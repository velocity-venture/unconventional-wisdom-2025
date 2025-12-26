// =============================================================================
// NEXT.JS CONFIGURATION
// Z2Q Initiative | Unconventional Wisdom Academy | Sayada.ai
// Production URL: https://uw.sayada.ai/z2q
// =============================================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ==========================================================================
  // BASE PATH CONFIGURATION
  // Deploys to: https://uw.sayada.ai/z2q
  // ==========================================================================
  
  // All routes will be prefixed with /z2q
  // Example: /dashboard → /z2q/dashboard
  // Example: /api/tutor → /z2q/api/tutor
  basePath: '/z2q',
  
  // Static assets (CSS, JS, images) will load from /z2q/_next/...
  // This ensures proper asset loading when deployed under a subpath
  assetPrefix: '/z2q',

  // ==========================================================================
  // TRAILING SLASHES
  // Consistent URL structure
  // ==========================================================================
  trailingSlash: false,

  // ==========================================================================
  // IMAGE OPTIMIZATION
  // ==========================================================================
  images: {
    // Allow images from these domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uw.sayada.ai',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'sayada.ai',
      },
    ],
    // Unoptimized for static export compatibility (if needed)
    unoptimized: false,
  },

  // ==========================================================================
  // ENVIRONMENT VARIABLES (exposed to browser)
  // ==========================================================================
  env: {
    // Base URL (Cloudflare proxied subdomain)
    NEXT_PUBLIC_BASE_URL: 'https://uw.sayada.ai',
    // Full app URL including basePath
    NEXT_PUBLIC_APP_URL: 'https://uw.sayada.ai',
  },

  // ==========================================================================
  // HEADERS
  // Security headers and Cloudflare compatibility
  // ==========================================================================
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // CORS headers for API routes (Cloudflare compatibility)
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://uw.sayada.ai',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, stripe-signature',
          },
        ],
      },
    ];
  },

  // ==========================================================================
  // REDIRECTS
  // ==========================================================================
  async redirects() {
    return [
      // Redirect bare /z2q to landing page (handled by index)
      // Add legacy redirects here if migrating from old domain
    ];
  },

  // ==========================================================================
  // WEBPACK CONFIGURATION
  // ==========================================================================
  webpack: (config, { isServer }) => {
    // Ensure stripe package works correctly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
      };
    }
    return config;
  },

  // ==========================================================================
  // EXPERIMENTAL FEATURES
  // ==========================================================================
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['uw.sayada.ai', 'localhost:3000'],
    },
  },

  // ==========================================================================
  // OUTPUT CONFIGURATION
  // ==========================================================================
  // Use 'standalone' for Docker/self-hosted deployments
  // output: 'standalone',
  
  // Disable x-powered-by header
  poweredByHeader: false,
};

module.exports = nextConfig;
