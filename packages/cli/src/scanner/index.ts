
import { Project, SyntaxKind, CallExpression } from 'ts-morph';
import path from 'path';
import chalk from 'chalk';

export interface Endpoint {
    method: string;
    path: string;
    sourceFile: string;
    lineStart: number;
    schema?: any;
    externalCalls?: string[];
}

export class CodebaseScanner {
    private project: Project;

    constructor(basePath: string) {
        this.project = new Project({
            tsConfigFilePath: path.join(basePath, 'tsconfig.json'),
            skipAddingFilesFromTsConfig: false,
        });

        if (this.project.getSourceFiles().length === 0) {
            this.project.addSourceFilesAtPaths([
                path.join(basePath, '**/*.ts'),
                path.join(basePath, '**/*.js'),
                '!**/node_modules/**',
                '!**/dist/**'
            ]);
        }
    }

    public scan(): Endpoint[] {
        const endpoints: Endpoint[] = [];
        const sourceFiles = this.project.getSourceFiles();

        console.log(chalk.blue(`Scanning ${sourceFiles.length} files...`));

        for (const sourceFile of sourceFiles) {
            sourceFile.forEachDescendant(node => {
                if (node.getKind() === SyntaxKind.CallExpression) {
                    const callExpr = node as CallExpression;
                    const expr = callExpr.getExpression();

                    if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
                        const propAccess = expr.asKind(SyntaxKind.PropertyAccessExpression);
                        // Ensure we have a valid property access
                        if (!propAccess) return;

                        const name = propAccess.getName();
                        const allowedMethods = ['get', 'post', 'put', 'delete', 'patch'];

                        if (allowedMethods.includes(name)) {
                            // Filter 1: Check if file is a test file
                            const filePath = sourceFile.getFilePath();
                            if (filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('__tests__')) return;

                            // Filter 2: Check object name (e.g. app.get, router.post)
                            const objExpr = propAccess.getExpression();
                            const objName = objExpr.getText();
                            // Very basic check, but effective for broad scans. 
                            // We typically want 'app', 'router', 'server', 'v1', etc.
                            // We definitely do not want 'db', 'sql', 'query'.
                            const blockedObjects = ['db', 'sql', 'query', 'client', 'pool', 'connection'];
                            if (blockedObjects.some(bo => objName.toLowerCase().includes(bo))) return;

                            const args = callExpr.getArguments();
                            if (args.length >= 2) {
                                const pathArg = args[0];
                                if (pathArg && pathArg.getKind() === SyntaxKind.StringLiteral) {
                                    const routePathRaw = pathArg.asKind(SyntaxKind.StringLiteral)?.getLiteralValue();

                                    if (routePathRaw) {
                                        // Filter 3: Check if path looks like SQL
                                        if (routePathRaw.trim().toUpperCase().startsWith('SELECT') ||
                                            routePathRaw.trim().toUpperCase().startsWith('INSERT') ||
                                            routePathRaw.trim().toUpperCase().startsWith('UPDATE') ||
                                            routePathRaw.trim().toUpperCase().startsWith('DELETE FROM')) {
                                            return;
                                        }

                                        // Analyze handler for schema/db calls
                                        const handler = args[args.length - 1];
                                        const externalCalls = this.detectExternalCalls(handler);
                                        const schema = this.extractSchema(handler);

                                        endpoints.push({
                                            method: name.toUpperCase(),
                                            path: routePathRaw,
                                            sourceFile: sourceFile.getFilePath(),
                                            lineStart: node.getStartLineNumber(),
                                            externalCalls,
                                            schema
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        return endpoints;
    }

    private detectExternalCalls(node: any): string[] {
        const calls: string[] = [];
        if (!node) return calls;
        node.forEachDescendant((child: any) => {
            if (child.getKind() === SyntaxKind.CallExpression) {
                const text = child.getText();
                if (text.includes('prisma.') || text.includes('db.') || text.includes('.create(')) calls.push('Database');
                if (text.includes('axios.') || text.includes('fetch(')) calls.push('External API');
            }
        });
        return [...new Set(calls)];
    }

    private extractSchema(node: any): any {
        if (!node) return null;
        let schema = null;
        node.forEachDescendant((child: any) => {
            if (child.getKind() === SyntaxKind.CallExpression) {
                const callExpr = child as CallExpression;
                const expr = callExpr.getExpression();
                if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
                    const propAccess = expr.asKind(SyntaxKind.PropertyAccessExpression);
                    if (propAccess) {
                        const name = propAccess.getName();
                        if (name === 'parse' || name === 'safeParse') {
                            const schemaName = propAccess.getExpression().getText();
                            schema = { type: 'zod', detail: `Detected Zod schema used: ${schemaName}` };
                        }
                    }
                }
            }
        });
        return schema;
    }
}
