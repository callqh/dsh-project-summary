# DSH Project Summary

**A floating card for branches, changes, commits and pull requests inside DeepSeek Harness.**

[![CI](https://github.com/callqh/dsh-project-summary/actions/workflows/ci.yml/badge.svg)](https://github.com/callqh/dsh-project-summary/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-0.2.0--rc.2-informational.svg)](https://github.com/callqh/dsh-project-summary/releases)

[简体中文](README.md) · English

A third-party, read-only DSH plugin. The compact card floats at the **top-right of the active conversation pane**, rather than consuming an entire right-hand column. It follows the conversation as the sidebar opens, closes or resizes, and inherits the client's light/dark theme colors.

> Initial compatibility target: **DSH `0.2.0-rc.2`**. Runtime integration was developed on macOS Desktop; other DSH versions and Windows are not verified. Development tests can run on Linux CI. This project is not affiliated with DeepSeek or OpenAI. UI labels are currently Chinese.

## Preview

| Dark theme, sidebar open | Light theme, sidebar open |
| --- | --- |
| ![Dark floating project summary](assets/preview-dark.png) | ![Light floating project summary](assets/preview-light.png) |

*Component-demo screenshots use a simulated layout, theme variables and fictional repository / PR data. They are not screenshots of a real DSH session.*

## Features

- Repository and branch, detached HEAD, and ahead/behind counts against the locally known upstream.
- Changed-file count and added/deleted lines, with a read-only tracked-file diff preview.
- GitHub PR title, number, status, base branch and link; open PRs are preferred.
- Three recent commits, including short hash, subject, author and date.
- A roughly 296px-wide expanded card, persistent collapsed state, and a collapsed default on narrow screens.
- DSH light/dark palette inheritance and conversation-bounded positioning, without replacing the sidebar.
- Local Git refresh every 15 seconds while expanded; PR cache of 60 seconds; reads pause when the page is hidden.
- Graceful states for non-repositories, missing GitHub CLI, inaccessible repositories and failed queries.

## Install

### 1. Get the prebuilt bundle

Download `dsh-project-summary-0.1.1.tgz` from [GitHub Releases](https://github.com/callqh/dsh-project-summary/releases/latest). Host and Client artifacts are included: **no installation build scripts need approval**.

### 2. Install and enable through DSH

Ask your DSH Agent:

```text
Use plugin_manager to install and enable this plugin bundle:
https://github.com/callqh/dsh-project-summary/releases/download/v0.1.1/dsh-project-summary-0.1.1.tgz
```

Alternatively, provide the absolute path of the downloaded tarball. Tool arguments:

```json
{
  "action": "install_bundle",
  "target": "https://github.com/callqh/dsh-project-summary/releases/download/v0.1.1/dsh-project-summary-0.1.1.tgz",
  "enabled": true
}
```

This is a **DSH tool payload**, not a shell command. Depending on your permission settings, DSH may ask for approval. Profile-wide installation and activation affect all sessions in that profile.

### 3. Load the new version

Follow the plugin manager's result:

- `applied`: refresh the current DSH page to load the new Client bundle.
- `restart-required`: **quit and reopen DSH**; refreshing alone may keep the old version.

Open a main conversation whose working directory is a Git repository. No additional plugin configuration is required.

> Not published to the npm registry yet. Use the GitHub Release tarball, not `npm install dsh-project-summary`.

## Optional GitHub PR support

Local branches, changes and commits only require Git. PR metadata additionally requires [GitHub CLI](https://cli.github.com/) to be installed and authenticated **in the environment used by the DSH Host**:

```bash
gh auth login
gh auth status
```

The plugin queries GitHub.com repositories referenced by `origin`, supporting HTTPS, `git@github.com:` and `ssh://git@github.com/` URL forms. Open, merged and closed PRs can be displayed; an open PR is preferred among matching results. GitLab, GitHub Enterprise and alternative remote names are not supported.

Missing gh, missing credentials, insufficient access or network failure only affect the PR area. The plugin never starts a login flow, reads a token value or displays credentials.

## Data scope and limitations

| Item | Definition |
| --- | --- |
| Project | The loaded main Session's host-owned working directory; Git discovers the repository in that directory or its parents |
| Line statistics | Final worktree contents relative to `HEAD`, including staged and unstaged edits; not an AI-turn edit count |
| Untracked files | Names only; no content reads or line statistics. Untracked directories are summarized by Git's `--untracked-files=normal` mode |
| No initial commit | Staged changes are displayed; recent commits are empty |
| Binary files | Counted separately, not as text lines |
| Ahead/behind | Compared to the locally known upstream; no automatic `fetch`; zero without an upstream |
| Diff | Tracked-file preview capped at 100,000 characters; excludes untracked contents |
| Large repositories | 8-second timeout and 2 MB output cap per command; oversized output produces an error state |
| Refresh | 4-second local snapshot cache and 60-second PR cache; manual refresh still respects the PR cache |

## Security and privacy

Commands use fixed command names and argument arrays through `execFile`, not shell interpolation. Git reads disable fsmonitor, hooks, external diff, textconv, pager and optional locks. Only existing Session IDs are accepted from the client, not arbitrary filesystem paths.

There is no telemetry, independent database or credential storage. Local storage only remembers the collapsed state. Installing this trusted Host plugin authorizes local reads and GitHub CLI network queries using existing credentials; **it is not a sandbox for malicious repositories**.

See [SECURITY.md](SECURITY.md) for boundaries and private vulnerability reporting. Never put tokens, private repository contents or unredacted logs in public issues.

## Troubleshooting

- **No card:** check that the bundle is enabled, perform the required restart, and open a loaded main conversation with a working directory. Settings pages do not display the card. An incompatible runtime may lack the expected slots or semantic layout markers.
- **Theme mismatch:** the card follows the active DSH theme, not an independent OS theme preference. Choose DSH's system theme setting to follow the OS.
- **No PR:** check the GitHub.com `origin`, whether the branch has a PR, and `gh auth status` in the Host environment. Allow up to a minute for the PR cache to expire.
- **Narrow pane:** collapse the card. Its position follows the conversation boundaries rather than the window's right edge.
- **Disable or uninstall:** use DSH's plugin manager with `set_bundle` (`enabled: false`) or `remove_bundle`, targeting `dsh-project-summary`; refresh or restart as instructed.

## Development and contributions

Requires Node.js **22.18+** and Git. No sibling project or private runtime checkout is needed:

```bash
git clone https://github.com/callqh/dsh-project-summary.git
cd dsh-project-summary
npm ci --ignore-scripts
npm run check
npx playwright install chromium
npm run test:ui
npm pack --ignore-scripts
```

`npm run check` includes type checking, builds, Git tests and package checks. UI tests use mocked RPC, layout and theme fixtures: they do not start a DSH server or modify your profile. Source and prebuilt artifacts are committed.

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the project layout and guidelines, and [CHANGELOG.md](CHANGELOG.md) for release notes.

## License

[MIT](LICENSE) © 2026 callqh. Use, modify and redistribute while retaining the license notice.
