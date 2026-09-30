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

  const worksSection = await page.$('#f3-portfolio');
  if (worksSection) {
    await worksSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const artifactPath = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/65fddc38-952e-407e-9a32-5a793fdc4604/works_thumbnails_3x2_preview.png');
    await worksSection.screenshot({ path: artifactPath });
    console.log('Works section screenshot captured successfully');

    // Hover over first card
    const firstCard = await page.$('.f3-work-card');
    if (firstCard) {
      await firstCard.hover();
      await page.waitForTimeout(500);
      const hoverArtifactPath = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/65fddc38-952e-407e-9a32-5a793fdc4604/works_thumbnails_hover_preview.png');
      await worksSection.screenshot({ path: hoverArtifactPath });
      console.log('Hover screenshot captured successfully');
    }
  }

  await browser.close();
})();
