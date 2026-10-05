const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  console.log('1. Loading Homepage...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const heroSwitch = page.locator('#hero-bottom-switch');
  const switchWrap = page.locator('#hero-bottom-switch-wrap');
  const tooltip = page.locator('#hero-switch-tooltip');

  // Verify switch attributes
  const ariaDisabled = await heroSwitch.getAttribute('aria-disabled');
  const ariaChecked = await heroSwitch.getAttribute('aria-checked');
  const isDisabledAttr = await heroSwitch.getAttribute('disabled');
  console.log('Initial Switch Attributes:', { ariaDisabled, ariaChecked, isDisabledAttr });

  // Capture hero switch idle state (tooltip hidden)
  await page.screenshot({ path: path.join(__dirname, 'hero_switch_idle.png') });
  console.log('Saved idle screenshot.');

  // Hover over switch wrap
  console.log('2. Hovering over switch...');
  await switchWrap.hover();
  await page.waitForTimeout(400);

  const tooltipVisible = await tooltip.isVisible();
  const tooltipText = await tooltip.textContent();
  const tooltipComputed = await tooltip.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      opacity: s.opacity,
      visibility: s.visibility,
      transform: s.transform,
      color: s.color,
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      textTransform: s.textTransform
    };
  });

  console.log('Tooltip on hover:', {
    tooltipVisible,
    tooltipText: tooltipText.trim(),
    computed: tooltipComputed
  });

  // Capture screenshot of hover with tooltip visible
  await page.screenshot({ path: path.join(__dirname, 'hero_switch_hover_tooltip.png') });
  console.log('Saved hover screenshot.');

  // Try clicking switch
  console.log('3. Attempting to click disabled switch...');
  await heroSwitch.click({ force: true });
  await page.waitForTimeout(400);

  const themeAfterClick = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Theme attribute after click attempt:', themeAfterClick || 'dark (none)');

  if (themeAfterClick === 'light') {
    console.error('ERROR: Switch toggled theme when it should be unclickable!');
    process.exit(1);
  } else {
    console.log('SUCCESS: Switch is completely unclickable and site remains dark.');
  }

  await browser.close();
})();
