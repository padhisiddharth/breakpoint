
import sqlite3 from 'sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.resolve('breakpoint.db');

import crypto from 'crypto';

export class Database {
    private db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database(DB_PATH);
        this.init();
    }

    private init() {
        this.db.serialize(() => {
            // Projects Table
            // Note: api_key column is deprecated/migrated to api_keys table for security
            this.db.run(`
                CREATE TABLE IF NOT EXISTS projects (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // API Keys Table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS api_keys (
                    id TEXT PRIMARY KEY,
                    project_id TEXT,
                    name TEXT,
                    hash TEXT NOT NULL,
                    prefix TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_used_at DATETIME,
                    FOREIGN KEY(project_id) REFERENCES projects(id)
                )
            `);

            // Runs Table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS runs (
                    id TEXT PRIMARY KEY,
                    project_id TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    status TEXT,
                    endpoints_scanned INTEGER,
                    issues_found INTEGER,
                    report_json TEXT,
                    FOREIGN KEY(project_id) REFERENCES projects(id)
                )
            `);
        });


        // Seed API Key from Env if present (auto-config for CLI)
        this.seedEnvKey();
    }

    private seedEnvKey() {
        const envKey = process.env.BREAKPOINT_API_KEY;
        if (!envKey) return;

        const hash = this.hashKey(envKey);
        const prefix = envKey.substring(0, 7);
        const keyId = 'env-seeded-key'; // Fixed ID for simplicity, or generate UUID
        const name = 'seeded-from-env';

        this.db.get('SELECT id FROM api_keys WHERE hash = ?', [hash], (err, row) => {
            if (!row) {
                console.log('Seeding API Key from environment into DB...');
                this.db.run(
                    `INSERT INTO api_keys (id, name, hash, prefix) VALUES (?, ?, ?, ?)`,
                    [keyId, name, hash, prefix],
                    (err) => {
                        if (err) console.error('Failed to seed API Key:', err);
                        else console.log('API Key seeded successfully.');
                    }
                );
            }
        });
    }

    private hashKey(key: string): string {
        return crypto.createHash('sha256').update(key).digest('hex');
    }

    public createProject(name: string): Promise<{ id: string, name: string }> {
        return new Promise((resolve, reject) => {
            const id = uuidv4();
            this.db.run(
                `INSERT INTO projects (id, name) VALUES (?, ?)`,
                [id, name],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, name });
                }
            );
        });
    }

    public createProjectWithId(id: string, name: string): Promise<{ id: string, name: string }> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO projects (id, name) VALUES (?, ?)`,
                [id, name],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, name });
                }
            );
        });
    }

    public async createApiKey(name: string = 'default'): Promise<{ keyId: string, apiKey: string }> {
        return new Promise((resolve, reject) => {
            const keyId = uuidv4();
            const rawKey = 'pk_' + crypto.randomBytes(24).toString('hex');
            const hash = this.hashKey(rawKey);
            const prefix = rawKey.substring(0, 7); // Store prefix for display

            this.db.run(
                `INSERT INTO api_keys (id, name, hash, prefix) VALUES (?, ?, ?, ?)`,
                [keyId, name, hash, prefix],
                function (err) {
                    if (err) reject(err);
                    else resolve({ keyId, apiKey: rawKey });
                }
            );
        });
    }

    public validateApiKey(apiKey: string): Promise<{ keyId: string } | null> {
        return new Promise((resolve, reject) => {
            const hash = this.hashKey(apiKey);
            this.db.get(
                `SELECT id FROM api_keys WHERE hash = ?`,
                [hash],
                (err, row: any) => {
                    if (err) reject(err);
                    else if (!row) resolve(null);
                    else {
                        // Update usage asynchronously
                        this.db.run(`UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?`, [row.id]);
                        resolve({ keyId: row.id });
                    }
                }
            );
        });
    }

    public getProject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM projects WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    public getAllRuns(limit: number = 50): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT r.id, r.timestamp, r.status, r.endpoints_scanned, r.issues_found, p.name as project_name, r.project_id
                 FROM runs r
                 JOIN projects p ON r.project_id = p.id
                 ORDER BY r.timestamp DESC
                 LIMIT ?`,
                [limit],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    public getAllProjects(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT id, name, created_at FROM projects`, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    public getApiKeys(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT id, name, prefix, created_at, last_used_at FROM api_keys ORDER BY created_at DESC`,
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    public deleteApiKey(keyId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `DELETE FROM api_keys WHERE id = ?`,
                [keyId],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    public getDashboardStats(): Promise<any> {
        return new Promise((resolve, reject) => {
            const stats: any = {};

            this.db.serialize(() => {
                // Total Projects
                this.db.get("SELECT COUNT(*) as count FROM projects", (err, row: any) => {
                    if (err) return reject(err);
                    stats.totalProjects = row.count;
                });

                // Total Runs
                this.db.get("SELECT COUNT(*) as count FROM runs", (err, row: any) => {
                    if (err) return reject(err);
                    stats.totalRuns = row.count;
                });

                // Recent Failures (Count)
                this.db.get("SELECT COUNT(*) as count FROM runs WHERE status = 'failure'", (err, row: any) => {
                    if (err) return reject(err);
                    stats.criticalFailures = row.count;
                });

                // Recent Runs (Global) - Limit 10, join with projects for name
                this.db.all(`
                    SELECT r.id, r.status, r.timestamp, r.issues_found, p.name as project_name, r.project_id
                    FROM runs r
                    JOIN projects p ON r.project_id = p.id
                    ORDER BY r.timestamp DESC
                    LIMIT 10
                `, (err, rows) => {
                    if (err) return reject(err);
                    stats.recentRuns = rows;
                    resolve(stats);
                });
            });
        });
    }

    public createRun(projectId: string, report: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const id = uuidv4();
            const status = report.stats.success ? 'success' : 'failure';
            const endpoints = report.stats.total || 0;
            const issues = report.failures ? report.failures.length : 0;
            const json = JSON.stringify(report);

            this.db.run(
                `INSERT INTO runs (id, project_id, status, endpoints_scanned, issues_found, report_json) VALUES (?, ?, ?, ?, ?, ?)`,
                [id, projectId, status, endpoints, issues, json],
                function (err) {
                    if (err) reject(err);
                    else resolve(id);
                }
            );
        });
    }

    public getRunsForProject(projectId: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT id, timestamp, status, endpoints_scanned, issues_found FROM runs WHERE project_id = ? ORDER BY timestamp DESC`,
                [projectId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    public getRunDetails(runId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT * FROM runs WHERE id = ?`,
                [runId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }
}
