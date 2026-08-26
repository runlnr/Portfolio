const { chromium } = require('playwright');
const path = require('path');

async function testTvMask() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/');

  // Wait for loader to finish and reveal hero
  await page.waitForSelector('body.loader-revealed', { timeout: 6000 });

  await page.evaluate(() => {
    const center = document.querySelector('.hero-center-visual');
    if (!center) return;
    center.innerHTML = `
      <div class="hero-tv-wrapper" style="
        position: relative;
        width: 680px;
        aspect-ratio: 565.01 / 332.96;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.95));
      ">
        <video
          class="hero-tv-video"
          src="/assets/videos/Rose%20Ascii%2060fps.mp4"
          autoplay
          loop
          muted
          playsinline
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            -webkit-mask-image: url('/assets/shape/SVG/TV.svg');
            mask-image: url('/assets/shape/SVG/TV.svg');
            -webkit-mask-size: 100% 100%;
            mask-size: 100% 100%;
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-position: center;
          "
        ></video>
      </div>
    `;
  });

  await page.waitForTimeout(2000);
  const shotPath = path.join('.tmp', 'tv_test.png');
  await page.screenshot({ path: shotPath });
  console.log('Saved tv_test.png');
  await browser.close();
}

testTvMask().catch(console.error);
