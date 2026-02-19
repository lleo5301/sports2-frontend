# Sports2 User Guide

Public documentation site for the Sports2 platform. Built with [Docusaurus](https://docusaurus.io/).

---

## Run Locally

```bash
cd docs-site
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Build

```bash
npm run build
npm run serve   # Preview production build
```

---

## Docker

```bash
cd docs-site
docker build -t sports2-docs .
docker run -p 8080:80 sports2-docs
```

Open [http://localhost:8080](http://localhost:8080).

---

## Deploy

The site outputs static files to `build/`. Deploy to:

- **Own infra** — Build and run the Docker image (see above). Expose port 80.
- **Vercel** — Connect repo, set root to `docs-site`, build command `npm run build`, output `build`
- **Netlify** — Same
- **GitHub Pages** — Use `npm run deploy` (configure `organizationName` and `projectName` in config)

---

## Content

- **docs/** — Markdown/MDX pages. Structure follows `docs/USER_GUIDE_PLAN.md`.
- **HERO_VIDEO_SCRIPT.md** — Script for the 2–3 min hero video. Record and embed when ready.
- **src/css/custom.css** — Theme overrides (Ink Black / Alabaster).

---

## Add a Video

1. Record using the script in `HERO_VIDEO_SCRIPT.md`.
2. Upload to Loom, Vimeo, or YouTube (unlisted).
3. Embed in `docs/intro.md`:

```mdx
import YouTube from '@site/src/components/YouTube';

<YouTube id="YOUR_VIDEO_ID" />
```

Or use a simple HTML embed:

```html
<iframe src="https://www.loom.com/embed/YOUR_ID" allowfullscreen></iframe>
```

---

## Phase 1 Status

- [x] Docusaurus site setup
- [x] Getting Started (overview, login, dashboard, team-context)
- [x] Reference (roles-permissions, FAQ)
- [x] Theme (Ink Black / Alabaster)
- [x] Hero video script
- [ ] Hero video recording (user)
- [ ] Deploy to production URL
