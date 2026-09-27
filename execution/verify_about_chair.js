const { chromium } = require('playwright');

async function captureAboutScroll() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Capture middle scroll showing bio & top of chair
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'execution/preview_about_chair_mid.png' });
  console.log('Saved preview_about_chair_mid.png');

  // 2. Scroll to the chair image section
  const chairSection = await page.$('.about-fullbleed-visual');
  if (chairSection) {
    await chairSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'execution/preview_about_chair_view.png' });
    console.log('Saved preview_about_chair_view.png');
  }

  // 3. Scroll all the way down to verify the curtain reveal footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'execution/preview_about_chair_bottom.png' });
  console.log('Saved preview_about_chair_bottom.png');

  await browser.close();
}

captureAboutScroll().catch(console.error);
