'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle, Terminal, Activity, FileText } from 'lucide-react';

export default function RunDetailsClient() {
    const params = useParams();
    const runId = params.runId;
    const projectId = params.id;

    const [run, setRun] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!runId) return;
        fetch(`http://localhost:4000/api/runs/${runId}`)
            .then(res => res.json())
            .then(data => {
                setRun(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [runId]);

    if (loading) return <div className="container"><p className="text-muted">Loading run details...</p></div>;
    if (!run) return <div className="container"><p className="text-danger">Run not found.</p></div>;

    const report = run.report_json || {};
    const failures = report.failures || [];
    const stats = report.stats || {};
    const rawOutput = report.rawOutput || '';

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <Link href={`/projects/${projectId}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                    <ArrowLeft size={16} /> Back to History
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            Run Analysis
                            {run.status === 'success' ? (
                                <span className="badge badge-success" style={{ fontSize: '1rem', padding: '0.25rem 0.75rem' }}>PASS</span>
                            ) : (
                                <span className="badge badge-failure" style={{ fontSize: '1rem', padding: '0.25rem 0.75rem' }}>FAIL</span>
                            )}
                        </h1>
                        <p className="subheading" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> {new Date(run.timestamp).toLocaleString()}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={16} /> {stats.total || 0} Endpoints Scanned
                            </span>
                        </p>
                    </div>
                </div>
            </header>

            {/* AI Analysis Section */}
            {failures.length > 0 && (
                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '0.25rem', borderRadius: '0.25rem', color: '#000' }}>
                            <Terminal size={16} />
                        </div>
                        AI Failure Insights
                    </h2>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {failures.map((fail: any, idx: number) => (
                            <div key={idx} className="card" style={{ borderLeft: `4px solid ${fail.severity === 'Critical' ? 'var(--danger-text)' : 'var(--warning-text)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>{fail.summary}</h3>
                                    <span className="badge" style={{
                                        backgroundColor: fail.severity === 'Critical' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                                        color: fail.severity === 'Critical' ? 'var(--danger-text)' : 'var(--warning-text)',
                                        border: `1px solid ${fail.severity === 'Critical' ? 'var(--danger-border)' : 'var(--warning-border)'}`
                                    }}>
                                        {fail.severity.toUpperCase()}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Root Cause</label>
                                        <p style={{ margin: 0, lineHeight: 1.5 }}>{fail.rootCause}</p>
                                    </div>
                                    <div style={{ background: 'rgba(16, 42, 34, 0.2)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--success-border)' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success-text)' }}>Recommendation</label>
                                        <code style={{ margin: 0, lineHeight: 1.5, color: 'var(--success-text)', fontSize: '0.9rem' }}>{fail.recommendation}</code>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Raw Logs Section */}
            <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <FileText size={18} /> Raw Execution Log
                </h2>
                <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#000' }}>
                    <pre style={{ margin: 0, padding: '1.5rem', overflowX: 'auto', color: '#d4d4d4', fontSize: '0.85rem', lineHeight: '1.5' }}>
                        {rawOutput || 'No output log available.'}
                    </pre>
                </div>
            </section>
        </div>
    );
}
