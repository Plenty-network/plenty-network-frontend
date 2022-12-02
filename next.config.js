/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

module.exports = {
  target: "serverless",
  images: {
    domains: [
      "https://cloudflare-ipfs.com/ipfs/",
      "https://cloudflare-ipfs.com/",
      "https://cloudflare-ipfs.com",
      "cloudflare-ipfs.com",
    ],
  },
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
