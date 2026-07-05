import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export -> builds to ./out, servable from any static host (e.g. nginx).
  output: "export",
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
