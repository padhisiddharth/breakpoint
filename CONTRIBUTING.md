# Contributing to Breakpoint

Thank you for your interest in contributing to Breakpoint! We're building the first AI Test Engineer that runs directly in your terminal. Since we are in active development, your feedback and contributions are highly valued.

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**

## Project Structure

Breakpoint is a monorepo managed with npm workspaces:

- `packages/cli`: The command-line interface (`breakpoint`) that users install. Built with TypeScript and Commander.
- `packages/server`: The backend server (Express + SQLite) that manages projects, runs, and AI analysis.
- `packages/web-ui`: The dashboard frontend (Next.js) for visualizing test reports.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/padhisiddharth/breakpoint.git
    cd breakpoint
    ```

2.  **Install dependencies**:
    Install dependencies for all workspaces from the root:
    ```bash
    npm install
    ```

3.  **Build the project**:
    Compile TypeScript for all packages:
    ```bash
    npm run build
    ```

## Development Workflow

To work on Breakpoint, you typically need the **Server** running, and optionally the **Dashboard** or **CLI**.

### 1. Running the Server (Required)
The server handles API requests and database operations.
```bash
npm run dev -w packages/server
# Runs on http://localhost:4000
```

### 2. Running the Dashboard (Optional)
The web UI for viewing reports.
```bash
npm run dev -w packages/web-ui
# Runs on http://localhost:3000
```

### 3. Developing the CLI
To test CLI changes locally without publishing:
1.  Build the CLI:
    ```bash
    npm run build -w packages/cli
    ```
2.  Link it globally:
    ```bash
    npm link -w packages/cli
    ```
3.  Now `breakpoint` command will use your local version.

## Pull Request Guidelines

1.  Fork the repository and create a new branch for your feature or fix.
2.  Ensure your code builds successfully: `npm run build`.
3.  Write clear commit messages.
4.  Submit a Pull Request to the `main` branch.

## Getting Help

If you have questions, please open an issue on GitHub.
