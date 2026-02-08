
import chalk from 'chalk';
import path from 'path';

export interface PipelineOptions {
    path: string;
    load: boolean;
    deepCheck: boolean;
    target: string;
    projectId?: string;
}

export interface PipelineResult {
    success: boolean;
    reportPath: string;
    summary: string;
}

export async function runTestPipeline(options: PipelineOptions): Promise<PipelineResult> {
    console.log(chalk.yellow(`Scanning codebase at: ${options.path}`));

    // Dynamically import to avoid circular dep issues if any, and keep startup fast
    const { CodebaseScanner } = await import('../scanner/index.js');
    const { CodebaseAnalyzer } = await import('../analyzer/index.js');
    const { TestGenerator } = await import('../generator/index.js');
    const { TestRunner } = await import('../runner/index.js');
    const { LoadGenerator } = await import('../load_generator/index.js');
    const fs = await import('fs/promises');

    try {
        // 1. Scan
        const scanner = new CodebaseScanner(options.path);
        const endpoints = scanner.scan();
        console.log(chalk.green(`Found ${endpoints.length} endpoints:`));

        // 2. Analyze
        const analyzer = new CodebaseAnalyzer();
        const rankedEndpoints = analyzer.analyze(endpoints);

        rankedEndpoints.forEach(ep => {
            let color = chalk.white;
            if (ep.riskLevel === 'Critical') color = chalk.red.bold;
            else if (ep.riskLevel === 'High') color = chalk.red;
            else if (ep.riskLevel === 'Medium') color = chalk.yellow;

            console.log(`  ${color(`[${ep.riskLevel}]`)} ${chalk.bold(ep.method)} ${ep.path}  (Score: ${ep.riskScore})`);
        });

        // 3. Generate
        const generator = new TestGenerator(process.env.OPENAI_API_KEY);
        const runner = new TestRunner();

        console.log(chalk.blue(`\nGenerating tests for ${rankedEndpoints.length} endpoints...`));

        for (const ep of rankedEndpoints) {
            console.log(chalk.dim(`\nAnalyzing ${ep.method} ${ep.path}...`));
            const tests = await generator.generateTests(ep);
            tests.forEach(t => {
                console.log(`  ${chalk.cyan('➜')} ${chalk.bold(t.name)}: ${t.description}`);
            });
            await runner.writeTests(ep, tests);
        }

        // 4. Run
        const results = await runner.runTests();
        let analysis: any[] = [];

        if (!results.success) {
            console.log(chalk.red(`\n⚠️  Tests Failed! Starting AI Failure Analysis...`));
            const { FailureAnalyzer } = await import('../analyzer/failure_analyzer.js');
            const failureAnalyzer = new FailureAnalyzer(process.env.OPENAI_API_KEY);
            analysis = await failureAnalyzer.analyze(results.output);

            console.log(chalk.bold.underline(`\n🔍 AI Failure Report:`));
            analysis.forEach((issue, idx) => {
                let sevColor = chalk.white;
                if (issue.severity === 'Critical') sevColor = chalk.bgRed.white.bold;
                else if (issue.severity === 'High') sevColor = chalk.red.bold;
                else if (issue.severity === 'Medium') sevColor = chalk.yellow;

                console.log(`\n${chalk.dim(`#${idx + 1}`)} ${sevColor(` [${issue.severity.toUpperCase()}] `)} ${chalk.bold(issue.summary)}`);
            });
        } else {
            console.log(chalk.green(`\n✅ All tests passed!`));
        }

        // 5. Save Report
        const report = {
            timestamp: new Date().toISOString(),
            projectId: options.projectId, // Attached from config/options
            stats: {
                success: results.success,
                total: rankedEndpoints.length
            },
            failures: analysis,
            rawOutput: results.output
        };
        const reportPath = path.resolve('aitest-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        // 6. Upload Report
        if (process.env.BREAKPOINT_API_KEY && options.projectId) {
            console.log(chalk.blue(`\n📤 Uploading report to server for project: ${options.projectId}...`));
            try {
                // Determine server URL (default to localhost for now, or env var)
                const serverUrl = process.env.BREAKPOINT_SERVER_URL || 'http://localhost:4000';

                // Use global fetch (Node 18+)
                const res = await fetch(`${serverUrl}/api/reports`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.BREAKPOINT_API_KEY}`,
                        'X-Project-Id': options.projectId
                    },
                    body: JSON.stringify(report)
                });

                if (res.ok) {
                    const data: any = await res.json();
                    console.log(chalk.green(`✅ Report uploaded successfully! Run ID: ${data.runId}`));
                } else {
                    console.error(chalk.red(`Failed to upload report: ${res.status} ${res.statusText}`));
                    const text = await res.text();
                    console.error(chalk.dim(text));
                }
            } catch (e: any) {
                console.error(chalk.red(`Error uploading report: ${e.message}`));
            }
        } else {
            console.log(chalk.yellow('\n⚠️  Skipping report upload: Missing BREAKPOINT_API_KEY or projectId.'));
        }

        // 7. Load Test
        if (options.load || process.env.RUN_LOAD === 'true') {
            const loadGen = new LoadGenerator();
            console.log(chalk.magenta(`\n🌪️  Running Load Tests against ${options.target}...`));
            for (const ep of rankedEndpoints) {
                await loadGen.runLoadTest(ep, options.target, options.deepCheck);
            }
        }

        return {
            success: results.success,
            reportPath,
            summary: results.success ? "All tests passed" : `${analysis.length} issues detected`
        };

    } catch (err: any) {
        console.error(chalk.red("Error in pipeline:"), err.message);
        throw err;
    }
}
