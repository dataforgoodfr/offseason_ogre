/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    build: {
      outDir: "build",
      /**
       * Source map must be turned on for Sentry integration to work properly.
       * See https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps/uploading/vite/.
       */
      sourcemap: true,
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
      /**
       * Sentry plugin must be put last.
       * See https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps/uploading/vite/.
       */
      sentryVitePlugin({
        org: "ogre",
        project: "ogre-client",
        include: "./build",
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
      }),
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
  };
});
