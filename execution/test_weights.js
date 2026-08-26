const { chromium } = require('playwright');
const path = require('path');

async function testWeights() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const variations = [
    { name: 'translate0_w500', css: '.loader-slash { transform: none !important; font-weight: 500 !important; }' },
    { name: 'translate0_scale106_w500', css: '.loader-slash { transform: none !important; font-size: 1.06em !important; font-weight: 500 !important; }' },
    { name: 'translate0_scale106_w600', css: '.loader-slash { transform: none !important; font-size: 1.06em !important; font-weight: 600 !important; }' },
    { name: 'translate0_scale108_w600', css: '.loader-slash { transform: none !important; font-size: 1.08em !important; font-weight: 600 !important; }' }
  ];

  for (const v of variations) {
    await page.goto('http://localhost:3000/');
    await page.addStyleTag({ content: v.css });
    await page.evaluate(() => {
      const lockup = document.querySelector('.loader-brand-lockup');
      const slash = document.getElementById('loader-slash');
      if (lockup && slash) {
        slash.style.opacity = '1';
        lockup.classList.add('popped', 'r-popped');
      }
    });
    // Wait for the 580ms CSS transition to fully complete!
    await page.waitForTimeout(700);
    const shotPath = path.join('.tmp', `test_${v.name}.png`);
    await page.screenshot({ path: shotPath, clip: { x: 620, y: 400, width: 200, height: 100 } });
    console.log(`Captured ${shotPath}`);
  }

  await browser.close();
}

testWeights().catch(console.error);
