'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Folder, Activity, AlertTriangle, Layers, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:4000/api/dashboard/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container"><p className="text-muted">Loading dashboard...</p></div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 className="heading">System Overview</h1>
                <p className="subheading">Centralized Test Intelligence</p>
            </header>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card">
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        <Folder size={16} /> Total Projects
                    </span>
                    <span style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.totalProjects}</span>
                </div>
                <div className="card">
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        <Activity size={16} /> Total Runs
                    </span>
                    <span style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.totalRuns}</span>
                </div>
                <div className="card" style={{ borderColor: stats.criticalFailures > 0 ? 'var(--danger-border)' : 'var(--border-default)' }}>
                    <span style={{ color: stats.criticalFailures > 0 ? 'var(--danger-text)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        <AlertTriangle size={16} /> Critical Failures
                    </span>
                    <span style={{ fontSize: '2.25rem', fontWeight: '700', color: stats.criticalFailures > 0 ? 'var(--danger-text)' : 'var(--text-primary)' }}>
                        {stats.criticalFailures}
                    </span>
                </div>
                <div className="card">
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        <Layers size={16} /> Active Endpoints
                    </span>
                    <span style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--text-muted)' }}>--</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Recent Runs Table */}
                <div className="card" style={{ padding: '0' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Recent Runs</h3>
                        <Link href="/projects" style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            View All Projects <ArrowRight size={14} />
                        </Link>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '100px' }}>Status</th>
                                <th>Project</th>
                                <th>Issues</th>
                                <th>Time</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentRuns.map((run: any) => (
                                <tr key={run.id}>
                                    <td>
                                        <span className={run.status === 'success' ? 'badge badge-success' : 'badge badge-failure'}>
                                            {run.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{run.project_name}</td>
                                    <td>
                                        {run.issues_found > 0 ? (
                                            <span style={{ color: 'var(--danger-text)', fontWeight: 500 }}>{run.issues_found} Issues</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>Clean</span>
                                        )}
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }} className="text-mono">
                                        {new Date(run.timestamp).toLocaleString()}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Link href={`/projects/${run.project_id}`} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentRuns.length === 0 && (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No runs recorded yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
