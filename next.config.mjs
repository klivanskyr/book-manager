/** @type {import('next').NextConfig} */
const nextConfig = {
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
                destination: '/explore',
                permanent: true,
            }
        ]
    },
    images: {
        remotePatterns: [
            {
                hostname: 'covers.openlibrary.org'
            }
        ],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    }
};


export default nextConfig;