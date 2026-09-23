const { chromium } = require('playwright');

async function measure() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Inject performance observer for CWV
  await page.addInitScript(() => {
    window._perfData = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      longTasks: 0,
      longTaskDuration: 0
    };

    // FCP
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
        window._perfData.fcp = entry.startTime;
      }
    }).observe({ type: 'paint', buffered: true });

    // LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        window._perfData.lcp = entries[entries.length - 1].startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // CLS
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window._perfData.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // Long Tasks
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        window._perfData.longTasks++;
        window._perfData.longTaskDuration += entry.duration;
      }
    }).observe({ type: 'longtask', buffered: true });
  });

  const startTime = Date.now();
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(2000); // let initial assets and animations settle

  // Measure dropdown animation FPS / duration
  const fpsData = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const frames = [];
      let lastTime = performance.now();
      let animActive = true;

      function loop(now) {
        const delta = now - lastTime;
        lastTime = now;
        frames.push(delta);
        if (animActive) requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

      const btn = document.getElementById('nav-hamburger-btn');
      btn.click();

      setTimeout(() => {
        animActive = false;
        // Calculate average frame duration and drops (>33ms = drop below 30fps, >16.6ms = drop below 60fps)
        const frameCount = frames.length;
        const totalDuration = frames.reduce((a, b) => a + b, 0);
        const jankFrames = frames.filter(f => f > 33.3).length;
        const averageFps = frameCount / (totalDuration / 1000);
        resolve({
          averageFps: Math.round(averageFps),
          jankFrames,
          totalFrames: frameCount,
          maxFrameMs: Math.round(Math.max(...frames))
        });
      }, 500);
    });
  });

  const cwv = await page.evaluate(() => window._perfData);
  const navigationTiming = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
      transferSize: Math.round(nav.transferSize / 1024)
    };
  });

  console.log('=== PERFORMANCE METRICS ===');
  console.log('FCP:', Math.round(cwv.fcp), 'ms');
  console.log('LCP:', Math.round(cwv.lcp), 'ms');
  console.log('CLS:', cwv.cls.toFixed(4));
  console.log('Long Tasks:', cwv.longTasks, `(Total: ${Math.round(cwv.longTaskDuration)}ms)`);
  console.log('Page Load:', navigationTiming.load, 'ms');
  console.log('--- Dropdown Opening Animation ---');
  console.log('Average FPS:', fpsData.averageFps);
  console.log('Jank Frames (>33ms):', fpsData.jankFrames);
  console.log('Max Frame Time:', fpsData.maxFrameMs, 'ms');

  await browser.close();
}

measure().catch(console.error);
