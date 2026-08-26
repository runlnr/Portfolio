const { chromium } = require('playwright');
const path = require('path');

async function verifyVisualDesigner() {
  console.log('--- Verifying Visual Designer with TV Frame & Side Curvature Controls ---');
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
  await page.waitForTimeout(1500);

  // 1. Verify Toggle Button
  const toggleBtn = await page.$('#vd-toggle-btn');
  if (!toggleBtn) throw new Error('#vd-toggle-btn not found');
  console.log('- #vd-toggle-btn exists: PASS');

  // 2. Click to open HUD panel
  await toggleBtn.click();
  await page.waitForTimeout(400);

  const panelActive = await page.evaluate(() => {
    const p = document.getElementById('vd-panel');
    return p ? p.classList.contains('active') : false;
  });
  console.log('- Panel active state after click:', panelActive ? 'PASS' : 'FAIL');
  if (!panelActive) throw new Error('Panel failed to activate on toggle click');

  // 3. Verify TV Sizing and Curvature Controls exist in panel
  const controlsExist = await page.evaluate(() => {
    return {
      tvWidth: !!document.getElementById('slider---hero-tv-width'),
      tvScale: !!document.getElementById('slider---hero-tv-scale'),
      tvTop: !!document.getElementById('slider---hero-tv-top'),
      tvSideBulge: !!document.getElementById('slider-tv-side-bulge'),
      tvVertBulge: !!document.getElementById('slider-tv-vert-bulge'),
    };
  });
  console.log('- Controls check:', controlsExist);
  for (const [k, v] of Object.entries(controlsExist)) {
    if (!v) throw new Error(`Missing slider: ${k}`);
  }
  console.log('- All TV sizing and curvature sliders present: PASS');

  // 4. Test live adjustment of sideBulge in WebGL shader
  console.log('Testing sideBulge slider adjustment...');
  const initialSideBulge = await page.evaluate(() => window.getHeroTvAscii ? window.getHeroTvAscii().sideBulge : null);
  console.log('- Initial shader sideBulge:', initialSideBulge);

  // Change sideBulge slider value to 0.08
  await page.evaluate(() => {
    const slider = document.getElementById('slider-tv-side-bulge');
    slider.value = '0.080';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(200);

  const updatedSideBulge = await page.evaluate(() => window.getHeroTvAscii ? window.getHeroTvAscii().sideBulge : null);
  console.log('- Updated shader sideBulge:', updatedSideBulge);
  if (Math.abs(updatedSideBulge - 0.080) > 0.001) {
    throw new Error(`Shader sideBulge did not update, got ${updatedSideBulge}`);
  }
  console.log('- Real-time shader side curvature update: PASS');

  // 5. Test live adjustment of CSS variables (--hero-tv-width)
  console.log('Testing --hero-tv-width slider adjustment...');
  await page.evaluate(() => {
    const slider = document.getElementById('slider---hero-tv-width');
    slider.value = '960';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(200);

  const updatedWidthVar = await page.evaluate(() => {
    return document.documentElement.style.getPropertyValue('--hero-tv-width');
  });
  console.log('- Updated CSS --hero-tv-width:', updatedWidthVar);
  if (updatedWidthVar !== '960px') {
    throw new Error(`CSS variable --hero-tv-width did not update, got ${updatedWidthVar}`);
  }
  console.log('- Real-time CSS TV width update: PASS');

  // 6. Capture screenshot at top (hero section + open HUD panel)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const screenshotPath = path.join(process.cwd(), '.tmp', 'visual_designer_tv_hud.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  console.log('\nALL VISUAL DESIGNER TV CONTROLS PASSED SUCCESSFULLY!');
  await browser.close();
}

verifyVisualDesigner().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
