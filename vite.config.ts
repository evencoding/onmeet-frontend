import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }): UserConfig => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  optimizeDeps: {
    include: [
      "lucide-react",
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "framer-motion",
    ],
  },
  build: {
    outDir: "dist/spa",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          query: ["@tanstack/react-query"],
          livekit: ["livekit-client", "@livekit/components-react"],
          editor: [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-color",
            "@tiptap/extension-highlight",
            "@tiptap/extension-text-align",
          ],
          firebase: ["firebase/app", "firebase/analytics"],
          charts: ["recharts"],
          motion: ["framer-motion"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: "esbuild",
  },
  esbuild: {
    drop: mode === "production" ? ["debugger"] : [],
    pure: mode === "production" ? ["console.debug"] : [],
  },
  plugins: [
    react(),
    cloudflare() as any,
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /^\/auth/, /^\/notification/, /^\/video/],
        importScripts: ["/firebase-messaging-sw.js"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.onmeet\.cloud\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
          },
        ],
      },
      manifest: {
        name: "OnMeet",
        short_name: "OnMeet",
        description: "팀을 위한 AI 화상 회의 플랫폼",
        theme_color: "#7c3aed",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
    mode === "analyze" &&
      visualizer({
        open: true,
        filename: "dist/bundle-report.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
}));
