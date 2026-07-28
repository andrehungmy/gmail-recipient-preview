# Security and Stability Review

**Review date:** July 28, 2026

**Reviewed version:** 0.8.3
**Scope:** Manifest V3 configuration, Gmail content script, preview rendering, popup, Landing page, local preference storage, and release assets.

## Executive summary

The extension has a deliberately small security boundary. It runs only on `https://mail.google.com/*`, requests only Chrome's `storage` permission, has no backend, and contains no analytics, advertising, remote JavaScript, AI API, or outbound application request.

This review found one material hardening opportunity in draft rendering. The previous sanitizer removed scripts and event-handler attributes but allowed more HTML elements and inline CSS than the preview needed. The current candidate uses an email-content allowlist, filters URL protocols and CSS properties, removes document-level and active elements, and prevents pasted content from positioning itself outside the message body.

No evidence of draft-content persistence or transmission was found. Remaining risks are primarily integration and rendering risks caused by Gmail's private DOM and native-client differences, not data-exfiltration paths in this codebase.

## Threat model

The review assumes that a draft may contain untrusted or malformed HTML copied from a web page, document editor, AI tool, forwarded message, signature, or received email thread. The main risks are:

1. Active content executing in the Gmail page.
2. Draft markup escaping the preview body and covering Gmail or extension controls.
3. Unsafe links or embedded resources loading unexpected schemes.
4. Draft content being sent to a server, analytics service, or external API.
5. Sensitive draft content being written to persistent storage.
6. Broad browser permissions exposing mailbox data outside the active Compose surface.
7. Gmail DOM changes breaking button placement, live updates, or layout restoration.

## Findings and controls

### Fixed: draft HTML sanitizer was broader than necessary

**Previous behavior:** Scripts, stylesheets, iframes, objects, forms, inputs, buttons, and event-handler attributes were removed, but unsupported tags and potentially disruptive inline CSS could remain.

**Current control:**

- Allows only common email-content elements such as paragraphs, spans, emphasis, lists, blockquotes, links, images, and tables.
- Removes active and document-level elements with their content.
- Unwraps unsupported containers so readable text is preserved without preserving unsafe behavior.
- Filters attributes by element type.
- Allows only local `blob:` and safe raster base64 `data:` image sources in Preview.
- Replaces HTTPS, HTTP, protocol-relative, relative, CID, and unsupported image sources with a local placeholder so Preview does not contact their hosts.
- Allows only HTTPS, HTTP, mailto, tel, fragment, and relative links.
- Adds `target="_blank"` plus `rel="noopener noreferrer"` to safe links.
- Filters inline CSS to presentation properties and rejects `url()`, `expression()`, `@import`, and `javascript:` values.
- Removes positioning, z-index, transforms, animations, and other properties that could move draft content outside the preview body.

### Verified: narrow extension permissions

`manifest.json` requests:

- `storage`
- Host access to `https://mail.google.com/*`

It does not request tabs, identity, contacts, history, cookies, downloads, scripting across arbitrary sites, or the ability to send email.

### Verified: no application network client

Static review found no use of `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, remote script imports, or analytics SDKs. External links appear only as user-initiated GitHub links on the Landing page.

Gmail may already load or proxy images in the original Compose surface. Preview does not repeat that request: network-backed image sources are replaced with local placeholders before preview insertion.

### Verified: preference-only persistence

Stored values are limited to:

- Interface language
- Reference-device preset
- Preview scale

The extension does not persist subjects, recipients, message bodies, inline images, attachments, or audit results.

Warning ignore and mute choices are held only in memory and are scoped to the active Compose DOM instance. Preview-location markers are generated internally, stripped from draft-supplied markup before rendering, and accepted by the sanitizer only when they match the current in-memory audit result. These controls never write back to the Gmail editor.

If Chrome invalidates an already-injected content script during an extension reload, preference access fails closed to in-memory state until Gmail is refreshed. The content script does not write preferences into `mail.google.com` local storage.

### Verified: local draft handling

The content script reads the active Compose DOM only after the user opens Preview. The generated preview is removed when closed or when the page unloads. Preview actions do not mutate the Gmail subject or body.

### Verified: extension-page scripting model

Popup and Landing page behavior is implemented in local JavaScript files. There is no inline executable script and no remote JavaScript dependency. Manifest V3's default extension-page Content Security Policy remains in effect.

## Stability review

- Preview buttons are bound to individual Compose roots, including multiple open drafts.
- Mutation and resize observers recover when Gmail hydrates or rebuilds Compose controls.
- Compose geometry is restored before close, maximize, minimize, fullscreen, and pop-out transitions.
- Floating-preview scale updates the device during a drag and resizes the outer window only when the gesture ends.
- Storage access is guarded so an invalidated extension context does not create an uncaught promise error.
- Landing and popup copy is localized without injecting translated HTML.
- Store screenshots are deterministic 1280 × 800 exports based on the current local QA interface.

## Residual risks and required release checks

1. **Gmail DOM changes:** Gmail can change private selectors or action-row structure without notice. Run the Compose regression matrix on Chrome Stable before each release.
2. **Native rendering variance:** Device presets model reference viewports; they do not execute Gmail's iOS or Android renderer. Keep native comparison evidence versioned and labeled.
3. **Remote draft images:** Gmail or the browser may load images already embedded in the draft. Confirm this behavior in DevTools Network and keep the privacy disclosure.
4. **Image fidelity:** Network-backed images are intentionally hidden in Preview. Validate that placeholders and warnings remain clear and that Gmail's original Compose behavior is accurately disclosed.
5. **Sanitizer compatibility:** Run supported- and active-content fixtures after every sanitizer change to ensure safety improvements do not remove expected Gmail formatting.
6. **Extension reload:** Refresh Gmail after reloading the unpacked extension so the active page receives the current content script.

## Release gate

Before Chrome Web Store submission:

- Run all P0, SAF, LIVE, IMG, WEB, and native-comparison tests in `TEST_CASES.md`.
- Inspect DevTools Network while opening, editing, and closing Preview; confirm no extension-originated backend, analytics, or network-image request.
- Inspect Chrome extension storage and `mail.google.com` local storage; confirm the three preferences exist only in extension storage and no draft data is persisted.
- Test the active-content sanitizer fixture and verify that no markup escapes `.grp-email-body`.
- Test a real Gmail draft containing an inline image, link, table, signature, quoted thread, and long copy.
- Reload the extension while Gmail remains open, verify graceful fallback, then refresh Gmail and retest.
- Review the final package contents and exclude QA-only, source, and working files from the Store upload.

This is an internal code and configuration review, not a third-party penetration test.
