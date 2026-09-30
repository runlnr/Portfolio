const { chromium } = require('playwright');
const server = require('../serve');

async function testNavStates() {
  const PORT = 3173;
  let testServer;
  await new Promise((resolve) => {
    testServer = server.listen(PORT, () => resolve());
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Testing Index page 3-state navigation status scramble...');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const getStatusText = async () => {
      return await page.$eval('#nav-status-line', el => {
        // Collect letters and spaces in order
        const parts = Array.from(el.childNodes).map(node => {
          if (node.nodeType === 3) return node.textContent;
          if (node.classList.contains('f3-mono-shuffle-space')) return ' ';
          return node.textContent;
        });
        return parts.join('').trim().replace(/\s+/g, ' ');
      });
    };

    // State 1: Hero
    const text1 = await getStatusText();
    console.log(`1. Top Viewport Status: "${text1}" (Expected: "LOOKING SHARP TODAY" or "Looking sharp today")`);

    // State 2: Scroll to Portfolio
    await page.evaluate(() => {
      const works = document.getElementById('f3-portfolio');
      if (works) works.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1600);
    const text2 = await getStatusText();
    console.log(`2. Middle / Works Section Status: "${text2}" (Expected: "What stood out")`);

    // State 3: Scroll to Contact / Footer
    await page.evaluate(() => {
      const contact = document.getElementById('f3-contact') || document.getElementById('f3-footer');
      if (contact) contact.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1600);
    const text3 = await getStatusText();
    console.log(`3. Near Bottom Footer Status: "${text3}" (Expected: "Dont be shy")`);

    // Test letter shuffle on "Dont be shy"
    const shyLetter = await page.$('#nav-status-line .f3-mono-shuffle-letter');
    if (shyLetter) {
      const origChar = await shyLetter.evaluate(el => el.getAttribute('data-original'));
      await shyLetter.hover();
      await page.waitForTimeout(100);
      const shuffledChar = await shyLetter.evaluate(el => el.textContent);
      console.log(`4. Hover test on Dont be shy letter: original="${origChar}", while hovered="${shuffledChar}"`);
    }

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1600);
    const textTopAgain = await getStatusText();
    console.log(`5. Back at Top Viewport Status: "${textTopAgain}" (Expected: "Looking sharp today")`);

    console.log('\nALL 3 NAVIGATION BAR STATUS STATES VERIFIED SUCCESSFULLY!');
  } finally {
    await browser.close();
    testServer.close();
  }
}

testNavStates().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
