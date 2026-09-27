const { chromium } = require('playwright');

async function auditSite() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const pagesToAudit = [
    { name: 'Homepage', url: 'http://localhost:3000/' },
    { name: 'About', url: 'http://localhost:3000/about.html' },
    { name: 'Project', url: 'http://localhost:3000/project.html?id=memphis-grizzlies' }
  ];

  const results = [];

  for (const p of pagesToAudit) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      sessionStorage.setItem('np_has_seen_intro', 'true');
    });

    await page.goto(p.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // If homepage, also trigger modal & dropdown for complete DOM coverage
    if (p.name === 'Homepage') {
      const openModalBtn = await page.$('#f3-open-contact-modal');
      if (openModalBtn) await openModalBtn.click();
      await page.waitForTimeout(300);
      const closeModalBtn = await page.$('#f3-close-contact-modal');
      if (closeModalBtn) await closeModalBtn.click();
      await page.waitForTimeout(300);
    }

    const elements = await page.evaluate((pageName) => {
      const all = Array.from(document.querySelectorAll('*'));
      const textNodes = [];

      all.forEach(el => {
        // Only elements with direct text content (or meaningful text children)
        const directText = Array.from(el.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE)
          .map(n => n.textContent.trim())
          .join(' ');

        if (!directText && !['BUTTON', 'INPUT', 'TEXTAREA', 'A', 'SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'LABEL'].includes(el.tagName)) {
          return;
        }

        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'HEAD', 'META', 'TITLE', 'SVG', 'PATH', 'G', 'RECT', 'CIRCLE', 'DEFS', 'FILTER', 'CLIPPATH', 'MASK'].includes(el.tagName)) {
          return;
        }

        const text = el.innerText ? el.innerText.trim().replace(/\s+/g, ' ') : (el.value || directText);
        if (!text || text.length === 0) return;
        if (['HTML', 'BODY', 'MAIN', 'NAV', 'HEADER', 'FOOTER', 'DIV', 'SECTION', 'ASIDE', 'FORM'].includes(el.tagName) && el.children.length > 2) {
          return; // Container elements
        }

        const cs = window.getComputedStyle(el);
        const className = el.className || '';
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';

        // Check assigned typography classes
        const classes = typeof className === 'string' ? className.split(/\s+/) : [];
        const matchedTypeClass = classes.find(c => c.startsWith('type-aero-') || c.startsWith('type-mono-') || c === 'live-clock') || null;

        // Extract styling tokens
        const fontFam = cs.fontFamily;
        const fontSize = cs.fontSize;
        const fontWeight = cs.fontWeight;
        const lineHeight = cs.lineHeight;
        const letterSpacing = cs.letterSpacing;
        const textTransform = cs.textTransform;

        textNodes.push({
          page: pageName,
          selector: `${tag}${id}${classes.length ? '.' + classes.slice(0, 3).join('.') : ''}`,
          textSnippet: text.length > 40 ? text.substring(0, 40) + '...' : text,
          matchedTypeClass,
          classes,
          styles: {
            fontFam,
            fontSize,
            fontWeight,
            lineHeight,
            letterSpacing,
            textTransform
          }
        });
      });

      return textNodes;
    }, p.name);

    results.push(...elements);
    await page.close();
  }

  await browser.close();

  const fs = require('fs');
  fs.writeFileSync('execution/audit_output.json', JSON.stringify(results, null, 2));
  console.log(`Audited ${results.length} text elements across 3 pages.`);
}

auditSite().catch(console.error);
