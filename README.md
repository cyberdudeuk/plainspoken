<p align="center"><img src="assets/logo-lockup.png" alt="Plainspoken" width="420"></p>

# Plainspoken

A phone-first speaking coach for anyone who speaks at work, with situations drawn from civil service and public sector settings. It turns a 16-week articulation plan into a daily habit: a 20-minute routine, event prep, speak-and-score, role-play, a live cue card, and progress you can see.

- **Live-listening version (GitHub Pages):** https://cyberdudeuk.github.io/plainspoken/
- **Claude version (coaching, role-play, synced data):** https://claude.ai/artifact/22Zr4rKqNhjk2QwcUdbXV9
- **Full written plan:** https://claude.ai/artifact/97sLuwHx6tT5Bwp4skDiWL

© 2026 Emanuel Silva. Developed in a personal capacity, outside working hours. An independent project: not affiliated with, endorsed by or produced on behalf of any government, public body or other organisation it mentions.

## What it does

| Area | Features |
| --- | --- |
| Today | Phase and week, daily volume meter, rhythm and rest notes, stage, three daily cues, timed 20-minute routine, spectrum, speaking prompt, upcoming events |
| Prep | 16 situations (meetings, chairing, webinars, talks, panels, ministerial briefings, select committees, media, town halls, pitches, difficult conversations, interviews on both sides, leading, pushing back, podcasts): one-page brief, checklist, introduction templates, likely hard questions, Claude review |
| Practise | Speak and score (pace, fillers, hedges, sentence length, signposts, acronyms), Claude coaching, 13 skill lessons with checks (6 speaking skills plus the Working relationships module), 15 role-plays with partner-card fallback, drills, 14 exercises |
| Live | Cue card, timer, filler tap counter, "lost my thread", discreet mode, keep screen on, live listening where the browser allows |
| Progress | Your form (this week against past weeks), 22 commendations, the 16-week spectrum, pace and filler trends, routine calendar, weekly checkpoints, situation log |
| Settings | Light, dark or device colour mode; high contrast; five colour themes; layout width and spacing; text size 90 to 150%; three typefaces; relaxed text spacing; larger buttons; strong focus outline; reduce motion; start view, listening language, coaching tone, your own filler words; hide rewards; data export, import and erase |
| Library | Introductions, frameworks, Facilitator mode (delivery plan, rubric, self-review, action plan), public sector rules, Success Profiles levels, inclusive speaking, microphone help, credits and licences, privacy, accessibility, about and build information, roadmap |

## Rewards

An original set of mechanics themed on sound and voice:

| Mechanic | How it works |
| --- | --- |
| Resonance | Points earned for practice (routine blocks, scored answers, role-plays, briefs, live events, checkpoints) |
| Volume meter | Daily goal shown as a needle gauge: Quiet 20, Conversational 50, Projected 80, Broadcast 120 |
| Rhythm | Days in a row you reach your goal; weekends optional |
| Rest notes | One earned per 7 days of rhythm (hold 2); covers a missed day automatically |
| Daily cues | Three practice tasks a day, with a bonus for all three |
| Stages | Eight stages from "Warming up" to "Master communicator" |
| Commendations | 20 milestones, from "First words" to "Graduate" |
| Spectrum | Each week is an equaliser bar that rises with routine days; diamonds mark phase gates |
| Your form | Compare this week with your own previous weeks; no rankings against other people |

## Why the microphone works here but not in Claude

Pages published on claude.ai run in a sandboxed, cross-origin frame. A framed page can use the microphone only if the page around it delegates that permission (the Permissions Policy `allow="microphone"`). Claude does not delegate it to published pages on this account, so the browser refuses without prompting. On GitHub Pages the app is a top-level page on its own HTTPS address, so the browser can ask for permission and the Web Speech API can run.

**Privacy:** in Chrome and Edge, the Web Speech API sends audio to the browser maker's speech service. Do not use live listening for sensitive material. See [PRIVACY.md](PRIVACY.md).

## Build and check

`app.html` is the source (as published to Claude, without a document skeleton). `index.html` is generated for GitHub Pages with favicons, manifest, social card and build information.

```
python3 build.py   # regenerate index.html from app.html
node check.js      # verification checks; see CHECKS.md
node tools/ui-smoke.js   # browser smoke test (needs Playwright)
node tools/ui-matrix.js  # cross-device and settings matrix (needs Playwright)
```

## Project documents

[CHANGELOG](CHANGELOG.md) · [ROADMAP](ROADMAP.md) · [CHECKS](CHECKS.md) · [PRIVACY](PRIVACY.md) · [ACCESSIBILITY](ACCESSIBILITY.md) · [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md) · [NOTICE](NOTICE) · [TRADEMARKS](TRADEMARKS.md)

## Licence

Free for personal use and for charities, not-for-profit organisations and not-for-profit purposes. **Commercial use is not permitted without written permission.**

| What | Licence | File |
| --- | --- | --- |
| Source code (`app.html` script and styles, `build.py`, `check.js`, `publish.sh`) | PolyForm Noncommercial License 1.0.0 | [LICENSE](LICENSE) |
| Text, exercises, prompts, role-play scenarios, passages, icons and artwork | Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0) | [LICENSE-CONTENT](LICENSE-CONTENT) |
| Additional permission for any not-for-profit organisation or purpose, including cost recovery | Granted by the author | [NOTICE](NOTICE) |
| The Plainspoken name and logo | Not licensed; fair reference allowed | [TRADEMARKS.md](TRADEMARKS.md) |
| Fonts, libraries and cited sources | Their own licences | [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) |

| Use | Allowed? |
| --- | --- |
| Personal practice, study, hobby | Yes |
| Charity, community group, CIC, social enterprise that doesn't distribute profit, school, university, public body | Yes, including charging to recover costs |
| Adapting it for a not-for-profit purpose | Yes, keep the credit and the same licence terms |
| Selling it, putting it in a paid product, or using it in for-profit training or consultancy | No, unless you get written permission (open an issue) |

Attribute content as: "Plainspoken by Emanuel Silva, CC BY-NC 4.0". These are source-available licences, not OSI-approved open source licences.

Thresholds (pace band, fillers per minute, gates) are planning choices, not research norms. Ideas and bugs: open an issue.
