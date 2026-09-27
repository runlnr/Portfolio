const { chromium } = require('playwright');

async function testAbout() {
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
  await page.screenshot({ path: 'execution/preview_about_type_c.png' });
  console.log('Saved preview_about_type_c.png');

  await browser.close();
}

testAbout().catch(console.error);
