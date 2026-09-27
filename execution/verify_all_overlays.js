const { chromium } = require('playwright');

async function testOverlays() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  // 1. Check Dropdown Menu Overlay
  console.log('Testing Dropdown Menu Overlay...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const hamburger = await page.$('#nav-hamburger-btn');
  if (hamburger) {
    await hamburger.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'execution/preview_dropdown_overlay.png' });
    console.log('Saved preview_dropdown_overlay.png');
    await hamburger.click();
    await page.waitForTimeout(400);
  }

  // 2. Check CTA Contact Modal Overlay & Logo
  console.log('Testing Contact Modal Overlay...');
  await page.goto('http://localhost:3000/#f3-contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const openContactBtn = await page.$('#f3-open-contact-modal');
  if (openContactBtn) {
    await openContactBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'execution/preview_contact_overlay.png' });
    console.log('Saved preview_contact_overlay.png');
    const closeContactBtn = await page.$('#f3-close-contact-modal');
    if (closeContactBtn) await closeContactBtn.click();
    await page.waitForTimeout(400);
  }

  // 3. Check Project Modal Overlay
  console.log('Testing Project Modal Overlay...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const workCard = await page.$('.f3-work-card');
  if (workCard) {
    await workCard.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'execution/preview_project_overlay.png' });
    console.log('Saved preview_project_overlay.png');
  }

  await browser.close();
  console.log('All overlay tests finished!');
}

testOverlays().catch(console.error);
