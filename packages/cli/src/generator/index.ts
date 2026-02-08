
import OpenAI from 'openai';
import type { RatedEndpoint } from '../analyzer/index.js';

export interface TestCase {
    name: string;
    description: string;
    input: any; // body, query, or params
    expectedStatus: number;
    reasoning: string; // Why is this an edge case?
}

export class TestGenerator {
    private openai: OpenAI;

    constructor(apiKey?: string) {
        this.openai = new OpenAI({
            apiKey: apiKey || 'mock-key',
            dangerouslyAllowBrowser: true // not needed in node but good constraint
        });
    }

    public async generateTests(endpoint: RatedEndpoint): Promise<TestCase[]> {
        if (process.env.MOCK_LLM === 'true' || !process.env.OPENAI_API_KEY) {
            return this.mockGenerate(endpoint);
        }

        const prompt = this.buildPrompt(endpoint);
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [{ role: 'system', content: 'You are an expert QA Engineer.' }, { role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        return JSON.parse(content || '{"tests": []}').tests;
    }

    private buildPrompt(endpoint: RatedEndpoint): string {
        return `
        Generate 3-5 diverse edge-case tests for the following API endpoint.
        
        Method: ${endpoint.method}
        Path: ${endpoint.path}
        Risk Level: ${endpoint.riskLevel}
        Schema Info: ${JSON.stringify(endpoint.schema || {})}
        External Calls: ${endpoint.externalCalls?.join(', ')}

        Focus on:
        1. Boundary values
        2. Type mismatches (e.g. string instead of int)
        3. Security inputs (SQLi, XSS strings) usually handled by middleware but good to test.
        4. Empty/Null payloads.

        Do NOT generate load or concurrency tests (e.g. race conditions), as these are handled by a separate module. Focus on functional correctness and input validation.

        Output JSON format:
        {
            "tests": [
                {
                    "name": "Short title",
                    "description": "What is being tested",
                    "input": { ... },
                    "expectedStatus": 400,
                    "reasoning": "Explanation"
                }
            ]
        }
        `;
    }

    private mockGenerate(endpoint: RatedEndpoint): TestCase[] {
        // Deterministic mock for demo purposes
        return [
            {
                name: "Empty Payload",
                description: "Send empty JSON body",
                input: {},
                expectedStatus: 400,
                reasoning: "Validation should catch empty body"
            },
            {
                name: "SQL Injection Probe",
                description: "Attempt SQL injection in string field",
                input: { name: "'; DROP TABLE users; --" },
                expectedStatus: 400,
                reasoning: "Input sanitization check"
            },
            {
                name: "Huge Payload",
                description: "Send extremely large string",
                input: { name: "A".repeat(10000) },
                expectedStatus: 413,
                reasoning: "DoS prevention check"
            }
        ];
    }
}
