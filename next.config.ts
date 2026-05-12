import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,

  // تعطيل الخاصية بالكامل
  devIndicators: false, 
};

export default nextConfig;
