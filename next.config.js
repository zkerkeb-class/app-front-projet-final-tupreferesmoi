/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    images: {
        domains: [
            "i.scdn.co",
            "mosaic.scdn.co",
            "wrapped-images.spotifycdn.com",
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:3000/api/:path*",
            },
        ];
    },
};

module.exports = nextConfig;
