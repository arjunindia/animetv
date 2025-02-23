import { defineConfig } from "vite";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import legacy from "vite-plugin-legacy-swc";
import { viteSingleFile } from "vite-plugin-singlefile";
import vConsolePlugin from "vite-plugin-simple-vconsole";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({}),
    TanStackRouterVite(),
    mkcert(),
    vConsolePlugin({
      enable: false,
      theme: "dark",
    }),
    legacy({
      targets: ["chrome 76"],
    }),
    viteSingleFile(),
  ],
  build: {
    target: "es5",
  },
  esbuild: {
    legalComments: "none",
  },
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
