// SF311 submission engine — Vercel serverless edition.
// Same flow as the local engine, adapted for @sparticuz/chromium + playwright-core
// and trimmed waits to fit serverless time limits.

import chromiumPkg from '@sparticuz/chromium';
import { chromium } from 'playwright-core';
import { forms } from './forms311.js';

const NAV_TIMEOUT = 40_000;

export async function submitReport(opts) {
  const spec = forms[opts.form];
  if (!spec) throw new Error(`Unknown form: ${opts.form}`);
  if (opts.category && !spec.categories[opts.category]) {
    throw new Error(`Unknown category "${opts.category}" for form ${opts.form}`);
  }

  const params = spec.urlParams ? spec.urlParams(opts.category) : '';
  const url = spec.url + params;

  const browser = await chromium.launch({
    args: chromiumPkg.args,
    executablePath: await chromiumPkg.executablePath(),
    headless: true,
  });
  const page = await (await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  })).newPage();
  page.setDefaultTimeout(NAV_TIMEOUT);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });

    // ---- Page 1: intro ----
    const firstNext = page.locator('button:has-text("Next")').first();
    await firstNext.waitFor({ state: 'visible' });
    await firstNext.click();

    // ---- Page 2: location (ArcGIS map) ----
    const search = page
      .locator('input[placeholder*="Find address" i], input[title*="Find address" i]')
      .first();
    await search.waitFor({ state: 'visible' });
    await page.waitForTimeout(1500); // let the map/geocoder finish wiring up
    await search.click();
    await search.fill(opts.address);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500); // geocode + pin
    await page.keyboard.press('Tab'); // commits match to the Location field

    const locBox = page.locator('textarea').first();
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

    if (opts.locationDescription) {
      const boxes = page.locator('textarea');
      if ((await boxes.count()) > 1) await boxes.nth(1).fill(opts.locationDescription);
    }
    await clickVisible(page, 'button:has-text("Next")');

    // ---- Page 3: request details ----
    const select = page.locator('select').first();
    if (await select.isVisible().catch(() => false)) {
      if (opts.category) await select.selectOption(opts.category).catch(() => {});
    }
    await page.locator('textarea').first().fill(opts.description || '');

    if (opts.photoPath) {
      const file = page.locator('input[type="file"]').first();
      if (await file.count()) {
        await file.setInputFiles(opts.photoPath);
        await page.waitForTimeout(2500);
      }
    }
    await clickVisible(page, 'button:has-text("Next")');

    // ---- Page 4: contact — anonymous ----
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

    // ---- Page 5: review + submit ----
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
