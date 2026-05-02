import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://nextjs-app-uploads.s3.us-east-1.amazonaws.com/**"),
    ],
  },
};

export default nextConfig;
