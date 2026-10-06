const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
    document.documentElement.setAttribute('data-theme', 'light');
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const report = await page.evaluate(() => {
    const targets = [
      '.homepage-main',
      '#f3-contact',
      '#f3-footer-curtain',
      '#f3-footer',
      '.f3-footer-main-grid',
      '.f3-footer-left-stage',
      '.f3-footer-right-stage',
      '.f3-footer-brand-mark',
      '.f3-footer-brand-svg',
      '.f3-footer-brand-signature',
      '.f3-signature-text',
      '.f3-footer-colophon-bar'
    ];
    return targets.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { selector: sel, error: 'not found' };
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        selector: sel,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.w), h: Math.round(r.h) },
        position: cs.position,
        zIndex: cs.zIndex,
        fontSize: cs.fontSize,
        width: cs.width,
        height: cs.height,
        bg: cs.backgroundColor,
        color: cs.color
      };
    });
  });

  console.log('DOM Elements Report:', JSON.stringify(report, null, 2));

  await browser.close();
})();
