const { chromium } = require('playwright');

async function testDropdownFps() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const result = await page.evaluate(async () => {
    return new Promise(resolve => {
      const frames = [];
      let lastTime = performance.now();
      let active = true;
      function loop(now) {
        frames.push(now - lastTime);
        lastTime = now;
        if (active) requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

      const t0 = performance.now();
      const btn = document.getElementById('nav-hamburger-btn');
      btn.click();
      const clickDuration = performance.now() - t0;

      setTimeout(() => {
        active = false;
        resolve({
          clickDuration: Math.round(clickDuration),
          maxFrameMs: Math.round(Math.max(...frames)),
          jankFrames: frames.filter(f => f > 33.3).length,
          avgFps: Math.round(frames.length / 0.5)
        });
      }, 500);
    });
  });

  console.log(`[After Step 1 Optimization] Max Frame: ${result.maxFrameMs}ms | Click: ${result.clickDuration}ms | Jank frames: ${result.jankFrames} | FPS: ${result.avgFps}`);
  await browser.close();
}

testDropdownFps().catch(console.error);
