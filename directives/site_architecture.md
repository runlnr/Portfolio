# Directive: Site Architecture & Design System

## Goal
Maintain visual excellence and structural consistency across the #SWAG portfolio website.

## Core File Organization
- **Pages**:
  - `index.html`: Hero home page with Rose ASCII TV visual, and integrated editorial portfolio section (`#f3-portfolio`).
  - `about.html`: Studio manifesto, team disciplines, and 14-client selected work table.
  - `contact.html`: Interactive inquiry form with discipline and budget selectors.
  - `project.html`: Dynamic case study showcase loading project data via `?id=<slug>`.
  - `policies.html`: Privacy and cookies legal notice.
  - *Note*: Standalone `/works` route redirects directly to `index.html#f3-portfolio`.

- **Styling (`css/`)**:
  - `css/typography.css`: Root design tokens (`:root`), font faces (`Inter Display`), and typography settings.
  - `css/hero-3d.css`: Header navigation grid layout, difference blend mode, and viewport styles.
  - `css/components.css`: Buttons, pill selectors, footers, forms, and cards.
  - `css/pages.css`: Specific layouts for About, Works, Contact, and Project pages.
  - `css/responsive.css`: Breakpoints for desktop, tablet, and mobile.

- **Data & Logic (`js/`)**:
  - `js/projects-data.js`: Master dataset of all 15 projects (metadata, images, credits).
  - `js/app.js`: Global initialization, real-time live clock (GMT+2).
  - `js/works.js`: Grid/List view switcher, dynamic card rendering, hover previews.
  - `js/contact.js`: Pill toggle logic and form submission handler.
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
