import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.rafacastello.com",
      },
      {
        protocol: "https",
        hostname: "rafacastello.com",
      },
    ],
  },
};

export default nextConfig;
