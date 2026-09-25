import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /projects was folded into the home page; keep the old URL working.
  async redirects() {
    return [{ source: "/projects", destination: "/", permanent: true }];
  },
};

export default nextConfig;
