const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const portfolio = await page.locator('#f3-portfolio');
  await portfolio.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const card = page.locator('.f3-work-card').first();
  console.log('Card found count:', await page.locator('.f3-work-card').count());

  const hoverBoxBefore = await page.evaluate(() => {
    const box = document.querySelector('.f3-card-hover-box');
    if (!box) return null;
    const style = window.getComputedStyle(box);
    return {
      opacity: style.opacity,
      transform: style.transform,
      display: style.display,
      visibility: style.visibility,
      bounds: box.getBoundingClientRect()
    };
  });
  console.log('HoverBox Before Hover:', JSON.stringify(hoverBoxBefore, null, 2));

  await card.hover();
  await page.waitForTimeout(600);

  const hoverBoxAfter = await page.evaluate(() => {
    const box = document.querySelector('.f3-card-hover-box');
    if (!box) return null;
    const style = window.getComputedStyle(box);
    return {
      opacity: style.opacity,
      transform: style.transform,
      display: style.display,
      visibility: style.visibility,
      bounds: box.getBoundingClientRect()
    };
  });
  console.log('HoverBox After Hover:', JSON.stringify(hoverBoxAfter, null, 2));

  const artifactPath = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/1d95d1ec-7f14-4bcd-9935-efa989934603/hover_test.png');
  await page.screenshot({ path: artifactPath });
  console.log('Screenshot saved to', artifactPath);

  await browser.close();
})();
