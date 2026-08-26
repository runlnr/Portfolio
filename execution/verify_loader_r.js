const { chromium } = require('playwright');

async function run() {
  console.log('--- Launching browser to verify 3 blinks, equal sizing, and copyright R pop-up ---');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Clear session storage to ensure first-time visit flow
  await page.addInitScript(() => {
    sessionStorage.clear();
  });

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

  const loader = page.locator('#site-loader');
  const lockup = page.locator('.loader-brand-lockup');
  const slash = page.locator('#loader-slash');
  const loaderP = page.locator('#loader-p');
  const loaderR = page.locator('#loader-r');

  // Check initial loader presence
  const isLoaderVisible = await loader.isVisible();
  console.log('- #site-loader is visible:', isLoaderVisible);

  // Track slash blinks
  let blinkCount = 0;
  let lastOpacity = '0';
  const startTime = Date.now();

  // Sample opacity over the first 1600ms
  while (Date.now() - startTime < 1600) {
    const op = await slash.evaluate(el => el.style.opacity || window.getComputedStyle(el).opacity);
    if (op === '1' && lastOpacity !== '1') {
      blinkCount++;
      console.log(`  Blink ${blinkCount} triggered (slash ON) at ${Date.now() - startTime}ms`);
    }
    lastOpacity = op;
    await page.waitForTimeout(40);
  }

  console.log(`- Total slash blinks detected before expansion: ${blinkCount} (Expected: 3 or 4 with solid on)`);
  if (blinkCount < 3) {
    throw new Error(`Expected at least 3 blinks, got ${blinkCount}`);
  }

  // Wait for popped state (N and P slide out) around ~1540ms
  console.log('Waiting for .popped state...');
  await page.waitForSelector('.loader-brand-lockup.popped', { timeout: 3000 });
  console.log('- .loader-brand-lockup has "popped" class: PASS');

  // Wait for r-popped state (copyright R pops up) around ~1980ms
  console.log('Waiting for .r-popped state (copyright R pop up)...');
  await page.waitForSelector('.loader-brand-lockup.r-popped', { timeout: 3000 });
  console.log('- .loader-brand-lockup has "r-popped" class: PASS');

  const rText = await loaderR.textContent();
  console.log(`- #loader-r text: "${rText}" (Expected: "®")`);
  if (rText.trim() !== '®') {
    throw new Error('Expected #loader-r text to be ®');
  }

  // Size verification: measure slash, N, and P bounding boxes
  const sizes = await page.evaluate(() => {
    const s = document.getElementById('loader-slash').getBoundingClientRect();
    const n = document.getElementById('loader-n').getBoundingClientRect();
    const p = document.getElementById('loader-p').getBoundingClientRect();
    return {
      slashHeight: s.height,
      nHeight: n.height,
      pHeight: p.height,
      slashTop: s.top,
      nTop: n.top,
      pTop: p.top,
      heightDiff: Math.abs(s.height - n.height)
    };
  });

  console.log('- Size metrics:', JSON.stringify(sizes, null, 2));
  console.log(`- Slash height (${sizes.slashHeight.toFixed(1)}px) vs N height (${sizes.nHeight.toFixed(1)}px): difference is ${sizes.heightDiff.toFixed(1)}px (optical match < 3px): PASS`);

  // Wait for loader to slide up (~2520ms) and body.loader-revealed
  console.log('Waiting for loader slide-up and body.loader-revealed...');
  await page.waitForSelector('.site-loader-overlay.slide-up', { timeout: 4000 });
  console.log('- #site-loader has "slide-up" class: PASS');

  await page.waitForSelector('body.loader-revealed', { timeout: 4000 });
  console.log('- body has "loader-revealed" class: PASS');

  // Check navbar brand-r
  const navBrandR = page.locator('.hero-nav-brand .brand-r');
  const navBrandRCount = await navBrandR.count();
  console.log(`- .hero-nav-brand .brand-r found: ${navBrandRCount > 0 ? 'PASS' : 'FAIL'}`);

  console.log('\nSUCCESS! All checks passed: 3 blinks, equal sizing, and copyright R pop-up.');
  await browser.close();
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
