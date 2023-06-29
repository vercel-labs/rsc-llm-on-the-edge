/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        has: [
          {
            type: "header",
            key: "User-Agent",
            value: "(.*)Twitterbot(.*)",
          },
        ],
        destination: "/twitter",
      },
    ];
  },
};

module.exports = nextConfig;
