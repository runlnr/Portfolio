const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));

  console.log('Setting skip-intro and navigating to http://localhost:3000/...');
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Hide fixed overlays for testing screenshot
  await page.evaluate(() => {
    const hero = document.getElementById('hero') || document.querySelector('.hero-pinned-section');
    if (hero) hero.style.display = 'none';
    const preloader = document.getElementById('site-preloader') || document.querySelector('.intro-brand-logo');
    if (preloader) preloader.style.display = 'none';
  });

  const section = await page.$('#f3-bio-services');
  if (!section) {
    console.error('Could not find #f3-bio-services');
    await browser.close();
    return;
  }

  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const boxes = await page.$$('.f3-showcase-box');
  console.log(`Found ${boxes.length} showcase boxes`);

  // Take screenshot of whole section in idle
  await section.screenshot({ path: path.join(__dirname, '../.tmp/showcase_ascii_idle.png') });
  console.log('Saved showcase_ascii_idle.png');

  // Hover Box 0
  if (boxes[0]) {
    await boxes[0].hover();
    await page.waitForTimeout(400);
    await boxes[0].screenshot({ path: path.join(__dirname, '../.tmp/box0_art_direction_ascii.png') });
    console.log('Saved box0_art_direction_ascii.png');
  }

  // Hover Box 1
  if (boxes[1]) {
    await boxes[1].hover();
    await page.waitForTimeout(400);
    await boxes[1].screenshot({ path: path.join(__dirname, '../.tmp/box1_brand_identity_ascii.png') });
    console.log('Saved box1_brand_identity_ascii.png');
  }

  // Hover Box 2
  if (boxes[2]) {
    await boxes[2].hover();
    await page.waitForTimeout(400);
    await boxes[2].screenshot({ path: path.join(__dirname, '../.tmp/box2_website_design_ascii.png') });
    console.log('Saved box2_website_design_ascii.png');
  }

  // Hover Box 3
  if (boxes[3]) {
    await boxes[3].hover();
    await page.waitForTimeout(400);
    await boxes[3].screenshot({ path: path.join(__dirname, '../.tmp/box3_social_media_ascii.png') });
    console.log('Saved box3_social_media_ascii.png');
  }

  await browser.close();
  console.log('Verification finished successfully!');
})();
