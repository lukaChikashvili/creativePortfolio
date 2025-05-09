/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'rawcdn.githack.com',
            }
        ]
    }
};

export default nextConfig;
