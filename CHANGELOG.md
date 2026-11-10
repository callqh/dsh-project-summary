# Changelog

## 0.1.2 — Unreleased

- Remove the exact DSH 0.2.0-rc.2 peer gate that disabled the plugin on DSH 0.2.2-rc.1.
- Use host-provided Cordis and Remote protocol modules; keep pinned packages for development only.
- Add distribution regression checks to prevent private host dependencies or exact-version gates returning.
- Verified on macOS with the 0.2.2-rc.1 host in disposable Web profiles: hoisted and isolated installs, built-in account RPC, project summary and diff for a newly created test session, and client bundle discovery.
- Existing Git tests and synthetic browser layout/theme checks pass. Windows and future breaking host API changes remain unverified.

## 0.1.1 — Initial public release

- Compact read-only project summary in the main DSH conversation.
- Repository and branch, detached HEAD, ahead/behind counts and three recent commits.
- HEAD-to-worktree change statistics and a bounded tracked-file diff preview.
- GitHub.com PR metadata through optional, already-authenticated GitHub CLI.
- Automatic DSH light/dark palette inheritance.
- Conversation-bounded placement that follows an opened or resized right sidebar.
- Persistent collapsed state, with a collapsed default on narrow screens.
- Bounded subprocess reads, fsmonitor/hooks/external-diff/textconv disabled, and graceful empty/error states.
- Chinese/English documentation, MIT license, reproducible dependency lock and automated checks.

Initial compatibility target: DSH `0.2.0-rc.2`. UI labels are currently Chinese. GitLab and GitHub Enterprise are not supported.
