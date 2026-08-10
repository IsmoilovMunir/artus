import type { NextConfig } from "next";

function remoteImagePattern() {
  const raw = process.env.MINIO_PUBLIC_URL || "http://localhost:9000";
  const url = new URL(raw);
  return {
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: url.port || undefined,
    pathname: "/**" as const,
  };
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [remoteImagePattern()],
  },
};

export default nextConfig;
