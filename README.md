# Prakhar Pandey — engineering portfolio

**Live website: https://prakhar2828.github.io/**

Personal engineering portfolio covering NASA Langley center operations experience, software/AI internships, independent mission software, mission analysis, research and personal interests.

- [Project walkthroughs](https://prakhar2828.github.io/walkthroughs.html)
- [Wind VISION research note](https://prakhar2828.github.io/wind-vision.html)
- [Reproducible Wind VISION release](https://github.com/Prakhar2828/wind-vision-research/releases/tag/results-replay-v1)

## Hosting and updates

This is a buildless static website hosted on GitHub Pages. Publishing source: `main` branch, repository root. `.nojekyll` disables Jekyll processing. No database, API key, payment account or running laptop is required. Commits to `main` publish automatically.

To edit through GitHub, open the relevant file, select Edit, make the change and commit. For updates involving several files, use a local checkout and push them together, or use Add file → Upload files. Preserve asset paths and upload related changes in the same commit.

Main files:
- `index.html`: homepage, experience, personal interests and project cards.
- `app.js`: project-dialog content and browser interactions.
- `style.css`: visual styling and responsive layouts.
- `walkthroughs.html`, `.css`, `.js`: guided project tours.
- `wind-vision.html`, `.css`, `.js`: research case study.
- `downloads/`: public resume files.
- `assets/`: portrait, figures and captioned tour clips.
- `research/`: public summaries, provenance and replay receipts.

`content.json` is a structured content snapshot; changing it alone does not rebuild the static HTML or JavaScript. Keep corresponding copy in `index.html` and `app.js` synchronized. The `_headers` file is retained for portable Cloudflare deployment; GitHub Pages does not apply that file as response-header configuration.

A custom domain is optional. Add one only after registering it and verifying ownership. Domain registration/renewal are separate from free Pages hosting. If the hostname changes, update canonical/social URLs, the Person structured-data URL, `robots.txt` and `sitemap.xml`.

## Evidence and attribution

Independent projects distinguish simulations, public NASA/ESA evidence, derived quantities, models and unknowns. Wind VISION credits the upstream NASA constrained latent flow-matching research. CPU results replay passed on macOS and clean Ubuntu; no fresh GPU training or benchmark campaign is claimed. No internal NASA operational data or intern exit deck is included.

Personal portrait and resume belong to Prakhar Pandey. Third-party research assets retain their existing terms and attribution. This repository does not grant blanket rights to those materials or imply NASA endorsement.
