// Verification checks for Plainspoken. Run: node check.js
// Each check names the defect or requirement that caused it to exist (see CHECKS.md). The suite never shrinks.
const fs = require("fs"), vm = require("vm"), path = require("path");
const rd = f => fs.readFileSync(path.join(__dirname, f), "utf8");
const app = rd("app.html"), idx = rd("index.html");
// GitHub configuration lives in .github (single source of truth since D24); repo-config/github is only a seed for copies without .github.
const ghc = p => fs.existsSync(path.join(__dirname, ".github", p)) ? ".github/" + p : "repo-config/github/" + p;
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const js = [...app.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
try { new vm.Script(js); ok(true, "C1 script parses"); } catch (e) { ok(false, "C1 script parses: " + e.message); }
const commit = (idx.match(/commit=([^"]+)"/) || [])[1] || "";
const expected = app.replace("__COMMIT__", commit).replace('<link rel="icon" type="image/svg+xml" href="data:image/svg+xml', '<link rel="alternate icon" type="image/svg+xml" href="data:image/svg+xml');
ok(idx.includes(expected), "C2 index.html is built from the current app.html (run python3 build.py)");
const v = (js.match(/const VERSION = "([\d.]+)"/) || [])[1];
ok(v && app.includes(`Plainspoken v${v}`), "C3 footer version matches VERSION");
ok(/<title>Plainspoken<\/title>/.test(app.slice(0, 8000)), "C4 title present in first 8KB");
const hosts = [...app.matchAll(/<script src="(https:\/\/[^"]+)"/g)].map(m => m[1]);
ok(hosts.length > 0 && hosts.every(h => /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/[^/]+\/\d[\d.]*\//.test(h)), "C5 scripts only from cdnjs, pinned to exact versions");
ok(/try \{ localStorage\.setItem/.test(app) && /try \{ const raw = localStorage\.getItem/.test(app), "C6 browser storage wrapped in try/catch");
ok(/\.path\{[^}]*overflow:hidden/.test(app) || /function pathView[\s\S]{0,400}<svg viewBox/.test(app), "C7 progress view cannot overflow phones (defect D2)");
ok(/case "newPassage"/.test(app) && !/data-act="ptab" data-k="drills">Another passage/.test(app), "C8 'Another passage' re-rolls the passage (defect D1)");
const ids = [...app.matchAll(/<symbol id="([^"]+)"/g)].map(m => m[1]);
const used = [...new Set([...js.matchAll(/["'(](i-[a-z]+)["')]/g)].map(m => m[1]))];
const missing = used.filter(u => !ids.includes(u));
ok(missing.length === 0, "C9 every icon used has a symbol (" + (missing.join(",") || "none missing") + ")");
ok(/© 2026 Emanuel Silva/.test(app), "C10 copyright notice present");
ok((/prefers-reduced-motion: reduce\)"\)\.matches\) return/.test(app) || (/function confetti\(\)\{[\s\S]{0,200}if \(reduceMotion\(\)\) return;/.test(app) && /function reduceMotion\(\)\{ return state\.settings\.motion==="reduce" \|\| mq\("\(prefers-reduced-motion: reduce\)"\); \}/.test(app))), "C11 celebration animation respects reduced motion (device setting or the app's own setting)");
ok(/:root\[data-theme="dark"\]/.test(app) && /prefers-color-scheme: dark/.test(app), "C12 both themes defined");
const visible = app.replace(/<script[\s\S]*?<\/script>/g, "") + js.replace(/\/\*[\s\S]*?\*\//g, "");
const banned = ["Duolingo", "Lingot", "streak freeze", "Streak freeze", "Daily quest", "League", " XP"].filter(t => new RegExp(t.replace(/ /g, "[ ]")).test(visible.replace(/XP_RULES|weekXP|\bxp\b/g, "")));
ok(banned.length === 0, "C13 no third-party product names or borrowed reward terms (" + (banned.join(", ") || "none") + ")");
const footer = (app.match(/<footer[\s\S]*?<\/footer>/) || [""])[0];
ok(/Open Government Licence v3\.0/.test((js.match(/const CREDITS = \[[\s\S]*?\];/)||[""])[0]) && /Open Government Licence v3\.0/.test(rd("THIRD_PARTY_NOTICES.md")) && !/Open Government Licence|Contains public sector information/.test(footer), "C14 cited public guidance attributed in Credits and notices only, not in the footer");
ok(/QR Code is a registered trademark of DENSO WAVE INCORPORATED/.test(app), "C15 QR Code trademark notice present");
ok(["favicon.ico", "favicon.svg", "manifest.webmanifest", "assets/apple-touch-icon.png", "assets/icon-512.png", "assets/social-card.png"].every(f => fs.existsSync(path.join(__dirname, f))) && /rel="manifest"/.test(idx) && /og:image/.test(idx), "C16 favicons, manifest and social card present and linked");
ok(commit && commit !== "__COMMIT__" && !/__COMMIT__/.test(idx), "C17 build information injected into index.html");
ok(/const CREDITS = \[/.test(app) && fs.existsSync(path.join(__dirname, "THIRD_PARTY_NOTICES.md")), "C18 credits section and third-party notices present");
const visText = app.replace(/const CREDITS = \[[\s\S]*?\];/, "");
const govBad = ["OFFICIAL-SENSITIVE","OFFICIAL SENSITIVE","SECRET","Crown copyright","Contains public sector information","your department's current route","Your department's policies"].filter(t => visText.includes(t));
ok(/Independent project\./.test(footer) && /personal capacity, outside working hours/.test(app) && govBad.length === 0, "C19 independence statement present; no classification or affiliation wording (" + (govBad.join(", ") || "none") + ")");
const lic = rd("LICENSE"), licc = rd("LICENSE-CONTENT"), readme = rd("README.md");
const fsx = f => fs.existsSync(path.join(__dirname, f));
ok(/PolyForm Noncommercial License 1\.0\.0/.test(lic) && /Required Notice: Copyright \(c\) 2026 Emanuel Silva/.test(lic) && /Attribution-NonCommercial 4\.0 International/.test(licc) && fsx("NOTICE") && fsx("TRADEMARKS.md") && /PolyForm Noncommercial/.test(app) && /CC BY-NC 4\.0/.test(app) && /PolyForm Noncommercial/.test(readme) && /CC BY-NC 4\.0/.test(readme) && !/MIT licen[cs]e\.?<\/p>|MIT \(code\)|Code under the MIT|Apache-2\.0 \(code\)|Code: Apache License|content CC BY 4\.0\)|CC BY 4\.0 \(text/.test(app + readme), "C20 licences consistent: PolyForm Noncommercial (code), CC BY-NC 4.0 (content), across LICENSE, LICENSE-CONTENT, NOTICE, app and README");
const notice = fsx("NOTICE") ? rd("NOTICE") : "";
ok(/ADDITIONAL PERMISSION/.test(notice) && /not-for-profit purpose/.test(notice) && /COMMERCIAL USE/.test(notice) && /written permission/.test(notice) && /not-for-profit/.test(readme) && /Commercial use is not permitted without written permission/.test(readme) && /commercial use needs written permission/.test(app), "C21 not-for-profit permission and commercial-use rule stated in NOTICE, README and app");
const exists = f => fs.existsSync(path.join(__dirname, f));
ok(exists("vendor/teams-js-2.58.0.min.js") && exists("vendor/LICENSE-teams-js.txt") && /const TEAMS_JS = "vendor\/teams-js-2\.58\.0\.min\.js"/.test(app) && /const IN_TEAMS = !IN_CLAUDE && HOST_PARAM === "teams"/.test(app) && !/<script src="vendor\//.test(app) && /if \(IN_TEAMS\) initTeams\(\)/.test(app), "C22 TeamsJS shipped with its licence and loaded only inside Teams, never in Claude");
ok(["teams/manifest.json","teams/manifest.tab-only.json","teams/declarativeAgent.json","teams/agent-instructions.md","tools/validate-teams.js","tools/package-teams.py","tools/schemas/teams-manifest-1.22.schema.json","tools/schemas/declarative-agent-1.6.schema.json"].every(exists), "C23 Teams and Copilot package sources, schemas and tooling present");
const pub = exists("publish.sh") ? rd("publish.sh") : "";
ok([ghc("workflows/check.yml"),ghc("workflows/maintenance.yml"),ghc("workflows/release.yml"),ghc("dependabot.yml"),ghc("CODEOWNERS"),ghc("PULL_REQUEST_TEMPLATE.md"),ghc("ISSUE_TEMPLATE/bug.yml"),"tools/check-links.js","tools/check-config.py"].every(exists) && /cp -R repo-config\/github\/\. \.github\//.test(pub) && /branches\/main\/protection/.test(pub), "C24 maintenance automation present and installed by publish.sh (checks, weekly health, release, Dependabot, templates, branch protection)");
ok(["MAINTENANCE.md","DEPLOYMENT-M365.md","SECURITY.md","CONTRIBUTING.md","TERMS.md"].every(exists), "C25 operating documents present");
ok(!/des\.mod\.uk\/wp-content|civilservicecodecomplaints/.test(app) && /mail\.civilservant\.org\.uk\/library\/2018-success_profiles\/CS_Behaviours_2018\.pdf/.test(app), "C26 known-dead source links replaced (defect D10)");
// v2.5: skills module, Working relationships, Facilitator mode
const grab = name => { const m = js.match(new RegExp("const " + name + " = ([\\[{][\\s\\S]*?\\n[\\]}]);")); if (!m) return null; try { return vm.runInNewContext("(" + m[1] + ")"); } catch (e) { return null; } };
const SK = grab("SKILLS"), RB = grab("RUBRIC"), RPS = (() => { const m = js.match(/const ROLEPLAYS = (\{[\s\S]*?\n\});/); try { return m ? vm.runInNewContext("(" + m[1] + ")") : null; } catch (e) { return null; } })();
const RPM = (() => { const m = js.match(/const RP_META = (\{[^\n]*\});/); try { return m ? vm.runInNewContext("(" + m[1] + ")") : null; } catch (e) { return null; } })();
const skOk = Array.isArray(SK) && SK.length === 13 && new Set(SK.map(k => k.id)).size === 13 && SK.filter(k => k.area === "core").length === 6 && SK.filter(k => k.area === "rel").length === 7
  && SK.every(k => k.title && k.aims.length === 3 && k.keys.length >= 3 && k.practice && k.quiz.length === 3 && k.quiz.every(q => q.q && q.o.length === 4 && Number.isInteger(q.a) && q.a >= 0 && q.a < 4 && q.why) && (!k.link || !k.link.rp || (RPS && RPS[k.link.rp])));
ok(skOk, "C28 skill lessons complete: 13 lessons (6 speaking, 7 relationships), 3 aims, 3 questions with 4 options and a valid answer and reason, role-play links resolve");
const oldTitles = ["Unlock Your Charisma", "First Impression Hacks", "Read People Like a Pro", "Give Tough Feedback Fast", "Handle Difficult People Smartly", "Be Likeable", "Interrupt Smoothly", "Defuse Any Conflict", "Listen Like a Leader", "Storytelling Secrets", "Confidence Wins", "Speak Up in Any Room"];
const leaked = oldTitles.filter(t => app.includes(t) || readme.includes(t));
ok(leaked.length === 0 && !/charisma/i.test(visText), "C29 source course renamed: no original course or lesson titles, no 'charisma' framing (defect D13) (" + (leaked.join(", ") || "none") + ")");
ok(Array.isArray(RB) && RB.length === 10 && RB.every(r => r.length === 6 && r.every(Boolean)) && /const RUBRIC_CORE = \["purpose","voice","listening","inclusion"\]/.test(js) && /sec\("facilitate"/.test(js) && /case "rubSave"/.test(js) && /vals\.some\(v=>!v\)/.test(js), "C30 facilitator rubric has 10 criteria x 4 levels, 4 core criteria, and a self-review that refuses incomplete scores");
const rpMissing = RPS && RPM ? Object.keys(RPS).filter(k => !RPM[k]) : ["(unparsed)"];
ok(rpMissing.length === 0, "C31 every role-play has icon and category metadata (" + (rpMissing.join(",") || "none missing") + ")");
const verStrs = [...app.matchAll(/(?:Plainspoken v|version )(\d+\.\d+)(?!\.\d)/g)].map(m => m[1]).filter(x => x !== v);
ok(verStrs.length === 0, "C32 every hard-coded version string matches VERSION (defect D14) (" + (verStrs.join(",") || "none stale") + ")");
const walk = d => fs.readdirSync(d, {withFileTypes: true}).flatMap(e => ["node_modules", ".git", "dist", "vendor"].includes(e.name) ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const workTag = walk(__dirname).filter(f => /\.(html|md|js|json|py|yml|txt|sh|webmanifest)$/.test(f) && /\bDSIT\b|dsit\.gov\.uk|\.gov\.uk>|Department for Science, Innovation/.test(fs.readFileSync(f, "utf8")) && !/check\.js$/.test(f));
ok(workTag.length === 0, "C33 no employer or work-account identifiers in the repo (defect D15) (" + (workTag.map(f => path.relative(__dirname, f)).join(", ") || "none") + ")");
ok(/\.card,details,\.table-wrap\{min-width:0;max-width:100%\}/.test(app) && /@media \(max-width:400px\)\{\.seg button\{padding:8px 7px/.test(app), "C34 wide tables scroll inside their box and the five Practise tabs fit a 360px phone (defect D16)");
const qPos = (() => { try { const f = js.match(/function rng\(seed\)\{[^\n]*\n/)[0] + js.match(/function qOrder\(id, i\)\{[^\n]*\n/)[0]; const ctx = {}; vm.runInNewContext(f + "this.qOrder = qOrder;", ctx); return SK.flatMap(k => k.quiz.map((q, i) => ctx.qOrder(k.id, i).indexOf(q.a))); } catch (e) { return []; } })();
const posMax = Math.max(0, ...[0, 1, 2, 3].map(n => qPos.filter(x => x === n).length));
ok(qPos.length === 39 && qPos.every(x => x >= 0) && posMax <= 39 * 0.4, "C35 quick-check answers are spread across positions A to D, not guessable by position (defect D17) (most common position: " + posMax + " of 39)");
ok(/"--format=%h", "--", "app.html"/.test(rd("build.py")) && /"--format=%cs", "--", "app.html"/.test(rd("build.py")) && !/rev-parse", "--short", "HEAD"|date=\{datetime\.date\.today/.test(rd("build.py")) && /fetch-depth: 0/.test(rd(ghc("workflows/check.yml"))), "C36 build stamps come from the last commit that changed app.html, so CI rebuilds match (defect D18)");
const metaCopy = (idx.match(/<meta name="copyright" content="([^"]*)"/) || [])[1] || "";
ok(/PolyForm Noncommercial 1\.0\.0/.test(metaCopy) && /CC BY-NC 4\.0/.test(metaCopy) && !/Apache|MIT|CC BY 4\.0/.test(idx.slice(0, 4000)), "C37 page metadata states the current licences (defect D19)");
ok(/gh release upload "\$GITHUB_REF_NAME" dist\/\*\.zip --clobber/.test(rd(ghc("workflows/release.yml"))), "C38 release workflow refreshes an existing release instead of failing when a tag is re-pushed (defect D20)");
// v2.6: display settings, accessibility and all-screen layout
const evalBlock = names => { const ctx = {}; let src = ""; for (const n of names){ const m = js.match(new RegExp("(?:const|function) " + n + "\\b[\\s\\S]*?\\n(?=const |function |let |/\\*)")); if (!m) return null; src += m[0] + "\n"; } try { vm.runInNewContext(src + names.map(n => `this.${n} = ${n};`).join(""), ctx); return ctx; } catch (e) { return null; } };
const D = evalBlock(["pad", "localDate", "DEFAULT", "SKINS", "BASES", "SETTING_OPTS", "cleanSettings"]);
const dataKeys = ["font","spacing","density","targets","focus","layout","rewards","motion"];
const cssMissing = D ? dataKeys.flatMap(k => D.SETTING_OPTS[k].map(o => String(o[0])).filter(v => v !== String(D.DEFAULT().settings[k]) && !(k === "motion" && v === "system")).filter(v => !app.includes(`[data-${k}="${v}"]`)).map(v => k + "=" + v)) : ["(unparsed)"];
ok(D && cssMissing.length === 0 && app.includes('[data-contrast="more"]'), "C39 every display option has a style rule (" + (cssMissing.join(", ") || "none missing") + ")");
const lum = h => { const c = h.replace("#", "").match(/../g).map(x => parseInt(x, 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const cssVar = (block, k) => (block.match(new RegExp("--" + k + ":(#[0-9a-fA-F]{6})")) || [])[1];
const lightBlock = (app.match(/:root\{\n  --bg:#eef2f1[\s\S]*?\n\}/) || [""])[0] + (app.match(/:root\{--amber:[^}]*\}/) || [""])[0];
const darkBlock = (app.match(/:root\[data-theme="dark"\]\{\n  --bg[\s\S]*?\}/) || [""])[0] + (app.match(/:root\[data-theme="dark"\]\{--amber[^}]*\}/) || [""])[0];
const lows = [];
if (D) {
  const modes = {l: ["light", 4.5], d: ["dark", 4.5], hl: ["hcLight", 7], hd: ["hcDark", 7]};
  for (const [sk, S] of Object.entries(D.SKINS)) for (const [m, [b, need]] of Object.entries(modes)) { const B = D.BASES[b], A = S[m];
    [["accent-ink on accent", A.ink, A.accent], ["accent on surface", A.accent, B.surface], ["accent on page", A.accent, B.bg], ["accent on sunk", A.accent, B.sunk], ["ink on accent-soft", B.ink, A.soft]].forEach(([n, f, g]) => { const r = ratio(f, g); if (r < need) lows.push(`${sk}/${b} ${n} ${r.toFixed(2)}`); }); }
  for (const [b, need] of [["light", 4.5], ["dark", 4.5], ["hcLight", 7], ["hcDark", 7]]) { const B = D.BASES[b]; [["ink", B.ink], ["muted", B.muted]].forEach(([n, f]) => ["surface", "bg", "sunk"].forEach(g => { const r = ratio(f, B[g]); if (r < need) lows.push(`${b} ${n} on ${g} ${r.toFixed(2)}`); })); }
  for (const [b, block] of [["light", lightBlock], ["dark", darkBlock]]) { const B = D.BASES[b]; ["good", "warn", "bad", "live", "amber", "indigo", "plum", "sky"].forEach(k => { const c = cssVar(block, k); if (!c) { lows.push(`${b} ${k} unparsed`); return; } ["surface", "bg"].forEach(g => { const r = ratio(c, B[g]); if (r < 4.5) lows.push(`${b} ${k} on ${g} ${r.toFixed(2)}`); }); }); }
  for (const b of ["hcLight", "hcDark"]) { const B = D.BASES[b]; ["good", "warn", "bad", "live", "amber", "indigo", "plum", "sky"].forEach(k => ["surface", "bg"].forEach(g => { const r = ratio(B[k], B[g]); if (r < 7) lows.push(`${b} ${k} on ${g} ${r.toFixed(2)}`); })); }
  if (cssVar(lightBlock, "bg") !== D.BASES.light.bg || cssVar(darkBlock, "bg") !== D.BASES.dark.bg) lows.push("CSS first-paint palette differs from BASES");
} else lows.push("(unparsed)");
ok(lows.length === 0, "C40 colour contrast: every skin in light, dark and both high-contrast modes meets WCAG AA (4.5:1), high contrast meets AAA (7:1), status colours included (defect D21) (" + (lows.slice(0, 6).join("; ") || "all pass") + ")");
let cleanOk = false; try { const c = D.cleanSettings({...D.DEFAULT().settings, theme: "neon", skin: "x", textSize: "999", font: "<script>", lang: "xx", myFillers: "a".repeat(500)}); cleanOk = c.theme === "system" && c.skin === "evergreen" && c.textSize === 100 && c.font === "atkinson" && c.lang === "en-GB" && c.myFillers.length === 300; } catch (e) {}
ok(cleanOk && /settings:cleanSettings\(\{\.\.\.d\.settings/.test(js), "C41 unknown or tampered settings (from imports or old versions) fall back to safe defaults");
ok(/<a class="skip" href="#view"/.test(app) && /<main id="view" tabindex="-1">/.test(app) && /id="announce" class="sr-only" aria-live="polite"/.test(app) && /R\.lang = "en-GB"/.test(js) && /document\.title = \(names\[v\]/.test(js) && /role="tablist" aria-label="Settings sections"/.test(js) && /role="tabpanel" aria-labelledby/.test(js), "C42 accessibility plumbing: skip link, focusable main, live announcements, page language, per-view titles, labelled settings tabs");
ok(/html\{font-size:var\(--fs,100%\)/.test(app) && /@media \(min-width:1024px\)\{\n  \.tabbar\{top:0;bottom:0/.test(app) && /@media \(max-height:500px\) and \(orientation:landscape\)/.test(app) && /@media \(max-width:360px\)/.test(app) && /@media \(forced-colors: active\)/.test(app) && /@media print\{/.test(app) && /@media \(max-width:440px\)\{\.top \.iconbtn \.lbl/.test(app), "C43 layouts for small phones, landscape, tablets and desktops (side rail), forced colours and print; text scales with the text-size setting");
ok(/rec\.lang = state\.settings\.lang \|\| "en-GB"/.test(js) && /softFillers\(\)\.forEach/.test(js) && /HARD_FILLERS\.concat\(softFillers\(\)\)/.test(js) && (js.match(/state\.settings\.tone==="gentle"/g) || []).length === 2 && /state\.settings\.startView/.test(js) && /state\.settings\.rewards === "off"\)\{ celebQ\.length = 0/.test(js), "C44 personal settings take effect: listening language, own filler words, coaching tone, start view, rewards hidden");
ok(/\.colophon,\.transcript,\.card p,\.card li,td\{overflow-wrap:anywhere\}/.test(app), "C45 long links and words wrap instead of widening the page at large text sizes (defect D22)");
ok(/document\.addEventListener\("keydown", e => \{\n  const t = e\.target; if \(!t \|\| t\.getAttribute\("role"\) !== "tab"/.test(js) && /"ArrowLeft","ArrowRight","Home","End"/.test(js), "C46 arrow, Home and End keys move between tabs in every tab strip (ARIA tabs pattern)");
ok(fs.existsSync(path.join(__dirname, "tools/commit.sh")) && /git reset -q index\.html[\s\S]*git commit -q "\$@"[\s\S]*python3 build\.py[\s\S]*git add index\.html/.test(rd("tools/commit.sh")) && /tools\/commit\.sh/.test(rd("MAINTENANCE.md")), "C47 sources are committed before index.html is rebuilt, so the build stamp names the source commit (defect D23)");
const wf = ["check.yml", "maintenance.yml", "release.yml"].map(f => rd(ghc("workflows/" + f))).join("\n");
const majors = re => [...wf.matchAll(re)].map(m => +m[1]);
const nodes = [...wf.matchAll(/node-version: (\d+)/g)].map(m => +m[1]);
ok(majors(/actions\/checkout@v(\d+)/g).every(v => v >= 7) && majors(/actions\/setup-node@v(\d+)/g).every(v => v >= 7) && nodes.length >= 3 && nodes.every(v => v >= 22) && /^repo-config\/$/m.test(rd(".gitignore")), "C48 one source for GitHub configuration (defect D24); workflows use current action majors and a supported Node.js LTS (defect D25)");
process.exitCode = fail ? 1 : 0; console.log(fail ? `${fail} check(s) failed` : "All checks passed");
