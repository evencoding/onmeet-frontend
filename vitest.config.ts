import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "client/__tests__/setup.ts",
    include: ["client/**/*.{test,spec}.{ts,tsx}"],
  },
});
