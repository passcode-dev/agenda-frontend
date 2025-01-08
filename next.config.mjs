/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Rota no frontend
                destination: 'http://localhost:8080/api/:path*', // URL do backend
            },
        ];
    },
};

export default nextConfig;
