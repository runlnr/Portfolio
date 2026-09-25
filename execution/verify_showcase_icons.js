const { chromium } = require('playwright');

async function testShowcaseIcons() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to 4-box showcase section
  await page.evaluate(() => {
    document.getElementById('f3-bio-services').scrollIntoView();
  });
  await page.waitForTimeout(1000);

  // Hover over each of the 4 boxes sequentially
  const boxes = await page.$$('.f3-showcase-box');
  console.log('Found showcase boxes count:', boxes.length);

  for (let i = 0; i < boxes.length; i++) {
    await boxes[i].hover();
    await page.waitForTimeout(600);
  }

  const canvasValidations = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('.f3-showcase-canvas'));
    return canvases.map((c, idx) => {
      const rect = c.getBoundingClientRect();
      return {
        index: idx,
        width: rect.width,
        height: rect.height,
        canvasWidth: c.width,
        canvasHeight: c.height
      };
    });
  });

  console.log('Canvas validations:', canvasValidations);
  console.log('Console Errors:', errors);

  await browser.close();
}

testShowcaseIcons().catch(console.error);
