# Contributing

Thanks for helping improve Gmail Recipient Preview. Keep contributions focused on the core pre-send preview experience, privacy, reliability, accessibility, and maintainability.

## Before starting

- Check `docs/backlog.md` and existing issues.
- Open an issue before a large UX change, permission change, new dependency, or Gmail integration rewrite.
- Do not include real email content, addresses, mailbox screenshots, credentials, or private account data in fixtures or reports.
- Note that this repository does not yet have an explicit software license. Clarify contribution/reuse expectations with the maintainer before investing in substantial work.

## Local setup

```bash
npm install
npm run validate
npm test
```

Chrome or Chromium is required for browser tests. Set `CHROME_PATH` if it is not installed in a standard location.

## Change guidelines

- Preserve Gmail Compose as the editable source of truth.
- Treat draft HTML, attributes, URLs, and computed styles as untrusted.
- Do not add analytics, telemetry, remote logging, external APIs, a backend, or remote image loading.
- Do not widen Chrome permissions without evidence and an explicit product/security decision.
- Prefer small, reviewable changes over a framework or architecture rewrite.
- Add a deterministic fixture/test for sanitizer, lifecycle, or synchronization behavior changes.
- Keep English and Traditional Chinese user-facing copy aligned and avoid guaranteed-rendering claims.
- Update README/docs when commands, architecture, permissions, privacy behavior, packaging, or limitations change.

## Validation

Before opening a pull request:

```bash
npm run format
npm run validate
npm test
npm run build
npm run package
npm run package:inspect
git diff --check
```

Also run the relevant real Gmail cases in `TEST_CASES.md` for selector, Compose layout, or lifecycle changes. State any case you could not run and the remaining uncertainty.

## Pull requests

Keep the description evidence-based:

- user or technical problem;
- verified cause;
- change made and alternatives considered;
- privacy/permission impact;
- commands and manual cases run;
- screenshots only when they contain synthetic data;
- known limitations and follow-up work.

Do not bundle unrelated refactors or generated release archives into a feature/fix pull request.
