/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'covers.openlibrary.org'
            }
        ],
    },
  };
  
export default nextConfig;