import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    rules: {
      "no-debugger": "error",
    },
    overrides: [
      {
        files: ["src/legacy/**"],
        rules: {
          "no-debugger": "off",
        },
      },
    ],
  },
});
