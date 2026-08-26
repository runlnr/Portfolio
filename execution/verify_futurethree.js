const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const checks = [
      ['hero-viewport (100vh Hero)', 'id="hero-viewport"'],
      ['Nav Behance Link', 'id="nav-behance-link">Behance</a>'],
      ['hero-lang-selector (Monospace)', 'id="hero-lang-selector"'],
      ['Language button EN', 'data-lang="en">EN</button>'],
      ['f3-content wrapper', 'id="f3-content"'],
      ['Section 1: f3-intro', 'id="f3-intro"'],
      ['Intro split grid', 'class="f3-intro-split-grid"'],
      ['Red accent N/P brand name', 'class="f3-accent-red">N/P®</span>'],
      ['Intro manifesto text', 'flawless functionality meets editorial aesthetics'],
      ['Pill button ABOUT US', 'ABOUT US'],
      ['Coordinates strip', 'class="f3-coordinates-strip"'],
      ['Ho Chi Minh City location', 'Ho Chi Minh City, Vietnam'],
      ['Email link phnm@outlook.com', 'phnm@outlook.com'],
      ['Section 2: f3-portfolio', 'id="f3-portfolio"'],
      ['Portfolio header THE BEST OF N/P', 'THE BEST<br>OF N/P'],
      ['Portfolio tag /Portfolio', 'class="f3-portfolio-tag-serif">/Portfolio</div>'],
      ['Disciplines bar (BRANDING, DESIGN, DEVELOPMENT)', 'class="f3-disciplines-bar"'],
      ['01 WIDE ANGLE', 'WIDE ANGLE'],
      ['02 TITARVL', 'TITARVL'],
      ['03 KADE AGENCY', 'KADE AGENCY'],
      ['Watermark number _15', 'class="f3-watermark-number" aria-hidden="true">_15</div>'],
      ['Section 3: f3-services', 'id="f3-services"'],
      ['Services serif/sans lockup (Our Core SERVICES)', 'class="f3-services-subhead">Our Core</span>'],
      ['Service 1: Branding', 'Brand Identity Design'],
      ['Service 2: Web Design', 'UX / UI & Creative Dev'],
      ['Service 3: Art Direction', 'Editorial & Spatial Craft'],
      ['Section 4: f3-billboard (N / P   D E S I G N)', 'class="f3-billboard-text">N / P   D E S I G N</h2>'],
      ['Section 5: f3-outro', 'id="f3-outro"'],
      ['Featured Work: Drift Labs', 'Drift Labs'],
      ['Outro headline', "Let’s create something timeless"],
      ['Pill button GET IN TOUCH', 'GET IN TOUCH'],
      ['Outro directory grid', 'class="f3-outro-directory-grid"'],
      ['Calendly non-binding tag', '[100% NON-BINDING]'],
      ['Footer legal bar N/P® PRACTICE', 'N/P® PRACTICE'],
      ['Stylesheet link', 'href="css/futurethree-scroll.css"'],
      ['Script link', 'src="js/futurethree-scroll.js"']
    ];

    let allPassed = true;
    for (const [name, pattern] of checks) {
      const found = body.includes(pattern);
      console.log(`- Check [${name}]: ${found ? 'PASS' : 'FAIL'}`);
      if (!found) allPassed = false;
    }
    console.log('\nN/P validation complete. All checks passed:', allPassed);
    process.exit(allPassed ? 0 : 1);
  });
}).on('error', err => {
  console.error('Fetch error:', err.message);
  process.exit(1);
});
