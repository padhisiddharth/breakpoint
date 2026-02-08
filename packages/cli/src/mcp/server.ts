
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
    ListResourcesRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { runTestPipeline } from '../lib/orchestrator.js';
import fs from 'fs/promises';
import path from 'path';

// Store last report path
let lastReportPath = path.resolve('aitest-report.json');

const server = new Server(
    {
        name: "ai-test-engineer",
        version: "1.0.0",
    },
    {
        capabilities: {
            resources: {},
            tools: {},
        },
    }
);

// List Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [{
            uri: "test://last-report",
            name: "Last Test Report",
            mimeType: "application/json",
            description: "The JSON report of the last test execution"
        }]
    };
});

// Read Resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === "test://last-report") {
        try {
            const content = await fs.readFile(lastReportPath, "utf-8");
            return {
                contents: [{
                    uri: "test://last-report",
                    mimeType: "application/json",
                    text: content
                }]
            };
        } catch (e) {
            throw new Error("Report not found. Run tests first.");
        }
    }
    throw new Error("Resource not found");
});

// List Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "run_ai_tests",
                description: "Run the AI Test Engineer pipeline (Scan -> Generate -> Test -> Report)",
                inputSchema: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "Path to the codebase to test (default: current directory)",
                        },
                        load: {
                            type: "boolean",
                            description: "Run load tests after functional tests",
                        },
                        deepCheck: {
                            type: "boolean",
                            description: "Enable deep response inspection (anomaly detection) during load tests",
                        },
                        target: {
                            type: "string",
                            description: "Target URL for load tests (default: http://localhost:3000)",
                        }
                    },
                },
            },
        ],
    };
});

// Call Tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "run_ai_tests") {
        const args = request.params.arguments as any;
        const projectPath = args.path || ".";
        const runLoad = args.load || false;
        const deepCheck = args.deepCheck || false;
        const target = args.target || "http://localhost:3000";

        try {
            const result = await runTestPipeline({
                path: projectPath,
                load: runLoad,
                deepCheck: deepCheck,
                target: target,
                ...(process.env.BREAKPOINT_PROJECT_ID ? { projectId: process.env.BREAKPOINT_PROJECT_ID } : {})
            });

            lastReportPath = result.reportPath;

            return {
                content: [
                    {
                        type: "text",
                        text: `Test Pipeline Completed.\nSuccess: ${result.success}\nSummary: ${result.summary}\nReport saved to: ${result.reportPath}\n\nYou can read the full details from resource 'test://last-report'.`
                    }
                ]
            };

        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error running tests: ${error.message}`
                    }
                ],
                isError: true,
            };
        }
    }
    throw new Error("Tool not found");
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("AI Test Engineer MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
