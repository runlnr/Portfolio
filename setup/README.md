# Antigravity Starter Template Kit

This directory contains the foundational files, rules, directives, and curated skills for initializing a new **Google Antigravity** project.

## Directory Structure

```text
├── AGENTS.md                 # Primary system prompt & 3-layer architecture instructions
├── CLAUDE.md                 # Symlink/mirror for Claude-compatible workflows
├── GEMINI.md                 # Symlink/mirror for Gemini-compatible workflows
├── .agents/
│   ├── mcp_config.json       # MCP server configuration
│   ├── rules/                # Operational rules & constraints
│   │   ├── design-to-code.md
│   │   ├── memory-integration.md
│   │   └── visual-preservation.md
│   └── skills/               # 23 Curated Frontend & Design skills
│       ├── animate
│       ├── animation-vocabulary
│       ├── apple-design
│       ├── brandkit
│       ├── design-taste-frontend
│       ├── emil-design-eng
│       ├── find-animation-opportunities
│       ├── frontend-design
│       ├── full-output-enforcement
│       ├── gpt-taste
│       ├── high-end-visual-design
│       ├── image-to-code
│       ├── imagegen-frontend-mobile
│       ├── imagegen-frontend-web
│       ├── improve-animations
│       ├── industrial-brutalist-ui
│       ├── minimalist-ui
│       ├── pick-ui-library
│       ├── prototype
│       ├── redesign-existing-projects
│       ├── review-animations
│       ├── stitch-design-taste
│       └── web-design-guidelines
└── directives/               # SOP templates & standard operating procedures
    ├── site_architecture.md  # Example: architecture & token reference
    └── run_dev_server.md     # Example: deterministic tool runner directive
```

## How to Initialize a New Project

1. Copy the contents of this `setup/` folder into your new project's root workspace.
2. In `AGENTS.md` (and mirrors), update the **Directory Structure**, **Build & Test Commands**, and **Deployment & Domain** to match your new project.
3. Customize `.agents/rules/` and `directives/` according to your application requirements.
