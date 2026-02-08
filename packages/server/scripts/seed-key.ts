
import sqlite3 from 'sqlite3';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const DB_PATH = path.resolve(__dirname, '../aitest.db');
const db = new sqlite3.Database(DB_PATH);

const apiKey = process.env.AITEST_API_KEY;

if (!apiKey) {
    console.error('AITEST_API_KEY not found in root .env');
    process.exit(1);
}

function hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
}

const keyId = crypto.randomUUID();
const hash = hashKey(apiKey);
const prefix = apiKey.substring(0, 7);
const name = 'seeded-from-env';

db.serialize(() => {
    // Ensure table exists (script might run before server start?)
    // Actually server starts and inits DB. We assume DB exists or we just create table if not?
    // Safer to rely on server to have init it, or duplicated logic. 
    // For now, let's assume server ran once.

    // Check if duplicate
    db.get('SELECT id FROM api_keys WHERE hash = ?', [hash], (err, row) => {
        if (row) {
            console.log('API Key already exists in DB.');
            process.exit(0);
        }

        const stmt = db.prepare('INSERT INTO api_keys (id, name, hash, prefix) VALUES (?, ?, ?, ?)');
        stmt.run(keyId, name, hash, prefix, (err: any) => {
            if (err) {
                console.error('Failed to insert key:', err);
                process.exit(1);
            }
            console.log(`Successfully seeded API Key '${prefix}...' into ${DB_PATH}`);
            process.exit(0);
        });
        stmt.finalize();
    });
});
