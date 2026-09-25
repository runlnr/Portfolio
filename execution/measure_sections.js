const { chromium } = require('playwright');

async function measure(viewportWidth, viewportHeight) {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight }
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Scroll down smoothly to reveal everything
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    const bioSection = document.getElementById('f3-bio-services');
    const bioDivider = bioSection.querySelector('.f3-intro-divider-row');

    const contactSection = document.getElementById('f3-contact');
    const contactDivider = contactSection.querySelector('.f3-single-divider-row');
    const clocksBar = contactSection.querySelector('.f3-contact-corners-bar');

    function r(el) {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { top: b.top + window.scrollY, bottom: b.bottom + window.scrollY, height: b.height };
    }

    const bBioSec = r(bioSection);
    const bBioDiv = r(bioDivider);

    const bContactSec = r(contactSection);
    const bContactDiv = r(contactDivider);
    const bClocksBar = r(clocksBar);

    return {
      bio: {
        sectionHeight: bBioSec.height,
        dividerTop: bBioDiv.top,
        nextDividerTop: bContactDiv.top,
        dividerToDividerDistance: bContactDiv.top - bBioDiv.top
      },
      cta: {
        sectionHeight: bContactSec.height,
        dividerTop: bContactDiv.top,
        sectionBottom: bContactSec.bottom,
        clocksBottomOffsetFromSectionBottom: bContactSec.bottom - bClocksBar.bottom,
        clocksBarBottom: bClocksBar.bottom,
        clocksBarTop: bClocksBar.top
      }
    };
  });

  await browser.close();
  return data;
}

async function main() {
  console.log('1440x900 Viewport:', JSON.stringify(await measure(1440, 900), null, 2));
  console.log('1920x1080 Viewport:', JSON.stringify(await measure(1920, 1080), null, 2));
}

main().catch(console.error);
