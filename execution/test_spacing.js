const { chromium } = require('playwright');
const path = require('path');

async function testSpacing() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const spacings = [
    { n: '-135%', p: '35%', name: 'spacing_original' },
    { n: '-140%', p: '40%', name: 'spacing_40' },
    { n: '-145%', p: '45%', name: 'spacing_45' }
  ];

  for (const s of spacings) {
    await page.goto('http://localhost:3000/');
    await page.addStyleTag({
      content: `
        .loader-slash {
          transform: none !important;
          font-size: 1.06em !important;
          font-weight: 600 !important;
          line-height: 1 !important;
        }
        .loader-brand-lockup.popped .loader-n {
          transform: translate(${s.n}, -50%) !important;
        }
        .loader-brand-lockup.popped .loader-p {
          transform: translate(${s.p}, -50%) !important;
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
    const shotPath = path.join('.tmp', `test_${s.name}.png`);
    await page.screenshot({ path: shotPath, clip: { x: 620, y: 400, width: 200, height: 100 } });
    console.log(`Captured ${shotPath}`);
  }

  await browser.close();
}

testSpacing().catch(console.error);
