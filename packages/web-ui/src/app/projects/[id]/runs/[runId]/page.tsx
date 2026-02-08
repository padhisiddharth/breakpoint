import RunDetailsClient from './RunDetailsClient';

// Dummy params for static export
export function generateStaticParams() {
    return [{ id: 'demo', runId: 'demo-run' }];
}

export default function RunDetails() {
    return <RunDetailsClient />;
}
