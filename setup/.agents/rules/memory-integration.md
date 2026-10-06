# Memory Integration & Context Continuity

## Guidelines for MCP Memory & Preference Tracking

1. **Context Persistence**:
   - Store and retrieve design decisions, layout preferences, and technical conventions across sessions using active MCP memory tools when available.
   - Cross-check documented decisions before initiating refactoring passes or making architectural adjustments.

2. **Living Directives & Tool Updates**:
   - As new execution scripts or directives are developed in `execution/` and `directives/`, document API limits, timing constants, or edge cases in the corresponding SOP markdown file.
   - Treat `directives/` as persistent knowledge artifacts that are enriched over time.
