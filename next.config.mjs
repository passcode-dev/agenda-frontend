/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Rota no frontend
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api:path*`, // URL do backend
            },
        ];
    },
};

export default nextConfig;
