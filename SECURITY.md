# Security Policy

This repository contains a client-side React tracker app. This SECURITY.md documents how to report vulnerabilities and the minimal security posture for this project.

Reporting
- If you find a security vulnerability, please open an issue with the label `security` or email security@your-org.example. Include reproduction steps and an example payload if applicable.

Secrets and configuration
- Do NOT commit secrets to the repository. Secrets used by the app (passcode hash) must be provided at build time via environment variables (Vite: VITE_PASSCODE_HASH, VITE_PASSCODE_HINT).
- If a secret was accidentally committed, rotate it immediately and remove it from git history.

Dependency management
- Run `npm audit` locally and fix or mitigate issues before merging pull requests.
- The repository includes a GitHub Actions workflow to run dependency checks on PRs.

Code scanning
- New first-party JS/TS code should be scanned with Snyk. See CLAUDE.md for organizational requirements.

Client-side controls
- This app uses client-side passcode locking for convenience. This is not a substitute for server-side authentication; do not rely on it to protect sensitive assets served from a server.

Contact
- security@your-org.example
