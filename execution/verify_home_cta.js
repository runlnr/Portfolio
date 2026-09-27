const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });
  await page.goto('http://localhost:3000/#f3-contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const contactSection = await page.$('#f3-contact');
  if (contactSection) {
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'execution/home_cta_preview.png' });
    console.log('Saved home_cta_preview.png');
  } else {
    console.log('Could not find #f3-contact');
  }

  await browser.close();
}

capture().catch(console.error);
