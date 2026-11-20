---
artefact:id: P16-PRD-001
artefact:version: 1.0.0
artefact:as-of: 2026-11-20
artefact:review-date: 2027-02-20
project: P16 Plainspoken
grade: G2
profile: personal and creative
---

# Product requirements (PRD): Plainspoken

> **How to read this.** Facts marked V were read from this repository on 20 November 2026. Assumptions, measures and risks are proposals written for this kit, not findings. U means unconfirmed. Where another document in this repository already covers a topic, this one links to it rather than repeating it.

## Problem and outcome
Practising speaking for work is easy to skip without a daily routine, feedback and visible progress.

Outcome sought: Users practise daily and feel more confident in meetings, talks and briefings. See [01-theory-of-change.md](01-theory-of-change.md).

## Users
- Anyone who speaks at work, especially in civil service and public sector settings

User evidence: [02-ur-bundle.md](02-ur-bundle.md).

## Scope
**In:**
- Today, Prep, Live, progress and rewards

**Out:**
- Sending any audio off the device
- Rankings against others

## Requirements
Derived from what this repository says it does (V: README and ADRs). The last column is the check that proves each one, where one exists. U means no check was found that clearly covers it; that is a gap to close, not a pass.

| ID | Requirement | Priority | Verified by |
|---|---|---|---|
| P16-R01 | Timed daily routine | Must | tools/ui-smoke.js |
| P16-R02 | 16 situation briefs | Must | tools/ui-matrix.js |
| P16-R03 | Live cue card with discreet mode | Must | tools/ui-smoke.js |
| P16-R04 | Teams package validates | Should | tools/validate-teams.js |

## Non-functional requirements
- Phone-first; works offline once loaded (U: confirm)

## Status
Personal project, developed outside working hours (V: README)
