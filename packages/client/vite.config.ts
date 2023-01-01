/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": "http://localhost:8080",
      "/socket.io": {
        target: "ws://localhost:8080",
        ws: true,
      },
    },
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin({
      exportAsDefault: true,
    }),
    visualizer(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/setupTests.ts"],
    },
  },
});
