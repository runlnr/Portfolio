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
  await page.waitForTimeout(500);

  // Take screenshot of Contact section
  const contact = page.locator('#f3-contact');
  if (await contact.isVisible()) {
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, 'shot_contact_light.png') });
  }

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'shot_footer_bottom_light.png') });

  // Scroll slightly up so both contact bottom and footer are visible
  await page.evaluate(() => window.scrollBy(0, -200));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(__dirname, 'shot_footer_reveal_light.png') });

  // Let's also check computed styles of all elements in footer
  const footerDiagnostics = await page.evaluate(() => {
    const el = document.querySelector('#f3-footer');
    const wrap = document.querySelector('#f3-footer-curtain');
    const main = document.querySelector('.homepage-main');
    const contact = document.querySelector('#f3-contact');
    
    return {
      main: main ? {
        tag: main.tagName,
        classes: main.className,
        position: window.getComputedStyle(main).position,
        zIndex: window.getComputedStyle(main).zIndex,
        bg: window.getComputedStyle(main).backgroundColor
      } : null,
      wrap: wrap ? {
        position: window.getComputedStyle(wrap).position,
        zIndex: window.getComputedStyle(wrap).zIndex,
        bg: window.getComputedStyle(wrap).backgroundColor,
        bottom: window.getComputedStyle(wrap).bottom,
        rect: wrap.getBoundingClientRect()
      } : null,
      footer: el ? {
        bg: window.getComputedStyle(el).backgroundColor,
        color: window.getComputedStyle(el).color,
        paddingTop: window.getComputedStyle(el).paddingTop,
        rect: el.getBoundingClientRect(),
        children: Array.from(el.querySelectorAll('*')).map(child => ({
          tag: child.tagName,
          class: child.className,
          color: window.getComputedStyle(child).color,
          bg: window.getComputedStyle(child).backgroundColor,
          borderTop: window.getComputedStyle(child).borderTopColor,
          display: window.getComputedStyle(child).display
        }))
      } : null
    };
  });

  console.log('Footer Diagnostics:', JSON.stringify(footerDiagnostics, null, 2));

  await browser.close();
})();
