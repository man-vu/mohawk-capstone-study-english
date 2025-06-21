import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "tsx",
    include: /\.[jt]sx?$/,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [
      ...configDefaults.exclude,
      "server/**",
      "./server/**",
      "**/server/**",
    ],
    coverage: {
      exclude: [
        "**/server/**",
        "**/coverage-backend/**",
        "postcss.config.js",
        "tailwind.config.js",
        "loader-register.js",
      ],
    },
  },
});
