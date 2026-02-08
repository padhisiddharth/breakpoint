# Breakpoint Tester (CLI)

**Breakpoint** is an autonomous, agentic testing tool that automatically explores your API, generates test cases (happy paths, edge cases, security probes), and explains failures using AI.

This package (`breakpoint-tester`) contains the command-line interface.

## 📦 Installation

```bash
npm install -g breakpoint-tester
# The 'breakpoint' command is now available.
```

## 📋 Prerequisites
The CLI requires a running **Breakpoint Server** to store projects and reports.
To run the server locally:

1.  Clone the main repository: [github.com/padhisiddharth/breakpoint](https://github.com/padhisiddharth/breakpoint)
2.  Start the server:
    ```bash
    cd breakpoint
    npm install
    npm run dev -w @breakpoint/server
    ```
    (Server starts on `http://localhost:4000`)

## 🚀 Usage

### 1. Initialize
Run this in your project root to create a configuration file (`breakpoint.config.json`):

```bash
breakpoint init
```
This will also help you set your `BREAKPOINT_API_KEY` and `BREAKPOINT_SERVER_URL` in your `.env`.

### 2. Run Tests
Launch the autonomous testing agent:

```bash
breakpoint run
```
Options:
*   `-p, --path`: Path to codebase (default: `.`)
*   `-l, --load`: Run load tests
*   `-t, --target`: Target URL for load tests

### 3. View Reports
View historical test runs:

```bash
breakpoint report
```

## 📚 Documentation
For full documentation, architecture details, and contribution guide, visit the [Main Repository](https://github.com/padhisiddharth/breakpoint).

## 📄 License
**Polyform Noncommercial License 1.0.0**
Free for personal and non-commercial use. Commercial use requires a license.
See `LICENSE` file for details.
