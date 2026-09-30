const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => {
    const loader = document.querySelector('.site-loader-overlay');
    if (loader) loader.style.display = 'none';
  });

  await page.waitForTimeout(800);

  // Scroll so bottom of ascii smile and top of contact are both visible
  const contactSection = page.locator('#f3-contact');
  await contactSection.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    window.scrollBy(0, -350);
  });
  await page.waitForTimeout(1000);

  const artifactDir = 'C:\\Users\\haina\\.gemini\\antigravity-ide\\brain\\65fddc38-952e-407e-9a32-5a793fdc4604';
  await page.screenshot({
    path: path.join(artifactDir, 'ascii_smile_to_contact_preview.png'),
    fullPage: false
  });
  console.log('Saved ascii_smile_to_contact_preview.png');

  await browser.close();
})();
