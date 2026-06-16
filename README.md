# Masters Tracker

This repository contains a React tracker app for your European master’s application plan.

[![pages-build-deployment](https://github.com/fontvu/linhtinh/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/fontvu/linhtinh/actions/workflows/pages/pages-build-deployment)
## Security

- See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting.
- See [docs/SECURE_DATA_HANDLING.md](docs/SECURE_DATA_HANDLING.md) for guidelines on handling sensitive documents.

## Publish to GitHub Pages

1. Create a GitHub repository and push this folder.
2. Install dependencies:
   - `npm install`
3. Build the site:
   - `npm run build`
4. Enable GitHub Pages in the repository settings:
   - Source: `docs/` folder on the `main` branch.
5. The app is served from `/masters_tracker_v2/` on your Pages site: `https://<your-username>.github.io/<repo>/masters_tracker_v2/`.
6. Wait a minute and open the site URL shown in GitHub Pages.

## Local development

- `npm run dev`

## Notes

- Build output is configured to `docs/` so GitHub Pages can serve the static site directly.
- The app stores progress in browser storage.
