# Directive: Run Dev Server & Testing

## Goal
Start the local HTTP development server and test all endpoints for 100% health (200 OK).

## Execution Tools
- `execution/serve.js`: High-performance static HTTP server with MIME type resolution and clean URL routing (`/works` -> `works.html`).
- `execution/test_endpoints.js`: Automated test runner hitting all 16 HTML and static asset endpoints.

## Operational Steps
1. **Start Server**:
   ```bash
   node execution/serve.js
   ```
   *Serves locally at `http://localhost:3000/`.*

2. **Verify All Endpoints**:
   ```bash
   node execution/test_endpoints.js
   ```

3. **Self-Annealing / Error Handling**:
   - If port 3000 is occupied, `serve.js` will attempt the next available port and log the active URL.
   - If any endpoint returns non-200, check the file path in `execution/serve.js` routing table.
