/**
 * Page/Route Detector
 * Detects pages and routes based on framework conventions
 */

import fs from 'fs/promises';
import path from 'path';
import type { FrameworkType } from './framework_detector.js';

export interface PageInfo {
    route: string;
    filePath: string;
    isDynamic: boolean;
}

export async function detectPages(basePath: string, framework: FrameworkType): Promise<PageInfo[]> {
    switch (framework) {
        case 'nextjs':
            return detectNextJsPages(basePath);
        case 'react':
            return detectReactRouterPages(basePath);
        case 'vue':
            return detectVuePages(basePath);
        default:
            return [];
    }
}

async function detectNextJsPages(basePath: string): Promise<PageInfo[]> {
    const pages: PageInfo[] = [];

    // Check for App Router (app directory)
    const appDirs = [
        path.join(basePath, 'app'),
        path.join(basePath, 'src', 'app')
    ];

    for (const appDir of appDirs) {
        if (await dirExists(appDir)) {
            const appPages = await scanNextJsAppRouter(appDir, appDir);
            pages.push(...appPages);
        }
    }

    // Check for Pages Router (pages directory)
    const pagesDirs = [
        path.join(basePath, 'pages'),
        path.join(basePath, 'src', 'pages')
    ];

    for (const pagesDir of pagesDirs) {
        if (await dirExists(pagesDir)) {
            const pagesRouterPages = await scanNextJsPagesRouter(pagesDir, pagesDir);
            pages.push(...pagesRouterPages);
        }
    }

    return pages;
}

async function scanNextJsAppRouter(dir: string, baseDir: string): Promise<PageInfo[]> {
    const pages: PageInfo[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip special directories
            if (entry.name.startsWith('_') || entry.name === 'api') continue;

            // Recurse into subdirectories
            const subPages = await scanNextJsAppRouter(fullPath, baseDir);
            pages.push(...subPages);
        } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx' || entry.name === 'page.ts' || entry.name === 'page.js') {
            const relativePath = path.relative(baseDir, dir);
            const route = '/' + relativePath
                .replace(/\\/g, '/')
                .replace(/\[([^\]]+)\]/g, ':$1'); // Convert [id] to :id

            pages.push({
                route: route === '/' ? '/' : route,
                filePath: fullPath,
                isDynamic: relativePath.includes('[')
            });
        }
    }

    return pages;
}

async function scanNextJsPagesRouter(dir: string, baseDir: string): Promise<PageInfo[]> {
    const pages: PageInfo[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip special directories
            if (entry.name.startsWith('_') || entry.name === 'api') continue;

            const subPages = await scanNextJsPagesRouter(fullPath, baseDir);
            pages.push(...subPages);
        } else if (entry.name.match(/\.(tsx|jsx|ts|js)$/)) {
            // Skip _app, _document, etc.
            if (entry.name.startsWith('_')) continue;

            const relativePath = path.relative(baseDir, fullPath);
            let route = '/' + relativePath
                .replace(/\\/g, '/')
                .replace(/\.(tsx|jsx|ts|js)$/, '')
                .replace(/\/index$/, '')
                .replace(/\[([^\]]+)\]/g, ':$1');

            if (route === '') route = '/';

            pages.push({
                route,
                filePath: fullPath,
                isDynamic: relativePath.includes('[')
            });
        }
    }

    return pages;
}

async function detectReactRouterPages(basePath: string): Promise<PageInfo[]> {
    // For React Router, we'd need to parse the router config
    // This is a simplified version that looks for common patterns
    const pages: PageInfo[] = [];

    const srcPath = await dirExists(path.join(basePath, 'src'))
        ? path.join(basePath, 'src')
        : basePath;

    // Look for pages/views/routes directories
    const pageDirs = ['pages', 'views', 'routes', 'screens'];

    for (const pageDir of pageDirs) {
        const dir = path.join(srcPath, pageDir);
        if (await dirExists(dir)) {
            const files = await scanDirectory(dir);
            for (const file of files) {
                if (file.match(/\.(tsx|jsx)$/)) {
                    const relativePath = path.relative(dir, file);
                    const route = '/' + relativePath
                        .replace(/\\/g, '/')
                        .replace(/\.(tsx|jsx)$/, '')
                        .replace(/\/index$/, '')
                        .replace(/([A-Z])/g, (m) => '-' + m.toLowerCase())
                        .replace(/^-/, '');

                    pages.push({
                        route,
                        filePath: file,
                        isDynamic: false
                    });
                }
            }
        }
    }

    return pages;
}

async function detectVuePages(basePath: string): Promise<PageInfo[]> {
    const pages: PageInfo[] = [];

    const srcPath = await dirExists(path.join(basePath, 'src'))
        ? path.join(basePath, 'src')
        : basePath;

    // Look for pages/views directories (common in Vue)
    const pageDirs = ['pages', 'views'];

    for (const pageDir of pageDirs) {
        const dir = path.join(srcPath, pageDir);
        if (await dirExists(dir)) {
            const files = await scanDirectory(dir);
            for (const file of files) {
                if (file.endsWith('.vue')) {
                    const relativePath = path.relative(dir, file);
                    const route = '/' + relativePath
                        .replace(/\\/g, '/')
                        .replace(/\.vue$/, '')
                        .replace(/\/index$/, '');

                    pages.push({
                        route,
                        filePath: file,
                        isDynamic: relativePath.includes('[') || relativePath.includes('_')
                    });
                }
            }
        }
    }

    return pages;
}

async function dirExists(dirPath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(dirPath);
        return stat.isDirectory();
    } catch {
        return false;
    }
}

async function scanDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const subFiles = await scanDirectory(fullPath);
            files.push(...subFiles);
        } else {
            files.push(fullPath);
        }
    }

    return files;
}
