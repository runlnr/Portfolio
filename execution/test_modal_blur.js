const { chromium } = require('playwright');
const server = require('../serve');

async function testModalBlur() {
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
  await page.waitForTimeout(1000);

  // Scroll down to the contact section
  await page.evaluate(() => {
    const contactSection = document.getElementById('f3-contact') || document.querySelector('.f3-section-contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'instant' });
    }
  });
  await page.waitForTimeout(1000);

  // Take screenshot of contact options in normal state
  await page.screenshot({ path: 'execution/contact_options_normal.png' });

  // Hover over the first row
  const firstRow = await page.$('.f3-contact-action-row');
  if (firstRow) {
    await firstRow.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'execution/contact_options_hovered.png' });
  }

  // Click "Start a project"
  if (firstRow) {
    await firstRow.click();
    // Capture during initial blur phase (80ms)
    await page.waitForTimeout(80);
    await page.screenshot({ path: 'execution/modal_blur_phase1.png' });

    // Capture when form is fully settled (450ms)
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'execution/modal_form_phase2.png' });
  }

  await browser.close();
  testServer.close();
  console.log('Modal blur test completed successfully.');
}

testModalBlur().catch(console.error);
