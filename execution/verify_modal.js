const { chromium } = require('playwright');

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

  // Click Start a project button to open modal
  await page.click('#f3-open-contact-modal');
  await page.waitForTimeout(600);

  // Capture screenshot of open modal
  await page.screenshot({ path: 'execution/modal_open_preview.png' });
  console.log('Saved modal_open_preview.png');

  // Verify site is unscrollable when modal is open
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(300);
  const scrollAfter = await page.evaluate(() => window.scrollY);
  console.log(`Scroll test when modal open: before=${scrollBefore}, after=${scrollAfter}`);

  // Test close button
  await page.click('#f3-close-contact-modal');
  await page.waitForTimeout(500);

  // Verify modal is closed
  const isHidden = await page.$eval('#f3-contact-modal', el => el.hasAttribute('hidden'));
  console.log(`Modal hidden after close click: ${isHidden}`);

  await browser.close();
}

capture().catch(console.error);
