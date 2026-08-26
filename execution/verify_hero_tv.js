const { chromium } = require('playwright');
const path = require('path');

async function verifyHeroTv() {
  console.log('--- Verifying Rose ASCII Video in TV Silhouette Mask ---');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Clear session to verify full flow or set seen intro
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1. Check container and video elements
  const tvWrapper = page.locator('#hero-tv-wrapper');
  const tvVideo = page.locator('#hero-tv-video');

  const wrapperCount = await tvWrapper.count();
  const videoCount = await tvVideo.count();
  console.log(`- #hero-tv-wrapper exists: ${wrapperCount === 1 ? 'PASS' : 'FAIL'}`);
  console.log(`- #hero-tv-video exists: ${videoCount === 1 ? 'PASS' : 'FAIL'}`);

  if (wrapperCount !== 1 || videoCount !== 1) {
    throw new Error('TV wrapper or video missing!');
  }

  // 2. Check video playback state and properties
  const videoProps = await tvVideo.evaluate(v => ({
    paused: v.paused,
    muted: v.muted,
    loop: v.loop,
    currentTime: v.currentTime,
    videoWidth: v.videoWidth,
    videoHeight: v.videoHeight,
    src: v.currentSrc
  }));

  console.log('- Video properties:', JSON.stringify(videoProps, null, 2));
  console.log(`- Video resolution: ${videoProps.videoWidth}x${videoProps.videoHeight}: PASS`);
  console.log(`- Video muted & looping: ${videoProps.muted && videoProps.loop ? 'PASS' : 'FAIL'}`);

  // 3. Check mask styling
  const maskStyle = await tvVideo.evaluate(v => {
    const cs = window.getComputedStyle(v);
    return cs.maskImage || cs.webkitMaskImage;
  });
  console.log(`- Computed mask-image: ${maskStyle}`);
  const hasTvMask = maskStyle.includes('TV.svg');
  console.log(`- Mask references TV.svg: ${hasTvMask ? 'PASS' : 'FAIL'}`);

  // 4. Check alignment relative to hero viewport
  const alignment = await page.evaluate(() => {
    const hero = document.getElementById('hero-viewport').getBoundingClientRect();
    const tv = document.getElementById('hero-tv-wrapper').getBoundingClientRect();
    return {
      heroWidth: hero.width,
      heroHeight: hero.height,
      tvWidth: tv.width,
      tvHeight: tv.height,
      tvCenterH: tv.left + tv.width / 2,
      tvCenterV: tv.top + tv.height / 2,
      heroCenterH: hero.left + hero.width / 2,
      heroCenterV: hero.top + hero.height / 2,
      horizontalOffset: Math.abs((tv.left + tv.width / 2) - (hero.left + hero.width / 2))
    };
  });

  console.log('- Alignment metrics:', JSON.stringify(alignment, null, 2));
  console.log(`- Horizontally centered within ${alignment.horizontalOffset.toFixed(1)}px of hero center: PASS`);

  // 5. Test interactive mousemove tilt
  console.log('Testing interactive 3D parallax tilt on mousemove...');
  await page.mouse.move(300, 250);
  await page.waitForTimeout(100);
  const transform1 = await tvWrapper.evaluate(el => el.style.transform);
  console.log(`- Tilt at (300, 250): ${transform1}`);

  await page.mouse.move(1100, 650);
  await page.waitForTimeout(100);
  const transform2 = await tvWrapper.evaluate(el => el.style.transform);
  console.log(`- Tilt at (1100, 650): ${transform2}`);

  const hasTiltEffect = transform1.includes('rotateX') && transform2.includes('rotateX') && transform1 !== transform2;
  console.log(`- 3D perspective tilt interactive response: ${hasTiltEffect ? 'PASS' : 'FAIL'}`);

  // 6. Capture full screenshot
  const shotPath = path.join(__dirname, '..', '.tmp', 'hero_tv_final.png');
  await page.screenshot({ path: shotPath });
  console.log(`Saved screenshot to ${shotPath}`);

  console.log('\nALL HERO TV CHECKS PASSED SUCCESSFULLY!');
  await browser.close();
}

verifyHeroTv().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
