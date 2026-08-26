const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');
  await page.waitForSelector('.loader-brand-lockup.r-popped');

  const domMetrics = await page.evaluate(() => {
    const s = document.getElementById('loader-slash');
    const n = document.getElementById('loader-n');
    const p = document.getElementById('loader-p');
    const r = document.getElementById('loader-r');

    const sRect = s.getBoundingClientRect();
    const nRect = n.getBoundingClientRect();
    const pRect = p.getBoundingClientRect();
    const rRect = r.getBoundingClientRect();

    const csS = window.getComputedStyle(s);
    const csN = window.getComputedStyle(n);
    const csP = window.getComputedStyle(p);

    return {
      slash: {
        top: sRect.top,
        bottom: sRect.bottom,
        left: sRect.left,
        right: sRect.right,
        height: sRect.height,
        width: sRect.width,
        font: csS.font,
        transform: csS.transform
      },
      n: {
        top: nRect.top,
        bottom: nRect.bottom,
        left: nRect.left,
        right: nRect.right,
        height: nRect.height,
        width: nRect.width,
        font: csN.font,
        transform: csN.transform
      },
      p: {
        top: pRect.top,
        bottom: pRect.bottom,
        left: pRect.left,
        right: pRect.right,
        height: pRect.height,
        width: pRect.width,
        font: csP.font,
        transform: csP.transform
      }
    };
  });

  console.log('DOM METRICS:');
  console.log(JSON.stringify(domMetrics, null, 2));

  await browser.close();
}

main().catch(console.error);
