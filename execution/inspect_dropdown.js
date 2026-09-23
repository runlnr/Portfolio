const { chromium } = require('playwright');
const path = require('path');

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Click hamburger button to open dropdown menu
  await page.click('#nav-hamburger-btn');
  await page.waitForTimeout(600);
  
  // Take screenshot of opened dropdown menu
  const dropdown = await page.$('#nav-dropdown-menu');
  if (dropdown) {
    await dropdown.screenshot({ path: path.join(__dirname, 'dropdown_menu_fixed.png') });
    console.log('Open dropdown screenshot saved');
  }

  // Hover over Projects and take screenshot
  await page.hover('#nav-works-link');
  await page.waitForTimeout(350);
  if (dropdown) {
    await dropdown.screenshot({ path: path.join(__dirname, 'dropdown_hover_fixed.png') });
    console.log('Hover screenshot saved');
  }
  
  await browser.close();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
