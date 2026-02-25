import type { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mfxqxyqtbfolsyqmnbyv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'hfzwowomsvrllqetjzei.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'maproduction.ae',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },

  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default withBundleAnalyzer(nextConfig);
