import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

const standalone = process.env.STANDALONE;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "style.css") return "FileManager.css";
          return assetInfo.name;
        },
      },
      // Ignore node_modules dependencies
      external: standalone
        ? []
        : (id) =>
            !id.startsWith("\0") && !id.startsWith(".") && !id.startsWith("/"),
    },
    emptyOutDir: !standalone,
    minify: false,
    lib: {
      entry: path.resolve("src/FileManager.ts"),
      name: "FileManager",
      formats: ["es"],
      fileName: () =>
        standalone ? "FileManager.standalone.js" : "FileManager.js",
    },
  },
});
