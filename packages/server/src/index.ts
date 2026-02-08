
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
import { app } from './app.js';
import chalk from 'chalk';

const PORT = process.env.PORT || 4000;

export function startServer() {
    app.listen(PORT, () => {
        console.log(chalk.green(`\n🚀 AI Test Engineer Report Server running on http://localhost:${PORT}`));
        console.log(chalk.dim(`   - Projects: GET /api/projects`));
        console.log(chalk.dim(`   - Reports:  POST /api/reports`));
    });
}

// Allow direct execution
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startServer();
}
