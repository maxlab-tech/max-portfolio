import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  assetPrefix: isGithubPages ? "/max-portfolio" : "",
  basePath: isGithubPages ? "/max-portfolio" : "",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["gsap", "three"],
  },
  webpack: (config, { isServer }) => {
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
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
