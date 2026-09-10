# Master Typography Manifest & Quick Reference Guide

> **Directive Reference**: Keep this file updated whenever adding new text components, adjusting tracking, or switching typefaces. This eliminates guesswork and allows any font or spacing modification to happen in seconds.

---

## 1. The 3 Master Font Tokens ([`css/typography.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/typography.css#L247-L250))

Every main sans-serif text element on the entire website routes through these three CSS variables declared in `:root`:

| Token | Current Value | Used By |
| :--- | :--- | :--- |
| **`--font-sans`** | `'AT Aero', 'At Aero', 'AtAero', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif` | Global `body`, Manifesto statements, Section headlines, Card titles, About link, Outro, Footer text |
| **`--font-nav`** | `'AT Aero', 'At Aero', 'AtAero', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif` | Top navigation links, Header row text, Project switcher tabs, Works headers |
| **`--font-display`** | `'AT Aero', 'At Aero', 'AtAero', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif` | Dropdown links, Logo brand mark, Floating CTA button, Social badges |

> [!TIP]
> **Switching the Entire Site's Font**:
> Updating these three lines in [`css/typography.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/typography.css#L247-L250) instantly updates all main font text across the whole site.
>
> In addition, [`css/typography.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/typography.css#L148-L210) defines backward-compatibility `@font-face` aliases for `"Neue Haas Grotesk Display Pro"` and `"Neue Haas Grotesk Display"` mapping them to the current font (`AT Aero`), ensuring older or hardcoded rules always inherit the correct font.

---

## 1.1 Standardized Typography Presets & Utility Tokens

Quick-reference typography tokens and CSS utility classes defined in [`css/typography.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/typography.css) and [`TYPOGRAPHY.txt`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/TYPOGRAPHY.txt):

| Preset | Font Family | Weight | Font Size | Line Height | Letter Spacing | CSS Tokens / Utility Class |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **At Aero Type A** | `AT Aero Retina` (`var(--font-retina)`) | `450` | `43px` | `49px` | `-2px` | `var(--type-aero-a-*)` / `.type-aero-a` |
| **At Aero Type B** | `AT Aero Regular` (`var(--font-primary)`) | `400` | `25px` | `27.5px` | `-1.5px` | `var(--type-aero-b-*)` / `.type-aero-b` |
| **At Aero Type C** | `AT Aero Regular` (`var(--font-primary)`) | `400` | `20px` | `27.5px` | `-1.5px` | `var(--type-aero-c-*)` / `.type-aero-c` |
| **At Aero Type D** | `AT Aero SemiBold` (`var(--font-primary)`) | `600` | `200px` | `230px` | `-10px` | `var(--type-aero-d-*)` / `.type-aero-d` |
| **Sometype Mono Type A** | `Sometype Mono` (`var(--font-mono)`) | `400` | `11px` | `13px` | `-0.2px` | `var(--type-mono-a-*)` / `.type-mono-a` |

---

## 2. Complete Inventory of All Main Font Elements

### A. Hero Viewport & Top Navigation
Files: [`index.html`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/index.html) & [`css/hero-3d.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css)

| Element / Selector | Exact File & Line | Font Family | Size Token | Weight Token | Tracking (Letter-Spacing) Token |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Bottom Left Text** (`"Nothing here/"`) | [`hero-3d.css:L1417-1435`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L1417-L1435) | `"AT Aero", var(--font-sans)` | `--hero-bottom-text-size: 48px` | `--hero-bottom-text-weight: 400` | `--hero-bottom-text-spacing: calc(-0.02em - 0.7px)` |
| **Hero Bottom Right Text** (`"/by accident."`) | [`hero-3d.css:L1417-1440`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L1417-L1440) | `"AT Aero", var(--font-sans)` | `--hero-bottom-text-size: 48px` | `--hero-bottom-text-weight: 400` | `--hero-bottom-text-spacing: calc(-0.02em - 0.7px)` |
| **Hero Headline (Legacy/Mobile)** | [`hero-3d.css:L1475-1485`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L1475-L1485) | `var(--font-sans)` | `--headline-font-size: 48px` | `--headline-font-weight: 500` | `--headline-letter-spacing: calc(-0.03em - 0.7px)` |
| **Hero Tagline** | [`hero-3d.css:L1501-1510`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L1501-L1510) | `var(--font-sans)` | `--tagline-font-size: 19.5px` | `--tagline-font-weight: 400` | `--tagline-letter-spacing: calc(-0.015em - 0.7px)` |
| **Nam Pham Logo Mark** (`.nav-box-brand`) | [`hero-3d.css:L1000-1052`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L1000-L1052) | `var(--font-display, var(--font-sans))` | `--nav-box-brand-size: 25px` / `17px` | `--nav-box-brand-weight: 700` | `--nav-box-brand-letter-spacing: -0.7px` |
| **Nav Modular Box Links** | [`hero-3d.css:L135-137`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L135-L137) | `var(--font-nav)` | `--nav-box-link-size: 14.5px` | `--nav-box-link-weight: 400` | `--nav-box-link-letter-spacing: calc(-0.01em - 0.7px)` |
| **Nav Dropdown Links** (*Home, Projects, About...*) | [`hero-3d.css:L584-602`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L584-L602) | `var(--font-display)` | `--nav-dropdown-item-font-size: 16.5px` | `--nav-dropdown-item-font-weight: 400` | `calc(-0.02em - 0.7px)` |
| **Dropdown Ongoing Line** (*"Ongoing projects"*) | [`hero-3d.css:L765-779`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L765-L779) | `var(--font-sans)` | `--nav-dropdown-info-font-size: 14px` | `400` | `calc(-0.01em - 0.7px)` |
| **Dropdown Contact Lines** (*Email & Phone*) | [`hero-3d.css:L798-810`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L798-L810) | `var(--font-sans)` | `--nav-dropdown-info-font-size: 14px` | `400` | `calc(-0.01em - 0.7px)` |
| **Dropdown Social Badge** (*"Bē"*) | [`hero-3d.css:L855-862`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L855-L862) | `var(--font-display)` | `13px` | `700` | `calc(-0.02em - 0.7px)` |
| **Floating Call CTA Text** (*"Start a project"*) | [`hero-3d.css:L955-971`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L955-L971) | `var(--font-display)` | `13.5px` | `400` | `calc(-0.01em - 0.7px)` |
| **Corner Slash Marks** (`/` and `\`) | [`hero-3d.css:L1274-1284`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/hero-3d.css#L1274-L1284) | `'AT Aero', var(--font-sans)` | `--corner-slashes-size: 20px` | `--corner-slashes-weight: 900` | — |

---

### B. Editorial Section & Works Grid
File: [`css/futurethree-scroll.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css)

| Element / Selector | Exact Line | Font Family | Size Token | Weight Token | Tracking (Letter-Spacing) Token |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Editorial Wrapper** (`.f3-editorial-wrapper`) | [`L140-148`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L140-L148) | `var(--font-sans)` | inherited | inherited | inherited |
| **Manifesto Statement** | [`L211-222`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L211-L222) | `var(--font-retina, 'AT Aero Retina')` | `--manifesto-font-size: 43px` | `--manifesto-font-weight: 400` | `--manifesto-letter-spacing: -1.8px` |
| **Manifesto "About ↗" Link** | [`L281-296`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L281-L296) | `var(--font-retina, 'AT Aero Retina')` | `16px` | `var(--manifesto-font-weight: 400)` | `calc(var(--manifesto-letter-spacing, -1.8px) * 16 / 43 - 0.7px)` |
| **Featured Works Tag** (`"Featured works"`) | [`L368-375`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L368-L375) | `var(--font-sans)` | `--featured-tag-font-size: 25px` | `--featured-tag-font-weight: 400` | `-1.5px` |
| **"View more" Link** | [`L421-432`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L421-L432) | `var(--font-sans)` | `14px` | `400` | `-0.8px` |
| **Work Card Titles (Grid View)** | [`L747-756`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L747-L756) | `var(--font-sans)` | `--work-card-title-size: 20px` | `400` | `-1.2px` |
| **Work Card Year (Grid View)** | [`L865-873`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L865-L873) | `var(--font-sans)` | `--work-card-title-size: 20px` | `400` | `-1.2px` |
| **List Row Title (List View)** | [`L493-501`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L493-L501) | `var(--font-sans)` | `20px` | `400` | `-1.1px` |
| **List Row Meta (Field, Client, Year)** | [`L503-511`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L503-L511) | `var(--font-sans)` | `13.5px` | `500` | `-0.8px` |
| **Flagship Card 01 Title** | [`L1003-1007`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1003-L1007) | `var(--font-sans)` | `--card-01-title-size: 50px` | `--card-01-title-weight: 500` | `--card-01-letter-spacing: -2.2px` |
| **Flagship Card 02 Title** | [`L1025-1029`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1025-L1029) | `var(--font-sans)` | `--card-02-title-size: 49px` | `--card-02-title-weight: 500` | `--card-02-letter-spacing: -2.3px` |
| **Flagship Card 03 Title** | [`L1072-1076`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1072-L1076) | `var(--font-sans)` | `--card-03-title-size: 49px` | `--card-03-title-weight: 500` | `--card-03-letter-spacing: -2.2px` |
| **Card Number & Bottom Title** | [`L1086-1105`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1086-L1105) | `var(--font-sans)` | `18px` / `clamp(24px, 2.8vw, 38px)` | `500` | `-1.9px` |
| **Contact Address & Values** | [`L1125-1163`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1125-L1163) | `var(--font-sans)` | `--contact-font-size: 17.5px` | `500` / `400` | `--contact-letter-spacing: -1.3px` |
| **Portfolio Bar Title** (`"THE BEST OF N/P"`) | [`L1187-1196`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1187-L1196) | `var(--font-sans)` | `--best-title-size: 33px` | `--best-title-weight: 500` | `--best-title-letter-spacing: -2.5px` |
| **Portfolio View All Link** | [`L1205-1215`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1205-L1215) | `var(--font-sans)` | `13.5px` | `500` | `-1.9px` |
| **Services Main Heading & Titles** | [`L1258-1320`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1258-L1320) | `var(--font-sans)` | `clamp(52px, 7.5vw, 110px)` | `500` | `-1.9px` |
| **Giant Billboard Text** | [`L1394-1405`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1394-L1405) | `var(--font-sans)` | `clamp(64px, 14vw, 210px)` | `500` | `-1.9px` |
| **Outro Headline & Contacts** | [`L1514-1600`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/futurethree-scroll.css#L1514-L1600) | `var(--font-sans)` | `clamp(32px, 3.8vw, 54px)` | `500` | `-1.9px` |

---

### C. Standalone Subpages (Works, About, Contact)
File: [`css/pages.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css)

| Element / Selector | Exact Line | Font Family | Size Token | Tracking (Letter-Spacing) Token |
| :--- | :--- | :--- | :--- | :--- |
| **Works Main Title** (`"Work"`) | [`L335-344`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L335-L344) | `var(--font-sans)` | `--works-title-font-size: 170px` | `--works-title-letter-spacing: calc(-0.04em - 0.7px)` |
| **Works Counter** (`"(15)"`) | [`L346-352`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L346-L352) | `var(--font-nav)` | `--works-counter-size: 15px` | `-1.9px` |
| **View Toggle Button** | [`L365-380`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L365-L380) | `var(--font-nav)` | `12px` | `-1.9px` |
| **Work Card Title (Standalone Page)** | [`L426-434`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L426-L434) | `var(--font-nav)` | `13px` | `-1.9px` |
| **Works List Header Row** | [`L530-542`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L530-L542) | `var(--font-nav)` | `11.5px` | `-1.9px` |
| **Work List Row Item** | [`L549-565`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L549-L565) | `var(--font-nav)` | `13px` | `calc(-0.02em - 0.7px)` |
| **About Hero Statement** | [`L688-693`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L688-L693) | inherited (`body`) | `clamp(2.2rem, 5vw, 4.5rem)` | `calc(-0.04em - 0.7px)` |
| **Case Study Narrative Body** | [`L906-911`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L906-L911) | inherited (`body`) | `clamp(1.25rem, 2.5vw, 2rem)` | `calc(-0.03em - 0.7px)` |
| **Next Project Title** | [`L984-990`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/pages.css#L984-L990) | inherited (`body`) | `clamp(2rem, 6vw, 5rem)` | `-1.9px` |

---

### D. Shared Component Overrides
File: [`css/components.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/components.css)

| Element / Selector | Exact Line | Font Family | Tracking (Letter-Spacing) |
| :--- | :--- | :--- | :--- |
| **Nav Brand Logo Text** (`.nav-brand`) | [`L33-40`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/components.css#L33-L40) | inherited (`body`) | `-1.9px` |
| **Mobile Menu Links** (`.mobile-links a`) | [`L154-160`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/components.css#L154-L160) | inherited (`body`) | `calc(-0.03em - 0.7px)` |

---

## 3. Which Fonts Are Intentionally NOT Main Font?
Keep these unchanged when adjusting the main sans font:
1. **Monospace / System Tags** (`var(--font-mono)`): Uses `'Sometype Mono', 'Share Tech Mono', Menlo, monospace`.
   - Used for: Live studio clock, status line (`Looking sharp today`), coordinate badges (`[01]`), corner time, credit tables, legal footer bar.
2. **Serif Italic Highlights** (`var(--font-serif-italic)` / `var(--font-serif)`): Uses `'Playfair Display', Georgia, serif`.
   - Used for: Editorial accent words, services subheadings, and italic tags.

---

## 4. 30-Second Font Swapping / Tracking Playbook

### Scenario 1: You want to switch to a new font family (e.g. `CustomFont`)
1. Add your `@font-face` definitions to [`css/typography.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/typography.css#L1-L240).
2. Update lines 247-249 in [`css/typography.css`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/typography.css#L247-L249):
   ```css
   --font-display: 'CustomFont', -apple-system, BlinkMacSystemFont, sans-serif;
   --font-nav: 'CustomFont', -apple-system, BlinkMacSystemFont, sans-serif;
   --font-sans: 'CustomFont', -apple-system, BlinkMacSystemFont, sans-serif;
   ```
3. Done! 100% of headings, bodies, cards, statements, and dropdowns update automatically.

### Scenario 2: You want to globally adjust letter spacing (tracking)
- **All running body text**: Modify [`css/typography.css:L283`](file:///c:/Users/haina/OneDrive/Documents/AI/4LOW/css/typography.css#L283) (`body { letter-spacing: ... }`).
- **Hero corner text**: Modify `index.html:L156` (`--hero-bottom-text-spacing`).
- **Manifesto statement & About link**: Modify `index.html:L42` / `css/futurethree-scroll.css:L23` (`--manifesto-letter-spacing`). The "About ↗" link automatically scales proportionally to match the manifesto.
- **Top nav bar**: Modify `css/hero-3d.css:L12` (`--nav-letter-spacing`).
