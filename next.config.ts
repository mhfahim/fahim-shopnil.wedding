import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The floating dev badge sits on top of the seal screen, which makes
  // side-by-side comparison against the reference harder than it needs to be.
  devIndicators: false,
};

export default nextConfig;
