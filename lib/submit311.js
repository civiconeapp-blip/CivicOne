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

function connectUrl() {
  if (process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID) {
    return `wss://connect.browserbase.com?apiKey=${process.env.BROWSERBASE_API_KEY}&projectId=${process.env.BROWSERBASE_PROJECT_ID}`;
  }
  if (process.env.BROWSERLESS_WS) return process.env.BROWSERLESS_WS;
  throw new Error(
    'No hosted browser configured. Set BROWSERBASE_API_KEY + BROWSERBASE_PROJECT_ID, or BROWSERLESS_WS.'
  );
}

export async function submitReport(opts) {
  const spec = forms[opts.form];
  if (!spec) throw new Error(`Unknown form: ${opts.form}`);
  if (opts.category && !spec.categories[opts.category]) {
    throw new Error(`Unknown category "${opts.category}" for form ${opts.form}`);
  }

  const params = spec.urlParams ? spec.urlParams(opts.category) : '';
  const url = spec.url + params;

  // Tracks which stage of the form-walk we're in, so a failure can be
  // diagnosed from server logs instead of just showing up as a bare 502.
  let step = 'connect';
  let browser;
  try {
    browser = await chromium.connectOverCDP(connectUrl());

    step = 'navigate';
    // Hosted providers hand back a ready context + page.
    const context = browser.contexts()[0] || (await browser.newContext());
    const page = context.pages()[0] || (await context.newPage());
    page.setDefaultTimeout(NAV_TIMEOUT);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });

    // ---- Page 1: intro ----
    step = 'intro';
    const firstNext = page.locator('button:has-text("Next")').first();
    await firstNext.waitFor({ state: 'visible' });
    await firstNext.click();

    // ---- Page 2: location (ArcGIS map) ----
    step = 'location';
    const search = page
      .locator('input[placeholder*="Find address" i], input[title*="Find address" i]')
      .first();
    await search.waitFor({ state: 'visible' });
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
    step = 'details';
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
    step = 'contact';
    const wantsTracking = Boolean(opts.email) && !spec.anonymousNeedsEmail;
    if (wantsTracking) {
      const email = page.locator('input[type="email"], input[name*="email" i]').last();
      await email.waitFor({ state: 'visible' });
      await email.fill(opts.email);
      await clickVisible(page, 'button:has-text("Next")');
    } else {
      try {
        await page.locator('text=No, I want to remain anonymous').first().click({ timeout: 5000 });
      } catch (_) {
        await page.locator('input[type=radio]').last().check().catch(() => {});
      }
      await page.waitForTimeout(1200);

      const reportAnonBtn = page.locator('button:has-text("Report Anonymously")').first();
      if (await reportAnonBtn.isVisible().catch(() => false)) {
        await reportAnonBtn.click();
      } else {
        if (spec.anonymousNeedsEmail) {
          if (!opts.email) throw new Error(`Form ${opts.form} requires an email even for anonymous reports`);
          const email = page.locator('input[type="email"], input[name*="email" i]').last();
          await email.fill(opts.email);
        }
        await clickVisible(page, 'button:has-text("Next")');
      }
    }

    // ---- Page 5: review + submit ----
    step = 'review';
    await page.locator('text=Please make sure the information below is correct').waitFor();

    if (opts.dryRun) {
      const reviewText = await page.locator('body').innerText();
      await browser.close();
      return { ok: true, dryRun: true, reviewText };
    }

    step = 'submit';
    await page.locator('button:has-text("Submit")').first().click();
    await page.locator('text=Report Submitted').waitFor({ timeout: NAV_TIMEOUT });
    const doneText = await page.locator('body').innerText();
    const m = doneText.match(/Service Request Number is:\s*([0-9]+)/i);

    await browser.close();
    return { ok: true, caseNumber: m ? m[1] : null };
  } catch (err) {
    console.error(`SF311 filing failed at step "${step}":`, err.message);
    if (browser) await browser.close().catch(() => {});
    return { ok: false, error: err.message, step };
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
