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
    localStorage.setItem('np_theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  });

  console.log('Loading Homepage in Light Mode...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(__dirname, 'shot_home_footer_fixed_light.png') });

  // Check footer computed styles in light mode
  const lightFooterInfo = await page.evaluate(() => {
    const el = document.querySelector('#f3-footer');
    const wrap = document.querySelector('#f3-footer-curtain');
    const main = document.querySelector('.homepage-main');
    const email = document.querySelector('.f3-footer-email-link');
    const brandSvg = document.querySelector('.f3-footer-brand-svg');
    const brandMark = document.querySelector('.f3-footer-brand-mark');
    const sig = document.querySelector('.f3-signature-text');
    const colophon = document.querySelector('.f3-footer-colophon-bar');
    return {
      theme: document.documentElement.getAttribute('data-theme'),
      mainBg: main ? window.getComputedStyle(main).backgroundColor : null,
      wrapBg: wrap ? window.getComputedStyle(wrap).backgroundColor : null,
      footerBg: el ? window.getComputedStyle(el).backgroundColor : null,
      emailColor: email ? window.getComputedStyle(email).color : null,
      brandSvgWidth: brandSvg ? window.getComputedStyle(brandSvg).width : null,
      brandSvgHeight: brandSvg ? window.getComputedStyle(brandSvg).height : null,
      brandMarkSize: brandMark ? { w: window.getComputedStyle(brandMark).width, h: window.getComputedStyle(brandMark).height } : null,
      sigColor: sig ? window.getComputedStyle(sig).color : null,
      sigFontSize: sig ? window.getComputedStyle(sig).fontSize : null,
      colophonColor: colophon ? window.getComputedStyle(colophon).color : null
    };
  });
  console.log('Light Mode Footer Info:', lightFooterInfo);

  // Test Dark Mode
  console.log('\nSwitching to Dark Mode...');
  await page.evaluate(() => {
    window.setTheme('dark');
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(__dirname, 'shot_home_footer_fixed_dark.png') });

  const darkFooterInfo = await page.evaluate(() => {
    const el = document.querySelector('#f3-footer');
    const wrap = document.querySelector('#f3-footer-curtain');
    const main = document.querySelector('.homepage-main');
    const email = document.querySelector('.f3-footer-email-link');
    const sig = document.querySelector('.f3-signature-text');
    return {
      theme: document.documentElement.getAttribute('data-theme') || 'dark',
      mainBg: main ? window.getComputedStyle(main).backgroundColor : null,
      wrapBg: wrap ? window.getComputedStyle(wrap).backgroundColor : null,
      footerBg: el ? window.getComputedStyle(el).backgroundColor : null,
      emailColor: email ? window.getComputedStyle(email).color : null,
      sigColor: sig ? window.getComputedStyle(sig).color : null
    };
  });
  console.log('Dark Mode Footer Info:', darkFooterInfo);

  // Check About Page Light Mode
  console.log('\nLoading About Page in Light Mode...');
  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.setTheme('light');
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(__dirname, 'shot_about_footer_fixed_light.png') });

  // Check Project Page Light Mode
  console.log('\nLoading Project Page in Light Mode...');
  await page.goto('http://localhost:3000/project.html?id=us-space-force', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.setTheme('light');
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(__dirname, 'shot_project_footer_fixed_light.png') });

  await browser.close();
  console.log('All tests completed successfully.');
})();
