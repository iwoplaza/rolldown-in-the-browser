import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env.NODE_DEBUG_NATIVE": '""',
  },
  optimizeDeps: {
    exclude: ["@rolldown/browser"],
  },
});
