/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['bcrypt'],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin-allow-popups",
                    }
                ]
            }
        ]
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true,
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: '/login',
                destination: '/',
            }
        ];
    },
    images: {
        remotePatterns: [
            {
                hostname: 'covers.openlibrary.org'
            }
        ],
    },
  };
  
export default nextConfig;