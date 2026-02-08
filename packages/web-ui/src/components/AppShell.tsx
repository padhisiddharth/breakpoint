'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLanding = pathname === '/';

    if (isLanding) {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ marginLeft: '250px', width: '100%', padding: '0' }}>
                {children}
            </main>
        </div>
    );
}
