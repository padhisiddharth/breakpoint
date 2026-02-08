
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { exec } from 'child_process';
import util from 'util';
import type { TestCase } from '../generator/index.js';
import type { RatedEndpoint } from '../analyzer/index.js'; // type-only import

const execAsync = util.promisify(exec);

export class TestRunner {
    private testDir: string;

    constructor(testDir: string = './tests') {
        this.testDir = path.resolve(process.cwd(), testDir);
    }

    public async writeTests(endpoint: RatedEndpoint, tests: TestCase[]) {
        // Ensure directory exists
        await fs.mkdir(this.testDir, { recursive: true });

        const saneMethod = endpoint.method.toUpperCase();
        const sanePath = endpoint.path.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = path.join(this.testDir, `${saneMethod}${sanePath}.test.ts`);

        // Prepare test content
        // Hardcoded import for demo purposes
        const content = `
import request from 'supertest';
// Use the running server URL for black-box testing
const app = process.env.BREAKPOINT_SERVER_URL || 'http://localhost:3000';

describe('${endpoint.method} ${endpoint.path}', () => {
${tests.map(t => this.generateTestBlock(endpoint, t)).join('\n')}
});
`;
        await fs.writeFile(filename, content);
        return filename;
    }

    private generateTestBlock(endpoint: RatedEndpoint, test: TestCase): string {
        const method = endpoint.method.toLowerCase();
        const url = endpoint.path;

        let chain = `.request(app).${method}('${url}')`;

        // Handle payload vs query
        if (['post', 'put', 'patch'].includes(method)) {
            chain += `.send(${JSON.stringify(test.input)})`;
        } else if (method === 'get' && (test.input as any).query) {
            chain += `.query(${JSON.stringify((test.input as any).query)})`;
        }

        return `
    test('${test.name.replace(/'/g, "\\'")}', async () => {
        const res = await request(app).${method}('${url}')
            ${['post', 'put', 'patch'].includes(method) ? `.send(${JSON.stringify(test.input)})` : ''}
            ${method === 'get' && (test.input as any).query ? `.query(${JSON.stringify((test.input as any).query)})` : ''};
        
        // Expect fail for fail cases
        // We use .not.toBe(200) or check expected status if known.
        // For simplicity, just log result or basic assertion.
        if (${test.expectedStatus}) {
            expect(res.status).toBe(${test.expectedStatus});
        }
    });`;
    }

    public async runTests(): Promise<{ success: boolean; output: string }> {
        console.log(chalk.blue('\n🧪 Running generated tests with Jest...'));
        try {
            const { spawn } = await import('child_process');
            return new Promise((resolve) => {
                // Point to local jest
                // Note: We use 'npx' to execute jest.
                // Added --verbose to show individual tests.
                // Added --forceExit to prevent hanging on open server handles.
                const child = spawn('npx', ['jest', '--config', 'jest.config.js', '--colors', '--verbose', '--forceExit'], {
                    env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules' },
                    stdio: 'pipe'
                });

                let stdoutData = '';
                let stderrData = '';

                // Stream to console AND buffer for analysis
                child.stdout.on('data', (data) => {
                    const str = data.toString();
                    process.stdout.write(str);
                    stdoutData += str;
                });

                child.stderr.on('data', (data) => {
                    const str = data.toString();
                    process.stderr.write(str);
                    stderrData += str;
                });

                child.on('close', (code) => {
                    const output = stdoutData + '\n' + stderrData;
                    if (code === 0) {
                        resolve({ success: true, output });
                    } else {
                        console.error(chalk.red('Test execution failed!'));
                        resolve({ success: false, output });
                    }
                });
            });
        } catch (err: any) {
            console.error(chalk.red('Test execution error!'), err);
            return { success: false, output: err.message };
        }
    }
}
