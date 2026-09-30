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

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check computed padding-bottom of .f3-works-grid-container
  const paddingBottom = await page.evaluate(() => {
    const el = document.querySelector('.f3-works-grid-container');
    return el ? window.getComputedStyle(el).paddingBottom : 'not found';
  });
  console.log('Computed padding-bottom of .f3-works-grid-container:', paddingBottom);

  // Take screenshot of the bottom of works and top of services
  await page.evaluate(() => {
    const el = document.getElementById('f3-bio-services');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  
  const screenshotPath = path.join(__dirname, 'works_to_services_gap.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
})();
