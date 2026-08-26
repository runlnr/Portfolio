const { chromium } = require('playwright');
const path = require('path');

async function testVisuals() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');

  // Evaluate different variations and capture crops
  const variations = [
    { name: 'current', css: '' },
    { name: 'no_translate', css: '.loader-slash { transform: none !important; }' },
    { name: 'exact_baseline', css: `
      .loader-brand-lockup { line-height: 1 !important; height: 1em !important; }
      .loader-char { line-height: 1 !important; }
      .loader-slash { transform: none !important; }
      .loader-n { transform: translate(-135%, -50%) !important; }
      .loader-p { transform: translate(35%, -50%) !important; }
    `},
    { name: 'optical_scale_105', css: `
      .loader-slash { transform: none !important; font-size: 1.08em !important; font-weight: 500 !important; }
    `},
    { name: 'optical_scale_110', css: `
      .loader-slash { transform: translateY(0.02em) !important; font-size: 1.12em !important; }
    `}
  ];

  for (const v of variations) {
    if (v.css) {
      await page.addStyleTag({ content: v.css });
    }
    await page.evaluate(() => {
      const lockup = document.querySelector('.loader-brand-lockup');
      const slash = document.getElementById('loader-slash');
      if (lockup && slash) {
        slash.style.opacity = '1';
        lockup.classList.add('popped', 'r-popped');
      }
    });
    await page.waitForTimeout(100);
    const shotPath = path.join('.tmp', `test_${v.name}.png`);
    await page.screenshot({ path: shotPath, clip: { x: 620, y: 400, width: 200, height: 100 } });
    console.log(`Captured ${shotPath}`);
  }

  await browser.close();
}

testVisuals().catch(console.error);
