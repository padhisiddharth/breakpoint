/**
 * Framework Detector
 * Deterministically detects React, Next.js, or Vue based on file structure
 */

import fs from 'fs/promises';
import path from 'path';

export type FrameworkType = 'react' | 'nextjs' | 'vue' | 'unknown';

export async function detectFramework(basePath: string): Promise<FrameworkType> {
    // Check for Next.js first (most specific)
    if (await fileExists(path.join(basePath, 'next.config.js')) ||
        await fileExists(path.join(basePath, 'next.config.mjs')) ||
        await fileExists(path.join(basePath, 'next.config.ts'))) {
        return 'nextjs';
    }

    // Check for Next.js App Router or Pages Router directories
    if (await dirExists(path.join(basePath, 'app')) ||
        await dirExists(path.join(basePath, 'pages')) ||
        await dirExists(path.join(basePath, 'src', 'app')) ||
        await dirExists(path.join(basePath, 'src', 'pages'))) {
        // Could be Next.js even without config
        const pkgJson = await readPackageJson(basePath);
        if (pkgJson?.dependencies?.next || pkgJson?.devDependencies?.next) {
            return 'nextjs';
        }
    }

    // Check package.json for framework hints
    const pkgJson = await readPackageJson(basePath);

    if (pkgJson) {
        const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };

        // Vue detection
        if (deps.vue || deps.nuxt) {
            return 'vue';
        }

        // React detection (CRA or plain React)
        if (deps.react || deps['react-scripts']) {
            return 'react';
        }
    }

    // Check for .vue files
    if (await hasFilesWithExtension(basePath, '.vue')) {
        return 'vue';
    }

    // Check for React files (JSX/TSX)
    if (await hasFilesWithExtension(basePath, '.tsx') ||
        await hasFilesWithExtension(basePath, '.jsx')) {
        return 'react';
    }

    return 'unknown';
}

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function dirExists(dirPath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(dirPath);
        return stat.isDirectory();
    } catch {
        return false;
    }
}

async function readPackageJson(basePath: string): Promise<any> {
    try {
        const content = await fs.readFile(path.join(basePath, 'package.json'), 'utf-8');
        return JSON.parse(content);
    } catch {
        return null;
    }
}

async function hasFilesWithExtension(basePath: string, ext: string): Promise<boolean> {
    try {
        const srcPath = await dirExists(path.join(basePath, 'src'))
            ? path.join(basePath, 'src')
            : basePath;

        const files = await fs.readdir(srcPath, { recursive: true });
        return files.some(f => f.toString().endsWith(ext));
    } catch {
        return false;
    }
}
