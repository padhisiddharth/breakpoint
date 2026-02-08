
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Folder, Play, Settings, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:4000/api/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container"><p className="text-muted">Loading projects...</p></div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="heading">Projects</h1>
                    <p className="subheading">Manage your test suites</p>
                </div>
                <button className="btn btn-primary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                    + New Project (Use CLI)
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {projects.map((project: any) => (
                    <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '0.375rem' }}>
                                    <Folder size={20} color="var(--accent-primary)" />
                                </div>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{project.name}</h2>
                            </div>
                            <Link href={`/projects/${project.id}/settings`}>
                                <Settings size={18} color="var(--text-secondary)" />
                            </Link>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Clock size={14} />
                                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <Link href={`/projects/${project.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    <Play size={16} /> View Runs
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="card" style={{ gridColumn: '1 / -1', borderStyle: 'dashed', textAlign: 'center', padding: '4rem' }}>
                        <Folder size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Projects Yet</h3>
                        <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                            Get started by running the CLI in your project directory.
                        </p>
                        <code style={{ background: '#000', padding: '0.5rem 1rem', borderRadius: '0.375rem', color: 'var(--accent-primary)' }}>
                            breakpoint init
                        </code>
                    </div>
                )}
            </div>
        </div>
    );
}
