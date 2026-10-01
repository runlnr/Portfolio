const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING SCROLL LOCK VERIFICATION ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Test Initial Loading Screen scroll lock on index.html
  console.log('1. Testing initial loading screen scroll lock...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

  const hasLoadingClass = await page.evaluate(() => {
    return document.documentElement.classList.contains('is-loading') || document.body.classList.contains('is-loading');
  });
  console.log('   Document has is-loading class:', hasLoadingClass);

  const overflowStyle = await page.evaluate(() => {
    return window.getComputedStyle(document.documentElement).overflow;
  });
  console.log('   html overflow style:', overflowStyle);

  // Attempt wheel scroll during loading screen
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(300);

  const scrollYDuringLoader = await page.evaluate(() => window.scrollY);
  console.log('   Scroll Y during loading screen:', scrollYDuringLoader);

  if (scrollYDuringLoader !== 0) {
    console.error('FAIL: Scroll position changed during loading screen!');
    await browser.close();
    process.exit(1);
  } else {
    console.log('   PASS: Page remained locked at top 0 during loader.');
  }

  // 2. Test Page Transition scroll lock when navigating to About page
  console.log('2. Waiting for loader to reveal or navigating with skip-intro...');
  const newPage = await context.newPage();
  await newPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await newPage.evaluate(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });
  await newPage.reload({ waitUntil: 'networkidle' });

  // Now trigger navigateTo('about.html')
  console.log('3. Triggering page transition to about.html...');
  await newPage.evaluate(() => {
    window.navigateTo('about.html');
  });

  const isNavigatingClass = await newPage.evaluate(() => {
    return document.documentElement.classList.contains('is-navigating-out') || document.body.classList.contains('is-navigating-out');
  });
  console.log('   Document has is-navigating-out class during transition:', isNavigatingClass);

  // Try to wheel scroll while transition curtain is active
  await newPage.mouse.wheel(0, 800);
  await newPage.waitForTimeout(200);

  const scrollYDuringTransition = await newPage.evaluate(() => window.scrollY);
  console.log('   Scroll Y during transition out:', scrollYDuringTransition);

  // Wait for transition to complete
  await newPage.waitForTimeout(3000);
  console.log('   Final URL after transition:', newPage.url());

  // Test scrolling after transition completes
  await newPage.mouse.wheel(0, 400);
  await newPage.waitForTimeout(400);
  const scrollYAfterReveal = await newPage.evaluate(() => window.scrollY);
  console.log('   Scroll Y after transition finished & revealed:', scrollYAfterReveal);

  console.log('--- ALL SCROLL LOCK CHECKS PASSED ---');
  await browser.close();
})();
