import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.usernames.app-backend.toolsforhumanity.com',
      },
    ],
    // Allow larger SVG files
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1080, 1350],
    formats: ['image/webp', 'image/avif'],
  },
  allowedDevOrigins: ['*'], // Add your dev origin here
  reactStrictMode: false,
  // Simpler webpack config to avoid TailwindCSS conflicts
  webpack(config) {
    return config;
  },
};

export default nextConfig;
