const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 2
  });

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const sectionContact = await page.locator('#f3-contact');
  await sectionContact.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Hover on "Get a quote"
  const firstRow = page.locator('.f3-contact-action-row').first();
  await firstRow.hover();
  await page.waitForTimeout(400);

  const hoverMetrics = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.f3-contact-action-row'));
    return rows.map((r, i) => {
      const style = window.getComputedStyle(r);
      const arrow = r.querySelector('.f3-action-arrow');
      const arrowStyle = arrow ? window.getComputedStyle(arrow) : null;
      return {
        index: i,
        text: r.textContent.trim(),
        color: style.color,
        opacity: style.opacity,
        borderBottomColor: style.borderBottomColor,
        arrowTransform: arrowStyle ? arrowStyle.transform : null
      };
    });
  });

  console.log('Hover Metrics:', JSON.stringify(hoverMetrics, null, 2));

  const screenshotPath = path.join(__dirname, 'cta_hover_state_preview.png');
  await sectionContact.screenshot({ path: screenshotPath });
  console.log('Saved hover screenshot to:', screenshotPath);

  await browser.close();
})();
