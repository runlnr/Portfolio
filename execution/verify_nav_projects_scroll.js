const { chromium } = require('playwright');
const server = require('../serve');

(async () => {
  const testPort = 3197;
  const testServer = await new Promise((resolve) => {
    const s = server.listen(testPort, () => resolve(s));
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  console.log('--- TEST 1: Landing Page Dropdown Click ---');
  await page.goto(`http://localhost:${testPort}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Open dropdown
  const dropdownToggle = page.locator('#nav-hamburger-btn');
  await dropdownToggle.click();
  await page.waitForTimeout(400);

  // Click Projects in dropdown
  const projectsLink = page.locator('#nav-works-link');
  await projectsLink.click();
  await page.waitForTimeout(1500);

  const url1 = page.url();
  const scrollY1 = await page.evaluate(() => window.scrollY || window.pageYOffset);
  console.log(`URL after clicking Projects: ${url1}`);
  console.log(`Scroll position: ${scrollY1}px`);

  const test1Passed = !url1.includes('#f3-portfolio') && scrollY1 > 400;
  console.log(`Test 1 Status: ${test1Passed ? 'PASS' : 'FAIL'}`);

  console.log('\n--- TEST 2: From About Page Dropdown Click ---');
  await page.goto(`http://localhost:${testPort}/about.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Open dropdown on About page
  await page.locator('#nav-hamburger-btn').click();
  await page.waitForTimeout(400);

  // Click Projects in dropdown
  await page.locator('#nav-works-link').click();
  await page.waitForTimeout(3500);

  const url2 = page.url();
  const scrollY2 = await page.evaluate(() => window.scrollY || window.pageYOffset);
  console.log(`URL after navigating from About: ${url2}`);
  console.log(`Scroll position: ${scrollY2}px`);

  const test2Passed = !url2.includes('#f3-portfolio') && url2.endsWith('/') && scrollY2 > 400;
  console.log(`Test 2 Status: ${test2Passed ? 'PASS' : 'FAIL'}`);

  console.log('\n--- TEST 3: From Project Page Dropdown Click ---');
  await page.goto(`http://localhost:${testPort}/project.html?id=memphis-grizzlies`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Open dropdown on Project page
  await page.locator('#nav-hamburger-btn').click();
  await page.waitForTimeout(400);

  // Click Projects in dropdown
  await page.locator('#nav-works-link').click();
  await page.waitForTimeout(3500);

  const url3 = page.url();
  const scrollY3 = await page.evaluate(() => window.scrollY || window.pageYOffset);
  console.log(`URL after navigating from Project: ${url3}`);
  console.log(`Scroll position: ${scrollY3}px`);

  const test3Passed = !url3.includes('#f3-portfolio') && url3.endsWith('/') && scrollY3 > 400;
  console.log(`Test 3 Status: ${test3Passed ? 'PASS' : 'FAIL'}`);

  await browser.close();
  testServer.close();

  if (test1Passed && test2Passed && test3Passed) {
    console.log('\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('\nSOME TESTS FAILED!');
    process.exit(1);
  }
})();
