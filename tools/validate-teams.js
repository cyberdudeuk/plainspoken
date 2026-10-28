// Validates the Teams app manifests and the Copilot declarative agent against Microsoft's
// published JSON schemas (copied into tools/schemas), plus project rules the schemas don't cover.
const fs = require("fs"), path = require("path");
const Ajv04 = require("ajv-draft-04").default; const addFormats = require("ajv-formats");
const root = path.join(__dirname, ".."); const rd = f => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const validate = (schemaFile, docFile) => { const ajv = new Ajv04({ strict: false, allErrors: true }); addFormats(ajv); const doc = rd(docFile); delete doc.$schema; const v = ajv.validate(rd("tools/schemas/" + schemaFile), doc); if (!v) console.log(JSON.stringify(ajv.errors.slice(0, 5), null, 1)); return v; };
ok(validate("teams-manifest-1.22.schema.json", "teams/manifest.json"), "T1 teams/manifest.json valid against manifest schema 1.22");
ok(validate("teams-manifest-1.22.schema.json", "teams/manifest.tab-only.json"), "T2 teams/manifest.tab-only.json valid against manifest schema 1.22");
ok(validate("declarative-agent-1.6.schema.json", "teams/declarativeAgent.json"), "T3 teams/declarativeAgent.json valid against declarative agent schema 1.6");
const m = rd("teams/manifest.json"), a = rd("teams/declarativeAgent.json"), app = fs.readFileSync(path.join(root, "app.html"), "utf8");
const ver = (app.match(/const VERSION = "([\d.]+)"/) || [])[1];
ok(m.version === ver + ".0" && rd("teams/manifest.tab-only.json").version === m.version, "T4 manifest version matches app VERSION");
ok(m.validDomains.includes("cyberdudeuk.github.io") && m.staticTabs[0].contentUrl.startsWith("https://cyberdudeuk.github.io/plainspoken/?host=teams"), "T5 tab points at the Pages site in Teams mode and its domain is declared");
ok(m.devicePermissions.includes("media"), "T6 media permission declared for the microphone");
ok(a.instructions === fs.readFileSync(path.join(root, "teams/agent-instructions.md"), "utf8").trim() && a.instructions.length <= 8000, "T7 agent instructions match agent-instructions.md and fit the 8,000-character limit");
ok(!/OFFICIAL-SENSITIVE|Crown copyright|on behalf of (the )?government/i.test(JSON.stringify(a) + JSON.stringify(m)), "T8 no government-affiliation wording in the package");
ok(["color.png", "outline.png"].every(f => fs.existsSync(path.join(root, "teams", f))), "T9 Teams icons present");
process.exitCode = fail ? 1 : 0; console.log(fail ? `${fail} Teams check(s) failed` : "All Teams checks passed");
