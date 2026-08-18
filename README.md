# Morwix

Marketing site, interactive PRDs, and clickable prototypes for **Morwix** — a school management platform (attendance, fees, gradebook, timetables, and parent/student communication).

**Live site:** [morwix.tech](https://morwix.tech)

This is a static site with no build step — every page is plain HTML/CSS/JS, deployed as-is via GitHub Pages. Clone it, open a file, and you're looking at exactly what's live.

---

## Table of contents

- [Site map](#site-map)
- [Repo structure](#repo-structure)
- [Getting started](#getting-started)
- [Making changes](#making-changes)
- [Adding a new page or prototype](#adding-a-new-page-or-prototype)
- [Design tokens](#design-tokens)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Support](#support)

---

## Site map

| Path | What it is | Source |
|---|---|---|
| `/` | Main marketing site | `index.html` + `assets/` |
| `/app/` | Product app shell (built bundle) | `app/` |
| `/morwix-prd/` | Interactive PRD viewer | `morwix-prd/index.html` |
| `/morwix_notification_module_release_1/` | Notification Module R1 — PRD | `morwix_notification_module_release_1/index.html` |
| `/notification-prototype/` | Notification Module R1 — desktop clickable prototype | `notification-prototype/` |
| `/notification-prototype/mobile/` | Notification Module R1 — mobile app view (phone-framed mockup gallery) | `notification-prototype/mobile/` |
| `/notification-prototype/jira/` | Notification Module R1 — internal ticket board (user stories from the flow, assignable, status columns) | `notification-prototype/jira/` |
| `/mom/` | Notification Module R2 — PRD (in progress) | `mom/index.html` |

If you add a new top-level folder with an `index.html` in it, it becomes a new route automatically — see [Adding a new page or prototype](#adding-a-new-page-or-prototype).

## Repo structure

```
morwix-first-view/
├── CNAME                                  # custom domain: morwix.tech
├── index.html                             # main marketing site
├── assets/                                # main site's built CSS/JS
├── app/                                   # product app shell (built Vite bundle — see caveat below)
├── morwix-prd/
│   └── index.html                         # interactive PRD viewer
├── morwix_notification_module_release_1/
│   └── index.html                         # Notification Module R1 PRD
├── mom/
│   └── index.html                         # Notification Module R2 PRD (in progress)
└── notification-prototype/                # Notification Module R1 prototypes
    ├── index.html                         # desktop prototype (multi-screen SPA)
    ├── styles.css
    ├── app.js
    ├── mobile/                            # mobile app view (phone mockup gallery)
    │   ├── index.html
    │   ├── mobile.css
    │   └── mobile.js
    └── jira/                              # internal ticket board (user stories, assignable)
        ├── index.html
        ├── jira.css
        └── jira.js
```

> **Caveat on `/app`:** the files under `app/assets/` (e.g. `index-DH7xwFsK.js`) are a **built output** — hashed filenames from a bundler (Vite), with no source checked into this repo. Don't hand-edit them; if you need to change that app, find the original source project, build it there, and copy the output here.

Everything else — the marketing site, PRDs, and prototypes — is authored directly as plain HTML/CSS/JS with no build step.

## Getting started

1. **Clone the repo:**
   ```bash
   git clone git@github.com:mohitvyas9265/morwix-first-view.git
   cd morwix-first-view
   ```
   (Using HTTPS instead? `git clone https://github.com/mohitvyas9265/morwix-first-view.git`)

2. **Preview locally.** No build step, no dependencies — just serve the folder and open it in a browser:
   ```bash
   python3 -m http.server 8080
   ```
   Then visit `http://localhost:8080/` for the homepage, or e.g. `http://localhost:8080/notification-prototype/` for a specific page.

   (Any static file server works — `npx serve`, VS Code's Live Server extension, etc. Opening `index.html` directly via `file://` also works for most pages, since nothing here depends on a server-side route.)

3. **Confirm it matches production** by comparing against [morwix.tech](https://morwix.tech).

## Making changes

1. **Create a branch off `main`:**
   ```bash
   git checkout -b your-name/short-description
   ```
2. **Edit the relevant files directly** — everything is plain HTML/CSS/JS, readable top to bottom.
3. **Preview your change locally** (see above) before pushing. For multi-screen prototypes, click through every screen you touched — these are static mockups, not framework apps, so nothing warns you about a broken link or a missed state.
4. **Commit with a clear message** describing what changed and why:
   ```bash
   git add <files>
   git commit -m "Short summary of the change"
   ```
5. **Push your branch and open a pull request** against `main`:
   ```bash
   git push -u origin your-name/short-description
   ```
   Then open a PR on GitHub. Include a screenshot or the local preview URL for any visual change — this repo has no automated visual diffing, so a reviewer needs to *see* it.
6. **Once merged to `main`, it's live** — GitHub Pages redeploys automatically within a minute or two (see [Deployment](#deployment)).

> Pushing directly to `main` works technically (no branch protection is currently enforced) but isn't the collaboration model this README is asking for — please use a branch + PR so others can review before it goes live on morwix.tech.

## Adding a new page or prototype

GitHub Pages serves this repo as-is: any folder with an `index.html` becomes a route at `morwix.tech/<folder-name>/`.

To add a new prototype or PRD page:

1. Create a new top-level folder, named for the route you want (e.g. `attendance-module/`).
2. Add an `index.html` inside it, plus any `.css`/`.js` it needs — keep them scoped to that folder (don't reach into another prototype's stylesheet).
3. If it shares the Morwix design language, copy the token setup from an existing prototype (see [Design tokens](#design-tokens)) rather than inventing new values.
4. Add a row for it to the [Site map](#site-map) table in this README.
5. Follow the branch + PR flow above.

## Design tokens

The prototypes under `notification-prototype/` share one design-token system, defined as CSS custom properties at the top of each stylesheet (`styles.css` for desktop, `mobile/mobile.css` for the mobile view). Reuse these instead of hardcoding colors or spacing when building something new:

- **Font:** Inter (400/500/600/700/800)
- **Brand color:** Indigo (`--brand-600: #4F46E5`)
- **Neutrals:** Slate ramp (`--slate-50` … `--slate-900`)
- **Status colors:** Draft = slate, Scheduled = blue, Active = green, Expired = amber
- **Spacing scale:** 2 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 px
- **Radius scale:** 0 / 6 / 8 / 12 / 16 / 20 / 999 (full) px

There's no shared token file between the desktop and mobile stylesheets yet — if you update one, check whether the other needs the same update.

## Deployment

- **Hosting:** GitHub Pages, serving directly from the `main` branch (no separate `gh-pages` branch or build action).
- **Custom domain:** `morwix.tech`, configured via the `CNAME` file at the repo root.
- **Deploy trigger:** any push to `main` — Pages rebuilds automatically, usually live within 1–2 minutes.
- **Cache note:** Pages sets `cache-control: max-age=600` on served files. If you don't see your change immediately, hard-refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`) before assuming the deploy failed.

## Contributing

- Keep pages self-contained — a prototype folder should work if you zip it up and open it standalone.
- Match the existing code style in whichever file you're editing rather than introducing a new pattern (e.g. this repo writes plain HTML with utility-style CSS classes, not a component framework).
- No emojis, no unnecessary comments — keep markup and scripts readable on their own.
- If you're adding a new collaborator, they just need push access to this repo (or fork + PR) — no accounts, API keys, or local setup beyond `git` and a browser.

## Support

Questions about the product or PRDs: reach out to the repo owner ([@mohitvyas9265](https://github.com/mohitvyas9265)).
