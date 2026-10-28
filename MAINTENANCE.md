# Maintenance runbook

How Plainspoken is operated and kept healthy. Owner: Emanuel Silva (@cyberdudeuk).

## Routines

| When | What | How | Automated? |
| --- | --- | --- | --- |
| Every push and pull request | Project checks (C1 onwards), Teams/Copilot schema validation (T1 onwards), rebuild proves `index.html` matches `app.html`, Teams packages build | `.github/workflows/check.yml` | Yes |
| Weekly (Monday 06:17 UTC) | Broken source links; rules staleness (over 90 days); live site responds | `.github/workflows/maintenance.yml` opens or updates one issue labelled `maintenance` | Yes |
| Weekly | Dependency and GitHub Action updates | Dependabot pull requests; merge only when checks pass | Yes (PRs) |
| Monthly | Review open issues, Dependabot PRs and the maintenance issue; re-run a smoke test on a phone | Manual | No |
| Quarterly | Re-check the public-sector rules (external speaking, pre-election, Osmotherly, Success Profiles); update `RULES_CHECKED` in `app.html`; review accessibility; test in Teams desktop, web and mobile | Manual; the weekly check opens an issue when it's overdue | Reminder only |
| Every release | Bump `VERSION` in `app.html`; update CHANGELOG; `python3 build.py`; commit; tag `vX.Y.Z`; push the tag | The release workflow builds the Teams zips and attaches them to the GitHub release | Partly |
| After each release | Republish the Claude version from `app.html` | Manual (Claude) | No |

## Versions in three places
`app.html` `VERSION` drives everything else: the footer, `index.html` (via `build.py`), the Teams manifest version (`X.Y.0`, checked by T4) and the release tag. Update the Teams manifests' `version` with the app.

## If something breaks
1. Check the latest Actions run and the `maintenance` issue.
2. Reproduce on the Pages site at phone width, light and dark.
3. Find the root cause before fixing. Add a check that fails without the fix (CHECKS.md), then fix.
4. Release a patch version.

## Rolling back
- Pages: revert the commit on `main`; Pages redeploys in a minute or two.
- Teams: re-upload the previous release's zip (each GitHub release keeps them).
- Claude: republish the previous `app.html`.

## Rules and limits
- No secrets in the repository. No analytics or tracking.
- Pinned third-party code only; TeamsJS is shipped in `vendor/` and updated deliberately (update `TEAMS_JS` in `app.html`, the file, and THIRD_PARTY_NOTICES.md together).
- Branch protection on `main` requires the Checks workflow to pass.


## Committing changes

Use `tools/commit.sh "Message"`. It commits your source changes first, then rebuilds `index.html` and commits it, so the page's build stamp names the source commit and the CI "index.html is current" step passes (defect D23). Push both commits together.


## Dependabot pull requests

Dependabot opens pull requests for GitHub Actions and npm updates. Merge one at a time: wait for both the `check` and `ui` jobs to pass, then use "Update branch" on the next one before merging. Read the release notes for major versions first. GitHub configuration lives only in `.github` (defect D24); there is no second copy to keep in step.
