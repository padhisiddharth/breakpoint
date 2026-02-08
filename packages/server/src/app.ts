
import express from 'express';
import cors from 'cors';
import { Database } from './db.js';

const app = express();
const db = new Database();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large reports

// GET /api/runs (Recent global runs)
app.get('/api/runs', async (req, res) => {
    try {
        const runs = await db.getAllRuns(100);
        res.json(runs);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// GET /api/dashboard/stats
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const stats = await db.getDashboardStats();
        res.json(stats);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// GET /api/projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await db.getAllProjects();
        res.json(projects);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/projects
app.post('/api/projects', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const project = await db.createProject(name);
        res.status(201).json(project); // No API key returned here anymore
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/apikeys
app.post('/api/apikeys', async (req, res) => {
    try {
        const { name } = req.body;
        // Project ID is no longer required for global keys
        const result = await db.createApiKey(name);
        res.status(201).json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// GET /api/apikeys
app.get('/api/apikeys', async (req, res) => {
    try {
        // Fetch all keys (global)
        const keys = await db.getApiKeys();
        res.json(keys);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE /api/apikeys/:id
app.delete('/api/apikeys/:id', async (req, res) => {
    try {
        await db.deleteApiKey(req.params.id);
        res.status(204).send();
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/projects/:id/keys -- Legacy/Alias
app.post('/api/projects/:id/keys', async (req, res) => {
    try {
        const { name } = req.body;
        // Legacy support: Create a global key, ignoring project ID
        const result = await db.createApiKey(name);
        res.status(201).json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// GET /api/projects/:id/keys -- Legacy/Alias
app.get('/api/projects/:id/keys', async (req, res) => {
    try {
        // Legacy support: Return all global keys
        const keys = await db.getApiKeys();
        res.json(keys);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/reports
app.post('/api/reports', async (req, res) => {
    // 1. Extract API Key
    let apiKey: string | undefined = req.headers['x-api-key'] as string | undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        apiKey = authHeader.split(' ')[1];
    }

    if (!apiKey) return res.status(401).json({ error: 'Missing API Key (Bearer token or x-api-key)' });

    try {
        const valid = await db.validateApiKey(apiKey);
        if (!valid) return res.status(403).json({ error: 'Invalid API Key' });

        const report = req.body;

        // 2. Resolve Project ID
        // Priority: Header > Body > Inferred
        let targetProjectId = req.headers['x-project-id'] as string;

        if (!targetProjectId && report.projectId) {
            targetProjectId = report.projectId;
        }

        if (!targetProjectId) {
            return res.status(400).json({ error: 'Project ID is required. Set X-Project-Id header or include projectId in body.' });
        }

        // Ideally verify project exists, but createRun handles FK constraints or we auto-create? 
        // Current DB schema has FK on project_id. So project MUST exist.
        // We probably should check if it exists, if not, maybe auto-create if configured to do so?
        // For now, let's try to create the run. If it fails due to FK, we return 400.
        // ACTUALLY: The prompt says "Associate with customer... Attach customer_id". 
        // Here we are just simple project linking. 

        // Let's check if project exists, if not create it (Auto-provisioning for CLI convenience)
        // This makes the "aitest init -> aitest run" flow seamless for new projects.
        // Auto-provision project if it doesn't exist
        try {
            const project = await db.getProject(targetProjectId);
            if (!project) {
                console.log(`Project ${targetProjectId} not found. Auto-creating...`);
                await db.createProjectWithId(targetProjectId, targetProjectId);
            }

            const runId = await db.createRun(targetProjectId, report);
            res.status(201).json({ runId });
        } catch (err: any) {
            console.error('Error in report upload flow:', err);
            res.status(500).json({ error: 'Failed to process report: ' + err.message });
        }
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// GET /api/projects/:id/runs
app.get('/api/projects/:id/runs', async (req, res) => {
    try {
        const runs = await db.getRunsForProject(req.params.id);
        res.json(runs);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// GET /api/runs/:id
app.get('/api/runs/:id', async (req, res) => {
    try {
        const run: any = await db.getRunDetails(req.params.id);
        if (!run) return res.status(404).json({ error: 'Run not found' });

        // Parse the JSON string back to object
        run.report_json = JSON.parse(run.report_json);
        res.json(run);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export { app };
