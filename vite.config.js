import { resolve } from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig(() => {
  return {
    plugins: [solidPlugin()],
    server: {
      port: 3000,
      open: true,
    },
    esbuild: {
      loader: "jsx",
    },
    babel: {
      presets: [
        ["solid", { generate: "dom", hydratable: false }],
        "@babel/preset-env",
      ],
      plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties",
        ["transform-jsx", { useVariables: true }],
      ],
      targets: "> 0.25%, not dead",
    },
    resolve: {
      alias: {
        src: resolve(__dirname, "./src"),
      },
    },
  };
});
