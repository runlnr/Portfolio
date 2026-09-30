const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const headerRow = await page.$('.f3-featured-tag-row');
  if (headerRow) {
    await headerRow.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const info = await page.evaluate(() => {
      const btn = document.querySelector('.f3-featured-more-link');
      const style = btn ? window.getComputedStyle(btn) : null;
      return {
        text: btn ? btn.textContent.trim() : null,
        fontFamily: style?.fontFamily,
        fontSize: style?.fontSize,
        fontWeight: style?.fontWeight,
        letterSpacing: style?.letterSpacing,
        backgroundColor: style?.backgroundColor,
        color: style?.color,
        height: style?.height,
        padding: style?.padding
      };
    });

    console.log('Button computed styles:', JSON.stringify(info, null, 2));

    const section = await page.$('.f3-section-intro');
    const artifactDir = 'C:/Users/haina/.gemini/antigravity-ide/brain/120774df-5983-4526-bf3c-171f4cdc636c';
    if (section) {
      await section.screenshot({ path: path.join(artifactDir, 'see_all_projects_btn_preview.png') });
      console.log('Saved see_all_projects_btn_preview.png');
    }
  }

  await browser.close();
})();
