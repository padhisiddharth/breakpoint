'use client';

import Link from 'next/link';
import { Terminal, Shield, Zap, AlertTriangle, CheckCircle, XCircle, Code, Lock, Server, BarChart2, Activity, GitBranch, Plug } from 'lucide-react';


export default function LandingPage() {
    return (
        <div style={{ backgroundColor: '#0B0F14', minHeight: '100vh', color: '#E5E7EB', fontFamily: 'Inter, sans-serif' }}>

            {/* Navigation (Minimal) */}
            <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.125rem', color: '#fff' }}>
                    <BarChart2 color="#38BDF8" /> AI Test Engineer
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <a href="#docs" style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Docs</a>
                    <a href="https://github.com/padhisiddharth/breakpoint" target="_blank" style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>GitHub</a>
                    <Link href="/dashboard" className="btn" style={{ backgroundColor: '#1F2937', color: '#fff', border: '1px solid #374151' }}>
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #9CA3AF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Your AI writes code.<br />
                    <span style={{ color: '#38BDF8', WebkitTextFillColor: '#38BDF8' }}>We make sure it doesn’t break.</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    A CLI-first AI test engineer that runs in your repo, finds real failures, and shows results in one central dashboard.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
                    <Link href="/settings" className="btn" style={{ backgroundColor: '#38BDF8', color: '#000', fontWeight: 'bold', padding: '0.75rem 2rem', fontSize: '1rem' }}>
                        Get API Key
                    </Link>
                    <Link href="/dashboard" className="btn" style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #374151', padding: '0.75rem 2rem', fontSize: '1rem' }}>
                        View Demo
                    </Link>
                </div>

                {/* Hero Visual - Split Screen */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#111827', border: '1px solid #1F2937', borderRadius: '1rem', overflow: 'hidden', textAlign: 'left', maxWidth: '1000px', margin: '0 auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    {/* Left: Terminal */}
                    <div style={{ padding: '1.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', background: '#0D1117', borderRight: '1px solid #1F2937' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></div>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></div>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></div>
                        </div>
                        <div style={{ color: '#9CA3AF' }}>$ aitest run</div>
                        <div style={{ color: '#38BDF8', marginTop: '0.5rem' }}>✔ Scanning repository...</div>
                        <div style={{ color: '#38BDF8' }}>✔ Generating edge cases...</div>
                        <div style={{ color: '#EF4444', marginTop: '0.5rem' }}>✖ Load test failed</div>
                        <br />
                        <div style={{ color: '#F87171' }}>Reason: DB connection pool exhausted at 320 concurrent users</div>
                    </div>
                    {/* Right: Dashboard Preview */}
                    <div style={{ padding: '1.5rem', background: '#111827' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Checkout Service</span>
                            <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>FAILED</span>
                        </div>
                        <div style={{ height: '80px', background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0) 100%)', borderBottom: '1px solid #38BDF8', marginBottom: '1rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: 0, right: '20%', width: '10px', height: '60px', background: '#EF4444' }}></div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <AlertTriangle size={12} color="#F59E0B" /> <span>High Latency detected on POST /checkout</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <Server size={12} color="#EF4444" /> <span>500 Internal Server Error (Connection Limit)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Problem Section */}
            <section style={{ padding: '6rem 2rem', background: '#0D1117' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>
                        AI made shipping faster.<br />
                        <span style={{ color: '#EF4444' }}>It also made failures more expensive.</span>
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <div style={{ padding: '2rem', background: '#161B22', borderRadius: '0.5rem', border: '1px solid #30363D' }}>
                            <XCircle size={48} color="#EF4444" style={{ margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Edge cases missed</h3>
                            <p style={{ color: '#9CA3AF' }}>AI generates happy paths. It forgets about empty payloads, SQL injections, and race conditions.</p>
                        </div>
                        <div style={{ padding: '2rem', background: '#161B22', borderRadius: '0.5rem', border: '1px solid #30363D' }}>
                            <Activity size={48} color="#EF4444" style={{ margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Load never tested</h3>
                            <p style={{ color: '#9CA3AF' }}>Your code works for one user. Does it work for 1,000 parallel requests? AI doesn't check.</p>
                        </div>
                        <div style={{ padding: '2rem', background: '#161B22', borderRadius: '0.5rem', border: '1px solid #30363D' }}>
                            <AlertTriangle size={48} color="#EF4444" style={{ margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Failures in Prod</h3>
                            <p style={{ color: '#9CA3AF' }}>Finding bugs in production costs 100x more than finding them in CLI.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Solution Section - How It Works */}
            <section style={{ padding: '6rem 2rem', borderBottom: '1px solid #1F2937' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>An AI Test Engineer — built for the terminal</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Step 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ background: '#1F2937', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Run in your repo</h3>
                                <div style={{ background: '#000', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace', marginTop: '0.5rem', border: '1px solid #374151' }}>
                                    <span style={{ color: '#38BDF8' }}>$</span> aitest run
                                </div>
                            </div>
                        </div>
                        {/* Step 2 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: '3rem' }}>
                            <div style={{ background: '#1F2937', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Tests generated & executed</h3>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Edge Cases</span>
                                    <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Load Tests</span>
                                    <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Performance</span>
                                </div>
                            </div>
                        </div>
                        {/* Step 3 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: '6rem' }}>
                            <div style={{ background: '#1F2937', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Reports centralized</h3>
                                <p style={{ color: '#9CA3AF', marginTop: '0.25rem' }}>Results sent to Web Dashboard instantly. Accessible per project, per run.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. What It Actually Does */}
            <section style={{ padding: '6rem 2rem', background: '#0B0F14' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem' }}>Capabilities</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: <Zap size={24} color="#38BDF8" />, title: 'Critical Path Detection', desc: 'Automatically identifies APIs that matter most to your business.' },
                            { icon: <AlertTriangle size={24} color="#F59E0B" />, title: 'Edge Case Generation', desc: 'Finds failures humans and AI editors miss (nulls, overflows, injections).' },
                            { icon: <Activity size={24} color="#EF4444" />, title: 'Load & Traffic Simulation', desc: 'Models real concurrency, not just toy tests. Detects pool exhaustion.' },
                            { icon: <Plug size={24} color="#06B6D4" />, title: 'MCP Integration', desc: 'Model Context Protocol support — seamlessly integrates with AI coding assistants.' },
                            { icon: <GitBranch size={24} color="#8B5CF6" />, title: 'GitHub Integration', desc: 'Results posted directly on PRs to block bad deployments.' },
                            { icon: <Code size={24} color="#10B981" />, title: 'Plain-English Failure Analysis', desc: 'Explains why things broke so you can fix it fast.' }
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '1.5rem', background: '#111827', border: '1px solid #1F2937', borderRadius: '0.5rem' }}>
                                <div style={{ marginBottom: '1rem' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F3F4F6' }}>{item.title}</h3>
                                <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Security */}
            <section style={{ padding: '6rem 2rem', background: '#0D1117', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Shield size={64} color="#10B981" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Developer-grade security</h2>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.125rem', color: '#D1D5DB', lineHeight: '2' }}>
                        <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle size={20} color="#10B981" /> API key–based authentication</li>
                        <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle size={20} color="#10B981" /> Keys generated in dashboard & stored locally .env</li>
                        <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle size={20} color="#10B981" /> Repo-agnostic execution</li>
                        <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle size={20} color="#10B981" /> No source code uploaded to our servers</li>
                    </ul>
                </div>
            </section>

            {/* 7. Developer Docs Section */}
            <section id="docs" style={{ padding: '6rem 2rem', background: '#0B0F14' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Quick Start for Developers</h2>
                    <p style={{ textAlign: 'center', color: '#9CA3AF', marginBottom: '3rem' }}>Get up and running in under 2 minutes</p>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {/* Step 1: Install */}
                        <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ background: '#38BDF8', color: '#000', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Install the CLI</h3>
                            </div>
                            <div style={{ background: '#0D1117', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', border: '1px solid #30363D' }}>
                                <span style={{ color: '#9CA3AF' }}>$</span> <span style={{ color: '#38BDF8' }}>npm install -g ai-test-engineer</span>
                            </div>
                        </div>

                        {/* Step 2: Initialize */}
                        <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ background: '#38BDF8', color: '#000', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Initialize in your project</h3>
                            </div>
                            <div style={{ background: '#0D1117', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', border: '1px solid #30363D' }}>
                                <div><span style={{ color: '#9CA3AF' }}>$</span> <span style={{ color: '#38BDF8' }}>cd your-backend-project</span></div>
                                <div><span style={{ color: '#9CA3AF' }}>$</span> <span style={{ color: '#38BDF8' }}>aitest init</span></div>
                                <div style={{ marginTop: '0.5rem', color: '#6EE7B7' }}>✔ Enter your API Key: ****</div>
                                <div style={{ color: '#6EE7B7' }}>✔ Enter Project ID: checkout-service</div>
                                <div style={{ color: '#6EE7B7' }}>✔ Created aitest.config.json</div>
                            </div>
                        </div>

                        {/* Step 3: Run */}
                        <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '0.75rem', padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ background: '#38BDF8', color: '#000', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Run tests</h3>
                            </div>
                            <div style={{ background: '#0D1117', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', border: '1px solid #30363D' }}>
                                <div><span style={{ color: '#9CA3AF' }}>$</span> <span style={{ color: '#38BDF8' }}>aitest run</span></div>
                                <div style={{ marginTop: '0.5rem', color: '#9CA3AF' }}>Scanning codebase...</div>
                                <div style={{ color: '#9CA3AF' }}>Found 12 endpoints</div>
                                <div style={{ color: '#9CA3AF' }}>Generating edge case tests...</div>
                                <div style={{ color: '#6EE7B7' }}>✔ Report uploaded! Run ID: abc123</div>
                            </div>
                        </div>

                        {/* CLI Commands Reference */}
                        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: '0.75rem', padding: '2rem', marginTop: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>CLI Commands Reference</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#38BDF8', fontSize: '0.875rem' }}>aitest init</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Initialize project with API key & config</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#38BDF8', fontSize: '0.875rem' }}>aitest run</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Scan, generate, and execute tests</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#38BDF8', fontSize: '0.875rem' }}>aitest run --load</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Include load/traffic tests</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#38BDF8', fontSize: '0.875rem' }}>aitest server</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Start local dashboard server</span>
                                </div>
                            </div>
                        </div>

                        {/* Config File Example */}
                        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: '0.75rem', padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Configuration File</h3>
                            <p style={{ color: '#9CA3AF', marginBottom: '1rem', fontSize: '0.9rem' }}>aitest.config.json — customize scanner behavior</p>
                            <div style={{ background: '#0D1117', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', border: '1px solid #30363D', overflow: 'auto' }}>
                                <pre style={{ margin: 0, color: '#E5E7EB' }}>{`{
  "projectType": "express",
  "testDir": "./tests",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"],
  "projectId": "your-project-id"
}`}</pre>
                            </div>
                        </div>

                        {/* GitHub Integration */}
                        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: '0.75rem', padding: '2rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <GitBranch size={24} color="#8B5CF6" />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>GitHub Integration</h3>
                            </div>
                            <p style={{ color: '#9CA3AF', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                Automatically post test results to your Pull Requests. Block bad deployments before they ship.
                            </p>

                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#D1D5DB' }}>Setup</h4>
                            <div style={{ background: '#0D1117', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', border: '1px solid #30363D', marginBottom: '1.5rem' }}>
                                <div style={{ color: '#9CA3AF' }}># Add to your GitHub Actions workflow</div>
                                <pre style={{ margin: '0.5rem 0 0 0', color: '#E5E7EB' }}>{`- name: Run AI Test Engineer
  run: |
    npx ai-test-engineer run
  env:
    AITEST_API_KEY: \${{ secrets.AITEST_API_KEY }}
    GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`}</pre>
                            </div>

                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#D1D5DB' }}>What gets posted:</h4>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#9CA3AF', fontSize: '0.875rem', lineHeight: '1.8' }}>
                                <li>✅ Test summary with pass/fail count</li>
                                <li>⚠️ Critical failures highlighted</li>
                                <li>📊 Load test performance metrics</li>
                                <li>🔗 Direct link to full dashboard report</li>
                            </ul>
                        </div>

                        {/* MCP Integration */}
                        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: '0.75rem', padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Plug size={24} color="#06B6D4" />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>MCP Integration (Model Context Protocol)</h3>
                            </div>
                            <p style={{ color: '#9CA3AF', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                Connect AI coding assistants like Cursor, Windsurf, and others directly to our hosted MCP server.
                                All test execution happens on our infrastructure — no local setup required.
                            </p>

                            <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06B6D4', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    <Server size={16} /> GitHub-Connected Architecture
                                </div>
                                <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: 0 }}>
                                    No code upload needed! Connect your GitHub repo once → Server clones & analyzes on demand → Results streamed via SSE
                                </p>
                            </div>

                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#D1D5DB' }}>Step 1: Connect Your GitHub Repository</h4>
                            <p style={{ color: '#6B7280', marginBottom: '0.75rem', fontSize: '0.85rem' }}>In your dashboard settings, link your GitHub repo (one-time setup):</p>
                            <div style={{ background: '#0D1117', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', border: '1px solid #30363D', marginBottom: '1.5rem' }}>
                                <div style={{ color: '#6EE7B7' }}>✔ Repository connected: github.com/your-org/your-backend</div>
                                <div style={{ color: '#9CA3AF', marginTop: '0.5rem' }}>Branch: main | Last synced: 2 mins ago</div>
                            </div>

                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#D1D5DB' }}>Step 2: Configure MCP Client</h4>
                            <p style={{ color: '#6B7280', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                                Add to your MCP settings (e.g., ~/.cursor/mcp.json). <br />
                                <span style={{ color: '#F59E0B' }}>Note:</span> Replace URL with your deployed server address or localhost.
                            </p>
                            <div style={{ background: '#0D1117', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', border: '1px solid #30363D', marginBottom: '1.5rem', overflow: 'auto' }}>
                                <pre style={{ margin: 0, color: '#E5E7EB' }}>{`{
  "mcpServers": {
    "ai-test-engineer": {
      "url": "http://localhost:3000/mcp", 
      "transport": "sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`}</pre>
                            </div>

                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#D1D5DB' }}>Available MCP Tools</h4>
                            <p style={{ color: '#6B7280', marginBottom: '0.75rem', fontSize: '0.85rem' }}>Server pulls code from your connected repo — no payload size limits:</p>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#06B6D4', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>scan_repo</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Pull latest from GitHub & identify API endpoints</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#06B6D4', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>generate_tests</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Generate edge-case tests for specific endpoints</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#06B6D4', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>run_tests</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Execute tests in isolated container on our infra</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#06B6D4', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>run_load_test</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Simulate concurrent traffic from distributed nodes</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#06B6D4', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>analyze_failures</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>AI-powered root cause analysis</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <code style={{ background: '#0D1117', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#06B6D4', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>get_report</code>
                                    <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Fetch test reports by project/run ID</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0D1117', borderRadius: '0.5rem', border: '1px solid #30363D' }}>
                                <h5 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#D1D5DB' }}>How it works (no code upload!):</h5>
                                <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#9CA3AF', fontSize: '0.85rem', lineHeight: '1.8' }}>
                                    <li>AI assistant: <em>"run tests on POST /checkout"</em></li>
                                    <li>MCP server receives request with your API key</li>
                                    <li>Server clones your connected GitHub repo (cached for speed)</li>
                                    <li>Tests generated & executed in isolated Docker container</li>
                                    <li>Results streamed back via SSE in real-time</li>
                                    <li>Report saved to dashboard & summarized for AI assistant</li>
                                </ol>
                            </div>

                            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.5rem' }}>
                                <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '0.85rem' }}>💡 Why GitHub connection?</span>
                                <p style={{ color: '#9CA3AF', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
                                    Large codebases (100MB+) would timeout via MCP payload. GitHub connection lets us clone incrementally and cache — supporting repos of any size.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CTA */}
            <section style={{ padding: '6rem 2rem', background: 'linear-gradient(180deg, #111827 0%, #000 100%)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>Start testing smarter today</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '3rem', fontSize: '1.25rem' }}>No setup. No config. Runs in your repo.</p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Link href="/settings" className="btn" style={{ backgroundColor: '#38BDF8', color: '#000', fontWeight: 'bold', padding: '1rem 3rem', fontSize: '1.125rem', borderRadius: '9999px' }}>
                        Generate API Key
                    </Link>
                    <Link href="/dashboard" className="btn" style={{ marginTop: '1rem', background: 'transparent', color: '#9CA3AF', textDecoration: 'underline' }}>
                        View Demo Report
                    </Link>
                </div>
            </section>

            {/* 9. Footer */}
            <footer style={{ padding: '3rem 2rem', background: '#000', borderTop: '1px solid #1F2937', textAlign: 'center', color: '#6B7280', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                    <a href="https://github.com/padhisiddharth/breakpoint" style={{ color: '#9CA3AF' }}>GitHub</a>
                    <a href="#" style={{ color: '#9CA3AF' }}>Docs</a>
                    <a href="#" style={{ color: '#9CA3AF' }}>Devpost</a>
                </div>
                <p>Built for DevDash 2026</p>
            </footer>
        </div>
    );
}
