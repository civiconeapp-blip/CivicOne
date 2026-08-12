// SF311 submission engine — connects to a HOSTED headless browser over CDP.
// Full Chromium won't run reliably inside a Vercel function, so instead of
// launching one we connect to a browser-as-a-service and drive SF311's form
// there. Supports Browserbase or Browserless; set one of these env vars:
//
//   BROWSERBASE_API_KEY + BROWSERBASE_PROJECT_ID   (browserbase.com)
//   BROWSERLESS_WS   e.g. wss://production-sfo.browserless.io/chromium/playwright?token=XXXX
//
// Nothing else changes: same page-walk, same "Reported by CivicOne." tag,
// same optional reporter email, same real SR case number returned.

import { chromium } from 'playwright-core';
import { forms } from './forms311.js';

const NAV_TIMEOUT = 40_000;
const ELEMENT_TIMEOUT = 20_000; // 20s for slow SF311 form elements

// The contact page actually has up to 4 candidate email-ish inputs at once:
// a readonly profile display field, two inactive profile-mapped duplicates
// left in the DOM from other pages/categories, and the one real field the
// form wants filled. Verint's own JS marks that real field with the
// "dform_field_active" class — trust that signal first instead of guessing
// from name/type alone, which is ambiguous across all 4 candidates and was
// timing out (and once, matching the wrong hidden field entirely).
const EMAIL_SELECTOR =
  'input.dform_field_active[name*="email" i]:visible, ' +
  'input[autocomplete="email" i]:not([readonly]):visible, ' +
  'input[type="email"]:not([readonly]):visible, ' +
  'input[name*="email" i]:not([readonly]):visible';

// Dumps the actual state of every email-ish input on the page — id, name,
// type, computed visibility, and bounding box — plus how many iframes exist
// and a slice of the visible body text. This has failed twice in production
// with different selectors while nobody (not the resident, not us — the
// hosted browser session isn't visible to either) could see what the page
// actually looked like at that point. Call this right before giving up so
// the *next* failure comes with real evidence instead of another guess.
async function dumpEmailFieldDiagnostics(page) {
  try {
    const fields = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          id: el.id,
          name: el.name,
          type: el.type,
          className: el.className,
          readOnly: el.readOnly,
          required: el.required,
          display: style.display,
          visibility: style.visibility,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      }).filter((f) => /email/i.test(f.name) || /email/i.test(f.id) || f.type === 'email');
    });
    const iframeCount = await page.locator('iframe').count();
    const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 1500);
    console.error('Email field diagnostics:', JSON.stringify({ fields, iframeCount, url: page.url() }));
    console.error('Visible body text at failure (first 1500 chars):', bodyText);
  } catch (e) {
    console.error('Email field diagnostics failed to collect:', e.message);
  }
}

// ---------------------------------------------------------------------------
// DOM-level fallbacks for the contact page.
//
// Every control on that page measures 0x0 in the hosted browser, even though
// the text is demonstrably rendered (see the diagnostics dump). Playwright
// treats a zero-sized box as "not visible" and refuses to click or fill it,
// so any locator-based interaction there times out no matter how precise the
// selector is — three selector fixes in a row died on exactly this. These
// helpers run inside the page instead, where visibility is not a gate.
// ---------------------------------------------------------------------------

// Selects the "remain anonymous" radio. Returns true only if a radio is
// actually checked afterwards, so a no-op click can't masquerade as success.
async function selectAnonymousInPage(page) {
  return page.evaluate(() => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const wanted = 'remain anonymous';

    for (const label of Array.from(document.querySelectorAll('label'))) {
      if (!clean(label.textContent).includes(wanted)) continue;
      const input =
        label.control || (label.htmlFor && document.getElementById(label.htmlFor));
      if (input) {
        input.click();
        if (input.checked) return true;
      }
      label.click();
    }

    const radios = Array.from(document.querySelectorAll('input[type=radio]'));
    for (const radio of radios) {
      const labelText = clean(radio.labels && radio.labels[0] ? radio.labels[0].textContent : '');
      if (labelText.includes(wanted) || clean(radio.value).startsWith('no')) {
        radio.click();
        if (radio.checked) return true;
      }
    }
    return radios.some((r) => r.checked);
  });
}

