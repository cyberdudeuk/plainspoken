# Security policy

Report vulnerabilities privately through GitHub: **Security → Report a vulnerability** (https://github.com/cyberdudeuk/plainspoken/security/advisories/new). Please don't open a public issue.

Scope: the web app (`app.html`, `index.html`), the Teams and Copilot package (`teams/`), and the build and check tooling. Expect an acknowledgement within 7 days. This is a personal, volunteer-maintained project with no service level.

Design notes: no server, no accounts, no analytics, no cookies. Data stays in the browser (GitHub Pages), in a private per-user store (Claude version) or in the user's own Microsoft 365 context (Copilot agent). Third-party code is pinned (cdnjs libraries; TeamsJS 2.58.0 shipped in `vendor/`) and updated through Dependabot.
