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

  console.log('1. Loading Homepage in Dark Mode...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(__dirname, 'full_hero_dark.png') });
  console.log('Saved Hero Dark screenshot.');

  // Check initial navbar & CRT TV computed styles
  const darkNavStyles = await page.evaluate(() => {
    const nav = document.querySelector('.nav-modular-box');
    const hero = document.querySelector('.hero-center-viewport');
    const canvas = document.querySelector('#hero-tv-canvas');
    return {
      navBg: window.getComputedStyle(nav).backgroundColor,
      heroBg: window.getComputedStyle(hero).backgroundColor,
      hasCanvas: !!canvas
    };
  });
  console.log('Dark Mode Metrics:', darkNavStyles);

  // Click switch to toggle to Light Mode
  console.log('2. Clicking Hero Switch to toggle to Light Mode...');
  const heroSwitch = page.locator('#hero-bottom-switch');
  await heroSwitch.click();
  await page.waitForTimeout(600);

  const lightThemeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const isChecked = await heroSwitch.getAttribute('aria-checked');
  console.log('Light Mode - data-theme:', lightThemeAttr, '| aria-checked:', isChecked);

  const lightHeroMetrics = await page.evaluate(() => {
    const nav = document.querySelector('.nav-modular-box');
    const hero = document.querySelector('.hero-center-viewport');
    const cornerSquare = document.querySelector('.hero-corner-square');
    const brandSvg = document.querySelector('.nav-brand-logo');
    return {
      navBg: window.getComputedStyle(nav).backgroundColor,
      navColor: window.getComputedStyle(brandSvg).color,
      heroBg: window.getComputedStyle(hero).backgroundColor,
      cornerSquareBg: window.getComputedStyle(cornerSquare).backgroundColor
    };
  });
  console.log('Light Mode Hero Metrics (Navbar preserved dark, Hero flipped light):', lightHeroMetrics);

  await page.screenshot({ path: path.join(__dirname, 'full_hero_light.png') });
  console.log('Saved Hero Light screenshot.');

  // Scroll to Intro / Works section
  console.log('3. Scrolling to Works Section in Light Mode...');
  const introSection = page.locator('#f3-intro');
  await introSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'full_works_light.png') });
  console.log('Saved Works Light screenshot.');

  // Scroll to Services section
  console.log('4. Scrolling to Services Section in Light Mode...');
  const servicesSection = page.locator('#f3-bio-services');
  await servicesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'full_services_light.png') });
  console.log('Saved Services Light screenshot.');

  // Scroll to Contact Section & Footer
  console.log('5. Scrolling to Contact Section & Footer in Light Mode...');
  const contactSection = page.locator('#f3-contact');
  await contactSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const contactMetrics = await page.evaluate(() => {
    const contact = document.querySelector('#f3-contact');
    const footer = document.querySelector('#f3-footer');
    const title = document.querySelector('.f3-contact-hook-title');
    return {
      contactBg: window.getComputedStyle(contact).backgroundColor,
      footerBg: window.getComputedStyle(footer).backgroundColor,
      titleColor: window.getComputedStyle(title).color
    };
  });
  console.log('Contact Section & Footer Metrics (Flipped light):', contactMetrics);

  await page.screenshot({ path: path.join(__dirname, 'full_contact_footer_light.png') });
  console.log('Saved Contact & Footer Light screenshot.');

  // Open Contact Modal in Light Mode
  console.log('6. Opening Contact Modal in Light Mode...');
  const openModalBtn = page.locator('#f3-open-contact-modal');
  await openModalBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(__dirname, 'full_contact_modal_light.png') });
  console.log('Saved Contact Modal Light screenshot.');

  const closeModalBtn = page.locator('#f3-close-contact-modal');
  await closeModalBtn.click();
  await page.waitForTimeout(400);

  // Test About Page in Light Mode
  console.log('7. Testing About Page in Light Mode...');
  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const aboutTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('About Page data-theme persisted:', aboutTheme);
  await page.screenshot({ path: path.join(__dirname, 'full_about_light.png') });
  console.log('Saved About Page Light screenshot.');

  // Test Project Page in Light Mode
  console.log('8. Testing Project Page in Light Mode...');
  await page.goto('http://localhost:3000/project.html?id=memphis-grizzlies', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const projectTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Project Page data-theme persisted:', projectTheme);
  await page.screenshot({ path: path.join(__dirname, 'full_project_light.png') });
  console.log('Saved Project Page Light screenshot.');

  // Test Privacy Page in Light Mode
  console.log('9. Testing Privacy Page in Light Mode...');
  await page.goto('http://localhost:3000/privacy.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const privacyTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Privacy Page data-theme persisted:', privacyTheme);
  await page.screenshot({ path: path.join(__dirname, 'full_privacy_light.png') });
  console.log('Saved Privacy Page Light screenshot.');

  await browser.close();
  console.log('=== All tests finished successfully! ===');
})();
