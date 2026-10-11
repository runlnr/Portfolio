const { chromium } = require('playwright');

async function measure() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [1440, 1920, 1280];

  for (const width of viewports) {
    const page = await browser.newPage({
      viewport: { width, height: 900 }
    });

    await page.addInitScript(() => {
      sessionStorage.setItem('np_has_seen_intro', 'true');
      document.documentElement.classList.add('skip-intro');
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const results = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('.f3-gallery-project-block'));
      const servicesDivider = document.querySelector('#f3-bio-services .f3-single-divider-row');

      const dividers = blocks.map(b => b.querySelector('.f3-gallery-hairline-divider'));
      dividers.push(servicesDivider);

      const rows = blocks.map(b => b.querySelector('.f3-gallery-row'));
      const wrap = document.querySelector('.f3-gallery-list-wrap');
      const wrapGap = window.getComputedStyle(wrap).gap;

      return blocks.map((block, i) => {
        const topDivider = dividers[i].getBoundingClientRect();
        const bottomDivider = dividers[i + 1] ? dividers[i + 1].getBoundingClientRect() : null;
        const blockRect = block.getBoundingClientRect();
        const rowRect = rows[i].getBoundingClientRect();
        const dividerToDivider = bottomDivider ? (bottomDivider.top - topDivider.top) : null;

        const rowStyle = window.getComputedStyle(rows[i]);
        const blockStyle = window.getComputedStyle(block);

        return {
          rowNumber: i + 1,
          projectName: block.getAttribute('data-project-id'),
          dividerToDividerHeight: dividerToDivider ? Math.round(dividerToDivider * 10) / 10 : 'N/A',
          blockHeight: Math.round(blockRect.height * 10) / 10,
          rowContentHeight: Math.round(rowRect.height * 10) / 10,
          rowBaseHeight: rowStyle.getPropertyValue('--row-base-height').trim(),
          rowFullHeight: rowStyle.getPropertyValue('--row-full-height').trim(),
          galleryWrapGap: wrapGap
        };
      });
    });

    console.log(`\n========================================`);
    console.log(`  VIEWPORT WIDTH: ${width}px`);
    console.log(`========================================`);
    console.table(results);
    await page.close();
  }

  await browser.close();
}

measure().catch(console.error);
