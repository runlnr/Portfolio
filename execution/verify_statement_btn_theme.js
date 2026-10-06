const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  console.log('1. Loading Homepage in Dark Mode...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const introLockup = page.locator('.f3-intro-lockup');
  await introLockup.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Dark Mode Check
  const darkMetrics = await page.evaluate(() => {
    const btn = document.querySelector('.f3-statement-btn');
    const span = btn ? btn.querySelector('span:first-child') : null;
    const arrow = btn ? btn.querySelector('.btn-arrow') : null;
    return {
      btnBg: window.getComputedStyle(btn).backgroundColor,
      btnColor: window.getComputedStyle(btn).color,
      spanColor: window.getComputedStyle(span).color,
      arrowColor: window.getComputedStyle(arrow).color,
    };
  });
  console.log('Dark Mode Statement Button Metrics (Untouched):', darkMetrics);

  await page.screenshot({
    path: path.join(__dirname, 'preview_background_btn_dark.png'),
    clip: await introLockup.boundingBox()
  });

  // Switch to Light Mode
  console.log('2. Switching to Light Mode...');
  const heroSwitch = page.locator('#hero-bottom-switch');
  await heroSwitch.click();
  await page.waitForTimeout(500);

  await introLockup.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Light Mode Normal Check
  const lightNormalMetrics = await page.evaluate(() => {
    const btn = document.querySelector('.f3-statement-btn');
    const span = btn ? btn.querySelector('span:first-child') : null;
    const arrow = btn ? btn.querySelector('.btn-arrow') : null;
    return {
      btnBg: window.getComputedStyle(btn).backgroundColor,
      btnColor: window.getComputedStyle(btn).color,
      spanColor: window.getComputedStyle(span).color,
      arrowColor: window.getComputedStyle(arrow).color,
    };
  });
  console.log('Light Mode Statement Button Metrics (Normal):', lightNormalMetrics);

  await page.screenshot({
    path: path.join(__dirname, 'preview_background_btn_light.png'),
    clip: await introLockup.boundingBox()
  });

  // Light Mode Hover Check
  const statementBtn = page.locator('.f3-statement-btn');
  await statementBtn.hover();
  await page.waitForTimeout(300);

  const lightHoverMetrics = await page.evaluate(() => {
    const btn = document.querySelector('.f3-statement-btn');
    const span = btn ? btn.querySelector('span:first-child') : null;
    const arrow = btn ? btn.querySelector('.btn-arrow') : null;
    return {
      btnBg: window.getComputedStyle(btn).backgroundColor,
      btnColor: window.getComputedStyle(btn).color,
      spanColor: window.getComputedStyle(span).color,
      arrowColor: window.getComputedStyle(arrow).color,
    };
  });
  console.log('Light Mode Statement Button Metrics (Hover):', lightHoverMetrics);

  await page.screenshot({
    path: path.join(__dirname, 'preview_background_btn_light_hover.png'),
    clip: await introLockup.boundingBox()
  });

  await browser.close();
  console.log('Verification finished successfully.');
})();
