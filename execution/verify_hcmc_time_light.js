const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  console.log('1. Loading Homepage...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Toggle to light mode
  const heroSwitch = page.locator('#hero-bottom-switch');
  await heroSwitch.click();
  await page.waitForTimeout(500);

  // Scroll to intro section
  const introSection = page.locator('#f3-intro');
  await introSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Evaluate computed styles of HCMC time indicator and nearby elements
  const metrics = await page.evaluate(() => {
    const status = document.querySelector('.f3-intro-status');
    const dot = document.querySelector('.f3-intro-status-dot');
    const statusText = document.querySelector('.f3-intro-status-text');
    const city = document.querySelector('.f3-intro-city');
    const liveTime = document.querySelector('.f3-intro-live-time');
    const statementBtn = document.querySelector('.f3-statement-btn');
    const statement = document.querySelector('.f3-intro-statement');
    const featuredTag = document.querySelector('.f3-featured-tag');
    const viewBtn = document.querySelector('.f3-view-btn.is-active');
    const expandBtn = document.querySelector('.f3-works-expand-btn');
    const listCardBadge = document.querySelector('.f3-list-card-badge');

    return {
      statusColor: status ? window.getComputedStyle(status).color : null,
      dotBg: dot ? window.getComputedStyle(dot).backgroundColor : null,
      statusTextColor: statusText ? window.getComputedStyle(statusText).color : null,
      statusTextContent: statusText ? statusText.textContent.trim() : null,
      cityColor: city ? window.getComputedStyle(city).color : null,
      liveTimeColor: liveTime ? window.getComputedStyle(liveTime).color : null,
      statementBtnBg: statementBtn ? window.getComputedStyle(statementBtn).backgroundColor : null,
      statementBtnColor: statementBtn ? window.getComputedStyle(statementBtn).color : null,
      statementColor: statement ? window.getComputedStyle(statement).color : null,
      featuredTagColor: featuredTag ? window.getComputedStyle(featuredTag).color : null,
      viewBtnColor: viewBtn ? window.getComputedStyle(viewBtn).color : null,
      expandBtnBg: expandBtn ? window.getComputedStyle(expandBtn).backgroundColor : null,
      expandBtnColor: expandBtn ? window.getComputedStyle(expandBtn).color : null,
      listCardBadgeBg: listCardBadge ? window.getComputedStyle(listCardBadge).backgroundColor : null,
      listCardBadgeColor: listCardBadge ? window.getComputedStyle(listCardBadge).color : null,
    };
  });

  console.log('Computed Light Mode Intro & Status Metrics:');
  console.log(JSON.stringify(metrics, null, 2));

  // Scroll specifically to intro lockup
  const introLockup = page.locator('.f3-intro-lockup');
  await introLockup.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Take screenshot of lockup
  await introLockup.screenshot({
    path: path.join(__dirname, 'intro_hcmc_light_preview.png')
  });
  console.log('Saved exact intro_hcmc_light_preview.png');

  await browser.close();
})();
