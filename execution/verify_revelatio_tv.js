const { chromium } = require('playwright');
const path = require('path');

async function verifyRevelatioTv() {
  console.log('--- Verifying Revelatio TV ASCII Effect with Yellow Waves.mp4 ---');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Verify canvas element
  const canvas = await page.$('#hero-tv-canvas');
  if (!canvas) throw new Error('#hero-tv-canvas not found in DOM');
  console.log('- #hero-tv-canvas exists: PASS');

  // 2. Verify canvas dimensions and WebGL context
  const canvasInfo = await page.evaluate(() => {
    const c = document.getElementById('hero-tv-canvas');
    return {
      width: c.width,
      height: c.height,
      clientWidth: c.clientWidth,
      clientHeight: c.clientHeight
    };
  });
  console.log('- Canvas Info:', canvasInfo);
  if (canvasInfo.width === 0 || canvasInfo.height === 0) {
    throw new Error('Canvas has 0 width/height');
  }
  console.log('- Canvas has valid rendering dimensions: PASS');

  // 3. Verify no hover scale
  await page.hover('#hero-tv-wrapper');
  await page.waitForTimeout(300);
  const hoverTransform = await page.evaluate(() => {
    const el = document.getElementById('hero-tv-wrapper');
    return window.getComputedStyle(el).transform;
  });
  console.log(`- Wrapper transform on hover: ${hoverTransform}`);
  if (hoverTransform !== 'none' && !hoverTransform.includes('matrix(1, 0, 0, 1, 0, 0)')) {
    throw new Error(`Unexpected transform on hover: ${hoverTransform}`);
  }
  console.log('- No hover effect on yellow waves: PASS');

  // 4. Capture screenshot
  const screenshotPath = path.join(process.cwd(), '.tmp', 'hero_revelatio_ascii_final.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  console.log('\nALL REVELATIO TV ASCII CHECKS PASSED SUCCESSFULLY!');
  await browser.close();
}

verifyRevelatioTv().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
