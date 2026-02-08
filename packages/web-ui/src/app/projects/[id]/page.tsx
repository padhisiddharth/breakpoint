import ProjectRunsClient from './ProjectRunsClient';

// Dummy params for static export
export function generateStaticParams() {
    return [{ id: 'demo' }];
}

export default function ProjectRuns() {
    return <ProjectRunsClient />;
}
