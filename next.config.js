const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.amazonaws.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                pathname: "/**",
            },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Enable React strict mode for better development
    reactStrictMode: true,
    // Enable production source maps for better debugging
    productionBrowserSourceMaps: true,
    // Optimize fonts
    optimizeFonts: true,
    // Enable SWC minification
    swcMinify: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.(webp)$/i,
            type: "asset/resource",
        });
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": require("path").resolve(__dirname, "./src"),
            "@components": require("path").resolve(__dirname, "./src/components"),
            "@features": require("path").resolve(__dirname, "./src/features"),
            "@styles": require("path").resolve(__dirname, "./src/styles"),
            "@store": require("path").resolve(__dirname, "./src/store"),
            "@services": require("path").resolve(__dirname, "./src/services"),
            "@utils": require("path").resolve(__dirname, "./src/utils"),
            "@hooks": require("path").resolve(__dirname, "./src/hooks"),
            "@config": require("path").resolve(__dirname, "./src/config"),
            "@lib": require("path").resolve(__dirname, "./src/lib"),
            "@providers": require("path").resolve(__dirname, "./src/providers")
        };
        return config;
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

module.exports = withBundleAnalyzer(nextConfig);
