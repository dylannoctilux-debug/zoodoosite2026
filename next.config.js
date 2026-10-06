/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
};
