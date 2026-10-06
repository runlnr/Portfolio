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

  const heroVisual = page.locator('#hero-center-visual');

  // Dark Mode Corner Squares Metrics
  const darkMetrics = await page.evaluate(() => {
    const squares = document.querySelectorAll('.hero-corner-square');
    return Array.from(squares).map(sq => ({
      className: sq.className,
      bg: window.getComputedStyle(sq).backgroundColor,
      opacity: window.getComputedStyle(sq).opacity
    }));
  });
  console.log('Dark Mode Corner Squares Metrics (Untouched White):', darkMetrics);

  await page.screenshot({
    path: path.join(__dirname, 'preview_hero_corners_dark.png'),
    clip: await heroVisual.boundingBox()
  });

  // Switch to Light Mode
  console.log('2. Switching to Light Mode...');
  const heroSwitch = page.locator('#hero-bottom-switch');
  await heroSwitch.click();
  await page.waitForTimeout(500);

  // Light Mode Corner Squares Metrics
  const lightMetrics = await page.evaluate(() => {
    const squares = document.querySelectorAll('.hero-corner-square');
    return Array.from(squares).map(sq => ({
      className: sq.className,
      bg: window.getComputedStyle(sq).backgroundColor,
      opacity: window.getComputedStyle(sq).opacity
    }));
  });
  console.log('Light Mode Corner Squares Metrics (Turned Black):', lightMetrics);

  await page.screenshot({
    path: path.join(__dirname, 'preview_hero_corners_light.png'),
    clip: await heroVisual.boundingBox()
  });

  await browser.close();
  console.log('Verification finished successfully.');
})();
