# Installing Plainspoken in Microsoft 365

Two packages are attached to each GitHub release (or build them with `python3 tools/package-teams.py`):

| Package | Contains | Works for |
| --- | --- | --- |
| `plainspoken-teams-tab-X.Y.Z.zip` | Personal app (the web app inside Teams; may also appear in Outlook and the Microsoft 365 app) | Any Microsoft 365 user whose organisation allows the app |
| `plainspoken-teams-X.Y.Z.zip` | The personal app plus the **Plainspoken coach** Copilot agent | Users with Microsoft 365 Copilot (full) or Copilot Chat (limited capabilities) |

## For one person (testing)
Needs a tenant where **Upload custom apps** is allowed for you (Teams admin center → Teams apps → Setup policies).
1. Teams → Apps → Manage your apps → Upload an app → Upload a custom app.
2. Choose the zip, then Add.
3. For live listening: open the app, select **App permissions** (top right) and turn on Media. On mobile: Settings → App permissions.

## For an organisation (administrators)
1. Review the package, PRIVACY.md, SECURITY.md, TERMS.md and ACCESSIBILITY.md.
2. Teams admin center → Teams apps → Manage apps → Upload new app → upload the zip. It appears in the organisation's catalogue ("Built for your org") after a few hours.
3. Control who can use it with app permission policies; pin it for users with app setup policies if wanted.
4. For the Copilot agent, also check your Copilot agent settings in the Microsoft 365 admin center.

## What the app needs
- **Network:** `https://cyberdudeuk.github.io` (the app, its pinned TeamsJS and icons) and `https://fonts.googleapis.com` / `https://fonts.gstatic.com` (fonts) and `https://cdnjs.cloudflare.com` (QR and barcode libraries). The app falls back to system fonts if fonts are blocked.
- **Permissions:** no Microsoft Graph permissions, no single sign-on, no bot. Device permission `media` (microphone) only, granted by each user.
- **Data:** stays in the user's browser storage inside Teams. Nothing is sent to the author. Live listening uses the browser engine's speech service (see PRIVACY.md).
- **Copilot agent:** instructions only, plus web search limited to four sites and the Meetings capability (the user's own meetings, permission-trimmed by Microsoft 365).

## Known limits
- The microphone may not be passed through in Outlook and the Microsoft 365 app; use keyboard dictation there.
- Device permissions aren't supported in the Teams meeting side panel.
- Data in the Teams app is separate from the GitHub Pages and Claude versions; move it with Download and Import in Settings.
- Not yet tested in a live tenant: package validated against Microsoft's manifest 1.22 and declarative agent 1.6 schemas only.
