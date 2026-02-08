/**
 * Frontend Scanner - Main Entry Point
 * Deterministic static analysis for React/Next.js/Vue projects
 */

import path from 'path';
import chalk from 'chalk';
import { detectFramework, type FrameworkType } from './framework_detector.js';
import { detectPages, type PageInfo } from './page_detector.js';
import { detectApiCalls, type ApiDependency } from './api_detector.js';
import { detectInteractiveComponents, type InteractiveComponent } from './component_detector.js';

export interface FrontendScanResult {
    framework: FrameworkType;
    pages: PageInfo[];
    apiDependencies: ApiDependency[];
    interactiveComponents: InteractiveComponent[];
}

export class FrontendScanner {
    private basePath: string;

    constructor(basePath: string) {
        this.basePath = path.resolve(basePath);
    }

    public async scan(): Promise<FrontendScanResult> {
        console.log(chalk.blue(`\n🔍 Scanning frontend codebase at: ${this.basePath}`));

        // 1. Detect Framework
        const framework = await detectFramework(this.basePath);
        console.log(chalk.green(`  ✔ Framework detected: ${framework}`));

        if (framework === 'unknown') {
            console.log(chalk.yellow('  ⚠ Could not detect frontend framework. Skipping frontend scan.'));
            return {
                framework: 'unknown',
                pages: [],
                apiDependencies: [],
                interactiveComponents: []
            };
        }

        // 2. Detect Pages/Routes
        console.log(chalk.dim('  Scanning pages/routes...'));
        const pages = await detectPages(this.basePath, framework);
        console.log(chalk.green(`  ✔ Found ${pages.length} pages/routes`));

        // 3. Detect API Calls
        console.log(chalk.dim('  Scanning API dependencies...'));
        const apiDependencies = await detectApiCalls(this.basePath);
        console.log(chalk.green(`  ✔ Found ${apiDependencies.length} API calls`));

        // 4. Detect Interactive Components
        console.log(chalk.dim('  Scanning interactive components...'));
        const interactiveComponents = await detectInteractiveComponents(this.basePath);
        console.log(chalk.green(`  ✔ Found ${interactiveComponents.length} interactive components`));

        return {
            framework,
            pages,
            apiDependencies,
            interactiveComponents
        };
    }
}

// Re-export types
export type { FrameworkType, PageInfo, ApiDependency, InteractiveComponent };
