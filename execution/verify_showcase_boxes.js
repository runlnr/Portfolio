const { chromium } = require('playwright');

async function captureShowcase() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  await page.goto('http://localhost:3000/#f3-bio-services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const showcaseGrid = await page.$('.f3-showcase-grid');
  if (showcaseGrid) {
    await showcaseGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'execution/preview_showcase_corners.png' });
    console.log('Saved preview_showcase_corners.png');
  } else {
    console.log('Could not find .f3-showcase-grid');
  }

  await browser.close();
}

captureShowcase().catch(console.error);
