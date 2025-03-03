import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:4000',
  //       secure: false,
  //     },
  //   },
  // },
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx"],
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
  },
  plugins: [react()],
  base: "/lumens/",
});
