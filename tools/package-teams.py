"""Build the Teams app packages into dist/:
  plainspoken-teams-<version>.zip          tab + Copilot agent (needs Microsoft 365 Copilot or Copilot Chat for the agent)
  plainspoken-teams-tab-<version>.zip      tab only (works in any tenant that allows the app)
Run: python3 tools/package-teams.py"""
import json, zipfile
from pathlib import Path
root = Path(__file__).resolve().parent.parent; t = root / "teams"; dist = root / "dist"; dist.mkdir(exist_ok=True)
ver = json.loads((t / "manifest.json").read_text())["version"]
def pack(name, manifest, extra):
    out = dist / name
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("manifest.json", (t / manifest).read_text())
        for f in ["color.png", "outline.png"] + extra:
            z.write(t / f, f)
    print("built", out.relative_to(root))
pack(f"plainspoken-teams-{ver}.zip", "manifest.json", ["declarativeAgent.json"])
pack(f"plainspoken-teams-tab-{ver}.zip", "manifest.tab-only.json", [])
