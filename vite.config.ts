import { defineConfig } from "vite";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import legacy from "vite-plugin-legacy-swc";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({}),
    TanStackRouterVite(),
    legacy({
      targets: ["chrome 76"],
    }),
    viteSingleFile(),
  ],
  build: {
    target: "es5",
  },
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
