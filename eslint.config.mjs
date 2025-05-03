import js from "@eslint/js";
import globals from "globals";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
//import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Node_modules mappa kizárása
  {
    ignores: ["node_modules", "src/script.js", "olds"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    //plugins: { js, prettier },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "prefer-const": "warn",
      "no-unused-vars": "warn",
      "eqeqeq": ["warn", "always"]
      //"prettier/prettier": "warn"
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
]);
