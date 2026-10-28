// Browser smoke test for the skills module and Facilitator mode (U1 in CHECKS.md).
// Run after `python3 build.py`: node tools/ui-smoke.js  (needs Playwright with Chromium; skips if absent)
let chromium; try { ({ chromium } = require("playwright")); } catch (e) { console.log("SKIP U1: Playwright not installed"); process.exit(0); }
const path = require("path");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 360, height: 780 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
  await p.goto("file://" + path.join(__dirname, "..", "index.html") + "#practise"); await p.waitForTimeout(600);
  const over = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await p.click('[data-act="ptab"][data-k="skills"]');
  ok(await p.$$eval('[data-act="skillOpen"]', a => a.length) === 13, "U1a 13 skill lessons listed");
  ok(await p.$eval(".seg", e => e.scrollWidth <= e.clientWidth), "U1b Practise tabs fit a 360px screen");
  await p.click('[data-act="skillOpen"][data-id="no"]');
  ok(await p.$eval('[data-act="skillDone"]', e => e.disabled), "U1c lesson cannot be marked done before the check");
  for (const q of [0, 1, 2]) await p.click(`[data-act="skillAns"][data-q="${q}"][data-o="1"]`);
  const xp = await p.evaluate(() => state.xp); await p.click('[data-act="skillDone"]');
  ok(await p.evaluate(x => state.xp > x && !!state.skills.no.done, xp), "U1d finishing a lesson saves it and awards resonance");
  await p.evaluate(() => { ui.libOpen = "facilitate"; go("library"); }); await p.waitForTimeout(200);
  await p.click('[data-act="rubSave"]');
  ok(await p.evaluate(() => state.rubric.length === 0), "U1e incomplete self-review is refused");
  ok(await over() <= 0, "U1f Library with Facilitator mode open has no sideways scroll at 360px (defect D16)");
  ok(errs.length === 0, "U1g no script errors (" + (errs.join("; ") || "none") + ")");
  await b.close(); console.log(fail ? `${fail} UI check(s) failed` : "All UI checks passed"); process.exitCode = fail ? 1 : 0;
})();
