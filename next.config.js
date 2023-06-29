/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  rewrites: {
    source: "/:path*",
    has: [
      {
        type: "header",
        key: "User-Agent",
        value: "Twitterbot",
      },
    ],
    destination: "/twitter",
  },
};

module.exports = nextConfig;
