const { chromium } = require('playwright');
const server = require('../serve');

async function captureHero() {
  const PORT = 3199;
  let testServer;
  await new Promise((resolve) => {
    testServer = server.listen(PORT, () => resolve());
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });
  const page = await context.newPage();

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Take screenshot of hero section before switch click
  await page.screenshot({ path: 'execution/hero_switch_off_preview.png' });
  console.log('Saved hero switch OFF preview to execution/hero_switch_off_preview.png');

  // Click the switch
  const heroSwitch = await page.$('#hero-bottom-switch');
  if (heroSwitch) {
    await heroSwitch.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'execution/hero_switch_on_preview.png' });
    console.log('Saved hero switch ON preview to execution/hero_switch_on_preview.png');

    // Screenshot just the switch
    const switchWrap = await page.$('#hero-bottom-switch-wrap');
    if (switchWrap) {
      await switchWrap.screenshot({ path: 'execution/switch_component_preview.png' });
      console.log('Saved switch component screenshot to execution/switch_component_preview.png');
    }
  }

  await browser.close();
  testServer.close();
}

captureHero().catch(console.error);
