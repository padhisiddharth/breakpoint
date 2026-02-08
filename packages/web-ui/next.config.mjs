/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true
    },
    // If deploying to a subpath (e.g. username.github.io/repo), set basePath here:
    basePath: process.env.NODE_ENV === 'production' ? '/breakpoint' : undefined,
};

export default nextConfig;
