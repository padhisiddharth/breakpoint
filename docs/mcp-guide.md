
# AI Test Engineer: MCP Integration Guide

The **AI Test Engineer** now exposes a Model Context Protocol (MCP) server, allowing AI editors like **Cursor**, **Windsurf**, or **Claude Desktop** to directly invoke testing capabilities.

## Capabilities

1.  **Run Tests (`run_ai_tests`)**:
    -   Scans the codebase.
    -   Generates new tests for risky endpoints.
    -   Runs tests (Jest).
    -   Analyzes failures (LLM).
    -   Optionally runs Load Tests with Anomaly Detection.

2.  **Read Report (`test://last-report`)**:
    -   Access the full JSON report of the last run.

## Setup for Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ai-test-engineer": {
      "command": "node",
      "args": [
        "/absolute/path/to/ai-test-engineer/dist/index.js",
        "mcp"
      ],
      "env": {
        "OPENAI_API_KEY": "sk-...",
        "RUN_LOAD": "true" 
      }
    }
  }
}
```

## Setup for Cursor / Windsurf

Configure the MCP server via the editor settings, pointing to the same command:
`node /path/to/ai-test-engineer/dist/index.js mcp`

## Usage Example

**User:** "Run full regression tests on the user API, including load tests."

**AI Agent:**
1.  Calls `run_ai_tests({ path: ".", load: true, deepCheck: true })`.
2.  Waits for pipeline to complete.
3.  Reads `test://last-report` to summarize failures.
