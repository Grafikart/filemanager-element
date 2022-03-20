import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    minify: false,
    lib: {
      entry: path.resolve("src/FileManager.ts"),
      name: "FileManager",
      formats: ["es"],
      fileName: () => "FileManager.js",
    },
  },
});
