// Cross-device and settings matrix (U2 in CHECKS.md). Run after `python3 build.py`: node tools/ui-matrix.js
// Needs Playwright with Chromium; skips if absent.
let chromium; try { ({ chromium } = require("playwright")); } catch (e) { console.log("SKIP U2: Playwright not installed"); process.exit(0); }
const path = require("path");
const url = "file://" + path.join(__dirname, "..", "index.html");
(async () => {
  const b = await chromium.launch(); let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
  const errs = [];
  const open = async (w, h, opts = {}) => { const ctx = await b.newContext({ viewport: { width: w, height: h }, ...opts }); const p = await ctx.newPage(); p.on("pageerror", e => errs.push(e.message)); await p.goto(url + "#today"); await p.waitForTimeout(400); return [ctx, p]; };
  const views = async p => {
    const bad = [];
    const steps = [["today"], ["prep"], ["practise", "speak"], ["practise", "skills"], ["practise", "roleplay"], ["practise", "drills"], ["practise", "exercises"], ["live"], ["progress"], ["library", "facilitate"], ["settings", "look"], ["settings", "read"], ["settings", "you"], ["settings", "practice"], ["settings", "data"]];
    for (const [v, t] of steps) {
      await p.evaluate(([v, t]) => { if (v === "practise") ui.practiseTab = t; if (v === "settings") ui.setTab = t; if (v === "library") ui.libOpen = t; ui.view = v; render(); }, [v, t]); await p.waitForTimeout(40);
      const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (o > 0) bad.push(`${v}${t ? "/" + t : ""} +${o}px`);
    }
    return bad;
  };
  // 1. Screens: small phone to wide desktop, default and largest text
  const screens = [[320, 640], [360, 780], [412, 915], [740, 360], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
  for (const [w, h] of screens) for (const size of [100, 150]) {
    const [ctx, p] = await open(w, h);
    await p.evaluate(s => { state.settings.textSize = s; render(); }, size);
    const bad = await views(p);
    ok(bad.length === 0, `U2a ${w}x${h} at ${size}% text: no sideways scrolling in any view (${bad.join(", ") || "none"})`);
    if (w >= 1024) ok(await p.evaluate(() => { const r = document.querySelector(".tabbar").getBoundingClientRect(); return r.left === 0 && r.height > innerHeight * 0.9 && r.width < 120; }), `U2b ${w}px: navigation is a side rail`);
    await ctx.close();
  }
  // 2. Every colour mode, contrast and skin applies the expected accent with no errors
  const [ctx, p] = await open(390, 844);
  const combos = await p.evaluate(() => { const out = []; for (const theme of ["light", "dark"]) for (const contrast of ["normal", "more"]) for (const skin of Object.keys(SKINS)) { state.settings.theme = theme; state.settings.contrast = contrast; state.settings.skin = skin; render(); const want = SKINS[skin][contrast === "more" ? (theme === "dark" ? "hd" : "hl") : (theme === "dark" ? "d" : "l")].accent; const got = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(); const bg = getComputedStyle(document.body).backgroundColor; out.push([theme, contrast, skin, want === got, bg]); } return out; });
  ok(combos.length === 20 && combos.every(c => c[3]), "U2c all 20 colour mode, contrast and skin combinations apply their palette");
  ok(await p.evaluate(() => { state.settings.theme = "dark"; state.settings.contrast = "more"; render(); return getComputedStyle(document.body).backgroundColor === "rgb(0, 0, 0)" && document.documentElement.dataset.theme === "dark"; }), "U2d dark high contrast paints a black page");
  // 3. Personal settings persist and take effect
  await p.evaluate(() => { state.settings.theme = "dark"; state.settings.contrast = "normal"; state.settings.rewards = "off"; state.settings.textSize = 130; state.settings.startView = "practise"; state.settings.myFillers = "right, so yeah"; save(); });
  await p.goto(url); await p.waitForTimeout(400);
  ok(await p.evaluate(() => ui.view === "practise" && document.documentElement.dataset.theme === "dark" && getComputedStyle(document.documentElement).fontSize === "20.8px"), "U2e settings survive a reload: start view, dark mode, 130% text");
  await p.evaluate(() => { ui.view = "today"; render(); });
  ok(await p.evaluate(() => [...document.querySelectorAll(".rw")].every(e => e.offsetParent === null)), "U2f rewards hidden everywhere when switched off");
  ok(await p.evaluate(() => analyse("Right, so yeah, the plan is ready. Right.", 10).fillers >= 3), "U2g personal filler words are counted");
  // 4. Keyboard: skip link reaches main content
  await p.keyboard.press("Tab"); const first = await p.evaluate(() => document.activeElement.className);
  await p.keyboard.press("Enter"); const focused = await p.evaluate(() => document.activeElement.id);
  ok(first.includes("skip") && focused === "view", "U2h first Tab lands on the skip link, which moves focus to the main content");
  await p.evaluate(() => { ui.view = "settings"; ui.setTab = "look"; render(); document.getElementById("st-look").focus(); });
  await p.keyboard.press("ArrowRight"); await p.keyboard.press("ArrowRight");
  ok(await p.evaluate(() => ui.setTab === "you" && document.activeElement.id === "st-you"), "U2k arrow keys move between settings tabs and keep focus");
  // 5. Reduced motion from the device is honoured
  const [ctx2, p2] = await open(390, 844, { reducedMotion: "reduce", colorScheme: "dark" });
  ok(await p2.evaluate(() => reduceMotion() && document.documentElement.dataset.theme === "dark"), "U2i device dark mode and reduced motion are followed by default");
  await ctx2.close(); await ctx.close();
  ok(errs.length === 0, "U2j no script errors (" + (errs.slice(0, 3).join("; ") || "none") + ")");
  await b.close(); console.log(fail ? `${fail} matrix check(s) failed` : "All matrix checks passed"); process.exitCode = fail ? 1 : 0;
})();
