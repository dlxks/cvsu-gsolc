/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true, // supported in Next.js 16
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint on `next build`
  },
};

module.exports = nextConfig;
