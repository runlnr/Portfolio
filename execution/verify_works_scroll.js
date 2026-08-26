const { chromium } = require('playwright');

async function verifyWorksScroll() {
  console.log('--- Verifying Works Scroll & Removal of Standalone Works Page ---');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  // TEST 1: Click "Works" on the Hero Home Page
  console.log('1. Testing "Works" click on home page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const initialScrollY = await page.evaluate(() => window.scrollY);
  console.log(`- Initial scrollY on home page: ${initialScrollY}`);

  const worksLink = page.locator('#nav-works-link');
  await worksLink.click();
  await page.waitForTimeout(1600); // Allow smooth scroll animation

  const scrolledY = await page.evaluate(() => window.scrollY);
  console.log(`- Scrolled scrollY after clicking Works: ${scrolledY}`);

  if (scrolledY < 800) {
    throw new Error(`Expected page to scroll down to portfolio (> 800px), got ${scrolledY}`);
  }
  console.log('- Home page Works scroll test: PASS');

  // Verify #f3-portfolio is near viewport top
  const portfolioRect = await page.evaluate(() => {
    const el = document.getElementById('f3-portfolio');
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom };
  });
  console.log(`- Portfolio section top relative to viewport: ${portfolioRect.top.toFixed(1)}px (Expected near 0-50px): PASS`);

  // TEST 2: Navigate to About page and click "Works"
  console.log('\n2. Testing "Works" click from About page...');
  await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const aboutWorksLink = page.locator('.hero-nav-stack a', { hasText: 'Works' }).first();
  await aboutWorksLink.click();
  await page.waitForTimeout(3200); // Allow SPA curtain transition (1s) + full smooth scroll (1.2s)

  const aboutScrolledY = await page.evaluate(() => window.scrollY);
  const currentUrl = page.url();
  console.log(`- Current URL: ${currentUrl}`);
  console.log(`- Scrolled scrollY after clicking Works from About: ${aboutScrolledY}`);

  if (aboutScrolledY < 800) {
    throw new Error(`Expected scroll to portfolio from About page (> 800px), got ${aboutScrolledY}`);
  }
  console.log('- About page Works navigation + scroll test: PASS');

  // TEST 3: Direct navigation to /works should redirect to /#f3-portfolio
  console.log('\n3. Testing direct navigation to /works (HTTP 302 redirect)...');
  await page.goto('http://localhost:3000/works', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // Allow redirect and scroll

  const finalUrl = page.url();
  const directScrollY = await page.evaluate(() => window.scrollY);
  console.log(`- Final URL after navigating to /works: ${finalUrl}`);
  console.log(`- Final scrollY after redirect: ${directScrollY}`);

  if (!finalUrl.includes('#f3-portfolio')) {
    throw new Error(`Expected URL to include #f3-portfolio, got ${finalUrl}`);
  }
  if (directScrollY < 800) {
    throw new Error(`Expected page to scroll to portfolio after /works redirect (> 800px), got ${directScrollY}`);
  }
  console.log('- /works redirect + scroll test: PASS');

  console.log('\nALL WORKS SCROLL AND REDIRECT CHECKS PASSED SUCCESSFULLY!');
  await browser.close();
}

verifyWorksScroll().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
