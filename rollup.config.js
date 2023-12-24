import { babel } from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import pkg from "./package.json";
import babelConfig from "./babel.config.json";

const extensions = [".js", ".jsx"];
let paths = pkg.exports["."];

const config = {
  external: ["effector", /effector\-solid/],
  input: "src/index.js",
  output: [
    {
      file: paths.require,
      format: "cjs",
      sourcemap: false,
    },
    {
      file: paths.import,
      format: "es",
      sourcemap: false,
    },
  ],
  plugins: [
    replace({
      preventAssignment: true,
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions,
      ...babelConfig,
    }),
    nodeResolve({ extensions }),
    commonjs({ extensions }),
    terser(),
  ],
};

export default config;
