# Breakpoint - Project Brief 🤖🧪

**Breakpoint** is an autonomous, agentic testing tool designed to revolutionize API quality assurance. Instead of writing tests manually, engineers simply point the tool at their API, and the AI agent automatically explores, generates, executes, and analyzes test cases—ranging from happy paths to complex edge cases and security vulnerabilities.

## 🚀 Vision
To empower developers with a "virtual QA engineer" that lives in their terminal, continuously ensuring API reliability and security without the manual overhead.

## 🏗️ Architecture
The project is structured as a modern TypeScript **monorepo** using NPM Workspaces:

### 1. **Packages**
*   **`packages/cli`**: The brain of the operation.
    *   **Generator**: Uses LLMs (OpenAI) to generate creative test scenarios based on OpenAPI specs or live introspection.
    *   **Runner**: Orchestrates test execution using Jest and Supertest.
    *   **Analyzer**: Diagnoses failures using AI, explaining *why* a test failed and suggesting fixes.
*   **`packages/server`**: The central reporting hub.
    *   REST API (Express) for storing test runs, projects, and API keys.
    *   SQLite database for persistence.
    *   Serves as the backend for the Dashboard.
*   **`packages/web-ui`** (Dashboard):
    *   Next.js application for visualizing test results.
    *   Provides insights into API health, history, and failure patterns.

## ✨ Key Features
*   **Autonomous Test Generation**: deeply understands API semantics to create meaningful tests.
*   **Self-Healing & Analysis**: When tests fail, the AI analyzes the stack trace and server response to pinpoint the root cause (e.g., "SQL Injection vulnerability detected" or "Invalid input validation").
*   **Black-Box Testing**: Tests running servers remotely via URL, mimicking real-world usage.
*   **CI/CD Integration**: Seamlessly integrates into GitHub Actions to block breaking changes.

## 🛠️ Tech Stack
*   **Language**: TypeScript (Node.js & React)
*   **Runtime**: Node.js (v18+)
*   **Database**: SQLite (built-in, zero config)
*   **AI Model**: OpenAI GPT-4o / GPT-4-turbo
*   **Test Framework**: Jest + Supertest
*   **Frontend**: Next.js + TailwindCSS + Shadcn/UI
*   **Monorepo**: NPM Workspaces

## 🔮 Roadmap
*   Support for multiple LLM providers (Anthropic, Local Llama).
*   Deep fuzzing capabilities.
*   Interactive "Conversation Mode" for debugging failures with the AI.
