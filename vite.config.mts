import { defineConfig } from "vite";

export default defineConfig({
  base: "/rolldown-in-the-browser",
  define: {
    "process.env.NODE_DEBUG_NATIVE": '""',
  },
  optimizeDeps: {
    exclude: ["@rolldown/browser"],
  },
});
