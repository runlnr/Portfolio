const { chromium } = require('playwright');

async function capture() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    document.querySelectorAll('#site-preloader, .site-preloader, #hero, .hero-pinned-section').forEach(e => e.remove());
    document.body.classList.add('is-loaded');
  });
  await page.waitForTimeout(500);

  const showcase = await page.$('.f3-showcase-wrap');
  if (showcase) {
    await showcase.screenshot({ path: 'execution/showcase_boxes_preview.png' });
    console.log('Saved showcase element screenshot.');
  }

  await browser.close();
}

capture().catch(console.error);
