# Contributing

Thanks for helping improve DSH Project Summary! Bug reports, documentation improvements and pull requests are welcome.

## Development

Use Node.js 22.18+ and Git:

```bash
git clone https://github.com/callqh/dsh-project-summary.git
cd dsh-project-summary
npm ci --ignore-scripts
npm run check
npx playwright install chromium
npm run test:ui
```

On a Linux machine missing browser libraries, use `npx playwright install --with-deps chromium`.

An already-installed Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE`; otherwise Playwright uses its managed Chromium. Browser tests use mocked RPC and synthetic CSS fixtures, not a live DSH profile.

## Project layout

- [`src/index.ts`](src/index.ts): Host Remote service. Only accepts loaded Session IDs.
- [`src/git.ts`](src/git.ts): bounded read-only Git / GitHub CLI queries and parsers.
- [`src/client/`](src/client/): floating component, RPC descriptors and theme-variable CSS.
- [`tests/`](tests/): parser and temporary-repository integration tests; synthetic UI palette.
- [`scripts/`](scripts/): client bundler, package checks and browser component verification.
- [`lib/`](lib/) and [`client/`](client/): committed prebuilt artifacts, so end users do not need install scripts.

## Before opening a PR

1. Keep Git operations read-only; do not add writes or credential collection as an incidental change.
2. Keep the card within the conversation pane; avoid replacing the DSH sidebar or shell.
3. Inherit DSH theme tokens rather than independently following the OS color scheme.
4. Add regression tests and run `npm run check` and `npm run test:ui`.
5. Commit regenerated build artifacts when changing source or CSS. Use the locked dependency versions.
6. Use only synthetic data in screenshots and tests. Redact local paths, credentials and private repository details.

PR titles may use conventional prefixes such as `fix:`, `feat:` or `docs:`. Please describe runtime version, operating system, reproduction steps and known limits. English and Chinese issues are both welcome.

## Packaging

```bash
npm run check
npm pack --ignore-scripts
```

Publish the generated tarball as a GitHub Release asset, with its SHA-256 checksum. This project does not publish to npm automatically. Installing from GitHub uses committed artifacts, not an install-time build.

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
