import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        // target: "https: //api.flamendough.com",
        changeOrigin: true,
      //  rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // eslint-disable-next-line no-dupe-keys
  // plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
});