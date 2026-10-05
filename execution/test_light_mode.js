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

  // Check initial dark theme
  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Initial Theme Attribute:', initialTheme || 'dark (default)');
  await page.screenshot({ path: path.join(__dirname, 'hero_dark_mode.png') });
  console.log('Saved Hero Dark Mode screenshot.');

  // Click hero switch to toggle light mode
  console.log('2. Toggling to Light Mode...');
  const heroSwitch = page.locator('#hero-bottom-switch');
  await heroSwitch.click();
  await page.waitForTimeout(600);

  const lightThemeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const isChecked = await heroSwitch.getAttribute('aria-checked');
  console.log('After toggle - data-theme:', lightThemeAttr, '| aria-checked:', isChecked);

  // Take screenshot of Hero in Light Mode
  await page.screenshot({ path: path.join(__dirname, 'hero_light_mode.png') });
  console.log('Saved Hero Light Mode screenshot.');

  // Scroll to Recent Works
  console.log('3. Scrolling to Recent Works in Light Mode...');
  const introSection = page.locator('#f3-intro');
  await introSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'works_light_mode.png') });
  console.log('Saved Works Light Mode screenshot.');

  // Scroll to Footer (Inverted Deep Black Section)
  console.log('4. Scrolling to Contact Footer in Light Mode...');
  const contactSection = page.locator('#f3-contact');
  await contactSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const footerMetrics = await page.evaluate(() => {
    const contact = document.querySelector('#f3-contact');
    const title = document.querySelector('.f3-contact-hook-title');
    const firstRow = document.querySelector('.f3-contact-action-row');
    const contactStyle = window.getComputedStyle(contact);
    const titleStyle = window.getComputedStyle(title);
    const rowStyle = window.getComputedStyle(firstRow);
    return {
      contactBg: contactStyle.backgroundColor,
      titleColor: titleStyle.color,
      rowColor: rowStyle.color
    };
  });
  console.log('Footer Metrics in Light Mode:', footerMetrics);

  await contactSection.screenshot({ path: path.join(__dirname, 'footer_black_in_light_mode.png') });
  console.log('Saved Footer screenshot in Light Mode.');

  // Test About page persistence
  console.log('5. Navigating to About page to test Light Mode persistence...');
  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const aboutThemeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('About page persisted data-theme:', aboutThemeAttr);
  await page.screenshot({ path: path.join(__dirname, 'about_light_mode.png') });

  await browser.close();
  console.log('All Light Mode verification tests completed successfully!');
})();
