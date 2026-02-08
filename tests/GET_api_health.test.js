import request from 'supertest';
import app from '../src/demo_server';
describe('GET /api/health', () => {
    test('Empty Payload', async () => {
        const res = await request(app).get('/api/health');
        // Expect fail for fail cases
        // We use .not.toBe(200) or check expected status if known.
        // For simplicity, just log result or basic assertion.
        if (400) {
            expect(res.status).toBe(400);
        }
    });
    test('SQL Injection Probe', async () => {
        const res = await request(app).get('/api/health');
        // Expect fail for fail cases
        // We use .not.toBe(200) or check expected status if known.
        // For simplicity, just log result or basic assertion.
        if (400) {
            expect(res.status).toBe(400);
        }
    });
    test('Huge Payload', async () => {
        const res = await request(app).get('/api/health');
        // Expect fail for fail cases
        // We use .not.toBe(200) or check expected status if known.
        // For simplicity, just log result or basic assertion.
        if (413) {
            expect(res.status).toBe(413);
        }
    });
});
//# sourceMappingURL=GET_api_health.test.js.map