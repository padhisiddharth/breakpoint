
import autocannon from 'autocannon';
import type { RatedEndpoint } from '../analyzer/index.js';
import chalk from 'chalk';

export class LoadGenerator {

    public async runLoadTest(endpoint: RatedEndpoint, baseUrl: string = 'http://localhost:3000', deepCheck: boolean = false): Promise<void> {
        // Pre-flight check
        try {
            await fetch(baseUrl);
        } catch (e) {
            console.log(chalk.red(`\n❌ Could not connect to target server at ${baseUrl}. Please ensure your application is running.`));
            return;
        }

        console.log(chalk.yellow(`\n🚀 Starting Load Test for ${endpoint.method} ${endpoint.path} ${deepCheck ? '(Deep Inspection Enabled)' : ''}`));

        // Determine profile based on risk
        let connections = 10;
        let duration = 5; // seconds
        let pipelining = 1;

        if (endpoint.riskLevel === 'Critical') {
            connections = 50;
            duration = 10;
        } else if (endpoint.riskLevel === 'High') {
            connections = 20;
        }

        const url = `${baseUrl}${endpoint.path}`;

        // Structures for Deep Check
        const uniqueResponses = new Map<string, number>();
        const sampleResponses = new Map<string, any>();


        const opts: any = {
            url,
            connections,
            duration,
            pipelining,
            method: endpoint.method as any,
            body: ['POST', 'PUT', 'PATCH'].includes(endpoint.method) ? JSON.stringify({}) : undefined,
            headers: { 'content-type': 'application/json' }
        };

        if (deepCheck) {
            opts.requests = [{
                method: endpoint.method as any,
                path: endpoint.path,
                // @ts-ignore
                onResponse: (status: number, body: string) => {
                    try {
                        const json = JSON.parse(body);
                        const keys = Object.keys(json).sort().join(',');
                        const fingerprint = `${status}::${keys}`;

                        uniqueResponses.set(fingerprint, (uniqueResponses.get(fingerprint) || 0) + 1);
                        if (!sampleResponses.has(fingerprint)) {
                            sampleResponses.set(fingerprint, json);
                        }
                    } catch (e) {
                        const fingerprint = `${status}::[Non-JSON]`;
                        uniqueResponses.set(fingerprint, (uniqueResponses.get(fingerprint) || 0) + 1);
                    }
                }
            }];
        }

        try {
            const result = await autocannon(opts);

            // Re-implement existing reporting...
            console.log(chalk.dim(`  Requests: ${result.requests.total}, Latency (Avg): ${result.latency.average}ms, Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`));

            // Report Status Codes
            // Type assertions needed as autocannon types might be loose
            const r = result as any;
            const codes = [r['1xx'], r['2xx'], r['3xx'], r['4xx'], r['5xx']];

            if (codes[1] > 0) console.log(chalk.green(`  2xx: ${codes[1]}`));
            if (codes[3] > 0) console.log(chalk.yellow(`  4xx: ${codes[3]}`));
            if (codes[4] > 0) console.log(chalk.red(`  5xx: ${codes[4]}`));

            // Deep Check Report
            if (deepCheck && uniqueResponses.size > 0) {
                console.log(chalk.bold(`\n  🔎 Response Structure Analysis:`));
                const total = Array.from(uniqueResponses.values()).reduce((a, b) => a + b, 0);

                uniqueResponses.forEach((count, fp) => {
                    const percent = ((count / total) * 100).toFixed(1);
                    // Anomaly? If < 5% and not the dominant one?
                    const isAnomaly = parseFloat(percent) < 5 && uniqueResponses.size > 1;

                    const color = isAnomaly ? chalk.red : chalk.green;
                    const icon = isAnomaly ? '⚠️ ' : '✅';

                    console.log(`  ${icon} ${color(percent + '%')} - Structure: [${fp}]`);
                    if (isAnomaly) {
                        console.log(chalk.dim(`      Sample: ${JSON.stringify(sampleResponses.get(fp)).slice(0, 100)}...`));
                    }
                });
            }

            if (result.errors > 0 || result.timeouts > 0) {
                console.log(chalk.red(`  ⚠️  Errors: ${result.errors}, Timeouts: ${result.timeouts}`));
            } else {
                // Check if we have 5xx errors which are also failures
                if (r['5xx'] > 0) {
                    console.log(chalk.red(`  ❌ High Load Failure: ${r['5xx']} Server Errors (5xx)`));
                } else {
                    console.log(chalk.green(`  ✅ Load Test Passed`));
                }
            }
        } catch (err) {
            console.error('Load test failed', err);
        }
    }
}
