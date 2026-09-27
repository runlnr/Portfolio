# Design-to-Code Implementation Workflow

## Guidelines for Translating Visual Inputs into Modular Code

1. **Step-by-Step Translation**:
   - When translating staging, mockups, or screenshot inputs, break the design down into modular, scoped components instead of monolithic inline additions.
   - Use existing design tokens and utility classes (`css/components.css`, `css/typography.css`) before introducing new CSS variables.
   - Maintain mobile and tablet responsiveness adhering to existing breakpoints in `css/responsive.css`.

2. **Semantic & Accessible Markup**:
   - Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
   - Include clear `aria-label`, `aria-expanded`, and `aria-hidden` attributes for modal dialogs, drawers, and interactive buttons.
   - Ensure all focusable elements have accessible focus outlines and keyboard navigation support.

3. **Data & Logic Decoupling**:
   - Store content datasets and metadata in modular data structures (`data/projects.json` or `js/projects-data.js`) with TypeScript definitions (`types/project.d.ts`).
   - Keep view logic in deterministic scripts (`js/works.js`, `js/project.js`, `js/contact.js`) cleanly separated from raw data models.
