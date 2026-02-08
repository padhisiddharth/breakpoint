/**
 * API Call Detector
 * Detects fetch, axios, and other API calls using AST parsing
 */

import { Project, SyntaxKind, CallExpression, Node } from 'ts-morph';
import path from 'path';
import fs from 'fs/promises';

export interface ApiDependency {
    componentFile: string;
    apiEndpoint: string;
    method: string;
    lineNumber: number;
}

export async function detectApiCalls(basePath: string): Promise<ApiDependency[]> {
    const apiCalls: ApiDependency[] = [];

    // Initialize ts-morph project
    const project = new Project({
        skipAddingFilesFromTsConfig: true,
    });

    // Find source directory
    const srcPath = await dirExists(path.join(basePath, 'src'))
        ? path.join(basePath, 'src')
        : basePath;

    // Add source files
    project.addSourceFilesAtPaths([
        path.join(srcPath, '**/*.tsx'),
        path.join(srcPath, '**/*.ts'),
        path.join(srcPath, '**/*.jsx'),
        path.join(srcPath, '**/*.js'),
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

        sourceFile.forEachDescendant(node => {
            if (node.getKind() === SyntaxKind.CallExpression) {
                const callExpr = node as CallExpression;
                const result = parseApiCall(callExpr, filePath);
                if (result) {
                    apiCalls.push(result);
                }
            }
        });
    }

    return apiCalls;
}

function parseApiCall(callExpr: CallExpression, filePath: string): ApiDependency | null {
    const expr = callExpr.getExpression();
    const text = expr.getText();

    // Pattern 1: fetch('url')
    if (text === 'fetch') {
        return parseFetchCall(callExpr, filePath);
    }

    // Pattern 2: axios.get('url'), axios.post('url'), etc.
    if (text.startsWith('axios.')) {
        return parseAxiosCall(callExpr, filePath, text);
    }

    // Pattern 3: api.get('url') - custom api client
    if (text.match(/^(api|client|http)\.(get|post|put|delete|patch)$/i)) {
        return parseGenericApiCall(callExpr, filePath, text);
    }

    return null;
}

function parseFetchCall(callExpr: CallExpression, filePath: string): ApiDependency | null {
    const args = callExpr.getArguments();
    if (args.length === 0) return null;

    const urlArg = args[0];
    if (!urlArg) return null;
    const url = extractStringValue(urlArg);
    if (!url) return null;

    // Determine method from options
    let method = 'GET';
    if (args.length > 1 && args[1]) {
        const optionsArg = args[1];
        const optionsText = optionsArg.getText();
        if (optionsText.includes('POST')) method = 'POST';
        else if (optionsText.includes('PUT')) method = 'PUT';
        else if (optionsText.includes('DELETE')) method = 'DELETE';
        else if (optionsText.includes('PATCH')) method = 'PATCH';
    }

    return {
        componentFile: filePath,
        apiEndpoint: url,
        method,
        lineNumber: callExpr.getStartLineNumber()
    };
}

function parseAxiosCall(callExpr: CallExpression, filePath: string, exprText: string): ApiDependency | null {
    const args = callExpr.getArguments();
    if (args.length === 0) return null;

    const urlArg = args[0];
    if (!urlArg) return null;
    const url = extractStringValue(urlArg);
    if (!url) return null;

    // Extract method from axios.get, axios.post, etc.
    const methodMatch = exprText.match(/axios\.(\w+)/);
    const method = methodMatch && methodMatch[1] ? methodMatch[1].toUpperCase() : 'GET';

    return {
        componentFile: filePath,
        apiEndpoint: url,
        method,
        lineNumber: callExpr.getStartLineNumber()
    };
}

function parseGenericApiCall(callExpr: CallExpression, filePath: string, exprText: string): ApiDependency | null {
    const args = callExpr.getArguments();
    if (args.length === 0) return null;

    const urlArg = args[0];
    if (!urlArg) return null;
    const url = extractStringValue(urlArg);
    if (!url) return null;

    const methodMatch = exprText.match(/\.(get|post|put|delete|patch)$/i);
    const method = methodMatch && methodMatch[1] ? methodMatch[1].toUpperCase() : 'GET';

    return {
        componentFile: filePath,
        apiEndpoint: url,
        method,
        lineNumber: callExpr.getStartLineNumber()
    };
}

function extractStringValue(node: Node): string | null {
    // Handle string literals
    if (node.getKind() === SyntaxKind.StringLiteral) {
        const literal = node.asKind(SyntaxKind.StringLiteral);
        return literal?.getLiteralValue() || null;
    }

    // Handle template literals (basic case)
    if (node.getKind() === SyntaxKind.TemplateExpression || node.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral) {
        // Return the raw template for reference
        return node.getText().replace(/^`|`$/g, '');
    }

    // Handle backtick strings
    const text = node.getText();
    if (text.startsWith('`') && text.endsWith('`')) {
        return text.slice(1, -1);
    }

    // Handle quoted strings
    if ((text.startsWith("'") && text.endsWith("'")) || (text.startsWith('"') && text.endsWith('"'))) {
        return text.slice(1, -1);
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
