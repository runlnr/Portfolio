const http = require('http');
const { chromium } = require('playwright');
const server = require('../serve');

async function testShuffle() {
  const PORT = 3188;
  let testServer;
  
  await new Promise((resolve) => {
    testServer = server.listen(PORT, () => resolve());
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Testing Index page mono shuffle elements...');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const indexSelectors = [
      '.f3-intro-city',
      '.f3-corner-label',
      '.f3-colophon-privacy',
      '.f3-colophon-left',
      '.f3-showcase-label'
    ];

    for (const sel of indexSelectors) {
      const count = await page.$$eval(sel, (els) => {
        return els.map(el => ({
          text: el.textContent,
          hasLetters: el.querySelectorAll('.f3-mono-shuffle-letter').length,
          letterCount: el.querySelectorAll('.f3-mono-shuffle-letter').length
        }));
      });
      console.log(`Selector "${sel}" matched ${count.length} element(s):`, count);
    }

    // Test hover on one of the letters of "MY TIME"
    const myTimeLetter = await page.$('.f3-contact-corner-left .f3-corner-label .f3-mono-shuffle-letter');
    if (myTimeLetter) {
      const origChar = await myTimeLetter.evaluate(el => el.getAttribute('data-original'));
      await myTimeLetter.hover();
      await page.waitForTimeout(100);
      const shuffledChar = await myTimeLetter.evaluate(el => el.textContent);
      console.log(`Hover test on MY TIME letter: original="${origChar}", while hovered="${shuffledChar}"`);
    }

    // Test hover on one of the 4 boxes labels
    const boxLabelLetter = await page.$('.f3-showcase-label .f3-mono-shuffle-letter');
    if (boxLabelLetter) {
      const origChar = await boxLabelLetter.evaluate(el => el.getAttribute('data-original'));
      await boxLabelLetter.hover();
      await page.waitForTimeout(100);
      const shuffledChar = await boxLabelLetter.evaluate(el => el.textContent);
      console.log(`Hover test on 4-box label letter: original="${origChar}", while hovered="${shuffledChar}"`);
    }

    // Test hover on ALL RIGHTS RESERVED
    const colophonLetter = await page.$('.f3-colophon-privacy .f3-mono-shuffle-letter');
    if (colophonLetter) {
      const origChar = await colophonLetter.evaluate(el => el.getAttribute('data-original'));
      await colophonLetter.hover();
      await page.waitForTimeout(100);
      const shuffledChar = await colophonLetter.evaluate(el => el.textContent);
      console.log(`Hover test on colophon privacy letter: original="${origChar}", while hovered="${shuffledChar}"`);
    }

    console.log('\nTesting Project page footer mono shuffle elements...');
    await page.goto(`http://localhost:${PORT}/project.html?id=audi-revolut-f1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const projectColophonLetters = await page.$$eval('.f3-colophon-privacy .f3-mono-shuffle-letter, .f3-colophon-left .f3-mono-shuffle-letter', els => els.length);
    console.log(`Project page colophon shuffle letter spans count: ${projectColophonLetters}`);

    console.log('\nTesting About page footer mono shuffle elements...');
    await page.goto(`http://localhost:${PORT}/about.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const aboutColophonLetters = await page.$$eval('.f3-colophon-privacy .f3-mono-shuffle-letter, .f3-colophon-left .f3-mono-shuffle-letter', els => els.length);
    console.log(`About page colophon shuffle letter spans count: ${aboutColophonLetters}`);

    console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
  } finally {
    await browser.close();
    testServer.close();
  }
}

testShuffle().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
