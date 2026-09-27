const { chromium } = require('playwright');

async function capture() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Top of page screenshot
  await page.screenshot({ path: 'execution/about_top_preview.png' });
  console.log('Saved about_top_preview.png');

  // 2. Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'execution/about_bottom_preview.png' });
  console.log('Saved about_bottom_preview.png');

  await browser.close();
}

capture().catch(console.error);
