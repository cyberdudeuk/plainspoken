---
artefact:id: P16-SAD-001
artefact:version: 1.0.0
artefact:as-of: 2026-11-20
artefact:review-date: 2027-02-20
project: P16 Plainspoken
grade: G2
profile: personal and creative
---

# Solution architecture (SAD): Plainspoken

> **How to read this.** Facts marked V were read from this repository on 20 November 2026. Assumptions, measures and risks are proposals written for this kit, not findings. U means unconfirmed. Where another document in this repository already covers a topic, this one links to it rather than repeating it.

## Context
Practising speaking for work is easy to skip without a daily routine, feedback and visible progress.

The solution is described in [03-prd.md](03-prd.md). It connects with: Microsoft Teams.

## Architecturally significant decisions
These are the decisions already recorded in this repository (V):

- None recorded as ADR files. Decisions so far are in the README and commit history; record the next one as `docs/adr/0001-...md`.

## Quality attributes

| Attribute | How it is met |
|---|---|
| Phone-first | Phone-first; works offline once loaded (U: confirm) |
| Contact | By form only; no email address anywhere (estate rule) |
| Documentation | This kit, checked in CI by `tools/artefact_check.py` |

## Constraints
- Personal project, developed outside working hours (V: README).
- No personal data unless a DPIA has been done first.
- Contact by form only.

## Risks (proposed ratings)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Microphone access differs by browser | Medium | Low | README explains where it works |
