# Visual Preservation & Zero Regression Policy

## Core Principle
Under no circumstances should an agent alter, redesign, rename, or restyle any visible UI element, typography hierarchy, animation easing, color tokens, layout grids, or interactive behaviors unless the user explicitly requests a visual redesign.

## Strict Rules
1. **Established Design Tokens**:
   - Always preserve `:root` tokens in `css/typography.css`, `css/hero-3d.css`, and other stylesheets.
   - Do not alter font families (`AT Aero`, `PP Supply Mono`, `Neue Haas Real`), font sizes, letter spacing, or line heights without explicit directive.
   - Do not remove or alter local font fallback chains or preloaded asset links.

2. **Motion & Physics Consistency**:
   - Retain established kinetic motion curves (`cubic-bezier(0.16, 1, 0.3, 1)`, exponential ease for Lenis smooth scroll, GSAP ScrollTrigger ticker integration).
   - Ensure reduced-motion media query guards (`@media (prefers-reduced-motion: reduce)`) remain intact for accessibility.

3. **Structural & Routing Integrity**:
   - Maintain all routes and URL query parameters (e.g. `/project.html?id=<slug>`, `/`, `/#f3-portfolio`).
   - Preserve existing DOM element IDs, ARIA labels, and class names referenced by interactive scripts and automated test suites.