// Waits for a phrase to appear in the page's rendered text. A plain
// locator waitFor() is visibility-gated and so hits the same 0x0 wall as
// everything else on these late pages; the text itself is still readable.
async function waitForBodyText(page, phrase, timeout = NAV_TIMEOUT) {
  const deadline = Date.now() + timeout;
  const target = phrase.toLowerCase();
  while (Date.now() < deadline) {
    const text = await page.locator('body').innerText().catch(() => '');
    if (text.toLowerCase().includes(target)) return text;
    await page.waitForTimeout(500);
  }
  return null;
}

// Clicks a button by its visible text from inside the page.
async function clickButtonInPage(page, text) {
  return page.evaluate((wanted) => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const target = clean(wanted);
    const els = Array.from(
      document.querySelectorAll('button, input[type=submit], input[type=button], a[role=button]')
    );
    const match = els.find((el) => clean(el.textContent || el.value).includes(target));
    if (!match) return false;
    match.click();
    return true;
  }, text);
}

// Fills the real email field from inside the page. Uses the native value
// setter so the form's own JS sees a genuine input/change, not just a
// mutated .value it ignores on validation.
async function fillEmailInPage(page, value) {
  return page.evaluate((v) => {
    const candidates = Array.from(document.querySelectorAll('input')).filter(
      (el) => !el.readOnly && (/email/i.test(el.name) || /email/i.test(el.id) || el.type === 'email')
    );
    const el =
      candidates.find((c) => c.required && c.classList.contains('dform_field_active')) ||
      candidates.find((c) => c.required) ||
      candidates.find((c) => c.classList.contains('dform_field_active')) ||
      candidates[0];
    if (!el) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, v);
    for (const type of ['input', 'change', 'blur']) {
      el.dispatchEvent(new Event(type, { bubbles: true }));
    }
    return el.value === v;
  }, value);
}

// Fills the email field, preferring a real Playwright fill and falling back
// to the in-page setter. Timeouts are deliberately short: the fallback is
// reliable here, so there's no value in burning 40s on a locator that the
// visibility gate will never let through.
async function fillEmailField(page, email) {
  try {
    const el = await waitForFormElement(page, EMAIL_SELECTOR, 8000);
    await el.fill(email, { timeout: 5000 });
    return;
  } catch (_) {
    if (await fillEmailInPage(page, email)) {
      console.log('Email filled via in-page fallback');
      return;
    }
  }
  await dumpEmailFieldDiagnostics(page);
  throw new Error('Could not fill the SF311 email field (locator and in-page fill both failed)');
}

function connectUrl() {
  if (process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID) {
    return `wss://connect.browserbase.com?apiKey=${process.env.BROWSERBASE_API_KEY}&projectId=${process.env.BROWSERBASE_PROJECT_ID}`;
  }
  if (process.env.BROWSERLESS_WS) return process.env.BROWSERLESS_WS;
  throw new Error(
    'No hosted browser configured. Set BROWSERBASE_API_KEY + BROWSERBASE_PROJECT_ID, or BROWSERLESS_WS.'
  );
}

// Wait for SF311 loading indicators to disappear
async function waitForLoadersToHide(page) {
  try {
    await page.locator('[class*="loading"], [class*="spinner"], .sk-spinner, [class*="overlay"]').first().waitFor({
      state: 'hidden',
      timeout: 10000
    }).catch(() => {});
  } catch (e) {
    console.log('No loader found or timeout — proceeding anyway');
  }
}

// Wait for form to be interactive (no pending API calls)
async function waitForFormReady(page) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  } catch (e) {
    console.log('Network not idle — proceeding with element waits');
  }
}

