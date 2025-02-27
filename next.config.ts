import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  mages: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
