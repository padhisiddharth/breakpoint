'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function ProjectRunsClient() {
    const params = useParams();
    const [runs, setRuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;
        fetch(`http://localhost:4000/api/projects/${params.id}/runs`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRuns(data);
                } else {
                    console.error('Expected array of runs, got:', data);
                    setRuns([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch runs:', err);
                setRuns([]);
                setLoading(false);
            });
    }, [params.id]);

    // Prepare Chart Data
    const chartData = {
        labels: runs.slice(0, 10).reverse().map((r: any) => new Date(r.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: 'Issues Found',
                data: runs.slice(0, 10).reverse().map((r: any) => r.issues_found),
                borderColor: '#F87171',
                backgroundColor: 'rgba(248, 113, 113, 0.5)',
                tension: 0.4
            },
            {
                label: 'Endpoints Scanned',
                data: runs.slice(0, 10).reverse().map((r: any) => r.endpoints_scanned),
                borderColor: '#38BDF8',
                backgroundColor: 'rgba(56, 189, 248, 0.5)',
                tension: 0.4,
                hidden: true // Hide by default to focus on failures
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: '#9CA3AF' }
            },
            title: {
                display: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#1F2937' },
                ticks: { color: '#9CA3AF' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF' }
            }
        }
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <Link href="/projects" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="heading">Run History</h1>
                        <p className="subheading" style={{ marginBottom: 0 }}>Project ID: <span className="text-mono" style={{ fontSize: '0.875rem' }}>{params.id}</span></p>
                    </div>
                    <Link href={`/projects/${params.id}/settings`} className="btn" style={{ border: '1px solid var(--border-default)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={16} /> Settings
                    </Link>
                </div>
            </header>

            {loading ? <p className="text-muted">Loading runs...</p> : (
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Performance Trend Chart */}
                    {runs.length > 1 && (
                        <div className="card">
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Issues Trend (Last 10 Runs)</h3>
                            <div style={{ height: '300px' }}>
                                <Line options={chartOptions} data={chartData} />
                            </div>
                        </div>
                    )}

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: '120px' }}>Status</th>
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Clock size={16} color="var(--text-secondary)" />
                                                <span className="text-mono" style={{ fontSize: '0.875rem' }}>{new Date(run.timestamp).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{run.endpoints_scanned}</td>
                                        <td>{run.issues_found > 0 ? (
                                            <b style={{ color: 'var(--danger-text)' }}>{run.issues_found} Issues</b>
                                        ) : (
                                            <span className="text-muted">0</span>
                                        )}</td>
                                        <td>
                                            <Link href={`/projects/${params.id}/runs/${run.id}`} className="btn" style={{ border: '1px solid var(--border-default)', fontSize: '0.75rem', padding: '0.25rem 0.75rem', display: 'inline-block', textDecoration: 'none', color: 'var(--text-primary)' }}>
                                                View Report
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {runs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                                            No runs found. Run <code className="text-mono" style={{ color: 'var(--accent-primary)' }}>breakpoint run</code> to generate data.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
