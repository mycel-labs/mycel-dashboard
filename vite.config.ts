import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import react from "@vitejs/plugin-react";
import vitePluginVercelApi from "vite-plugin-vercel-api";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodeResolve(), react(), vitePluginVercelApi()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
