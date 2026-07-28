# Decision Log

## 2026-07-26 — Block network-backed images in Preview

- **Problem:** Inserting sanitized `http`, `https`, protocol-relative, or relative image sources could contact an image host and reveal a request/open signal.
- **Evidence:** The sanitizer accepted these schemes and inserted the result through the preview body's `innerHTML`.
- **Decision:** Render only local `blob:` and allowlisted raster base64 `data:` images. Replace all other images with a localized placeholder and warning.
- **Alternatives considered:** Keep remote images for higher fidelity; add a user opt-in; proxy images through a backend.
- **Trade-off:** Image-layout fidelity is lower, but the local-processing promise is defensible and no backend or new permission is introduced.
- **Files changed:** `content.js`, `content.css`, tests, privacy/security documentation.
- **Validation:** Browser test blocks all non-local requests and verifies no request occurs when Preview opens.

## 2026-07-26 — Do not fall back to Gmail page storage

- **Problem:** An invalidated extension context caused preference reads/writes to fall back to `window.localStorage` on `mail.google.com`.
- **Evidence:** Existing content-script helpers called `localStorage.getItem` and `setItem`.
- **Decision:** Return in-memory defaults and no-op failed writes until Gmail is refreshed.
- **Alternatives considered:** Continue page storage for persistence; inject a page bridge; add a background worker.
- **Trade-off:** A stale content script may not persist a preference after extension reload, but no extension state crosses into Gmail-owned storage.
- **Files changed:** `content.js`, `PRIVACY.md`, README, security checks, tests.
- **Validation:** Static check forbids `localStorage` in `content.js`; browser test confirms no preference key appears in page storage.

## 2026-07-26 — Rebind cloned or stale Compose controls

- **Problem:** A Compose DOM clone can contain the extension button markup without cloned JavaScript listeners or observer properties.
- **Evidence:** The multiple-Compose browser test reproduced a visible but inert cloned button.
- **Decision:** Treat only a button with the isolated-world `_grpBound` property as initialized. Remove/recreate stale markup and disconnect known observers.
- **Alternatives considered:** Trust the class name; delegate every click at the document level.
- **Trade-off:** Rebinding adds a small DOM replacement but preserves per-Compose ownership and avoids a broad document click handler.
- **Files changed:** `content.js`, runtime types, browser tests.
- **Validation:** Multiple-Compose and duplicate-initialization tests pass.

## 2026-07-26 — Keep a source-shipped extension

- **Problem:** Release tooling was missing, but adding a framework/bundler would increase runtime and maintenance complexity.
- **Evidence:** The extension has three local browser scripts and no production dependencies or transpilation need.
- **Decision:** Keep direct source shipping. Define `build` as validation and add an explicit package allowlist.
- **Alternatives considered:** Vite/Webpack/React migration; copying the repository wholesale into a ZIP.
- **Trade-off:** Runtime modularity remains limited, but the release artifact is small, auditable, and reproducible.
- **Files changed:** `package.json`, `tools/package-*.mjs`, `tools/inspect-package.mjs`, CI and docs.
- **Validation:** Package inspection compares every archive entry with the allowlist.

## 2026-07-26 — Test against a local Gmail-like harness

- **Problem:** Core lifecycle and sanitizer logic had no automated regression suite; live Gmail automation would require credentials and fragile selectors.
- **Evidence:** The repository contained `qa/harness.html` and manual Markdown cases only.
- **Decision:** Use `playwright-core` with installed Chrome, an ephemeral local server, and a non-local request block.
- **Alternatives considered:** Live Gmail end-to-end tests; a large screenshot suite; a second application framework.
- **Trade-off:** Determinism and privacy improve, but real Gmail remains a manual release gate.
- **Files changed:** `tests/browser-tests.mjs`, `package.json`, CI and testing docs.
- **Validation:** Browser suite covers sync, sanitization, controls, localization, multiple drafts, cleanup, stale buttons, and duplicate initialization.
