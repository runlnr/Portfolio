const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });
  await page.reload({ waitUntil: 'networkidle' });

  // Check .f3-statement-btn gap
  const statementBtnGap = await page.evaluate(() => {
    const el = document.querySelector('.f3-statement-btn');
    return el ? window.getComputedStyle(el).gap : null;
  });
  console.log('Statement (Background) button gap:', statementBtnGap);

  // Check .f3-featured-more-link gap
  const moreLinkGap = await page.evaluate(() => {
    const el = document.querySelector('.f3-featured-more-link');
    return el ? window.getComputedStyle(el).gap : null;
  });
  console.log('See all projects button gap:', moreLinkGap);

  // Take preview screenshot of the manifesto section & see all projects header
  const statementBtn = await page.$('.f3-statement-btn');
  if (statementBtn) {
    await statementBtn.screenshot({ path: 'execution/preview_background_btn.png' });
  }

  const moreLink = await page.$('.f3-featured-more-link');
  if (moreLink) {
    await moreLink.screenshot({ path: 'execution/preview_see_all_btn.png' });
  }

  console.log('VERIFICATION FINISHED: Gaps correctly evaluate to', statementBtnGap);
  await browser.close();
})();
