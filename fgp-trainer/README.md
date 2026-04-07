# FGP Training App

A progressive web app (PWA) for Flash Gordon Pool — a structured billiards training system covering fundamentals, shotmaking, position play, pattern play, safety play, kicking, and break shots.

## Features

- **9 Training Chapters** — 100+ drills based on Phil Capelle's *Practicing Pool*
- **RDS System** — Runout Drill System with 16 levels + Fargo rating estimation
- **Flash Coach** — AI video analysis via Gemini 2.5 Flash
- **Cadence Trainer** — 24-beat pre-shot routine with voice cues and hands-free control
- **Fargo Tracker** — Unified rating tracker across official, RDS, and AI estimates
- **Offline capable** — Service worker caches all assets for use without a connection
- **Installable PWA** — Add to home screen on iOS and Android

## Structure

```
fgp-app/          ← PWA (deploy this folder to GitHub Pages)
  index.html
  app.js
  cadence.js
  rds.js
  sw.js
  manifest.json
  logo.png
  icon-192.png
  icon-512.png
  diagrams/       ← Drill diagram images
rds-app/          ← Legacy standalone RDS app
```

## Deployment (GitHub Pages)

The app is designed to be served from a `/fgp-app/` path. For deployment:

1. The `fgp-app/` contents should live at the root of a dedicated GitHub repo
2. Enable GitHub Pages on that repo (Settings → Pages → Deploy from branch → main → / root)
3. For a custom domain (e.g. `apps.flashgordonpool.com`), add a `CNAME` file at the repo root containing the domain, then configure your DNS with a CNAME record pointing to `<username>.github.io`

> **Note:** If keeping this monorepo structure, use a GitHub Actions workflow to deploy only the `fgp-app/` subdirectory to a `gh-pages` branch.

## Technology

- Vanilla JS / HTML / CSS — no build step, no dependencies
- Web Speech API for voice commands
- Cache API + Service Worker for offline support
- LocalStorage for progress, settings, and Fargo data
