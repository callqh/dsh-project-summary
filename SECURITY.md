# Security policy

## Supported version

The latest GitHub release is supported. The initial compatibility target is DSH `0.2.0-rc.2`; other runtime versions have not been verified. Do not bypass DSH's compatibility checks without understanding the risk.

## What this plugin can access

- The working directory in an existing, loaded DSH Session's host-owned header. The browser sends a Session ID, not a filesystem path.
- Local Git repository metadata, changed-file names, recent commit subjects/authors/timestamps and tracked-file diff contents.
- GitHub.com PR metadata through the already-authenticated `gh` CLI, when `origin` is a supported GitHub URL.

All data is displayed in the DSH client. This plugin has no telemetry, analytics, dedicated database, token-storage mechanism, automatic login, commit/push commands or credential upload. It uses the Host environment's existing GitHub CLI credentials and does not read or return their values.

Local storage remembers only the card's collapsed state. In-memory Host caches are bounded to 50 entries; local snapshots have a 4-second cache window and PR metadata a 60-second window. Data is not independently persisted by this plugin.

## Read-only behavior and limits

Commands run using `execFile` with fixed command names and argument arrays, never shell interpolation. Git reads explicitly disable fsmonitor, hooks, external diff, textconv, pager and optional locks. Untracked file contents are not read by the diff viewer. The plugin does not modify repository files or Git configuration.

Commands time out after 8 seconds and output is capped at 2 MB. Tracked diffs shown in the client are capped at 100,000 characters. Large output and inaccessible repositories produce a visible error state, rather than falling back to an unbounded read.

`gh` performs network requests to GitHub.com using its existing credentials. A PR query failure does not prevent local Git display. Only supported `origin` URL forms are accepted; GitLab, arbitrary remote hosts and GitHub Enterprise are not queried.

## Boundaries

This is a trusted local Host plugin, not a sandbox. Installing it authorizes its read-only subprocess queries, independently of agent tool approval prompts. It inherits the Host environment. Do not install untrusted plugin builds or open untrusted repositories on a Host with sensitive credentials. Git configuration includes behavior beyond the explicitly disabled options; these measures do not make an arbitrary malicious repository safe.

The component tests use synthetic theme variables and mocked RPC responses. They do not establish compatibility with all future DSH releases. Conversation placement relies on semantic DOM markers in the supported client.

## Reporting a vulnerability

Please use GitHub's [private vulnerability reporting](https://github.com/callqh/dsh-project-summary/security/advisories/new). Do not include tokens, credentials, private repository contents, unredacted logs or real session identifiers in public issues. Provide a minimal reproduction using a throwaway repository and describe the expected and actual behavior.
