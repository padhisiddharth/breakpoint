# GitHub Actions Integration

Breakpoint integrates directly into your CI/CD pipeline to block bad code from reaching production. This guide will help you set up the GitHub Action workflow.

## Prerequisites

1.  **API Key**: Obtained from `breakpoint init` or your local `.env`.
2.  **OpenAI API Key**: Required for test generation and failure analysis.
3.  **GitHub Secrets**: Add these to your repository settings (**Settings** > **Secrets and variables** > **Actions** > **New repository secret**):
    *   `BREAKPOINT_API_KEY`: Your Breakpoint API Key.
    *   `OPENAI_API_KEY`: Your OpenAI API Key.

## Workflow Configuration

Create a new file in your repository at `.github/workflows/breakpoint.yml`.

### Basic Configuration
This workflow runs on every Pull Request to `main`. It runs the tests and then posts a comment with the results.

```yaml
name: Breakpoint AI Test

on:
  pull_request:
    branches: [ "main" ]

permissions:
  contents: read
  pull-requests: write # Required to post comments

jobs:
  test:
    name: AI Security & Load Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci
        # If using yarn: yarn install --frozen-lockfile

      # Step 1: Run Scanner, Generator, and Test Runner
      - name: Run Breakpoint Tests
        env:
          BREAKPOINT_API_KEY: ${{ secrets.BREAKPOINT_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          # Optional: Point to a self-hosted server for dashboard reporting
          # BREAKPOINT_SERVER_URL: https://your-breakpoint-instance.com
        run: |
          npx breakpoint-tester run

      # Step 2: Post Results to PR Comment
      # This runs even if tests fail, so you see the failure analysis
      - name: Post PR Comment
        if: always()
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          npx breakpoint-tester ci
```

## Configuration Details

### Project ID & Server URL
- **Project ID**: Automatically read from `breakpoint.config.json` in your repository root. This ensures tests are tracked under the correct project.
- **Server URL**:
  - By default, the CLI attempts to upload reports to `http://localhost:4000`.
  - In CI/CD, this upload will fail gracefully if you don't have a deployed server, but **local test execution and PR comments will still work**.
  - If you have a deployed Breakpoint Server, add `BREAKPOINT_SERVER_URL` to your repository secrets or env vars to enable centralized dashboard reporting.

### Customizing Execution
You can add flags to the `run` command in the YAML:

- `npx breakpoint-tester run --load`: Enable load testing.
- `npx breakpoint-tester run --path ./backend`: Specify a subfolder.
