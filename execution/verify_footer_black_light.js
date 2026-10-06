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
  await page.waitForTimeout(500);

  const footer = page.locator('#f3-footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Dark Mode Footer Metrics
  const darkFooterMetrics = await page.evaluate(() => {
    const ft = document.querySelector('#f3-footer');
    const email = document.querySelector('.f3-footer-email-link');
    const location = document.querySelector('.f3-footer-location');
    const social = document.querySelector('.f3-footer-social-link');
    const sig = document.querySelector('.f3-signature-text');
    const colophon = document.querySelector('.f3-footer-colophon-bar');
    const privacy = document.querySelector('.f3-colophon-privacy-link');
    return {
      footerBg: window.getComputedStyle(ft).backgroundColor,
      emailColor: window.getComputedStyle(email).color,
      locationColor: window.getComputedStyle(location).color,
      socialColor: window.getComputedStyle(social).color,
      sigColor: window.getComputedStyle(sig).color,
      colophonColor: window.getComputedStyle(colophon).color,
      privacyColor: window.getComputedStyle(privacy).color,
    };
  });
  console.log('Dark Mode Footer Metrics (Untouched):', darkFooterMetrics);

  await page.screenshot({
    path: path.join(__dirname, 'preview_footer_dark.png'),
    clip: await footer.boundingBox()
  });

  // Switch to Light Mode
  console.log('2. Switching to Light Mode...');
  const heroSwitch = page.locator('#hero-bottom-switch');
  await heroSwitch.click();
  await page.waitForTimeout(500);

  // Scroll to contact section to view footer transition
  const contact = page.locator('#f3-contact');
  await contact.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(__dirname, 'preview_footer_contact_transition_light.png')
  });

  // Scroll down a bit more into footer reveal
  await page.evaluate(() => {
    const el = document.querySelector('#f3-contact');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + 350);
    }
  });
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(__dirname, 'preview_footer_reveal_light.png')
  });

  await browser.close();
  console.log('Verification finished.');
})();
