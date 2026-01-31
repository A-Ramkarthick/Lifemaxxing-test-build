import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ['gaezssvfnzlfjykkotrx.supabase.co'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/signin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
