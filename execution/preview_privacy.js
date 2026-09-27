const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  await page.goto('http://localhost:3000/privacy.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'execution/preview_privacy_top.png', fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'execution/preview_privacy_mid.png', fullPage: false });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'execution/preview_privacy_bottom.png', fullPage: false });

  await browser.close();
  console.log('Screenshots captured successfully.');
}

main().catch(console.error);
