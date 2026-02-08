
import type { Endpoint } from '../scanner/index.js';

export interface RatedEndpoint extends Endpoint {
    riskScore: number;
    riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
    reasoning: string[];
}

export class CodebaseAnalyzer {

    public analyze(endpoints: Endpoint[]): RatedEndpoint[] {
        return endpoints
            .map(ep => this.scoreEndpoint(ep))
            .sort((a, b) => b.riskScore - a.riskScore);
    }

    private scoreEndpoint(ep: Endpoint): RatedEndpoint {
        let score = 0;
        const reasoning: string[] = [];
        const lowerPath = ep.path.toLowerCase();

        // Method scoring
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(ep.method)) {
            score += 5;
            reasoning.push('State mutation method');
        } else {
            score += 1;
        }

        // External Calls
        if (ep.externalCalls) {
            ep.externalCalls.forEach(call => {
                if (call === 'Database') {
                    // Refine detection if possible (read vs write), currently generic
                    score += 5;
                    reasoning.push('Database interaction');
                }
                if (call === 'External API') {
                    score += 5;
                    reasoning.push('External API dependency');
                }
            });
        }

        // Business Logic Keywords
        if (lowerPath.includes('payment') || lowerPath.includes('order') || lowerPath.includes('checkout')) {
            score += 20;
            reasoning.push('Revenue critical keywords');
        }
        if (lowerPath.includes('auth') || lowerPath.includes('login') || lowerPath.includes('signup')) {
            score += 15;
            reasoning.push('Auth critical keywords');
        }

        let riskLevel: RatedEndpoint['riskLevel'] = 'Low';
        if (score >= 20) riskLevel = 'Critical';
        else if (score >= 15) riskLevel = 'High';
        else if (score >= 5) riskLevel = 'Medium';

        return { ...ep, riskScore: score, riskLevel, reasoning };
    }
}
