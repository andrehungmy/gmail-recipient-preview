# Release Checklist

Use this checklist for a specific candidate version. Record evidence and do not mark an item complete based on an earlier archive or working tree.

**Candidate:** 0.8.3

**Automated verification date:** July 28, 2026

**Artifact:** `dist/gmail-recipient-preview-v0.8.3.zip`

**SHA-256:** `967aabf2c614cc4f371efa46e34228ed37a0c6e0c1a1cb4193e53aacccd5c26e`
**Automated browser environment:** Google Chrome 150.0.7871.187 on macOS 26.5.2

## Candidate identity

- [x] `manifest.json` and `package.json` versions match.
- [ ] The working tree and intended release commit are identified.
- [x] Release notes describe only verified changes.
- [ ] No unrelated or unreviewed local changes are included.

## Product behavior

- [ ] New message, saved draft, reply, reply all, and forward open Preview.
- [ ] Subject, body, formatting, signature, quote, and safe inline image changes synchronize.
- [ ] Mobile/Desktop, Light/approximate Dark, reference-device, scale, locale, side-panel, and Floating controls work.
- [ ] Two Compose windows receive independent launch controls and the selected draft drives Preview.
- [ ] Minimize, maximize, fullscreen, pop-out, close, and Gmail navigation restore Gmail-owned layout.
- [ ] Empty and unsupported states use understandable copy and never modify the draft.

## Privacy and permissions

- [x] Permissions remain exactly `storage` plus `https://mail.google.com/*` host access, unless a documented release decision says otherwise.
- [ ] DevTools Network shows no extension-originated backend, analytics, telemetry, AI, logging, or network-image request.
- [x] `chrome.storage.local` contains only locale, device preset, and preview scale.
- [x] Gmail `localStorage` contains no keys written by the content script.
- [x] Remote images render local placeholders; the disclosure explains Gmail may load source images independently.
- [x] Privacy policy, store disclosure, and implemented behavior agree.

## Security

- [x] `npm run test:security` passes.
- [x] Active-content and supported-content sanitizer fixtures pass.
- [x] Unsafe tags, attributes, URL schemes, CSS URL values, position/z-index, and SVG are removed.
- [x] No `eval`, dynamic code generation, remote JavaScript, inline extension-page script, or draft-content log is present.
- [x] Explicit extension CSP remains self-only.
- [x] `npm audit` findings are reviewed; production dependency count remains zero.
- [x] Secret scan finds no credentials, tokens, private email content, or personal screenshots.

## Accessibility

- [x] All controls are keyboard reachable and show visible focus.
- [x] Close returns focus to the active editor when it still exists.
- [x] Settings focus enters/exits predictably and Escape closes the correct layer.
- [x] Audit state updates are announced without repeated noise.
- [x] Color is not the only warning indicator.
- [ ] 200% browser zoom and reduced motion remain usable.
- [x] English and Traditional Chinese labels have accessible names.

## Localization and copy

- [x] English and Traditional Chinese product names and key terms are consistent.
- [x] Dark Mode, viewport, and rendering claims remain explicitly approximate.
- [x] Privacy claims do not exceed the code behavior.
- [x] No malformed dimensions, untranslated critical strings, or stale version text remain.

## Automated validation

- [x] `npm ci` succeeds from the candidate lockfile.
- [x] `npm run format:check` passes.
- [x] `npm run lint` passes.
- [x] `npm run typecheck` passes.
- [x] `npm run test:security` passes.
- [x] `npm test` passes with the locally installed Chrome.
- [x] `npm run build` passes.

## Package inspection

- [x] `npm run package` succeeds.
- [x] `npm run package:inspect` reports only allowlisted runtime files.
- [x] The ZIP contains all `landing.html` image references.
- [x] The ZIP excludes tests, QA fixtures, raw/final store working assets, internal docs, logs, environment files, source maps, and development dependencies.
- [ ] Load the unpacked ZIP contents in a clean Chrome profile and repeat smoke tests.
- [x] Record archive name, size, and checksum.

## Documentation and open source

- [x] README commands and structure match the candidate.
- [x] Architecture, testing, privacy/security, limitations, backlog, and decision log are current.
- [x] `SECURITY.md` provides a private reporting path.
- [x] Contribution and GitHub templates remain practical.
- [ ] An explicit software license has been selected and added, or public reuse remains blocked and clearly disclosed.

## Chrome Web Store readiness

- [x] Store name, short description, detailed description, category, language, and privacy fields match the product.
- [x] Screenshots are generated from the candidate and contain no real mailbox data.
- [x] Icons meet Store requirements.
- [ ] Support/contact and privacy URLs are available.
- [x] Single-purpose, user-data, and permission justifications are reviewed.
- [x] Native-client limitations and independent/non-Google status are clear.
- [x] No submission occurs until the maintainer explicitly approves it.

## Manual QA evidence

- [ ] Chrome Stable, OS, Gmail locale, account type, timestamp, and test owner are recorded.
- [ ] `TEST_CASES.md` P0, LIVE, SAF, IMG, WEB, localization, and lifecycle cases pass.
- [ ] Native comparison evidence follows `DEVICE_RESEARCH_AND_VALIDATION.md`.
- [ ] Any skipped test states the reason, resulting uncertainty, and later verification method.

## Rollback considerations

- [ ] The previous known-good ZIP and source commit are retained.
- [ ] Migration risk for stored preference keys is documented.
- [ ] A rollback does not require deleting user data because no draft data is stored.
- [ ] The maintainer knows how to halt rollout or publish a corrective version without force-pushing or rewriting Git history.
