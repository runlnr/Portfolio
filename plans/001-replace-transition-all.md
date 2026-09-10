# 001 — Replace `transition: all` with explicit properties

- **Status**: TODO
- **Commit**: fc0984d
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, 2 line edits

## Problem

`transition: all` causes the browser to animate every CSS property simultaneously, including layout-triggering properties like `width`, `height`, `padding`, `border`, and `margin`. These run on the CPU (not the GPU), cause layout + paint + composite passes on every animation frame, and can drop frames under load — especially on mobile.

**`css/components.css:272` — current:**
```css
/* .view-toggle-btn */
transition: all var(--transition-fast);
```

**`css/components.css:345` — current:**
```css
/* .pill-option */
transition: all var(--transition-fast);
```

Both elements change `background-color`, `color`, and `border-color` on their active/hover states. Nothing else needs to animate.

## Target

Restrict transitions to only the properties that actually change on interaction, keeping them on the GPU-compositable path:

```css
/* css/components.css:272 — target */
transition:
  background-color var(--transition-fast),
  color var(--transition-fast),
  border-color var(--transition-fast);
```

```css
/* css/components.css:345 — target */
transition:
  background-color var(--transition-fast),
  color var(--transition-fast),
  border-color var(--transition-fast);
```

`--transition-fast` is defined in `css/main.css:27`:
```css
--transition-fast: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
```

## Repo conventions to follow

- Easing tokens live in `css/main.css` as `--transition-*`. Always reference the token, never inline values.
- Exemplar of correct explicit transition in the same file (`css/components.css:71–72`):
  ```css
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  ```

## Steps

1. Open `css/components.css`.
2. Find line 272 (inside `.view-toggle-btn`). Replace `transition: all var(--transition-fast);` with:
   ```css
   transition:
     background-color var(--transition-fast),
     color var(--transition-fast),
     border-color var(--transition-fast);
   ```
3. Find line 345 (inside `.pill-option`). Replace `transition: all var(--transition-fast);` with the same three-property transition as step 2.
4. Save the file.

## Boundaries

- Do NOT touch any other property in either ruleset.
- Do NOT touch the `::before` pseudo-element transitions on either component — those are already explicit and correct.
- Do NOT add new dependencies.
- If the line numbers don't match (file has drifted since fc0984d), search for the literal string `transition: all var(--transition-fast)` — there should be exactly 2 occurrences.

## Verification

- **Mechanical**: Open the browser. No build step required for this project.
- **Feel check**:
  1. Navigate to the Works page. Hover over a view toggle button. Confirm it changes background color smoothly with no layout shift or flicker.
  2. Open Chrome DevTools → Rendering panel → check "Paint flashing". Hover the toggle button. The paint flash region should be limited to the button only.
  3. Repeat on the Contact page for a `.pill-option` selector button.
- **Done when**: `transition: all` no longer appears anywhere in `css/components.css` (verify with `grep "transition: all" css/components.css`).
