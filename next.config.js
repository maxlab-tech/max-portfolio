/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  assetPrefix: isGithubPages ? '/max-portfolio' : '',
  basePath: isGithubPages ? '/max-portfolio' : '',
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["gsap", "@react-three/fiber", "@react-three/drei", "three"],
  },
  webpack: (config, { isServer }) => {
    // Fix for Three.js modules
    config.resolve.alias = {
      ...config.resolve.alias,
      three: "three",
    };
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    return config;
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "origin-when-cross-origin" },
      ],
    },
    {
      source: "/:path*.(js|css|woff|woff2)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

module.exports = nextConfig;