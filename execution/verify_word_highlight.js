const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const servicesSection = await page.$('#f3-bio-services');
  if (servicesSection) {
    await servicesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Check highlighted word 1
    const word1 = await page.evaluate(() => {
      const selected = document.querySelector('.f3-word-highlightable.is-selected-word');
      return selected ? selected.textContent : null;
    });
    console.log('Initially highlighted word:', word1);

    const artifactPath1 = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/65fddc38-952e-407e-9a32-5a793fdc4604/services_word_highlight_jump1.png');
    await servicesSection.screenshot({ path: artifactPath1 });

    // Wait 2.7 seconds for next jump
    await page.waitForTimeout(2700);

    const word2 = await page.evaluate(() => {
      const selected = document.querySelector('.f3-word-highlightable.is-selected-word');
      return selected ? selected.textContent : null;
    });
    console.log('Second highlighted word after jump:', word2);

    const artifactPath2 = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/65fddc38-952e-407e-9a32-5a793fdc4604/services_word_highlight_jump2.png');
    await servicesSection.screenshot({ path: artifactPath2 });
  }

  await browser.close();
})();
