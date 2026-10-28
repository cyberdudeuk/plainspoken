"""Build index.html (GitHub Pages) from app.html (the Claude artifact source).
Adds the document skeleton the artifact host adds at publish time, plus web-app metadata
(favicons, manifest, theme colour, social card, canonical URL) and build information.
Run: python3 build.py"""
import subprocess, datetime, re
from pathlib import Path
root = Path(__file__).parent
body = (root / "app.html").read_text(encoding="utf-8")
try:
    commit = subprocess.check_output(["git", "-C", str(root), "rev-parse", "--short", "HEAD"], text=True).strip()
except Exception:
    commit = "unreleased"
body = body.replace("__COMMIT__", commit)
version = re.search(r'const VERSION = "([\d.]+)"', body).group(1)
url = "https://cyberdudeuk.github.io/plainspoken/"
desc = "Plainspoken: a daily speaking coach for public servants. Routine, event prep, scoring, role-play and a live cue card."
head = f'''<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="{desc}">
<meta name="author" content="Emanuel Silva">
<meta name="copyright" content="© 2026 Emanuel Silva. Code Apache-2.0; content CC BY 4.0.">
<link rel="license" href="LICENSE">
<meta name="application-name" content="Plainspoken">
<meta name="generator" content="build.py; app v{version}; commit {commit}">
<meta name="build" content="version={version}; date={datetime.date.today().isoformat()}; commit={commit}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0b6f5a" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d1513" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Plainspoken">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="canonical" href="{url}">
<link rel="icon" href="favicon.ico" sizes="32x32"><link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
<meta property="og:type" content="website"><meta property="og:site_name" content="Plainspoken">
<meta property="og:title" content="Plainspoken"><meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{url}assets/social-card.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Plainspoken logo: a speech bubble holding three rising bars">
<meta property="og:locale" content="en_GB"><meta name="twitter:card" content="summary_large_image">
<style>:root{{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0;font:14px system-ui,sans-serif}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
</head><body>'''
body = body.replace('<link rel="icon" type="image/svg+xml" href="data:image/svg+xml', '<link rel="alternate icon" type="image/svg+xml" href="data:image/svg+xml', 1)
(root / "index.html").write_text(head + body + "</body></html>\n", encoding="utf-8")
print("index.html built; commit", commit)
