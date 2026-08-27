# 002 — Portfolio card scroll-entry stagger reveal

- **Status**: TODO
- **Commit**: fc0984d
- **Severity**: HIGH
- **Category**: Missed opportunity
- **Estimated scope**: 1 JS file (`js/futurethree-scroll.js`), no CSS changes

## Problem

The three portfolio cards — Card 01 (`.f3-project-card-01`), Card 02 (`.f3-project-card-02`), and Card 03 (`.f3-project-card-03`) — have no scroll-entry animation. When the user scrolls to the portfolio section, the entire grid appears at full opacity with no motion. This is the most visually important section of the site and the one the user flagged as lacking hierarchy.

Currently in `js/futurethree-scroll.js`: only the intro statement, watermark parallax, service rows, and billboard have GSAP scroll reveals. The portfolio cards have zero GSAP animation.

## Target

When the portfolio section scrolls into view:
1. Card 01 (flagship, tall left portrait) fades up first with a slight upward translate.
2. Card 02 (landscape, right stack top) enters 80ms later.
3. Card 03 (offset square, right stack bottom) enters 160ms later.

The stagger creates a visual hierarchy: the flagship card arrives and settles before the supporting cards follow, making Card 01 feel dominant.

**Target values (from AUDIT.md):**
- Stagger: 80ms between cards (within the 30–80ms editorial stagger budget)
- Initial state: `opacity: 0`, `y: 40px`
- Final state: `opacity: 1`, `y: 0`
- Duration: `0.85s` per card
- Ease: `'power3.out'` (matches the existing pattern in this file at line 43)
- Trigger: `start: 'top 82%'` (matches service rows trigger at line 85)
- `toggleActions: 'play none none none'` (one-shot, matches all other reveals in this file)

## Repo conventions to follow

- This file uses `window.gsap.fromTo(element, fromVars, toVars)` with a `scrollTrigger` property in `toVars`.
- Exemplar from `js/futurethree-scroll.js:76–91` (service rows stagger — follow this exactly):
  ```js
  window.gsap.fromTo(
    serviceRows,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.f3-services-list',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    }
  );
  ```
- The difference: portfolio cards use **individual triggers per card**, not a single group stagger, because Card 01 is in the left column and Cards 02–03 are in a right stack (`f3-portfolio-right-stack`). A group stagger on the grid container would fire all three at the same time (the container enters at once). Instead, animate Card 01 first and the right stack second with a `delay`.

## Steps

1. Open `js/futurethree-scroll.js`.
2. Locate the comment `// Staggered reveal for service rows` (around line 73). **Insert the new portfolio card animation BEFORE it**, after the watermark parallax block (after line 71's closing `}`).
3. Add the following code block:

```js
// Staggered portfolio card reveal: flagship first, right stack follows
const portfolioCard01 = document.querySelector('.f3-project-card-01');
const portfolioRightStack = document.querySelector('.f3-portfolio-right-stack');

if (portfolioCard01) {
  window.gsap.fromTo(
    portfolioCard01,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.f3-section-portfolio',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    }
  );
}

if (portfolioRightStack) {
  window.gsap.fromTo(
    portfolioRightStack,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.85,
      delay: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.f3-section-portfolio',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    }
  );
}
```

4. Save the file.

## Boundaries

- Do NOT add `data-reveal` attributes to the HTML — this file manages reveals directly via JS selectors.
- Do NOT touch the CSS.
- Do NOT animate the portfolio header bar (`.f3-portfolio-header-bar`) — that is a separate missed opportunity (noted in audit, not in scope here).
- Do NOT change any existing service rows, watermark, or billboard animations.
- If `portfolioCard01` or `portfolioRightStack` return null (SPA navigation to a non-home page), the guards handle it — no extra null checks needed.

## Verification

- **Mechanical**: Open `index.html` in a browser. No build step needed.
- **Feel check**:
  1. Scroll down from the hero. When the portfolio section comes into view, confirm Card 01 animates up first, then the right stack follows ~80ms later.
  2. In DevTools, open the Animations panel and set playback to 10%. Confirm Card 01 completes its travel before Card 02/03 begin.
  3. Reload the page and jump directly to `#f3-portfolio` via the Works nav link. Confirm the reveal fires correctly after `scrollToPortfolioSection` completes.
- **Done when**: Both portfolio columns visually enter from below when the section first scrolls into the viewport.
