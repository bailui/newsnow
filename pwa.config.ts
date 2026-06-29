import process from "node:process"
import type { VitePWAOptions } from "vite-plugin-pwa"
import { VitePWA } from "vite-plugin-pwa"

const pwaOption: Partial<VitePWAOptions> = {
  includeAssets: ["icon.svg", "apple-touch-icon.png"],
  filename: "swx.js",
  manifest: {
    name: "白鹿io · 新闻聚合",
    short_name: "白鹿新闻",
    description: "白鹿io 旗下新闻聚合 - 实时热点新闻优雅阅读",
    theme_color: "#ff5f93",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
  workbox: {
    navigateFallbackDenylist: [/^\/api/],
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    type: "module",
    navigateFallback: "index.html",
  },
}

export default function pwa() {
  return VitePWA(pwaOption)
}
