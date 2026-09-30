const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check Grid View
  const gridSection = await page.$('#f3-portfolio');
  if (gridSection) {
    await gridSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const gridInfo = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.f3-work-card'));
      return cards.map(card => {
        const title = card.querySelector('.f3-title-front')?.textContent?.trim();
        const subtitle = card.querySelector('.f3-work-card-subtitle');
        const style = subtitle ? window.getComputedStyle(subtitle) : null;
        const tags = Array.from(card.querySelectorAll('.f3-work-tag'));
        return {
          title,
          subtitleText: subtitle?.textContent?.trim(),
          fontFamily: style?.fontFamily,
          fontSize: style?.fontSize,
          fontWeight: style?.fontWeight,
          lineHeight: style?.lineHeight,
          letterSpacing: style?.letterSpacing,
          color: style?.color,
          tagCount: tags.length
        };
      });
    });

    console.log('Grid View Subtitles Check:', JSON.stringify(gridInfo, null, 2));

    const artifactDir = 'C:/Users/haina/.gemini/antigravity-ide/brain/120774df-5983-4526-bf3c-171f4cdc636c';
    await gridSection.screenshot({ path: path.join(artifactDir, 'project_subtitles_grid.png') });
    console.log('Saved project_subtitles_grid.png');

    // Switch to List View
    const listBtn = await page.$('#f3-view-list');
    if (listBtn) {
      await listBtn.click();
      await page.waitForTimeout(600);

      const listInfo = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.f3-list-item-row'));
        return rows.map(row => {
          const title = row.querySelector('.f3-list-title')?.textContent?.trim();
          const subtitle = row.querySelector('.f3-list-subtitle');
          const style = subtitle ? window.getComputedStyle(subtitle) : null;
          return {
            title,
            subtitleText: subtitle?.textContent?.trim(),
            fontFamily: style?.fontFamily,
            fontSize: style?.fontSize,
            fontWeight: style?.fontWeight,
            lineHeight: style?.lineHeight,
            letterSpacing: style?.letterSpacing,
            color: style?.color
          };
        });
      });

      console.log('List View Subtitles Check:', JSON.stringify(listInfo, null, 2));

      const listViewContainer = await page.$('.f3-section-intro');
      if (listViewContainer) {
        await listViewContainer.screenshot({ path: path.join(artifactDir, 'project_subtitles_list.png') });
        console.log('Saved project_subtitles_list.png');
      }
    }
  }

  await browser.close();
})();
