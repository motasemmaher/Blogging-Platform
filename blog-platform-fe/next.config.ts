import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Improve performance with compression
  compress: true,
  
  // Enable strict React mode for better development
  reactStrictMode: true,
  
  // Improve performance with build optimizations
  swcMinify: true,
  
  // Configure headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
