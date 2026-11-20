---
artefact:id: P16-FTIR-001
artefact:version: 1.0.0
artefact:as-of: 2026-11-20
artefact:review-date: 2027-02-20
project: P16 Plainspoken
grade: G2
profile: personal and creative
---

# Functional, technical and integration requirements (FTIR): Plainspoken

> **How to read this.** Facts marked V were read from this repository on 20 November 2026. Assumptions, measures and risks are proposals written for this kit, not findings. U means unconfirmed. Where another document in this repository already covers a topic, this one links to it rather than repeating it.

Requirements are stated once, in [03-prd.md](03-prd.md). This document says how each is met and checked.

## Functional

| ID | Requirement | Priority | Verified by | State |
|---|---|---|---|---|
| F01 | Timed daily routine | Must | tools/ui-smoke.js | Has a check |
| F02 | 16 situation briefs | Must | tools/ui-matrix.js | Has a check |
| F03 | Live cue card with discreet mode | Must | tools/ui-smoke.js | Has a check |
| F04 | Teams package validates | Should | tools/validate-teams.js | Has a check |

## Technical

| ID | Requirement | State |
|---|---|---|
| T01 | Code scanning | Present (V: .github/workflows) |
| T02 | Dependency review on pull requests | Present (V: .github/workflows) |
| T03 | OpenSSF Scorecard | Present (V: .github/workflows) |
| T04 | Automated release | Present (V: .github/workflows) |
| T05 | Published by workflow (Pages) | Not present |
| T06 | Documentation kit checked in CI | Present (V: .github/workflows) |

Workflows present (V): `check.yml`, `codeql.yml`, `dependency-review.yml`, `maintenance.yml`, `release.yml`, `scorecard.yml`.

Tests present (V): none found.

## Integration

| ID | Integration | Direction | State |
|---|---|---|---|
| I01 | Microsoft Teams | App package | Ready |
