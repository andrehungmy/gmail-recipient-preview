# Testing

## Strategy

Testing is split into three layers:

1. **Static checks** verify syntax, formatting policy, type safety, permissions, CSP, explicit network clients, storage boundaries, and sanitizer controls.
2. **Local browser tests** execute the real content script against a deterministic Gmail-like DOM without accessing a mailbox.
3. **Manual Gmail and native-client QA** covers private Gmail DOM behavior and client rendering differences that a local fixture cannot reproduce.

## Automated commands

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm run test:security
npm test
npm run build
npm run package
npm run package:inspect
```

`npm run build` validates the source-shipped extension; it does not bundle or transpile code.

## Browser test coverage

`tests/browser-tests.mjs` starts an ephemeral server bound to `127.0.0.1`, launches installed Chrome/Chromium through `playwright-core`, blocks every non-local request, and verifies:

- Compose detection and one bound launch control;
- subject/body live synchronization;
- draft integrity while controls change;
- Light/approximate Dark Mode state;
- limitation copy and accessible live status;
- English/Traditional Chinese switching;
- no content-script preference writes to page `localStorage`;
- active-content, attribute, URL, CSS, SVG, and image sanitization;
- no preview-originated remote image request;
- local raster `data:` image preservation;
- multiple Compose windows;
- stale/cloned button rebinding;
- active Compose removal and preview cleanup;
- duplicate script initialization;
- local Landing page localization and assets.

If Chrome is not in a standard path, set `CHROME_PATH` to a Chrome or Chromium executable before running `npm test`.

## Manual Gmail release matrix

Run on Chrome Stable at 100% zoom with English and Traditional Chinese Gmail:

- new message, reply, reply all, and forward;
- standard, maximized, fullscreen, minimized, and pop-out Compose;
- existing saved drafts;
- two Compose windows, then close each in both orders;
- extension reload followed by Gmail refresh;
- subject replacement, rich-text toolbar changes, signatures, quoted content, and inline images;
- side panel and Floating preview transitions;
- keyboard-only control use, focus restoration, browser zoom, and reduced motion;
- empty, long, CJK, mixed-language, RTL, table, long-link, and long-unbroken-string fixtures;
- DevTools Network and Application inspection for network/storage boundaries.

Record Chrome version, Gmail locale, account type, operating system, timestamp, and observed selector failure for any defect. Do not record real draft content.

## Native comparison

Follow `DEVICE_RESEARCH_AND_VALIDATION.md`. Use a controlled sent fixture and record Gmail/OS/device settings. Compare layout and readability, not minor icon differences. Label all evidence by client version and date.

## What automation does not prove

- The local harness does not prove current Gmail selectors still work.
- Page-script execution does not fully reproduce Chrome's extension isolated world or extension-update lifecycle.
- Browser tests do not execute native Gmail rendering engines.
- A passing sanitizer suite is not a penetration test.
- Visual polish and color contrast still require human review at browser zoom and OS accessibility settings.

## Adding tests

Prefer deterministic fixture changes over live Gmail automation. Every test must:

- avoid account credentials and real email data;
- block or explicitly account for external requests;
- clean up browser/server processes in `finally`;
- assert a user-visible or security-relevant outcome;
- avoid timing assumptions when a DOM/state condition can be awaited.
