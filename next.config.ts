import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Cloudflare Pages用に画像最適化を無効化
  },
  // Trailing slashを追加（Cloudflare Pagesでの挙動を安定化）
  trailingSlash: true,
};

export default nextConfig;
