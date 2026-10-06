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

  for (const route of ['/', '/about.html', '/project.html']) {
    console.log(`\n=== Testing route: ${route} ===`);
    await page.addInitScript(() => {
      localStorage.removeItem('np_theme');
      document.documentElement.removeAttribute('data-theme');
    });
    await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.removeItem('np_theme');
      document.documentElement.removeAttribute('data-theme');
    });
    await page.waitForTimeout(600);

    // Scroll to bottom to reveal footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);

    const footer = page.locator('#f3-footer, .f3-editorial-footer').first();
    const isVisible = await footer.isVisible();
    console.log(`Footer visible: ${isVisible}`);

    // Check footer box, computed styles in dark mode
    let footerInfo = await page.evaluate(() => {
      const el = document.querySelector('#f3-footer, .f3-editorial-footer');
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const wrap = document.querySelector('.f3-footer-reveal-wrap');
      const wrapCs = wrap ? window.getComputedStyle(wrap) : null;
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        wrapBg: wrapCs ? wrapCs.backgroundColor : null,
        theme: document.documentElement.getAttribute('data-theme') || 'dark'
      };
    });
    console.log('Dark mode footer info:', footerInfo);

    const safeName = route === '/' ? 'home' : route.replace('/', '').replace('.html', '');
    await page.screenshot({
      path: path.join(__dirname, `footer_${safeName}_dark.png`),
      fullPage: false
    });

    // Switch to light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('np_theme', 'light');
    });
    await page.waitForTimeout(600);

    footerInfo = await page.evaluate(() => {
      const el = document.querySelector('#f3-footer, .f3-editorial-footer');
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const wrap = document.querySelector('.f3-footer-reveal-wrap');
      const wrapCs = wrap ? window.getComputedStyle(wrap) : null;
      const email = document.querySelector('.f3-footer-email-link');
      const socials = document.querySelectorAll('.f3-footer-social-link');
      const sig = document.querySelector('.f3-signature-text');
      const colophon = document.querySelector('.f3-footer-colophon-bar');
      const dividers = document.querySelectorAll('.f3-footer-divider-row');
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        wrapBg: wrapCs ? wrapCs.backgroundColor : null,
        emailColor: email ? window.getComputedStyle(email).color : null,
        socialsColor: socials[0] ? window.getComputedStyle(socials[0]).color : null,
        sigColor: sig ? window.getComputedStyle(sig).color : null,
        colophonColor: colophon ? window.getComputedStyle(colophon).color : null,
        theme: document.documentElement.getAttribute('data-theme')
      };
    });
    console.log('Light mode footer info:', footerInfo);

    await page.screenshot({
      path: path.join(__dirname, `footer_${safeName}_light.png`),
      fullPage: false
    });
  }

  await browser.close();
  console.log('Footer inspection complete.');
})();
