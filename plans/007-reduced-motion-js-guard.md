# 007 — Add `prefers-reduced-motion` guard to JS animations

- **Status**: TODO
- **Commit**: fc0984d
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 3 JS files, guard added at each init function entry point

## Problem

The site has `@media (prefers-reduced-motion: reduce)` CSS blocks in `hero-3d.css` (lines 663, 726) and `components.css` (line 576). However, every GSAP-driven animation — the hero scroll timeline, card stagger reveals, watermark parallax, service rows, billboard kinetic scale, and scroll reveal fade-ups — fires unconditionally in JavaScript regardless of the user's OS motion preference.

This is an accessibility violation and a potential vestibular motion issue for users with inner-ear conditions.

**Affected init functions:**
- `js/motion-stack.js` → `initScrollReveals()` (line 61) — fade-ups, kinetics, stagger
- `js/futurethree-scroll.js` → `initFutureThreeScroll()` (line 9) → GSAP block (line 30)
- `js/hero-scroll-transition.js` → `initHeroScrollTransition()` (line 18) — entire pinned hero scrub

## Target

Add a reduced-motion check at the top of each GSAP animation block. The behavior follows the AUDIT.md rule: *keep transitions that aid comprehension, remove position changes*. For this site:
- `prefers-reduced-motion: reduce` → skip all `y` translate and `scale` animations; keep `opacity` reveals where they exist (these are comprehension aids, not movement)
- The hero scroll expansion is a major position change — skip the whole timeline under reduced motion

**Shared pattern to use (copy exactly):**
```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

## Repo conventions to follow

- Each init function is an IIFE or method. The guard goes at the top of the GSAP-specific block, not at the module level — the non-GSAP code (clock sync, language selector, etc.) should still run.
- No new dependencies. `window.matchMedia` is supported in all modern browsers.

## Steps

### File 1: `js/motion-stack.js`

1. Open `js/motion-stack.js`.
2. Find `initScrollReveals()` method (line 61).
3. After `if (!window.gsap || !window.ScrollTrigger) return;` (line 62), insert:
```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return;
```
4. The full resulting start of the method:
```js
initScrollReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // A. Fade Up Elements
  ...
```

### File 2: `js/futurethree-scroll.js`

1. Open `js/futurethree-scroll.js`.
2. Find the GSAP block: `if (window.gsap && window.ScrollTrigger) {` (line 30).
3. Immediately after the opening brace (before `window.ScrollTrigger.refresh()`), insert:
```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) { window.ScrollTrigger.refresh(); return; }
```
   This still calls `ScrollTrigger.refresh()` (needed for layout) but skips all animation setup.

4. The result:
```js
if (window.gsap && window.ScrollTrigger) {
  window.ScrollTrigger.refresh();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) { return; }

  // Intro text reveal
  ...
```
   Note: `ScrollTrigger.refresh()` was already on line 31 — keep it where it is and insert the guard after it.

### File 3: `js/hero-scroll-transition.js`

1. Open `js/hero-scroll-transition.js`.
2. Find `initHeroScrollTransition()` (line 18).
3. After the GSAP null check block (after line 22 `return;`), insert:
```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return;
```

4. The result (lines 18–26 target state):
```js
function initHeroScrollTransition() {
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('HeroScrollTransition: GSAP or ScrollTrigger not loaded');
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (currentTimeline) {
    ...
```

5. Save all three files.

## Boundaries

- Do NOT remove or modify the `@media (prefers-reduced-motion: reduce)` blocks in the CSS — those stay.
- Do NOT touch the cursor rAF loop in `js/app.js` — cursor movement is not a vestibular concern.
- Do NOT touch the page transition curtain — it's a full-page cover, not a scroll-based position animation.
- Do NOT touch the intro loader setTimeout chain — it's a one-time first-visit experience.
- The language selector and clock code in `futurethree-scroll.js` must still execute — only the GSAP block should early-return.

## Verification

- **Feel check**:
  1. In Chrome DevTools → Rendering panel → check "Emulate CSS media feature prefers-reduced-motion: reduce".
  2. Reload `index.html`. The hero should be visible immediately without the pinned scroll expansion.
  3. Scroll down. Portfolio cards, service rows, intro statement, and billboard should be immediately visible without fade or translate animations.
  4. Navigation and page transitions should still work normally.
  5. Uncheck the emulation. Reload. Confirm all animations return.
- **Done when**: All GSAP-driven translate/scale animations are skipped under `prefers-reduced-motion: reduce` emulation, with no JS errors in the console.
