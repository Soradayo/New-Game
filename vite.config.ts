import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ["node_modules/**", "dist/**", "tests/**"],
  },
} satisfies UserConfig);
