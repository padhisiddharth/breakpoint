
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Server, Shield, Database, ExternalLink, Plus, Trash2, Key, Copy, AlertTriangle, CheckCircle } from 'lucide-react';

export default function GlobalSettings() {
    const [stats, setStats] = useState<any>(null);
    const [keys, setKeys] = useState<any[]>([]);
    const [loadingKeys, setLoadingKeys] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<{ keyId: string, apiKey: string } | null>(null);

    useEffect(() => {
        // reuse dashboard stats for system info
        fetch('http://localhost:4000/api/dashboard/stats')
            .then(res => res.json())
            .then(setStats)
            .catch(console.error);

        fetchKeys();
    }, []);

    const fetchKeys = () => {
        setLoadingKeys(true);
        fetch('http://localhost:4000/api/apikeys')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setKeys(data);
                } else {
                    console.error('Expected array of keys, but got:', data);
                    setKeys([]);
                }
                setLoadingKeys(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingKeys(false);
            });
    };

    const handleGenerate = () => {
        fetch('http://localhost:4000/api/apikeys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newKeyName || 'New Key' })
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    console.error('Failed to generate key:', data);
                    alert('Error generating key: ' + (data.error || 'Unknown error'));
                    return;
                }
                console.log('Generated Key Response:', data);
                if (!data.apiKey) {
                    alert('Error: Server returned success but no API Key. Check server logs.');
                    return;
                }
                setGeneratedKey(data);
                fetchKeys(); // Refresh list
            })
            .catch(err => {
                console.error('Network/Server Error:', err);
                alert('Failed to connect to server.');
            });
    };

    const handleRevoke = (id: string) => {
        if (!confirm('Are you sure you want to revoke this key? Integration will stop working immediately.')) return;
        fetch(`http://localhost:4000/api/apikeys/${id}`, { method: 'DELETE' })
            .then(() => fetchKeys());
    };

    const copyToClipboard = () => {
        if (generatedKey) {
            navigator.clipboard.writeText(generatedKey.apiKey);
            alert('Copied to clipboard!');
        }
    };


    return (
        <div className="container">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 className="heading">Global Settings</h1>
                <p className="subheading">System Configuration & Status</p>
            </header>

            <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px' }}>

                {/* System Status Card */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Server size={20} color="var(--accent-primary)" /> System Status
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-default)' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Backend Server</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--success-text)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-text)' }}></div>
                                Online (Port 4000)
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-default)' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Database</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                <Database size={14} /> SQLite
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-default)' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>AI Model</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                <Shield size={14} /> OpenAI GPT-4o
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appearance Placeholder */}
                <div className="card" style={{ opacity: 0.7 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Appearance</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '0.5rem', border: '1px solid var(--border-default)' }}>
                        <div>
                            <span style={{ fontWeight: 500 }}>Dark Mode</span>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Synced with system preference</p>
                        </div>
                        <div style={{ background: 'var(--accent-primary)', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                            ACTIVE
                        </div>
                    </div>
                </div>


                {/* API Key Management */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-default)', paddingBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>API Access Keys</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage global access keys for CI/CD and CLI integration.</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => { setShowModal(true); setGeneratedKey(null); setNewKeyName(''); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={16} /> Generate New Key
                        </button>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Prefix</th>
                                <th>Created</th>
                                <th>Last Used</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keys.map((key: any) => (
                                <tr key={key.id}>
                                    <td style={{ fontWeight: 500 }}>{key.name || 'Unnamed'}</td>
                                    <td><code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', color: 'var(--accent-primary)' }}>{key.prefix}...</code></td>
                                    <td style={{ fontSize: '0.875rem' }}>{new Date(key.created_at).toLocaleDateString()}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : <span className="text-muted">Never</span>}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleRevoke(key.id)} className="btn" style={{ color: 'var(--danger-text)', border: '1px solid var(--danger-border)', background: 'rgba(63, 29, 29, 0.2)', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                                            <Trash2 size={14} style={{ marginRight: '0.25rem', verticalAlign: 'text-bottom' }} /> Revoke
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {keys.length === 0 && !loadingKeys && (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No active keys found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)', zIndex: 100 }}>
                        <div className="card" style={{ width: '450px', maxWidth: '90%', border: '1px solid var(--border-default)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                            {!generatedKey ? (
                                <>
                                    <h3 style={{ marginTop: 0, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Generate API Key</h3>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Key Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. CI Pipeline"
                                            className="card"
                                            style={{ width: '100%', padding: '0.75rem', color: 'var(--text-primary)', background: 'var(--bg-primary)', border: '1px solid var(--border-default)', outline: 'none' }}
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                        <button className="btn" onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>Cancel</button>
                                        <button className="btn btn-primary" onClick={handleGenerate}>Generate</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(16, 42, 34, 1)', marginBottom: '1rem' }}>
                                            <CheckCircle size={32} color="var(--success-text)" />
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--success-text)' }}>Key Generated Successfully</h3>
                                    </div>

                                    <div style={{ background: '#000', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Key size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                                        <code style={{ wordBreak: 'break-all', fontSize: '0.9rem', color: 'var(--accent-primary)', flex: 1 }}>{generatedKey.apiKey}</code>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', alignItems: 'start', backgroundColor: 'var(--warning-bg)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--warning-border)' }}>
                                        <AlertTriangle size={18} color="var(--warning-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span style={{ color: 'var(--warning-text)', fontSize: '0.875rem' }}>Copy this key now. It will never be shown again.</span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                        <button className="btn btn-primary" onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Copy size={16} /> Copy to Clipboard
                                        </button>
                                        <button className="btn" onClick={() => setShowModal(false)} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}>Close</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Projects</h2>
                    <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>View your test projects and run history.</p>

                    <Link href="/projects" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ExternalLink size={16} /> Go to Projects
                    </Link>
                </div>

            </div>
        </div>
    );
}
