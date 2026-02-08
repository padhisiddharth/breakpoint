
import OpenAI from 'openai';
import chalk from 'chalk';

export interface FailureAnalysis {
    summary: string;
    rootCause: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    recommendation: string;
}

export class FailureAnalyzer {
    private openai: OpenAI;

    constructor(apiKey?: string) {
        const key = apiKey || process.env.OPENAI_API_KEY;
        if (!key && process.env.MOCK_LLM !== 'true') {
            throw new Error("Missing OPENAI_API_KEY");
        }
        this.openai = new OpenAI({ apiKey: key || 'mock-key' });
    }

    public async analyze(testOutput: string): Promise<FailureAnalysis[]> {
        // If mock mode, return canned response
        if (process.env.MOCK_LLM === 'true') {
            return [{
                summary: "Endpoint returned 200 OK for SQL Injection probe payload.",
                rootCause: "Input validation is missing or insufficient.",
                severity: "High",
                recommendation: "Implement strict schema validation using Zod and sanitize SQL inputs."
            }];
        }

        try {
            const prompt = `
            You are an expert QA Engineer. Analyze the following Jest test failure log.
            Identify the likely root cause and provide a concise explanation.
            
            Log:
            ${testOutput.slice(0, 4000)}

            Return a strict JSON array of objects with keys: 
            - summary: One-line description of what failed.
            - rootCause: Technical explanation (e.g. "Expected status 400 but got 200").
            - severity: 'Critical' | 'High' | 'Medium' | 'Low'.
            - recommendation: Actionable fix (e.g. "Add validation middleware").
            
            Output ONLY raw JSON. Do not use markdown blocks.
            `;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
            });

            const content = completion.choices[0]?.message?.content || '[]';
            const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(cleanJson);
        } catch (error) {
            // console.error(chalk.red("Failed to analyze failure:"), error);
            return [];
        }
    }
}
