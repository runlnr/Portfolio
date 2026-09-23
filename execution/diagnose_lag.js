const { chromium } = require('playwright');

async function testScenario(name, setupFn) {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  if (setupFn) await page.evaluate(setupFn);

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

  console.log(`[${name}] Max Frame: ${result.maxFrameMs}ms | Click handler: ${result.clickDuration}ms | Jank frames: ${result.jankFrames} | FPS: ${result.avgFps}`);
  await browser.close();
}

async function run() {
  console.log('--- DIAGNOSING LAG CAUSE ---');
  // Baseline
  await testScenario('Baseline (Current)', null);

  // Scenario 1: Without overflow: hidden on html/body
  await testScenario('No overflow:hidden on body/html', () => {
    const style = document.createElement('style');
    style.innerHTML = `html.nav-dropdown-active, body.nav-dropdown-active { overflow: visible !important; }`;
    document.head.appendChild(style);
  });

  // Scenario 2: Without backdrop-filter blur on .nav-dropdown-backdrop
  await testScenario('No backdrop-filter on backdrop', () => {
    const style = document.createElement('style');
    style.innerHTML = `.nav-dropdown-backdrop { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }`;
    document.head.appendChild(style);
  });

  // Scenario 3: Pause WebGL ASCII TV render loop during dropdown
  await testScenario('Pausing WebGL TV render during dropdown', () => {
    const canvas = document.getElementById('hero-tv-canvas');
    if (canvas) canvas.style.display = 'none';
  });

  // Scenario 4: Both No overflow:hidden AND No backdrop-filter on backdrop
  await testScenario('No overflow:hidden AND clean backdrop tint', () => {
    const style = document.createElement('style');
    style.innerHTML = `
      html.nav-dropdown-active, body.nav-dropdown-active { overflow: visible !important; }
      .nav-dropdown-backdrop { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; background: rgba(0, 0, 0, 0.75) !important; }
    `;
    document.head.appendChild(style);
  });
}

run().catch(console.error);
