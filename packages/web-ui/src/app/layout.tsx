
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppShell from '../components/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Breakpoint Dashboard',
  description: 'Centralized Test Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
