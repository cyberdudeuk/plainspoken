# Checks and defect register

Run `node check.js`. Every check is proven by a negative test (break the input and confirm the check fails). The suite never shrinks.

| Check | What it verifies | Exists because of |
| --- | --- | --- |
| C1 | The app script parses | Baseline safety check |
| C2 | `index.html` was rebuilt from the current `app.html` | Risk of the Pages copy drifting from the Claude copy |
| C3 | Footer version matches `VERSION` | Version shown in two places |
| C4 | `<title>` is in the first 8 KB | Artifact host scans only the first 8 KB for a title |
| C5 | External scripts only from cdnjs, pinned to exact versions | Artifact content security policy |
| C6 | Browser storage wrapped in try/catch | Storage can throw in private windows and previews |
| C7 | Progress view cannot overflow phones | **D2** |
| C8 | "Another passage" picks a new passage | **D1** |
| C9 | Every icon used has a symbol | A missing symbol renders blank |
| C10 | Copyright notice present | Requirement: name and copyright on published artefacts |
| C11 | Celebration animation respects reduced motion | Accessibility |
| C12 | Both light and dark themes defined | Unreadable text if one theme is missing |
| C13 | No third-party product names or borrowed reward terms in the UI | **D4**: v2 reward vocabulary mirrored an existing app |
| C14 | Cited public guidance carries its source-licence attribution in Credits and THIRD_PARTY_NOTICES only, never as the project's own licence or a footer statement | Source licence condition; **D7** |
| C15 | QR Code trademark notice present | DENSO WAVE trademark |
| C16 | Favicons, manifest and social card exist and are linked | Web app metadata requirement |
| C17 | Build information injected | Traceability from page to commit |
| C18 | Credits section and third-party notices present | Licence conditions of fonts, libraries and sources |
| C19 | Independence statement present; no information-classification markings or government-affiliation wording | **D7** |
| C20 | Licences consistent: LICENSE is PolyForm Noncommercial 1.0.0 with its Required Notice, LICENSE-CONTENT is CC BY-NC 4.0, NOTICE and TRADEMARKS exist, app and README state the same terms, no permissive licence claimed for the project | **D8**, **D9** |
| C21 | The not-for-profit permission and the commercial-use rule appear in NOTICE, README and the app | **D9** |
| C22 | TeamsJS shipped with its licence and loaded only inside Teams, never in Claude | Microsoft 365 requirement; artifact content policy |
| C23 | Teams and Copilot package sources, schemas and tooling present | Microsoft 365 requirement |
| C24 | Maintenance automation present and installed by publish.sh | Operating requirement |
| C25 | Operating documents present | Operating requirement |
| C26 | Known-dead source links replaced | **D10** |
| C27 | Every repo-config YAML parses; workflows have runnable steps; issue forms complete (`tools/check-config.py`) | **D12** |
| C28 | Skill lessons complete: 13 lessons (6 speaking, 7 relationships), 3 aims, 3 questions each with 4 options, a valid answer and a reason; role-play links resolve | Requirement: skills module |
| C29 | No original course or lesson titles and no "charisma" framing | **D13** |
| C30 | Facilitator rubric has 10 criteria by 4 levels and 4 core criteria; self-review refuses incomplete scores | Requirement: Facilitator mode |
| C31 | Every role-play has icon and category metadata | Review risk: a role-play without metadata would break the picker |
| C32 | Every hard-coded version string matches `VERSION` | **D14** |
| C33 | No employer or work-account identifiers anywhere in the repo | **D15** |
| C34 | Wide tables scroll inside their box; five Practise tabs fit a 360px phone | **D16** |
| C35 | Quick-check answers spread across positions A to D | **D17** |
| U1 | Browser smoke test at 360px: 13 lessons listed, tabs fit, lesson locked until the check is answered, completion saved and rewarded, incomplete self-review refused, no sideways scroll, no script errors (`node tools/ui-smoke.js`, needs Playwright; skips without it) | **D16**; requirement: skills module |
| T1-T9 | Teams manifests and Copilot agent valid against Microsoft's schemas, versions aligned, tab points at Pages in Teams mode, media permission, instructions within limit, no affiliation wording, icons present (`tools/validate-teams.js`) | Microsoft 365 requirement |
| L1 | Weekly: no broken source links; rules re-checked within 90 days; own-repo links excluded; bot-blocking sites reported as unverified (`tools/check-links.js`) | **D10**, **D11** |

