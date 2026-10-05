const { chromium } = require('playwright');
const server = require('../serve');

async function testSwitchHighRes() {
  const PORT = 3199;
  let testServer;
  await new Promise((resolve) => {
    testServer = server.listen(PORT, () => resolve());
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await context.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });
  const page = await context.newPage();

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const switchWrap = await page.$('#hero-bottom-switch-wrap');
  if (switchWrap) {
    await switchWrap.screenshot({ path: 'execution/switch_off_2x.png' });
  }

  const heroSwitch = await page.$('#hero-bottom-switch');
  if (heroSwitch) {
    await heroSwitch.click();
    // Move mouse away to 0,0 so custom cursor is not hovering on top
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);
    await switchWrap.screenshot({ path: 'execution/switch_on_2x.png' });
  }

  await page.screenshot({ path: 'execution/hero_full_sharp_switch.png' });

  await browser.close();
  testServer.close();
}

testSwitchHighRes().catch(console.error);
