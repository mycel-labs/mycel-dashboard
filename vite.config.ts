import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import { fileURLToPath, URL } from "url";
import vitePluginVercelApi from "vite-plugin-vercel-api";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react(), vitePluginVercelApi()],
  resolve: {
    alias: [{ find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) }],
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
