const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

async function runVerification() {
  console.log('--- Starting Featured Works Verification ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Set sessionStorage to bypass intro loader for immediate rendering
  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // 1. Check intro left column elements
  const coordinatesEl = await page.$('.f3-intro-coordinates');
  const ongoingBadgeEl = await page.$('.f3-ongoing-badge');
  const ongoingLabelEl = await page.$('.f3-ongoing-label');

  const coordText = coordinatesEl ? await coordinatesEl.textContent() : null;
  const badgeText = ongoingBadgeEl ? await ongoingBadgeEl.textContent() : null;
  const labelText = ongoingLabelEl ? await ongoingLabelEl.textContent() : null;

  console.log('Intro Coordinates:', coordText);
  console.log('Ongoing Badge:', badgeText);
  console.log('Ongoing Label:', labelText);

  // 2. Check Section Header Row
  const headerTag = await page.$eval('.f3-featured-tag', el => el.textContent.trim());
  const headerMore = await page.$eval('.f3-featured-more-link', el => ({
    text: el.textContent.trim(),
    href: el.getAttribute('href')
  }));
  console.log('Header Tag:', headerTag);
  console.log('Header More Link:', headerMore);

  // Scroll intro & portfolio into view
  await page.evaluate(() => {
    const portfolio = document.getElementById('f3-portfolio');
    if (portfolio) portfolio.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(600);

  // 3. Measure title & year baseline alignment across all 4 cards
  const alignmentReport = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.f3-work-card'));
    return cards.map(c => {
      const title = c.querySelector('.f3-work-card-title');
      const year = c.querySelector('.f3-work-card-year');
      const tags = Array.from(c.querySelectorAll('.f3-work-tag')).map(t => t.textContent.trim());
      const titleRect = title ? title.getBoundingClientRect() : null;
      const yearRect = year ? year.getBoundingClientRect() : null;
      const titleStyle = title ? window.getComputedStyle(title) : null;
      const yearStyle = year ? window.getComputedStyle(year) : null;

      // Calculate baseline approximation (bottom - font descent or direct bottom alignment)
      const bottomDiff = (titleRect && yearRect) ? Math.abs(titleRect.bottom - yearRect.bottom) : null;

      return {
        title: title ? title.textContent.trim() : null,
        year: year ? year.textContent.trim() : null,
        tagCount: tags.length,
        tags: tags,
        titleFontSize: titleStyle ? titleStyle.fontSize : null,
        titleLetterSpacing: titleStyle ? titleStyle.letterSpacing : null,
        bottomDiffPixels: bottomDiff
      };
    });
  });

  console.log('Cards Alignment & Tag Pill Report:', JSON.stringify(alignmentReport, null, 2));

  // Save desktop snapshot of the section
  const sectionEl = await page.$('.f3-section-intro');
  if (sectionEl) {
    await sectionEl.screenshot({ path: '.tmp/verify_desktop_works.png' });
    console.log('Saved .tmp/verify_desktop_works.png');
  }

  // 4. Test Hover Interaction on Memphis Grizzlies
  const memphisCard = await page.$('a[href*="memphis-grizzlies"]');
  if (memphisCard) {
    await memphisCard.hover();
    await page.waitForTimeout(400);

    const hoverState = await page.evaluate(() => {
      const memphis = document.querySelector('a[href*="memphis-grizzlies"]');
      const img = memphis ? memphis.querySelector('.f3-work-card-media img') : null;
      const otherCard = document.querySelector('a[href*="us-ski-snowboard"]');
      
      const imgStyle = img ? window.getComputedStyle(img) : null;
      const otherStyle = otherCard ? window.getComputedStyle(otherCard) : null;

      return {
        hoveredTransform: imgStyle ? imgStyle.transform : null,
        otherCardFilter: otherStyle ? otherStyle.filter : null
      };
    });

    console.log('Memphis Hover State:', hoverState);
    if (sectionEl) {
      await sectionEl.screenshot({ path: '.tmp/verify_hover_memphis.png' });
      console.log('Saved .tmp/verify_hover_memphis.png');
    }
  }

  // 5. Test Hover Interaction on Audi Revolut F1 (2 tags)
  const audiCard = await page.$('a[href*="audi-revolut-f1"]');
  if (audiCard) {
    await audiCard.hover();
    await page.waitForTimeout(400);

    const audiHoverState = await page.evaluate(() => {
      const audi = document.querySelector('a[href*="audi-revolut-f1"]');
      const img = audi ? audi.querySelector('.f3-work-card-media img') : null;
      const memphis = document.querySelector('a[href*="memphis-grizzlies"]');

      return {
        audiTransform: img ? window.getComputedStyle(img).transform : null,
        memphisFilter: memphis ? window.getComputedStyle(memphis).filter : null
      };
    });

    console.log('Audi Hover State:', audiHoverState);
    if (sectionEl) {
      await sectionEl.screenshot({ path: '.tmp/verify_hover_audi.png' });
      console.log('Saved .tmp/verify_hover_audi.png');
    }
  }

  // 6. Test Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    const portfolio = document.getElementById('f3-portfolio');
    if (portfolio) portfolio.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(500);

  const mobileCols = await page.evaluate(() => {
    const grid = document.querySelector('.f3-works-staggered-grid');
    return grid ? window.getComputedStyle(grid).flexDirection : null;
  });
  console.log('Mobile flex-direction:', mobileCols);

  const mobileSectionEl = await page.$('.f3-section-intro');
  if (mobileSectionEl) {
    await mobileSectionEl.screenshot({ path: '.tmp/verify_mobile_works.png' });
    console.log('Saved .tmp/verify_mobile_works.png');
  }

  await browser.close();
  console.log('--- Verification Finished Successfully ---');
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