// Try to find element, checking both regular page and iframes. .last() makes
// this safe to call with a multi-pattern selector (e.g. "input[type=email],
// input[name*=email]") — without it, a selector matching more than one node
// throws a Playwright strict-mode error instead of picking one.
async function waitForFormElement(page, selector, timeout = ELEMENT_TIMEOUT) {
  // First try regular page
  const elem = page.locator(selector).last();
  try {
    await elem.waitFor({ state: 'visible', timeout: 3000 });
    return elem;
  } catch (e) {
    console.log(`Element not found in main page (${selector}), checking iframes...`);
  }

  // Skip the iframe hunt entirely when the page has none — on this form it
  // never does, and probing four selectors at 3s each just added ~12s of
  // dead wait to every failure.
  if ((await page.locator('iframe').count()) === 0) {
    console.log('No iframes on page; skipping iframe search');
    const direct = page.locator(selector).last();
    await direct.waitFor({ state: 'visible', timeout }).catch(() => {});
    return direct;
  }

  // Try common SF311 iframe patterns
  const iframeSelectors = [
    'iframe[src*="verint"]',
    'iframe[title*="Service"]',
    'iframe[name*="311"]',
    'iframe' // fallback: first iframe
  ];

  for (const iframeSel of iframeSelectors) {
    try {
      const frame = page.frameLocator(iframeSel);
      const elemInFrame = frame.locator(selector).last();
      await elemInFrame.waitFor({ state: 'visible', timeout: 3000 });
      console.log(`Found element in iframe: ${iframeSel}`);
      return elemInFrame;
    } catch (e) {
      // Continue to next iframe
    }
  }

  // Final attempt: wait for element in main page with the full caller-given
  // timeout, in case it just needed longer than the quick 3s probe above.
  console.log(`Retrying element search with full timeout: ${selector}`);
  const fallback = page.locator(selector).last();
  await fallback.waitFor({ state: 'visible', timeout }).catch(() => {});
  return fallback;
}

