# Prakhar Pandey — engineering portfolio

**Live website: https://prakhar2828.github.io/**

Personal engineering portfolio covering NASA Langley center operations experience, software/AI internships, independent mission software, mission analysis, research and personal interests.

- [Asteria architecture and engineering decisions](https://prakhar2828.github.io/asteria.html)
- [A2 MissionLab architecture and engineering decisions](https://prakhar2828.github.io/missionlab.html)
- [Project walkthroughs](https://prakhar2828.github.io/walkthroughs.html)
- [Wind VISION research note](https://prakhar2828.github.io/wind-vision.html)
- [Reproducible Wind VISION release](https://github.com/Prakhar2828/wind-vision-research/releases/tag/results-replay-v1)

## Hosting and updates

This is a buildless static website hosted on GitHub Pages. Publishing source: `main` branch, repository root. `.nojekyll` disables Jekyll processing. No database, API key, payment account or running laptop is required. Commits to `main` publish automatically.

To edit through GitHub, open the relevant file, select Edit, make the change and commit. For updates involving several files, use a local checkout and push them together, or use Add file → Upload files. Preserve asset paths and upload related changes in the same commit.

Main files:
- `index.html`: homepage, experience, personal interests and project cards.
- `app.js`: project-dialog content and browser interactions.
- `style.css`, `experience.css`: visual styling and responsive layouts.
- `mission-lab.js`, `vendor/asteria/`: actual C++/WebAssembly homepage fault-and-recovery exercise, runtime adapter, attribution and license.
- `asteria.html`, `missionlab.html`: visual engineering case studies.
- `wind-explorer.js`, `wind-math.mjs`, `wind-explorer.css`: browser classical-reconstruction demonstration on two real held-out synthetic fields. The estimator does not receive hidden truth.
- `assets/portfolio-share.jpg`: 1200 × 630 social preview rendered from HTML/CSS with the supplied portrait.
- `walkthroughs.html`, `.css`, `.js`: guided project tours.
- `wind-vision.html`, `.css`, `.js`: research case study.
- `downloads/`: public resume files.
- `assets/`: portrait, figures and captioned tour clips.
- `research/`: public summaries, provenance and replay receipts.

`content.json` is a structured content snapshot; changing it alone does not rebuild the static HTML or JavaScript. Keep corresponding copy in `index.html` and `app.js` synchronized. The `_headers` file is retained for portable Cloudflare deployment; GitHub Pages does not apply that file as response-header configuration.

A custom domain is optional. Add one only after registering it and verifying ownership. Domain registration/renewal are separate from free Pages hosting. If the hostname changes, update canonical/social URLs, the Person structured-data URL, `robots.txt` and `sitemap.xml`.

## Evidence and attribution

The interactive homepage lazily loads its C++/WebAssembly model when started. It commissions the spacecraft, injects a power fault, rejects premature recovery, explicitly advances 40 simulated minutes to recharge, and recovers after the health gates pass. The visitor can export the actual journal. After completing the bounded exercise, use Restart to run it again. Browser activity pauses when hidden.

Three continuous interface recordings include chapter navigation, editorial captions, VTT files, transcripts and frame-timestamp/hash provenance. They are actual browser captures rather than sequences of separately posed screenshots.

Independent projects distinguish simulations, public NASA/ESA evidence, derived quantities, models and unknowns. Wind VISION credits the upstream NASA constrained latent flow-matching research. CPU results replay passed on macOS and clean Ubuntu; no fresh GPU training or benchmark campaign is claimed. No internal NASA operational data or intern exit deck is included.

Personal portrait and resume belong to Prakhar Pandey. Third-party research assets retain their existing terms and attribution. This repository does not grant blanket rights to those materials or imply NASA endorsement.
