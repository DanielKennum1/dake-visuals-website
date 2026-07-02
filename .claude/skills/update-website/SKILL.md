---
name: update-website
description: Use whenever the user makes or asks for an edit to the DAKE Visuals website (HTML/CSS/JS/images/videos in this repo). Commits and pushes the change to GitHub, then offers to deploy the live site on Hostinger.
---

# Update DAKE Visuals Website

## Codebase overview

Local path: `/Users/daniel.kennum/DAKE Visuals - Website`

Static HTML site, no build step. Key files/folders:
- `index.html`, `about.html`, `work.html`, `bts.html`, `contact.html` — top-level pages
- `projects/*.html` — individual project case-study pages
- `billeder/` — images, organized by project
- `Videos/` — showreel and project videos (Compressed/, Thumbnails/)

## GitHub repo

- Repo: https://github.com/DanielKennum1/dake-visuals-website
- Local `origin` remote is already configured, credentials cached in macOS Keychain
- Default branch: `main`
- `$GITHUB_TOKEN` is available in `~/.zshrc` if a token is ever needed for the API

## Hostinger deployment

- Domain: `dakevisuals.com`
- Deploy via the `hostinger-hosting` MCP server (configured in `.mcp.json`, requires `$HOSTINGER_API_TOKEN` from `~/.zshrc`)
- Tool: `hosting_deployStaticWebsite` — deploys a zip archive of the site to the hosting account for `dakevisuals.com`
- The username for the hosting account is auto-resolved from the domain by the tool

## Workflow — every time the user makes a change

1. **Commit and push to GitHub**
   - `git add -A`
   - `git commit -m "<short description of the change>"`
   - `git push origin main`

2. **Ask before deploying** — ALWAYS ask the user explicitly whether to deploy this change to the live site (`dakevisuals.com`) before doing anything with the Hostinger API. Never deploy automatically.

3. **If the user confirms deploy:**
   - Create a zip archive of the site contents, excluding `.git`, `.claude`, `.mcp.json`, `.DS_Store`, and any other dev-only files
   - Call `hosting_deployStaticWebsite` (Hostinger MCP) with that archive for `dakevisuals.com`
   - Confirm the deployment result back to the user

4. **If the user declines deploy:**
   - Leave it at the GitHub push — note that the live site is unchanged and they can deploy later by asking
