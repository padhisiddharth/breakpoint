#!/usr/bin/env node

import 'dotenv/config';
import path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';

const program = new Command();

console.log(
    chalk.cyan(
        figlet.textSync('Breakpoint', { horizontalLayout: 'full' })
    )
);

program
    .version('1.0.0')
    .description('A terminal-first AI-powered testing tool');

program
    .command('init')
    .description('Initialize Breakpoint in the current directory')
    .action(async () => {
        console.log(chalk.green('Initializing project configuration...'));
        const fs = await import('fs/promises');
        const readline = await import('readline');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (query: string) => new Promise<string>(resolve => rl.question(query, resolve));

        try {
            const apiKey = await question(chalk.cyan('Enter your Breakpoint API Key: '));
            const projectId = await question(chalk.cyan('Enter your Project ID (e.g. checkout-service): '));
            const serverUrl = await question(chalk.cyan('Enter your Server URL (default: http://localhost:3000): '));
            rl.close();

            const config = {
                projectType: 'express',
                testDir: './tests',
                include: ['src/**/*.ts', 'src/**/*.js'],
                exclude: ['node_modules', 'dist'],
                projectId: projectId.trim()
            };

            await fs.writeFile('breakpoint.config.json', JSON.stringify(config, null, 2));
            console.log(chalk.blue('Created breakpoint.config.json'));

            // Create .env file if it doesn't exist
            let envContent = '';
            try {
                envContent = await fs.readFile('.env', 'utf-8');
            } catch (e) {
                // File doesn't exist
            }

            let envUpdates = envContent;

            // API Key
            if (envContent.includes('BREAKPOINT_API_KEY=')) {
                // Replace existing
                envUpdates = envUpdates.replace(/BREAKPOINT_API_KEY=.*/g, `BREAKPOINT_API_KEY=${apiKey.trim()}`);
                console.log(chalk.blue('Updated BREAKPOINT_API_KEY in .env'));
            } else {
                // Append
                envUpdates += `\nBREAKPOINT_API_KEY=${apiKey.trim()}`;
                console.log(chalk.blue('Added BREAKPOINT_API_KEY to .env'));
            }

            // Server URL
            const url = serverUrl.trim() || 'http://localhost:3000';
            if (envContent.includes('BREAKPOINT_SERVER_URL=')) {
                // Replace existing
                envUpdates = envUpdates.replace(/BREAKPOINT_SERVER_URL=.*/g, `BREAKPOINT_SERVER_URL=${url}`);
                console.log(chalk.blue(`Updated BREAKPOINT_SERVER_URL=${url} in .env`));
            } else {
                // Append
                envUpdates += `\nBREAKPOINT_SERVER_URL=${url}`;
                console.log(chalk.blue(`Added BREAKPOINT_SERVER_URL=${url} to .env`));
            }

            // Write updates
            await fs.writeFile('.env', envUpdates);

            if (envUpdates) {
                await fs.appendFile('.env', envUpdates + '\n');
            }

            console.log(chalk.green('\n✅ Initialization complete!'));
            console.log(`Run ${chalk.bold('breakpoint run')} to start testing.`);

        } catch (error) {
            console.error(chalk.red('Failed to initialize:'), error);
            rl.close();
            process.exit(1);
        }
    });

program
    .command('run')
    .description('Run the AI test generation and execution pipeline')
    .option('-p, --path <path>', 'Path to codebase', '.')
    .option('-l, --load', 'Run load tests')
    .option('-t, --target <url>', 'Target URL for load tests', 'http://localhost:3000')
    .option('-d, --deep-check', 'Enable deep response inspection during load tests (Anomaly Detection)')
    .action(async (options) => {
        try {
            const fs = await import('fs/promises');
            let projectId = process.env.BREAKPOINT_PROJECT_ID;

            // Try to read config file
            try {
                const configRaw = await fs.readFile('breakpoint.config.json', 'utf-8');
                const config = JSON.parse(configRaw);
                if (config.projectId) projectId = config.projectId;
            } catch (e) {
                // Config file might not exist, ignore
            }

            const { runTestPipeline } = await import('./lib/orchestrator.js');
            const pipelineOptions: any = {
                path: options.path,
                load: options.load,
                deepCheck: options.deepCheck,
                target: options.target
            };
            if (projectId) pipelineOptions.projectId = projectId;

            await runTestPipeline(pipelineOptions);
        } catch (err: any) {
            // Error is logged in orchestrator
            process.exit(1);
        }
    });

program
    .command('ci')
    .description('Post test results to GitHub PR')
    .action(async () => {
        const fs = await import('fs/promises');
        if (!process.env.GITHUB_TOKEN) {
            console.error(chalk.red('Error: GITHUB_TOKEN is not set.'));
            process.exit(1);
        }

        try {
            // 1. Read Report
            const reportRaw = await fs.readFile('aitest-report.json', 'utf-8');
            const report = JSON.parse(reportRaw);

            // 2. Get PR Number
            let prNumber = process.env.PR_NUMBER;
            if (!prNumber && process.env.GITHUB_EVENT_PATH) {
                const event = JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH, 'utf-8'));
                prNumber = event.pull_request?.number;
            }

            if (!prNumber) {
                console.error(chalk.red('Error: Could not determine PR number. Set PR_NUMBER or run in GitHub Actions.'));
                process.exit(1);
            }

            // 3. Format Comment
            let body = `## 🤖 Breakpoint Report\n\n`;
            if (report.stats.success) {
                body += `✅ **All Tests Passed!**\n\n`;
            } else {
                body += `⚠️ **${report.failures.length} Issues Detected**\n\n`;

                report.failures.forEach((issue: any, idx: number) => {
                    const icon = issue.severity === 'Critical' ? '🛑' : (issue.severity === 'High' ? '🔴' : 'Vk');
                    body += `### ${icon} [${issue.severity}] ${issue.summary}\n`;
                    body += `**Root Cause:** ${issue.rootCause}\n\n`;
                    body += `**Recommendation:** \`${issue.recommendation}\`\n\n`;
                    body += `---\n`;
                });
            }
            body += `\n*Generated by Breakpoint at ${new Date().toISOString()}*`;

            // 4. Post Comment
            const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
            if (!owner || !repo) {
                console.error(chalk.red('Error: GITHUB_REPOSITORY not set.'));
                process.exit(1);
            }

            const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'breakpoint'
                },
                body: JSON.stringify({ body })
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(`GitHub API Error: ${res.status} ${err}`);
            }

            console.log(chalk.green(`✅ Comment posted to PR #${prNumber}`));

        } catch (err: any) {
            console.error(chalk.red('CI Error:'), err.message);
            process.exit(1);
        }
    });

program
    .command('mcp')
    .description('Start the MCP server')
    .action(async () => {
        await import('./mcp/server.js');
    });

program
    .command('server')
    .description('Start the standalone Report Server')
    .action(async () => {
        // In monorepo, we encourage running the server via its own package or docker container
        console.log(chalk.yellow('To start the server, please run: npm run start -w @ai-test-engineer/server'));
        // Or if we want to support it, we need to import from the built package
        // const { startServer } = await import('@ai-test-engineer/server');
        // startServer();
        // startServer();
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
