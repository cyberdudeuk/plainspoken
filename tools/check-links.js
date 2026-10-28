// Weekly maintenance check: every external link in the app's Sources and Credits still resolves,
// and the public-sector rules have been re-checked within 90 days. Exit code 1 = action needed.
const fs = require("fs"), path = require("path");
const app = fs.readFileSync(path.join(__dirname, "..", "app.html"), "utf8");
const urls = [...new Set([...app.matchAll(/"(https:\/\/[^"\s]+)"/g)].map(m => m[1]).filter(u => !/fonts\.g|cdnjs|cyberdudeuk|claude\.ai/.test(u)))];
const checked = (app.match(/const RULES_CHECKED = "(\d{4}-\d{2}-\d{2})"/) || [])[1];
const age = Math.round((Date.now() - Date.parse(checked + "T00:00:00Z")) / 864e5);
(async () => {
  // Own-repo links are excluded (they 404 until the repo is public). Sites that block automated
  // requests (401/403/429/503) are retried once and reported as "unverified", not broken (defect D11).
  const bad = [], unverified = [];
  const get = u => fetch(u, { method: "GET", redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (Plainspoken link check)" }, signal: AbortSignal.timeout(20000) });
  for (const u of urls) {
    let st; try { st = (await get(u)).status; } catch (e) { st = "ERR"; }
    if (st === "ERR" || [401, 403, 429, 500, 502, 503, 504].includes(st)) { await new Promise(r => setTimeout(r, 3000)); try { st = (await get(u)).status; } catch (e) { st = "ERR"; } }
    if ([401, 403, 429, 503].includes(st)) unverified.push(`${st} ${u}`); else if (st === "ERR" || st >= 400) bad.push(`${st} ${u}`);
  }
  console.log(`Checked ${urls.length} links; ${bad.length} broken; ${unverified.length} unverified (site blocks automated checks).`);
  bad.forEach(b => console.log("BROKEN " + b)); unverified.forEach(b => console.log("UNVERIFIED " + b));
  console.log(`Public-sector rules last checked ${checked} (${age} days ago).`);
  const stale = age > 90; if (stale) console.log("STALE rules: re-check speaking, pre-election and committee guidance, then update RULES_CHECKED.");
  process.exitCode = (bad.length || stale) ? 1 : 0;
})();
