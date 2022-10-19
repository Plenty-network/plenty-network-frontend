/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

module.exports = {
  target: "serverless",
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: "/",
        destination: "/",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/swap",
        permanent: true,
      },
    ];
  },
};
