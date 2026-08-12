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

export async function submitReport(opts) {
  const spec = forms[opts.form];
  if (!spec) throw new Error(`Unknown form: ${opts.form}`);
  if (opts.category && !spec.categories[opts.category]) {
    throw new Error(`Unknown category "${opts.category}" for form ${opts.form}`);
  }

  const params = spec.urlParams ? spec.urlParams(opts.category) : '';
  const url = spec.url + params;

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
    await waitForLoadersToHide(page);
    await waitForFormReady(page);

    const wantsTracking = Boolean(opts.email) && !spec.anonymousNeedsEmail;
    if (wantsTracking) {
      try {
        const email = await waitForFormElement(page, EMAIL_SELECTOR, ELEMENT_TIMEOUT);
        await email.fill(opts.email);
      } catch (err) {
        await dumpEmailFieldDiagnostics(page);
        throw err;
      }

      // Wait for form to accept the input
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(500);

      await clickVisible(page, 'button:has-text("Next")');
    } else {
      try {
        await page.locator('text=No, I want to remain anonymous').first().click({ timeout: 5000 });
      } catch (_) {
        await page.locator('input[type=radio]').last().check().catch(() => {});
      }
      await page.waitForTimeout(1200);

      const reportAnonBtn = page.locator('button:has-text("Report Anonymously")').first();
      const reportAnonVisible = await reportAnonBtn.isVisible().catch(() => false);
      console.log(`Report Anonymously button visible: ${reportAnonVisible}`);
      if (reportAnonVisible) {
        await reportAnonBtn.click();
      } else {
        if (spec.anonymousNeedsEmail) {
          if (!opts.email) throw new Error(`Form ${opts.form} requires an email even for anonymous reports`);
          try {
            const email = await waitForFormElement(page, EMAIL_SELECTOR, ELEMENT_TIMEOUT);
            await email.fill(opts.email);
          } catch (err) {
            await dumpEmailFieldDiagnostics(page);
            throw err;
          }
        }
        await clickVisible(page, 'button:has-text("Next")');
      }
    }

    // ---- Page 5: review + submit ----
    console.log('Page 5: review + submit');
    await page.locator('text=Please make sure the information below is correct').waitFor();

    if (opts.dryRun) {
      const reviewText = await page.locator('body').innerText();
      await browser.close();
      return { ok: true, dryRun: true, reviewText };
    }

    await page.locator('button:has-text("Submit")').first().click();
    await page.locator('text=Report Submitted').waitFor({ timeout: NAV_TIMEOUT });
    const doneText = await page.locator('body').innerText();
    const m = doneText.match(/Service Request Number is:\s*([0-9]+)/i);

    await browser.close();
    return { ok: true, caseNumber: m ? m[1] : null };
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
