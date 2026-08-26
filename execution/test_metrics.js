const { chromium } = require('playwright');

async function testMetrics() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');

  await page.addStyleTag({
    content: `
      .loader-slash {
        transform: none !important;
        font-size: 1.06em !important;
        font-weight: 600 !important;
        line-height: 1 !important;
      }
    `
  });

  await page.evaluate(() => {
    const lockup = document.querySelector('.loader-brand-lockup');
    const slash = document.getElementById('loader-slash');
    slash.style.opacity = '1';
    lockup.classList.add('popped', 'r-popped');
  });

  await page.waitForTimeout(700);

  const metrics = await page.evaluate(() => {
    const s = document.getElementById('loader-slash').getBoundingClientRect();
    const n = document.getElementById('loader-n').getBoundingClientRect();
    const p = document.getElementById('loader-p').getBoundingClientRect();
    return {
      slash: { top: s.top, bottom: s.bottom, height: s.height, width: s.width },
      n: { top: n.top, bottom: n.bottom, height: n.height, width: n.width },
      p: { top: p.top, bottom: p.bottom, height: p.height, width: p.width },
      gapNSlash: s.left - n.right,
      gapSlashP: p.left - s.right
    };
  });

  console.log('METRICS:', JSON.stringify(metrics, null, 2));
  await browser.close();
}

testMetrics().catch(console.error);
