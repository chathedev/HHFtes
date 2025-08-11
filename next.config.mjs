/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-toast', '@radix-ui/react-collapsible'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: "https",
        hostname: "az316141.cdn.laget.se",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "highcon.se",
      },
      {
        protocol: "https",
        hostname: "az729104.cdn.laget.se",
      },
      {
        protocol: "https",
        hostname: "westerlinds.nu",
      },
      {
        protocol: "https",
        hostname: "d3sjey3kqst1or.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "files.builder.misssite.com",
      },
    ],
  },
  poweredByHeader: false,
  compress: true,
}

export default nextConfig