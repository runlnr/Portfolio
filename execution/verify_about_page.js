const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const topScreenshot = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/1d95d1ec-7f14-4bcd-9935-efa989934603/about_top_preview.png');
  await page.screenshot({ path: topScreenshot });
  console.log('Saved', topScreenshot);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  const bottomScreenshot = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/1d95d1ec-7f14-4bcd-9935-efa989934603/about_bottom_preview.png');
  await page.screenshot({ path: bottomScreenshot });
  console.log('Saved', bottomScreenshot);

  await browser.close();
})();
