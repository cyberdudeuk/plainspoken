// JavaScript linter (OpenSSF warnings criterion; secure development standing rule, 15 Nov 2026).
// CI installs the pinned versions below and runs `npx eslint .`, which fails on any finding.
// eslint@9.39.5, @eslint/js@9.39.5, globals@16.5.0
import js from "@eslint/js";
import globals from "globals";

export default [
  {ignores: ["node_modules/**", "**/vendor/**", "**/*.min.js", "dist/**"]},
  js.configs.recommended,
  // The .js files are Node scripts (CommonJS); some pass callbacks into the page, so browser names are known too.
  {files: ["**/*.js", "**/*.cjs"], languageOptions: {ecmaVersion: 2024, sourceType: "commonjs", globals: {...globals.node, ...globals.browser}}},
  {files: ["**/*.mjs"], languageOptions: {ecmaVersion: 2024, sourceType: "module", globals: {...globals.node}}},
  // Unused names are errors unless they start with an underscore; unused catch bindings and empty catches are allowed.
  {rules: {"no-unused-vars": ["error", {varsIgnorePattern: "^_", argsIgnorePattern: "^_", caughtErrors: "none"}], "no-empty": ["error", {allowEmptyCatch: true}]}},
  // These scripts pass callbacks into the page (Playwright page.evaluate): inside them, names such as state and render
  // are the page's own globals, so no-undef cannot judge them here. The page itself is linted by tools/lint-page.js.
  {files: ["tools/ui-matrix.js", "tools/ui-smoke.js"], rules: {"no-undef": "off"}},
];
