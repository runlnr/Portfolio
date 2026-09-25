const { chromium } = require('playwright');

async function testFloatingCTA() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Deploy navigation dropdown
  await page.click('#nav-hamburger-btn');
  await page.waitForTimeout(600);

  // 1. Unhovered State
  const unhovered = await page.evaluate(() => {
    const cta = document.querySelector('.nav-floating-cta');
    const icon = cta.querySelector('.floating-cta-icon');
    const text = cta.querySelector('.floating-cta-text');
    const csCta = window.getComputedStyle(cta);
    const csIcon = window.getComputedStyle(icon);
    const csText = window.getComputedStyle(text);
    return {
      ctaPadding: csCta.padding,
      iconOpacity: csIcon.opacity,
      iconMaxWidth: csIcon.maxWidth,
      textOpacity: csText.opacity,
      textMaxWidth: csText.maxWidth
    };
  });
  console.log('Unhovered state:', unhovered);

  // 2. Hovered State
  await page.hover('.nav-floating-cta');
  await page.waitForTimeout(700);

  const hovered = await page.evaluate(() => {
    const cta = document.querySelector('.nav-floating-cta');
    const icon = cta.querySelector('.floating-cta-icon');
    const text = cta.querySelector('.floating-cta-text');
    const csCta = window.getComputedStyle(cta);
    const csIcon = window.getComputedStyle(icon);
    const csText = window.getComputedStyle(text);
    const rectText = text.getBoundingClientRect();
    const rectCta = cta.getBoundingClientRect();
    return {
      ctaPadding: csCta.padding,
      iconOpacity: csIcon.opacity,
      iconMaxWidth: csIcon.maxWidth,
      textOpacity: csText.opacity,
      textMaxWidth: csText.maxWidth,
      textWidth: rectText.width,
      textLeftOffset: rectText.left - rectCta.left,
      textRightOffset: rectCta.right - rectText.right
    };
  });
  console.log('Hovered state:', hovered);

  await browser.close();
}

testFloatingCTA().catch(console.error);
