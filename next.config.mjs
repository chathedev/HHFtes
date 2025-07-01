/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "az316141.cdn.laget.se",
      "i.ibb.co",
      "images.unsplash.com",
      "source.unsplash.com",
      "via.placeholder.com",
      "placehold.co",
      "picsum.photos"
    ],
    unoptimized: true,
  }
};

export default nextConfig;
