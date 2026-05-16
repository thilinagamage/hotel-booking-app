import type { NextConfig } from "next";

const bucketDomain = process.env.NEXT_PUBLIC_S3_BUCKET_DOMAIN;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: bucketDomain
      ? [{ hostname: bucketDomain, protocol: "https" }]
      : [{ hostname: "*.s3.*.amazonaws.com", protocol: "https" }],
  },
};

export default nextConfig;
