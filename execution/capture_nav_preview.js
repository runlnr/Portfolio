const { chromium } = require('playwright');
const server = require('../serve');

async function captureNav() {
  const PORT = 3174;
  let testServer;
  await new Promise((resolve) => {
    testServer = server.listen(PORT, () => resolve());
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`http://localhost:${PORT}/about.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const navBox = await page.$('.nav-modular-box');
  if (navBox) {
    await navBox.screenshot({ path: 'execution/about_nav_preview.png' });
    console.log('Saved about nav preview screenshot to execution/about_nav_preview.png');
  }

  await browser.close();
  testServer.close();
}

captureNav().catch(console.error);
