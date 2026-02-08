
import express from 'express';
import { z } from 'zod';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());

const UserSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    age: z.number().min(18).optional()
});

app.post('/api/users', (req, res) => {
    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    return res.status(201).json({ id: Date.now(), ...result.data });
});

app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

// Purposely buggy route for testing failure analysis
app.post('/api/crash', (req, res) => {
    const { input } = req.body;
    if (input === 'boom') {
        throw new Error("Critical System Failure");
    }
    res.send('Safe');
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(3000, () => console.log('Demo server running on port 3000'));
}

export default app;
