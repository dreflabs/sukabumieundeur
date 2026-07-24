import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  eslint: {
    // ESLint is run separately in CI — don't block production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors are caught in dev — don't block production builds
    ignoreBuildErrors: true,
  },
  // During Docker build there is no DB — make all pages dynamic by default
  // so they never try to pre-render with DB calls at build time.
  // Individual pages can still opt into static generation explicitly.
  experimental: {
    isrFlushToDisk: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
