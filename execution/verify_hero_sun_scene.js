const { chromium } = require('playwright');
const path = require('path');

async function verifyHeroSunScene() {
  console.log('--- Verifying 3D Sun Scene in Vintage TV Silhouette Mask ---');
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

  // 1. Verify wrapper and iframe elements
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
  if (!iframeSrc || !iframeSrc.includes('Sun%20Scene.html')) {
    throw new Error(`Expected iframe src to contain Sun Scene.html, got ${iframeSrc}`);
  }
  console.log('- iframe src is Sun Scene.html: PASS');

  // 2. Verify TV.svg CSS mask on iframe
  const maskStyle = await page.evaluate(() => {
    const el = document.getElementById('hero-tv-iframe');
    const s = window.getComputedStyle(el);
    return s.maskImage || s.webkitMaskImage;
  });
  console.log(`- Computed mask-image: ${maskStyle}`);
  if (!maskStyle.includes('TV.svg')) {
    throw new Error(`Expected mask-image to include TV.svg, got ${maskStyle}`);
  }
  console.log('- Mask references TV.svg: PASS');

  // 3. Verify alignment and bounding box
  const metrics = await page.evaluate(() => {
    const hero = document.getElementById('hero-viewport');
    const tv = document.getElementById('hero-tv-wrapper');
    const hr = hero.getBoundingClientRect();
    const tr = tv.getBoundingClientRect();
    return {
      heroWidth: hr.width,
      heroHeight: hr.height,
      tvWidth: tr.width,
      tvHeight: tr.height,
      tvCenterH: tr.left + tr.width / 2,
      tvCenterV: tr.top + tr.height / 2,
      heroCenterH: hr.left + hr.width / 2,
      heroCenterV: hr.top + hr.height / 2,
      horizontalOffset: Math.abs((tr.left + tr.width / 2) - (hr.left + hr.width / 2))
    };
  });
  console.log('- Alignment metrics:', JSON.stringify(metrics, null, 2));

  if (metrics.horizontalOffset > 2) {
    throw new Error(`TV wrapper not horizontally centered. Offset: ${metrics.horizontalOffset}px`);
  }
  console.log(`- Horizontally centered within ${metrics.horizontalOffset.toFixed(1)}px of hero center: PASS`);

  // 4. Wait for 3D ASCII canvas to render inside iframe
  console.log('Waiting for Sun Scene WebGL canvas inside iframe...');
  const frame = page.frameLocator('#hero-tv-iframe');
  await frame.locator('canvas').waitFor({ timeout: 10000 });
  console.log('- WebGL canvas loaded inside TV iframe: PASS');

  // 5. Test 3D perspective parallax tilt on mousemove
  console.log('Testing interactive 3D parallax tilt on mousemove...');
  await page.mouse.move(300, 250);
  await page.waitForTimeout(300);
  const tilt1 = await page.evaluate(() => document.getElementById('hero-tv-wrapper').style.transform);
  console.log(`- Tilt at (300, 250): ${tilt1}`);

  await page.mouse.move(1100, 650);
  await page.waitForTimeout(300);
  const tilt2 = await page.evaluate(() => document.getElementById('hero-tv-wrapper').style.transform);
  console.log(`- Tilt at (1100, 650): ${tilt2}`);

  if (!tilt1.includes('perspective') || !tilt1.includes('rotate')) {
    throw new Error(`Expected 3D perspective tilt transform on mousemove, got: ${tilt1}`);
  }
  console.log('- 3D perspective tilt interactive response: PASS');

  // 6. Capture full screenshot
  const screenshotPath = path.join(process.cwd(), '.tmp', 'hero_sun_scene_tv.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  console.log('\nALL 3D SUN SCENE TV CHECKS PASSED SUCCESSFULLY!');
  await browser.close();
}

verifyHeroSunScene().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
