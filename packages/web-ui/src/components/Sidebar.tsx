
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Folder, FileText, Key, Settings, BarChart2 } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    const linkStyle = (active: boolean) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        marginBottom: '0.5rem',
        borderRadius: '0.5rem',
        color: active ? 'white' : 'var(--muted)',
        backgroundColor: active ? 'var(--primary)' : 'transparent',
        textDecoration: 'none',
        fontWeight: 500
    });

    return (
        <aside style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-default)', height: '100vh', padding: '1.5rem', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
                    <BarChart2 color="var(--accent-primary)" />
                    <span>AI Test Engineer</span>
                </h1>
            </div>

            <nav style={{ flex: 1 }}>
                <Link href="/dashboard" style={linkStyle(isActive('/dashboard'))}>
                    <Home size={18} /> Dashboard
                </Link>
                <Link href="/projects" style={linkStyle(isActive('/projects'))}>
                    <Folder size={18} /> Projects
                </Link>
                {/* Placeholder links for now */}
                <Link href="/reports" style={linkStyle(isActive('/reports'))}>
                    <FileText size={18} /> Reports
                </Link>
            </nav>

            <div style={{ marginTop: 'auto' }}>
                <Link href="/settings" style={linkStyle(isActive('/settings'))}>
                    <Settings size={18} /> Settings
                </Link>
            </div>
        </aside>
    );
}
