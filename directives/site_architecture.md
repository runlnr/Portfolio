# Directive: Site Architecture & Design System

## Goal
Maintain visual excellence and structural consistency across the Nam Pham portfolio website.
- **Official Production Domain:** `https://scherre.com` (deployed on Cloudflare Pages)

## Core File Organization
- **Pages**:
  - `index.html`: Hero home page with Rose ASCII TV visual, and integrated editorial portfolio section (`#f3-portfolio`).
  - `about.html`: Studio manifesto, team disciplines, and biographical narrative.
  - `archive.html`: Curated archive of visual explorations, graphic specimens, telemetry studies, and lightbox viewer.
  - `project.html`: Dynamic case study showcase loading project data via `?id=<slug>`.
  - `privacy.html`: Privacy and legal notice.
  - *Note*: Standalone `/works` route redirects directly to `index.html#f3-portfolio`.

- **Styling (`css/`)**:
  - `css/typography.css`: Root design tokens (`:root`), font faces (`Inter Display`), and typography settings.
  - `css/hero-3d.css`: Header navigation grid layout, difference blend mode, and viewport styles.
  - `css/scherre-scroll.css`: Editorial home sections (intro, portfolio grid/list, services, billboard, outro, contact modal).
  - `css/components.css`: Buttons, pill selectors, footers, forms, and cards.
  - `css/pages.css`: Specific layouts for About, Works, Contact, and Project pages.
  - `css/archive.css`: Media grid, filter pill controls, card frames, and high-performance lightbox modal.
  - `css/responsive.css`: Breakpoints for desktop, tablet, and mobile.

- **Data & Logic (`js/`)**:
  - `js/projects-data.js`: Master dataset of selected client projects.
  - `data/archive.json` & `js/archive-data.js`: Master dataset of archive specimens and visual explorations.
  - `js/app.js`: Global initialization, real-time live clock (UTC+7).
  - `js/archive.js`: Category filter pills, media grid rendering, and interactive lightbox controller.
  - `js/works.js`: Grid/List view switcher, dynamic card rendering, hover previews.
  - `js/contact.js`: Pill toggle logic and form submission handler (POSTs JSON to `/api/contact`; includes a hidden `website` honeypot field).
  - `js/motion-stack.js` & `js/scherre-scroll.js`: GSAP/Lenis scroll reveals and editorial home animations (all guarded by `prefers-reduced-motion`).
  - `functions/api/contact.js`: Cloudflare Pages Function that validates input (honeypot, field length caps, same-origin check) and sends mail via Resend. Requires env `RESEND_API_KEY`; optional `CONTACT_RECEIVER_EMAIL`, `CONTACT_FROM_EMAIL`. Falls back to `onboarding@resend.dev` if the sender domain is unverified.
  - `js/project.js`: URL parameter parser and case study renderer.

## Typography Tokens Standard (`css/typography.css`)
```css
:root {
  --nav-font-size: 13px;
  --nav-line-height: 13.5px;
  --nav-letter-spacing: -0.3px;
  --nav-font-weight: 600;
  --nav-padding-y: 10px;
  --nav-padding-x: 12px;
  --nav-center-max-width: 900px;
  --nav-center-gap: 110px;
  --nav-stack-gap: 0px;
  --nav-center-align: left;
}
```
