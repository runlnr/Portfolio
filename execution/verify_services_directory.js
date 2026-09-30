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

  const metrics = await page.evaluate(() => {
    const divider = document.querySelector('#f3-bio-services .f3-single-divider-line');
    const grid = document.querySelector('.f3-services-directory-grid');
    const nextDivider = document.querySelector('#f3-contact .f3-single-divider-line');

    const dividerRect = divider ? divider.getBoundingClientRect() : null;
    const gridRect = grid ? grid.getBoundingClientRect() : null;
    const nextDividerRect = nextDivider ? nextDivider.getBoundingClientRect() : null;

    return {
      gapDividerToGrid: (dividerRect && gridRect) ? (gridRect.top - dividerRect.bottom) : null,
      gapGridToNextDivider: (gridRect && nextDividerRect) ? (nextDividerRect.top - gridRect.bottom) : null
    };
  });

  console.log('Services Section Spacing Metrics:', JSON.stringify(metrics, null, 2));

  const servicesSection = await page.$('#f3-bio-services');
  if (servicesSection) {
    await servicesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const artifactPath = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/65fddc38-952e-407e-9a32-5a793fdc4604/services_directory_preview.png');
    const localPath = path.resolve(__dirname, 'services_directory_preview.png');

    await servicesSection.screenshot({ path: localPath });
    await servicesSection.screenshot({ path: artifactPath });
    console.log('Services section screenshot captured successfully');

    // Also take a full viewport shot including surrounding sections
    const fullArtifactPath = path.resolve('C:/Users/haina/.gemini/antigravity-ide/brain/65fddc38-952e-407e-9a32-5a793fdc4604/services_directory_context.png');
    await page.screenshot({ path: fullArtifactPath });
    console.log('Context screenshot captured successfully');
  } else {
    console.error('Services section not found');
  }

  await browser.close();
})();
