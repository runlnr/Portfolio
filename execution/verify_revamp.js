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

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    const hero = document.getElementById('hero') || document.querySelector('.hero-pinned-section');
    if (hero) hero.style.display = 'none';
    const preloader = document.getElementById('site-preloader') || document.querySelector('.intro-brand-logo');
    if (preloader) preloader.style.display = 'none';
  });

  // Showcase section
  const sectionBio = await page.$('#f3-bio-services');
  if (sectionBio) {
    await sectionBio.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await sectionBio.screenshot({ path: path.join(__dirname, 'showcase_revamp_desktop.png') });
  }

  // Contact / CTA section
  const sectionContact = await page.$('#f3-contact');
  if (sectionContact) {
    await sectionContact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const ctaScreenshotPath = path.join(__dirname, 'cta_revamp_desktop.png');
    await sectionContact.screenshot({ path: ctaScreenshotPath });
    console.log('Saved desktop CTA screenshot to:', ctaScreenshotPath);
  }

  // Mobile test
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  if (sectionContact) {
    await sectionContact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const mobScreenshotPath = path.join(__dirname, 'cta_revamp_mobile.png');
    await sectionContact.screenshot({ path: mobScreenshotPath });
    console.log('Saved mobile CTA screenshot to:', mobScreenshotPath);
  }

  await browser.close();
})();
