const { chromium } = require('playwright');
const path = require('path');

async function verifyHeroYellowWaves() {
  console.log('--- Verifying Yellow Waves Masked by TV.svg Shape Without Hover Effects ---');
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
  await page.waitForTimeout(1000);

  // 1. Verify clipPath definition exists
  const clipPathExists = await page.evaluate(() => {
    return !!document.getElementById('tv-clippath');
  });
  console.log('- #tv-clippath element exists in DOM:', clipPathExists ? 'PASS' : 'FAIL');
  if (!clipPathExists) throw new Error('#tv-clippath defs missing in DOM');

  // 2. Verify wrapper and iframe elements
  const tvWrapper = await page.$('#hero-tv-wrapper');
  if (!tvWrapper) throw new Error('#hero-tv-wrapper element not found');
  console.log('- #hero-tv-wrapper exists: PASS');

  const tvIframe = await page.$('#hero-tv-iframe');
  if (!tvIframe) throw new Error('#hero-tv-iframe element not found');
  console.log('- #hero-tv-iframe exists: PASS');

  const iframeSrc = await page.evaluate(() => {
    const el = document.getElementById('hero-tv-iframe');
    return el ? el.getAttribute('src') : null;
  });
  console.log(`- iframe src: ${iframeSrc}`);
  if (!iframeSrc || !iframeSrc.includes('Yellow%20Waves.html')) {
    throw new Error(`Expected iframe src to contain Yellow Waves.html, got ${iframeSrc}`);
  }
  console.log('- iframe src is Yellow Waves.html: PASS');

  // 3. Verify clip-path applied on wrapper and iframe
  const clipStyles = await page.evaluate(() => {
    const el = document.getElementById('hero-tv-wrapper');
    const iframe = document.getElementById('hero-tv-iframe');
    return {
      wrapperClip: window.getComputedStyle(el).clipPath,
      iframeClip: window.getComputedStyle(iframe).clipPath,
      wrapperFilter: window.getComputedStyle(el).filter
    };
  });
  console.log('- Clip and filter styles:', clipStyles);
  if (!clipStyles.wrapperClip.includes('tv-clippath') && !clipStyles.wrapperClip.includes('url')) {
    throw new Error(`Expected clip-path on wrapper, got ${clipStyles.wrapperClip}`);
  }
  console.log('- TV silhouette clip-path active on wrapper: PASS');

  if (clipStyles.wrapperFilter.includes('241, 42, 45') || clipStyles.wrapperFilter.includes('rgb(241')) {
    throw new Error(`Red glow detected in filter: ${clipStyles.wrapperFilter}`);
  }
  console.log('- Red glow completely removed: PASS');

  // 4. Verify inside iframe: WebGL canvas exists, autoRotate is false, and #info is hidden
  console.log('Waiting for Yellow Waves canvas inside iframe...');
  const frame = page.frameLocator('#hero-tv-iframe');
  await frame.locator('canvas').waitFor({ timeout: 10000 });
  console.log('- WebGL canvas loaded inside TV iframe: PASS');

  const iframeInfoDisplay = await frame.locator('body').evaluate(() => {
    const info = document.getElementById('info');
    return info ? window.getComputedStyle(info).display : 'none';
  });
  console.log(`- Info overlay display: ${iframeInfoDisplay}`);
  if (iframeInfoDisplay !== 'none') {
    throw new Error(`Expected #info to be hidden, got ${iframeInfoDisplay}`);
  }
  console.log('- Info overlay hidden: PASS');

  // 5. Verify NO hover effect occurs on TV wrapper
  console.log('Testing hover behavior on TV wrapper...');
  await page.hover('#hero-tv-wrapper');
  await page.waitForTimeout(300);

  const hoverTransform = await page.evaluate(() => {
    const el = document.getElementById('hero-tv-wrapper');
    return el.style.transform || window.getComputedStyle(el).transform;
  });
  console.log(`- Transform during hover: ${hoverTransform}`);
  if (hoverTransform.includes('scale') && !hoverTransform.includes('scale(1)')) {
    throw new Error(`Hover scale detected when hover should be disabled: ${hoverTransform}`);
  }
  console.log('- No hover effect on yellow waves: PASS');

  // 6. Capture screenshot
  const screenshotPath = path.join(process.cwd(), '.tmp', 'hero_yellow_waves_tv_shape.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  console.log('\nALL YELLOW WAVES TV SHAPE MASK CHECKS PASSED SUCCESSFULLY!');
  await browser.close();
}

verifyHeroYellowWaves().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
