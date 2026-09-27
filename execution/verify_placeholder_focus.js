const { chromium } = require('playwright');

async function testPlaceholderFocus() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  await page.goto('http://localhost:3000/#f3-contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const openBtn = await page.$('#f3-open-contact-modal');
  if (openBtn) {
    await openBtn.click();
    await page.waitForTimeout(400);

    // Screenshot before focus
    await page.screenshot({ path: 'execution/preview_form_unfocused.png' });
    console.log('Saved preview_form_unfocused.png');

    // Focus email field
    const emailInput = await page.$('#f3-form-email');
    if (emailInput) {
      await emailInput.focus();
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'execution/preview_form_email_focused.png' });
      console.log('Saved preview_form_email_focused.png');
    }
  }

  await browser.close();
}

testPlaceholderFocus().catch(console.error);
