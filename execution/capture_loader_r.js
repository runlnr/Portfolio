const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.clear();
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

  // Wait until r-popped
  await page.waitForSelector('.loader-brand-lockup.r-popped');
  await page.waitForTimeout(200);

  const loaderShotPath = path.join(__dirname, '..', '.tmp', 'loader_r_popped.png');
  await page.screenshot({ path: loaderShotPath });
  console.log('Saved loader screenshot to:', loaderShotPath);

  // Wait until slide-up finishes and page is revealed
  await page.waitForSelector('body.loader-revealed');
  await page.waitForTimeout(600);

  const navShotPath = path.join(__dirname, '..', '.tmp', 'nav_revealed.png');
  await page.screenshot({ path: navShotPath });
  console.log('Saved revealed screenshot to:', navShotPath);

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
