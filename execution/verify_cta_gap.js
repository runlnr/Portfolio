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

  const metrics = await page.evaluate(() => {
    const divider = document.querySelector('.f3-single-divider-line');
    const splitLayout = document.querySelector('.f3-contact-split-layout');
    const clocks = document.querySelector('.f3-contact-corners-bar');

    const dividerRect = divider ? divider.getBoundingClientRect() : null;
    const splitRect = splitLayout ? splitLayout.getBoundingClientRect() : null;
    const clocksRect = clocks ? clocks.getBoundingClientRect() : null;

    return {
      gapDividerToContext: (dividerRect && splitRect) ? (splitRect.top - dividerRect.bottom) : null,
      gapContextToClocks: (splitRect && clocksRect) ? (clocksRect.top - splitRect.bottom) : null
    };
  });

  console.log('CTA Spacing Metrics:', JSON.stringify(metrics, null, 2));

  const sectionContact = await page.locator('#f3-contact');
  if (sectionContact) {
    await sectionContact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const ctaScreenshotPath = path.join(__dirname, 'cta_clocks_gap_preview.png');
    await sectionContact.screenshot({ path: ctaScreenshotPath });
    console.log('Saved screenshot to:', ctaScreenshotPath);
  }

  await browser.close();
})();