// SF311's confirmation wording is not stable across forms, and a filing that
// succeeded once returned a page this failed to parse — which the UI then
// showed as a failure, prompting a duplicate report. Try the known phrasings
// in order, then fall back to a long digit run introduced by a number-ish
// word. The >=5 digit floor keeps it off phone numbers, dates and ZIPs.
function extractCaseNumber(text, { strict = false } = {}) {
  // Collapse whitespace first: the number is often split from its label by
  // markup and newlines, which would otherwise defeat these patterns.
  const t = String(text || '').replace(/\s+/g, ' ');
  const patterns = [
    /Service Request Number is:?\s*#?\s*(\d{5,})/i,
    /(?:service request|case|request|reference|confirmation)\s*(?:number|no\.?|#|id)\s*(?:is)?\s*[:#]?\s*(\d{5,})/i,
  ];
  // Loosest pattern only for rendered text — raw textContent sweeps in
  // script bodies and markup where a stray long number is easy to mistake
  // for a case number.
  if (!strict) patterns.push(/\b(?:number|no\.?|#)\s*[:#]?\s*(\d{6,})\b/i);
  for (const re of patterns) {
    const m = t.match(re);
    if (m) return m[1];
  }
  return null;
}

// The confirmation page renders "Your Service Request Number is:" before the
// number itself is populated — a real filing was logged with that label and
// nothing after it. So don't read once and give up: poll until the number
// appears. Also check textContent and field values, since the number may sit
// in a node innerText skips (these late pages render everything at 0x0).
async function waitForCaseNumber(page, timeout = 15000) {
  const deadline = Date.now() + timeout;
  let lastSeen = '';
  while (Date.now() < deadline) {
    const snap = await page
      .evaluate(() => ({
        innerText: document.body ? document.body.innerText : '',
        textContent: document.body ? document.body.textContent : '',
        values: Array.from(document.querySelectorAll('input, textarea'))
          .map((el) => el.value)
          .filter(Boolean)
          .join(' '),
      }))
      .catch(() => null);
    if (snap) {
      if (snap.innerText) lastSeen = snap.innerText;
      const found =
        extractCaseNumber(snap.innerText) ||
        extractCaseNumber(snap.textContent, { strict: true }) ||
        extractCaseNumber(snap.values, { strict: true });
      if (found) return { caseNumber: found, text: lastSeen };
    }
    await page.waitForTimeout(500);
  }
  return { caseNumber: null, text: lastSeen };
}

export async function submitReport(opts) {
  const spec = forms[opts.form];
  if (!spec) throw new Error(`Unknown form: ${opts.form}`);
  if (opts.category && !spec.categories[opts.category]) {
    throw new Error(`Unknown category "${opts.category}" for form ${opts.form}`);
  }

  const params = spec.urlParams ? spec.urlParams(opts.category) : '';
  const url = spec.url + params;

  // Reports which stage we're on so the API can stream progress to the
  // resident — this walk takes over a minute and a silent wait is what made
  // phones give up on the request.
  const progress = typeof opts.onProgress === 'function' ? opts.onProgress : () => {};

  const browser = await chromium.connectOverCDP(connectUrl());
  try {
    // Hosted providers hand back a ready context + page.
    const context = browser.contexts()[0] || (await browser.newContext());
    const page = context.pages()[0] || (await context.newPage());

    // Set explicit viewport for consistency in headless mode
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(NAV_TIMEOUT);

    await page.goto(url, { waitUntil: 'load', timeout: NAV_TIMEOUT });
    await waitForFormReady(page);
    await waitForLoadersToHide(page);

    // ---- Page 1: intro ----
    console.log('Page 1: intro');
    const firstNext = page.locator('button:has-text("Next")').first();
    await firstNext.waitFor({ state: 'visible' });
    await firstNext.click();
    await page.waitForTimeout(1200);

    // ---- Page 2: location (ArcGIS map) ----
    console.log('Page 2: location');
    progress('location');
    await waitForLoadersToHide(page);
    const search = page
      .locator('input[placeholder*="Find address" i], input[title*="Find address" i]')
      .first();
    await search.waitFor({ state: 'visible', timeout: ELEMENT_TIMEOUT });
    await page.waitForTimeout(1500);
    await search.click();
    await search.fill(opts.address);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500); // geocode + pin
    await page.keyboard.press('Tab'); // commits match to the Location field

    // Read the (read-only) Location field — it's the visible textarea on this step.
    const locBox = page.locator('textarea:visible').first();
    let locVal = await locBox.inputValue().catch(() => '');
    if (!locVal) {
      const map = page.locator('[id*="map" i], .esriMapContainer').first();
      const bb = await map.boundingBox();
      if (bb) {
        await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
        await page.waitForTimeout(2000);
        locVal = await locBox.inputValue().catch(() => '');
      }
    }
    if (!locVal) throw new Error('Location field never populated — geocode failed');

    // Optional "Location description" is the 2nd visible, editable textarea here.
    if (opts.locationDescription) {
      const boxes = page.locator('textarea:visible:not([readonly])');
      if ((await boxes.count()) > 0) await boxes.first().fill(opts.locationDescription).catch(() => {});
    }
    await clickVisible(page, 'button:has-text("Next")');

    // ---- Page 3: request details ----
    console.log('Page 3: request details');
    progress('details');
    await waitForLoadersToHide(page);
    const select = page.locator('select:visible').first();
    if (await select.isVisible().catch(() => false)) {
      if (opts.category) await select.selectOption(opts.category).catch(() => {});
    }
    // Fill the VISIBLE, editable description box — earlier steps' hidden read-only
    // textareas (like the map address field) are still in the DOM, so target :visible.
    await page.locator('textarea:visible:not([readonly])').first().fill(opts.description || '');

    if (opts.photoPath) {
      const file = page.locator('input[type="file"]').first();
      if (await file.count()) {
        await file.setInputFiles(opts.photoPath);
        await page.waitForTimeout(2500);
      }
    }
    await clickVisible(page, 'button:has-text("Next")');

    // ---- Page 4: contact ----
    console.log('Page 4: contact');
    progress('contact');
    await waitForLoadersToHide(page);
    await waitForFormReady(page);

    const wantsTracking = Boolean(opts.email) && !spec.anonymousNeedsEmail;
    if (wantsTracking) {
      await fillEmailField(page, opts.email);

      // Wait for form to accept the input
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(500);

      if (!(await clickButtonInPage(page, 'Next'))) {
        await clickVisible(page, 'button:has-text("Next")');
      }
    } else {
      // Try Playwright first — if this page ever renders normally, the real
      // click is preferable. Fall back to an in-page click, which is what
      // actually works here today (see the DOM-level helpers above).
      const anonClicked = await page
        .locator('text=No, I want to remain anonymous')
        .first()
        .click({ timeout: 5000 })
        .then(() => true)
        .catch(() => false);
      const anonSelected = anonClicked || (await selectAnonymousInPage(page));
      console.log(`Anonymous option selected: ${anonSelected} (playwright click: ${anonClicked})`);
      await page.waitForTimeout(1500);

      // Same story for the button the choice reveals.
      const reportAnonDone =
        (await page
          .locator('button:has-text("Report Anonymously")')
          .first()
          .click({ timeout: 5000 })
          .then(() => true)
          .catch(() => false)) || (await clickButtonInPage(page, 'Report Anonymously'));
      console.log(`Report Anonymously clicked: ${reportAnonDone}`);

      if (reportAnonDone) {
        await page.waitForTimeout(1200);
      } else {
        if (spec.anonymousNeedsEmail) {
          if (!opts.email) throw new Error(`Form ${opts.form} requires an email even for anonymous reports`);
          await fillEmailField(page, opts.email);
        }
        if (!(await clickButtonInPage(page, 'Next'))) {
          await clickVisible(page, 'button:has-text("Next")');
        }
      }
    }

    // ---- Page 5: review + submit ----
    console.log('Page 5: review + submit');
    progress('submitting');
    const reviewText = await waitForBodyText(page, 'Please make sure the information below is correct');
    if (!reviewText) throw new Error('Never reached the SF311 review page');

    if (opts.dryRun) {
      await browser.close();
      return { ok: true, dryRun: true, reviewText };
    }

    const submitted =
      (await page
        .locator('button:has-text("Submit")')
        .first()
        .click({ timeout: 5000 })
        .then(() => true)
        .catch(() => false)) || (await clickButtonInPage(page, 'Submit'));
    console.log(`Submit clicked: ${submitted}`);
    const doneText = await waitForBodyText(page, 'Report Submitted');
    if (!doneText) throw new Error('SF311 never confirmed the report was submitted');
    const { caseNumber, text: confirmText } = await waitForCaseNumber(page);
    if (!caseNumber) {
      // The report IS filed at this point — don't let an unparsed number be
      // mistaken for a failed filing. Log the confirmation wording so the
      // pattern can be corrected from evidence instead of guessed at.
      console.error(
        'Filed, but no case number matched. Confirmation text:',
        (confirmText || doneText).replace(/\s+/g, ' ').slice(0, 800)
      );
    }

    await browser.close();
    return { ok: true, caseNumber };
  } catch (err) {
    await browser.close().catch(() => {});
    console.error('SF311 submission error:', err);
    return { ok: false, error: err.message };
  }
}

async function clickVisible(page, selector) {
  const btns = page.locator(selector);
  const n = await btns.count();
  for (let i = n - 1; i >= 0; i--) {
    const b = btns.nth(i);
    if (await b.isVisible().catch(() => false)) {
      await b.click();
      await page.waitForTimeout(1200);
      return;
    }
  }
  throw new Error(`No visible element for ${selector}`);
}
