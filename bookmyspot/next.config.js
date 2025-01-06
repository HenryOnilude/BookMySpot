/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };

    return config;
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.tile.openstreetmap.org',
      },
      {
        protocol: 'https',
        hostname: 'nominatim.openstreetmap.org',
      }
    ],
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' blob: data: https://*.tile.openstreetmap.org https://nominatim.openstreetmap.org https://*.stripe.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "frame-src 'self' https://*.stripe.com https://js.stripe.com",
              "connect-src 'self' https://*.tile.openstreetmap.org https://nominatim.openstreetmap.org https://*.stripe.com https://api.stripe.com",
              "font-src 'self' data:",
              "worker-src 'self' blob:",
            ].join('; ')
          }
        ],
      },
    ];
  },
}

module.exports = nextConfig;