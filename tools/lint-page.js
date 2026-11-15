// Lints the scripts inside app.html (index.html is built from it by build.py) (D-LINT-01; secure development standard, 15 November 2026).
// Each page's classic scripts share one global scope, so they are joined and linted as one. Any finding fails.
// Allowed on purpose: empty catch blocks (storage and optional features fail closed and silently), unused catch
// bindings, names starting with "_", and the globals of the vendored Microsoft Teams SDK, QRCode.js and JsBarcode (every use is guarded). The vendored SDK file
// itself is not ours to edit, so it is not linted.
// Self-test first: a duplicate object key and an undefined name must both be reported.
// Run: node tools/lint-page.js [page.html ...]
const fs = require("fs");
const {ESLint} = require("eslint");
const js = require("@eslint/js");
const globals = require("globals");

const eslint = new ESLint({overrideConfigFile: true, overrideConfig: [js.configs.recommended, {
  languageOptions: {ecmaVersion: 2024, sourceType: "script", globals: {...globals.browser, microsoftTeams: "readonly", QRCode: "readonly", JsBarcode: "readonly"}},
  rules: {"no-empty": ["error", {allowEmptyCatch: true}], "no-unused-vars": ["error", {args: "none", caughtErrors: "none", varsIgnorePattern: "^_"}]},
}]});
const lint = async code => (await eslint.lintText(code, {filePath: "page.js"}))[0].messages;

(async () => {
  const planted = new Set((await lint("const C={a:1,a:2};console.log(C,notDefinedAnywhere);")).map(m => m.ruleId));
  if (!planted.has("no-dupe-keys") || !planted.has("no-undef")) { console.error("FAIL self-test: planted defects not caught", [...planted]); process.exit(1); }
  let failed = 0;
  for (const page of process.argv.slice(2).length ? process.argv.slice(2) : ["app.html"]) {
    const html = fs.readFileSync(page, "utf8");
    const scripts = [...html.matchAll(/<script(?![^>]*type="application\/(?:ld\+)?json)(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => s.trim());
    const code = scripts.join("\n;\n"), lines = code.split("\n");
    for (const m of await lint(code)) {
      failed++;
      console.error(`${page}:${m.line}:${m.column} ${m.ruleId} ${m.message} | ${(lines[m.line - 1] || "").slice(Math.max(0, m.column - 60), m.column + 40).trim()}`);
    }
    console.log(`${page}: ${scripts.length} script(s) linted`);
  }
  if (failed) { console.error(`FAIL ${failed} finding(s)`); process.exit(1); }
  console.log("PASS no lint findings in the pages; self-test caught a duplicate key and an undefined name");
})();
