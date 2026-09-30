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

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => {
    const loader = document.querySelector('.site-loader-overlay');
    if (loader) loader.style.display = 'none';
  });

  await page.waitForTimeout(800);

  // Scroll to ascii smile section
  const smileSection = page.locator('#f3-ascii-smile');
  await smileSection.scrollIntoViewIfNeeded();

  // Wait 1.5s for 3D ASCII animation frames to render
  await page.waitForTimeout(1500);

  const artifactDir = 'C:\\Users\\haina\\.gemini\\antigravity-ide\\brain\\65fddc38-952e-407e-9a32-5a793fdc4604';
  
  // Capture section screenshot
  await smileSection.screenshot({
    path: path.join(artifactDir, 'ascii_smile_preview.png')
  });
  console.log('Saved ascii_smile_preview.png');

  // Move mouse over canvas to test interactive tracking
  const canvas = page.locator('#f3-ascii-smile-canvas');
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.25);
    await page.waitForTimeout(800);
    await smileSection.screenshot({
      path: path.join(artifactDir, 'ascii_smile_interactive.png')
    });
    console.log('Saved ascii_smile_interactive.png');
  }

  // Capture full context around services and ascii smile and CTA
  await page.evaluate(() => {
    const el = document.getElementById('f3-bio-services');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(artifactDir, 'ascii_smile_context.png'),
    fullPage: false
  });
  console.log('Saved ascii_smile_context.png');

  await browser.close();
  console.log('Done!');
})();
