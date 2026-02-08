# Breakpoint

A terminal-first AI-powered testing tool that automatically scans backend codebases, generates edge-case and load tests, executes them, and explains failures.

## Installation

### 1. Install CLI
Install the command-line tool globally via npm:
```bash
npm install -g breakpoint-tester
# The 'breakpoint' command is now available.
```

### 2. Start the Backend (Required)
The CLI requires a running **Breakpoint Server** to store projects and reports. 
Currently, you need to run this from source (or request a hosted instance).

1.  Clone this repository:
    ```bash
    git clone https://github.com/your-username/breakpoint.git
    cd breakpoint
    npm install
    ```
2.  Start the server:
    ```bash
    npm run dev -w @breakpoint/server
    ```
    The server will start on **http://localhost:4000**.

### 3. Start the Dashboard (Optional)
To visualize test reports and manage projects via a web interface:
```bash
npm run dev -w @breakpoint/dashboard
```
Open **http://localhost:3000** in your browser.

## Usage

Once installed and the server is running, you can run the `breakpoint` command from anywhere in your terminal.

### Commands

- **Initialize a new project**:
  Generates `breakpoint.config.json` with default settings.
  ```bash
  breakpoint init
  ```

- **Run Tests**:
  Runs the full pipeline: scanning, generation, and execution.
  ```bash
  breakpoint run
  ```
  Options:
  - `-p, --path <path>`: Path to codebase (default: current directory)

- **View Reports**:
  View past test execution reports.
  ```bash
  breakpoint report
  ```

- **Help**:
  Show all available commands and options.
  ```bash
  breakpoint --help
  ```
