# Known Limitations

## Rendering fidelity

- The preview does not execute Gmail iOS, Gmail Android, Apple Mail, Outlook, or another native client's rendering engine.
- Dark Mode is an approximation. Clients apply different color inversion, background preservation, link treatment, and image handling.
- Reference-device presets model logical layout dimensions, not physical size, pixel density, browser chrome, text scaling, or every accessibility setting.
- Gmail and receiving servers may rewrite markup, quotes, signatures, links, images, and whitespace after send.

## Content

- Network-backed images are hidden in Preview to avoid contacting their hosts. This protects the local-processing boundary but reduces image-layout fidelity. Local `blob:` and allowlisted raster base64 `data:` images can remain visible.
- CID images, SVG, video, audio, forms, embedded documents, active content, and unsupported wrappers are not faithfully rendered.
- The sanitizer intentionally removes behavior and layout properties that could escape the email body.
- Wide tables are detected heuristically and may still behave differently in a recipient client.
- Contrast warnings use the current Compose DOM's computed styles and a limited background walk; gradients, images, blending, and client color transformations can produce false negatives or positives.
- The sender identity is represented generically rather than extracted from the account.
- Recipient chips, CC/BCC presentation, attachment cards, scheduled-send state, and confidential-mode behavior are outside the current preview model.

## Gmail integration

- Gmail exposes no stable public Compose DOM API. Private selectors and layout behavior can change without notice.
- The extension supports common new-message, reply, forward, saved-draft, and multiple-Compose structures only to the extent verified by the current manual matrix.
- Pop-out windows and Gmail experiments may require selector maintenance.
- Reloading the extension requires refreshing open Gmail tabs before new content-script code is active.

## Accessibility and localization

- Core controls have keyboard focus styles and accessible names, but a complete screen-reader matrix has not been run.
- English and Traditional Chinese are supported in product surfaces and Chrome-managed extension metadata. Detailed Chrome Web Store descriptions are maintained separately for each locale.
- RTL draft content is preserved when supported by sanitized `dir` attributes, but the full preview shell is not localized for RTL languages.

## Platform and release

- The MVP targets Chrome Manifest V3 and has not been qualified for Edge, Brave, or other Chromium distributions.
- Version 0.8.3 is publicly available in the Chrome Web Store. There is no separate rollback channel or installed-user migration evidence yet.
- The repository has no explicit software license yet.
- Automated tests use a local Gmail-like harness; real Gmail manual QA remains a release gate.
