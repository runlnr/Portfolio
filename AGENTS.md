# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- Standard Operating Procedures (SOPs) written in Markdown, living in `directives/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is you. Your job: intelligent routing and non-destructive maintenance.
- Read directives and `.agents/rules/`, call execution tools in the right order, handle errors, update directives with learnings
- You're the glue between intent and execution.

**Layer 3: Execution (Doing the work)**
- Deterministic Node.js and Python scripts in `execution/`
- Environment variables, API keys, etc. stored in `.env`
- Handle static file serving, endpoint testing, build validation, data extraction
- Reliable, testable, fast. Use deterministic scripts instead of manual work.

## Core Operating Principles & Rules

**1. Zero Regression Policy (Visual Preservation)**
- Under no circumstances should an agent alter, redesign, rename, or restyle any visible UI element, typography tokens (`:root` in `css/typography.css`), animation curves (`cubic-bezier(0.16, 1, 0.3, 1)`), or layout grids unless explicitly instructed to redesign.
- Reference `.agents/rules/visual-preservation.md`.

**2. Design-to-Code Modular Translation**
- Translate visual concepts and staging inputs into modular, semantic components using existing CSS tokens before introducing new styles.
- Maintain full accessibility (semantic HTML5, ARIA states, keyboard navigation).
- Reference `.agents/rules/design-to-code.md`.

**3. Memory & Directive Persistence**
- Store and read design decisions and technical preferences from active MCP memory tools when available.
- Treat `directives/` as living documentation: update them with learnings, API constraints, and timing discoveries.
- Reference `.agents/rules/memory-integration.md`.

**4. Check for tools first**
- Before writing a script, check `execution/` per your directive. Only create new scripts if none exist.

**5. Self-anneal when things break**
- Read error messages and stack traces, fix the root cause, and re-test.

**6. Typography Traceability**
- Every new text block added to the site must use one of the existing Aero type or Mono type classes defined in typography.css. Do not create a text block with standalone/custom properties that duplicate or diverge from those classes. If a text block genuinely needs properties unlike any existing Aero/Mono type, stop and ask before adding it. This rule exists to keep all text styling traceable to a single source of typography classes — don't quietly work around it.

## Directory Structure
- `index.html`, `project.html` - Production HTML pages
- `css/` - Design tokens, typography, component styles, and layout sheets
- `js/` - Frontend application logic, interaction scripts, and animations
- `data/` - Modular JSON datasets (`data/projects.json`)
- `types/` - TypeScript interface declarations (`types/project.d.ts`)
- `assets/` - Optimized images, webfonts, SVGs, and media
- `directives/` - Standard Operating Procedures in Markdown
- `execution/` - Node.js and Python deterministic tools and test suites
- `.agents/` - Custom rules (`.agents/rules/`) and tool configuration (`.agents/mcp_config.json`)
- `.tmp/` - Temporary files and build intermediate scratch data (never committed)

## Build & Test Commands
- `npm test` - Run automated static asset and route endpoint verification suite
- `npm run typecheck` - Run TypeScript static typechecker (`tsc --noEmit`)
- `npm start` / `npm run dev` - Start local development server on port 3000