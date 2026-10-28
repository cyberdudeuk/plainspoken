#!/usr/bin/env bash
# One-step publish for Plainspoken: checks, GitHub repo, Pages, branch protection, labels, first release.
# Needs: GitHub CLI signed in as cyberdudeuk (brew install gh && gh auth login), git, node 20+, python3 with PyYAML.
set -euo pipefail
cd "$(dirname "$0")"
REPO=cyberdudeuk/plainspoken
VERSION=$(sed -n 's/.*const VERSION = "\([0-9.]*\)".*/\1/p' app.html | head -1)

echo "1/8 Install GitHub configuration (workflows, Dependabot, templates, CODEOWNERS)"
if [ ! -d .github/workflows ]; then mkdir -p .github && cp -R repo-config/github/. .github/; fi

echo "2/8 Install validator dependencies and run every check"
npm ci --silent || npm install --silent
python3 build.py
node check.js
node tools/validate-teams.js
python3 tools/check-config.py
python3 tools/package-teams.py

echo "3/8 Commit"
if [ ! -d .git ]; then git init -q -b main; fi
git add -A
git commit -q -m "Plainspoken v$VERSION" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012vn922crNysv9WbBX6qsuM" || echo "(nothing new to commit)"

echo "4/8 Create the public repository and push"
if gh repo view "$REPO" >/dev/null 2>&1; then
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "Plainspoken: a phone-first speaking coach for work" \
    --homepage "https://cyberdudeuk.github.io/plainspoken/"
fi

echo "5/8 Switch on GitHub Pages"
gh api -X POST "repos/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || echo "(Pages already on)"

echo "6/8 Repository settings: topics, security features, labels"
gh repo edit "$REPO" --add-topic speaking --add-topic public-sector --add-topic communication-skills --add-topic microsoft-teams --add-topic pwa \
  --enable-issues --enable-wiki=false --delete-branch-on-merge
gh api -X PUT "repos/$REPO/vulnerability-alerts" >/dev/null 2>&1 || true
gh api -X PUT "repos/$REPO/automated-security-fixes" >/dev/null 2>&1 || true
for l in "maintenance:d98a14:Raised by the weekly health check" "accessibility:3d55b8:Accessibility barrier" "licensing:8b4a8e:Commercial use requests" "idea:1b739e:Ideas and improvements"; do
  IFS=: read -r n c d <<< "$l"; gh label create "$n" --color "$c" --description "$d" --repo "$REPO" --force >/dev/null
done

echo "7/8 Protect main: require the Checks workflow to pass"
gh api -X PUT "repos/$REPO/branches/main/protection" --input - >/dev/null <<'JSON'
{"required_status_checks":{"strict":true,"contexts":["check"]},"enforce_admins":false,"required_pull_request_reviews":null,"restrictions":null,"allow_force_pushes":false,"allow_deletions":false}
JSON

echo "8/8 Tag v$VERSION (the release workflow builds and attaches the Teams packages)"
git tag -f "v$VERSION" && git push -f origin "v$VERSION"

echo "Done. Site: https://cyberdudeuk.github.io/plainspoken/  Releases: https://github.com/$REPO/releases"