## Defect register

| ID | Found | Defect | Root cause | Fix | Check |
| --- | --- | --- | --- | --- | --- |
| D1 | v1 review | "Another passage" did nothing; "Read and score" lost the passage | Passage picked at render time, never stored | Store `ui.passage`; add `newPassage` action | C8 |
| D2 | v2 smoke test | 7px horizontal scroll on phones | Path node offsets plus label width exceeded card width | Replaced by a fixed-viewBox spectrum SVG | C7 |
| D3 | v2 build | Patch script failed to match text | Source held literal `·` where the patch expected `·` | Matcher accepts both forms (tooling only) | n/a |
| D4 | v2.1 review | Reward names and path/ring visuals mirrored an existing language-learning app | Designed by analogy to that app | Original sound-themed mechanics and visuals | C13 |
| D5 | v2.1 review | App name clashed with an existing app ("Wellspoken: Articulation Coach") | No name search before naming | Renamed to Plainspoken; formal trademark search still recommended | (manual) |
| D6 | v2.1 review | An exercise reproduced a broadcast panel game's rule set | Borrowed format | Renamed and rewritten as "Sixty-second flow" | (manual) |
| D7 | v2.2 review | Footer licence statement, OFFICIAL-SENSITIVE marking and "your department" wording implied a government connection for a personal project | Content drafted assuming a work context | Independence statement; neutral wording; source attribution moved to credits | C14, C19 |
| D8 | v2.2 review | MIT covered code but not the written content, artwork or name | One software licence applied to a mixed work | Apache 2.0 (code), CC BY 4.0 (content), reserved name and logo | C20 |
| D10 | v2.4 link check | Two cited sources died: a Success Profile Behaviours copy (410 Gone) and a Civil Service Commission page (404) | Sources moved or withdrawn after citation | Replaced with the 2018 Civil Service Behaviours (archive copy, full grade mapping verified) and the Commission's current Code page (route verified) | C26, L1 |
| D11 | v2.4 link check | Checker reported false failures | Counted the unpublished own repo and treated bot-blocking (403/503) as broken | Exclude own repo; retry once; report blocked sites as unverified | L1 |
| D12 | v2.4 build | Two YAML files would have broken GitHub (comma in a flow mapping; colon in a plain scalar) | Hand-written YAML in compact styles | Issue forms generated in block style; release step uses a block scalar; config checker added | C27 |
| D13 | v2.5 review | The source course and lesson titles shared a name with an unrelated commercial course ("Unlock your charisma" on Udemy) and used a "hacks / like a pro" tone that clashed with the app and with the guide's own rule against inferring emotion | Titles written for a course listing, not checked for clashes | All 13 lessons renamed; "charisma" framing removed | C29 |
| D14 | v2.5 build | The barcode's accessible label still said 2.4 after the version bump; only the footer was checked | Version typed in two places, one unchecked | Label updated; every version string now checked | C32 |
| D15 | v2.5 review | The source guide's file properties named a work account as author, which contradicts the independence statement | File created through a work-managed account | Author confirmed the work is personal; source file kept out of the repo; repo scanned for employer identifiers | C33 |
| D16 | v2.5 smoke test | Facilitator mode widened the Library by 273px and the five Practise tabs scrolled by 33px on a 360px phone | Grid and details children default to min-width:auto, so a wide table stretched its card; tab padding sized for four tabs | min-width:0 on cards, details and table wrappers; tighter tab padding under 400px | C34, U1 |
| D17 | v2.5 adversarial review | 27 of the 39 source questions had B as the answer, so a learner could pass by always choosing B | Source answer key written without position balancing | Options shown in a fixed, per-question shuffled order (answers now spread; most common position 13 of 39) | C35 |
| D9 | v2.3 review | Permissive licences allowed commercial use the author does not want | Licence chosen before the commercial intent was stated | PolyForm Noncommercial 1.0.0 (code), CC BY-NC 4.0 (content), additional not-for-profit permission | C20, C21 |
