# 003 — Flagship card hover hierarchy: overlay reveal

- **Status**: TODO
- **Commit**: fc0984d
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 CSS file (`css/futurethree-scroll.css`), targeted card 01 section only

## Problem

All three portfolio cards use identical hover behavior: `transform: scale(1.035)` on the image inside the wrapper. There is no visual distinction between the flagship card (Card 01, tall left portrait) and the supporting cards. The user explicitly asked for Card 01 to dominate — with an image reveal and title overlay that fades in on hover.

**`css/futurethree-scroll.css:267–278` — current Card 01 hover:**
```css
.f3-img-wrap-01 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.08);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
}

.f3-project-card-link:hover .f3-img-wrap-01 img {
  transform: scale(1.035);
  filter: contrast(1.12);
}
```

No overlay. No title reveal. Indistinguishable from Cards 02 and 03.

## Target

Card 01 gets a dark overlay that fades in on hover, with the project title revealed from below inside the image frame. Cards 02 and 03 keep their existing subtle scale (unchanged).

The overlay uses `opacity` and `translateY` — GPU-only properties. No layout changes.

**Add to `css/futurethree-scroll.css`, within the Card 01 block (after line 278):**

```css
/* Card 01 overlay: dark scrim + title reveal on hover */
.f3-img-wrap-01 {
  position: relative; /* already set — confirm, do not duplicate */
}

.f3-img-wrap-01::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.18) 55%, transparent 100%);
  opacity: 0;
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 2;
}

.f3-project-card-link:hover .f3-img-wrap-01::after {
  opacity: 1;
}

/* Overlay title: lives inside .f3-img-wrap-01 via absolute positioning */
.f3-card-01-overlay-title {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 3;
  font-family: var(--font-sans);
  font-size: clamp(20px, 2.2vw, 30px);
  font-weight: 500;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: #ffffff;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.f3-project-card-link:hover .f3-card-01-overlay-title {
  opacity: 1;
  transform: translateY(0);
}
```

**Add to `index.html` inside `.f3-img-wrap-01` (after the `<img>` tag, before the closing `</div>`):**

```html
<div class="f3-card-01-overlay-title">WIDE ANGLE®</div>
```

Exact location in `index.html`, line 251 (after the img tag, before `</div>`):
```html
<!-- current -->
<div class="f3-img-wrap-01">
  <img src="https://framerusercontent.com/images/McfLASz7qCgeArkEfMksXwLY.jpg" alt="WIDE ANGLE"
    loading="lazy">
</div>

<!-- target -->
<div class="f3-img-wrap-01">
  <img src="https://framerusercontent.com/images/McfLASz7qCgeArkEfMksXwLY.jpg" alt="WIDE ANGLE"
    loading="lazy">
  <div class="f3-card-01-overlay-title">WIDE ANGLE®</div>
</div>
```

Keep the existing Card 01 image scale hover untouched:
```css
/* keep as-is */
.f3-project-card-link:hover .f3-img-wrap-01 img {
  transform: scale(1.035);
  filter: contrast(1.12);
}
```

## Repo conventions to follow

- Transitions use tokens from `css/main.css` where possible. The 0.45s duration is intentionally longer than `--transition-smooth` (0.4s) to give the overlay a slightly slower, more cinematic feel — this is deliberate, not a deviation.
- The overlay pattern matches the editorial dark-on-light inversion: white card body, dark overlay inside the image frame.
- The font settings mirror `.f3-card-title` (`css/futurethree-scroll.css:295–306`) for consistency.

## Steps

1. Open `css/futurethree-scroll.css`.
2. Find the `.f3-img-wrap-01 img` block (around line 267). After the `.f3-project-card-link:hover .f3-img-wrap-01 img` closing brace (line ~278), insert the new CSS block above (the `::after` overlay, `.f3-card-01-overlay-title`, and their hover states).
3. Verify `.f3-img-wrap-01` already has `position: relative` (line 260 — it does). Do NOT add it again.
4. Open `index.html`.
5. Find line 251 (inside `.f3-img-wrap-01`). After the `<img>` tag and before the `</div>`, insert:
   ```html
   <div class="f3-card-01-overlay-title">WIDE ANGLE®</div>
   ```
6. Save both files.

## Boundaries

- Do NOT modify Card 02 (`.f3-img-wrap-02`) or Card 03 (`.f3-img-wrap-03`) CSS — they keep their existing uniform scale-only hover.
- Do NOT change the `.f3-card-bottom-bar`, `.f3-card-num`, or `.f3-card-title` below the image — those remain visible at all times.
- Do NOT add overlay titles to Cards 02 or 03.
- If the overlay title text should change (e.g. for other projects in future), it lives only in `index.html` — no JS needed.

## Verification

- **Mechanical**: Open `index.html` in browser, no build step needed.
- **Feel check**:
  1. Hover over Card 01 (tall left portrait). The dark gradient overlay should fade in from the bottom third of the image, and "WIDE ANGLE®" should slide up into view simultaneously.
  2. Hover over Card 02 or Card 03. Confirm NO overlay appears — only the existing scale.
  3. In DevTools Animations panel at 10% speed, confirm: overlay `opacity` and title `translateY` start together and complete in ~450ms.
  4. Move the cursor off Card 01. Confirm the overlay and title fade back out smoothly (CSS transition reversal — no JS needed).
  5. Toggle `prefers-reduced-motion` in DevTools Rendering panel. Confirm: the scale effect still occurs (it's subtle and spatial) but the overlay should ideally not transition — add to `@media (prefers-reduced-motion: reduce)` block in `css/components.css:576` if desired:
     ```css
     .f3-img-wrap-01::after,
     .f3-card-01-overlay-title { transition: none; }
     ```
- **Done when**: Card 01 hover visually dominates over Cards 02 and 03 with the overlay reveal.
