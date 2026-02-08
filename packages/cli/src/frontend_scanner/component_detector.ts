/**
 * Interactive Component Detector
 * Detects forms, event handlers, auth checks using AST
 */

import { Project, SyntaxKind, CallExpression, JsxAttribute, Node } from 'ts-morph';
import path from 'path';
import fs from 'fs/promises';

export type ComponentFeature = 'form' | 'auth' | 'api' | 'events' | 'state';

export interface InteractiveComponent {
    filePath: string;
    componentName: string;
    features: ComponentFeature[];
    lineStart: number;
}

export async function detectInteractiveComponents(basePath: string): Promise<InteractiveComponent[]> {
    const components: InteractiveComponent[] = [];

    const project = new Project({
        skipAddingFilesFromTsConfig: true,
    });

    const srcPath = await dirExists(path.join(basePath, 'src'))
        ? path.join(basePath, 'src')
        : basePath;

    project.addSourceFilesAtPaths([
        path.join(srcPath, '**/*.tsx'),
        path.join(srcPath, '**/*.jsx'),
        `!${path.join(basePath, 'node_modules/**')}`,
        `!${path.join(basePath, '.next/**')}`,
        `!${path.join(basePath, 'dist/**')}`
    ]);

    const sourceFiles = project.getSourceFiles();

    for (const sourceFile of sourceFiles) {
        const filePath = sourceFile.getFilePath();

        // Skip test files
        if (filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('__tests__')) {
            continue;
        }

        const fileText = sourceFile.getFullText();
        const features = new Set<ComponentFeature>();

        // Detect forms
        if (fileText.includes('<form') || fileText.includes('onSubmit') || fileText.includes('handleSubmit')) {
            features.add('form');
        }

        // Detect event handlers
        if (fileText.match(/on(Click|Change|Blur|Focus|KeyDown|KeyUp|Mouse)/)) {
            features.add('events');
        }

        // Detect state management
        if (fileText.includes('useState') || fileText.includes('useReducer') || fileText.includes('useContext')) {
            features.add('state');
        }

        // Detect auth patterns
        if (fileText.match(/useAuth|isAuthenticated|session|token|login|logout|signIn|signOut/i)) {
            features.add('auth');
        }

        // Detect API calls
        if (fileText.includes('fetch(') || fileText.includes('axios') || fileText.includes('useSWR') || fileText.includes('useQuery')) {
            features.add('api');
        }

        // Only include components with interactive features
        if (features.size > 0) {
            // Try to extract component name from file
            const componentName = extractComponentName(sourceFile);

            components.push({
                filePath,
                componentName: componentName || path.basename(filePath, path.extname(filePath)),
                features: Array.from(features),
                lineStart: 1
            });
        }
    }

    return components;
}

function extractComponentName(sourceFile: any): string | null {
    // Look for default export function/const
    const defaultExport = sourceFile.getDefaultExportSymbol();
    if (defaultExport) {
        return defaultExport.getName();
    }

    // Look for function declarations
    const functions = sourceFile.getFunctions();
    for (const fn of functions) {
        const name = fn.getName();
        if (name && name[0] === name[0].toUpperCase()) {
            return name;
        }
    }

    // Look for const with arrow function (common pattern)
    const variables = sourceFile.getVariableDeclarations();
    for (const v of variables) {
        const name = v.getName();
        if (name && name[0] === name[0].toUpperCase()) {
            return name;
        }
    }

    return null;
}

async function dirExists(dirPath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(dirPath);
        return stat.isDirectory();
    } catch {
        return false;
    }
}
