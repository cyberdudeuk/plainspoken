#!/usr/bin/env bash
# Commit source changes, then rebuild index.html so its build stamp names that source commit (defect D23).
# Usage: tools/commit.sh "Commit message"   (extra -m trailers can follow)
set -euo pipefail
cd "$(dirname "$0")/.."
git add -A
git reset -q index.html
git commit -q "$@"
python3 build.py >/dev/null
node check.js >/dev/null
git add index.html
git commit -q -m "Build index.html for $(git log -1 --format=%h -- app.html)" || echo "(index.html already current)"
git log --oneline -2
