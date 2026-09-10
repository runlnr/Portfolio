# 004 — Easing token cleanup: bare `ease` on hover states

- **Status**: TODO
- **Commit**: fc0984d
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 CSS file, 3 line changes

## Problem

Per the AUDIT.md rule: **bare `ease` on UI is always a finding for hover states**. `ease` is a CSS keyword equivalent to `cubic-bezier(0.25, 0.1, 0.25, 1.0)` — it has a slow start (ease-in portion) that delays the response at the exact moment the user's eye is watching. The correct curve for hover color transitions is `ease-out`.

**`css/futurethree-scroll.css:122–123` — current `.f3-pill-btn` hover:**
```css
transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
```

**`css/futurethree-scroll.css:133` — current `.f3-pill-btn .btn-arrow` hover:**
```css
transition: transform 0.2s ease;
```

**`css/futurethree-scroll.css:306` — current `.f3-card-title` hover:**
```css
transition: color 0.2s ease;
```

All three use bare `ease` where they should use the repo's `--transition-fast` token (which is `0.2s cubic-bezier(0.16, 1, 0.3, 1)` — a strong ease-out).

## Target

Replace bare `ease` instances with `var(--transition-fast)` from `css/main.css:27`:

**`css/futurethree-scroll.css:122` — target:**
```css
transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color var(--transition-fast);
```

**`css/futurethree-scroll.css:133` — target:**
```css
transition: transform var(--transition-fast);
```

**`css/futurethree-scroll.css:306` — target:**
```css
transition: color var(--transition-fast);
```

Note: `--transition-fast` resolves to `0.2s cubic-bezier(0.16, 1, 0.3, 1)`, so the duration is unchanged. Only the curve changes from `ease` to a proper strong ease-out.

## Repo conventions to follow

- Easing tokens are in `css/main.css:27–29`. Use `var(--transition-fast)` for 200ms hover transitions.
- Exemplar: `css/components.css:71–72` already uses explicit cubic-bezier for transition (predecessor pattern). This plan moves to the token-first approach.

## Steps

1. Open `css/futurethree-scroll.css`.
2. Find line 122–123 (`.f3-pill-btn` transition). Change `background-color 0.2s ease` to `background-color var(--transition-fast)`.
3. Find line 133 (`.f3-pill-btn .btn-arrow` transition). Change `transition: transform 0.2s ease` to `transition: transform var(--transition-fast)`.
4. Find line 306 (`.f3-card-title` transition). Change `transition: color 0.2s ease` to `transition: color var(--transition-fast)`.
5. Save.

## Boundaries

- Do NOT change the `transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)` part of the pill button transition — that value is deliberate (slightly longer than fast for the lift effect).
- Do NOT touch any other properties in these rulesets.
- Do NOT change `css/futurethree-scroll.css:167` (`.f3-coord-value a` transition) — that `0.2s ease` is on a text link color, not a UI button; medium priority and can be addressed as follow-up.

## Verification

- **Feel check**: Hover over the "ABOUT US" pill button and a portfolio card title. The color/background change should feel snappier and more responsive — not delayed by a slow ease-in start. The difference is subtle but compounds across every interaction.
- **Done when**: `grep "0.2s ease" css/futurethree-scroll.css` returns zero results on the three targeted lines.
