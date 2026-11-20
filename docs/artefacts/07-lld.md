---
artefact:id: P16-LLD-001
artefact:version: 1.0.0
artefact:as-of: 2026-11-20
artefact:review-date: 2027-02-20
project: P16 Plainspoken
grade: G2
profile: personal and creative
---

# Low-level design (LLD): Plainspoken

> **How to read this.** Facts marked V were read from this repository on 20 November 2026. Assumptions, measures and risks are proposals written for this kit, not findings. U means unconfirmed. Where another document in this repository already covers a topic, this one links to it rather than repeating it.

## Build and check commands (V: README)
```
python3 build.py
node tools/ui-smoke.js
```

## Scripts (V: file tree)
- `tools/check-config.py`
- `tools/check-links.js`
- `tools/commit.sh`
- `tools/lint-page.js`
- `tools/package-teams.py`
- `tools/ui-matrix.js`
- `tools/ui-smoke.js`
- `tools/validate-teams.js`

## Tests (V: file tree)
- No test files found. Adding tests is an open item.

## Workflows (V: .github/workflows)
- `check.yml`
- `codeql.yml`
- `dependency-review.yml`
- `maintenance.yml`
- `release.yml`
- `scorecard.yml`

## Repository size
79 files tracked on 20 November 2026.

## Documentation kit
- `docs/artefacts/manifest.yaml` lists every core document, where it is, and its review date.
- `tools/artefact_check.py` checks the kit (rules AC-01 to AC-08, each with a negative test). Run `python3 tools/artefact_check.py --self-test` then `python3 tools/artefact_check.py .`.

## Handover
Someone new can rebuild and verify with the commands above, then read [03-prd.md](03-prd.md) and [05-sad.md](05-sad.md).
