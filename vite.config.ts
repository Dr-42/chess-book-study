import { defineConfig } from "vite";
export default defineConfig(async () => ({
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        edit: "edit.html",
        settings: "settings.html",
      },
    },
  }
}));
