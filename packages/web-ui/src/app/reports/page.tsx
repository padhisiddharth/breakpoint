'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function GlobalReports() {
    const [runs, setRuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:4000/api/runs')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRuns(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="heading" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText /> Global Report History
                </h1>
                <p className="subheading">Recent test runs across all projects</p>
            </header>

            {loading ? <p className="text-muted">Loading...</p> : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Project</th>
                                <th>Time</th>
                                <th>Endpoints Checked</th>
                                <th>Issues Found</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {runs.map((run: any) => (
                                <tr key={run.id}>
                                    <td>
                                        <span className={run.status === 'success' ? 'badge badge-success' : 'badge badge-failure'}>
                                            {run.status === 'success' ? (
                                                <><CheckCircle size={12} style={{ marginRight: '4px' }} /> PASS</>
                                            ) : (
                                                <><XCircle size={12} style={{ marginRight: '4px' }} /> FAIL</>
                                            )}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href={`/projects/${run.project_id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                                            {run.project_name || run.project_id}
                                        </Link>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={16} color="var(--text-secondary)" />
                                            <span className="text-mono" style={{ fontSize: '0.875rem' }}>{new Date(run.timestamp).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td>{run.endpoints_scanned}</td>
                                    <td>{run.issues_found > 0 ? (
                                        <b style={{ color: 'var(--danger-text)' }}>{run.issues_found} Issues</b>
                                    ) : (
                                        <span className="text-muted">0</span>
                                    )}</td>
                                    <td>
                                        <Link href={`/projects/${run.project_id}/runs/${run.id}`} className="btn" style={{ border: '1px solid var(--border-default)', fontSize: '0.75rem', padding: '0.25rem 0.75rem', display: 'inline-block', textDecoration: 'none', color: 'var(--text-primary)' }}>
                                            View Report
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {runs.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                                        No runs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
