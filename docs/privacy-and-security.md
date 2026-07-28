# Privacy and Security

## Plain-language summary

Gmail Recipient Preview reads the subject and body of the Gmail draft the user chooses to preview. Processing happens locally in that Gmail tab. The extension does not send draft content to a server, AI API, analytics provider, logging service, or maintainer.

The extension stores three interface preferences in Chrome's local extension storage: language, reference-device preset, and preview scale. It does not store email bodies, subjects, recipients, images, attachments, or warning results.

## Data accessed

While Preview is open, the content script can read:

- the active Compose subject field;
- the active Compose rich-text body;
- formatting and layout information needed for the preview and warnings.

The current MVP does not intentionally read contact history, mailbox history, other messages, attachment file contents, or credentials. Gmail's private DOM is not an authorization boundary, so selectors must remain narrow and be revalidated before each release.

## Data location and lifetime

- Draft processing: active Gmail renderer process.
- Preview state: in-memory DOM and JavaScript state while the panel is open.
- Draft persistence by this extension: none.
- Preference persistence: `chrome.storage.local` only.
- Page-owned Gmail `localStorage`: not used by the content script.

Closing Preview removes its rendered draft. Unloading the Gmail page destroys the content-script context.

## Transmission and network behavior

The production JavaScript contains no `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, or `sendBeacon` client. It includes no analytics, telemetry, remote logging, remote fonts, or remote JavaScript.

Images are a separate browser network boundary. Inserting an `http`, `https`, protocol-relative, or relative image URL into Preview could contact a host even without `fetch`. The sanitizer therefore replaces network-backed images with a local placeholder. Only local `blob:` URLs and allowlisted raster base64 `data:` images remain renderable in Preview.

Gmail itself may already load or proxy an image in the original Compose surface before the extension reads it. The extension cannot prevent Gmail's own behavior and does not claim otherwise.

Links remain user-initiated navigation. Sanitized links reject executable/data schemes and use `noopener noreferrer` when opened.

## Permissions

| Permission                  | Why it is needed                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| `https://mail.google.com/*` | Inject the local content script and CSS into Gmail so the user can launch Preview from Compose. |
| `storage`                   | Persist only locale, reference-device, and preview-scale preferences.                           |

The extension does not request `tabs`, `history`, `identity`, `cookies`, `contacts`, `downloads`, broad scripting, `<all_urls>`, or email-sending privileges.

## Untrusted HTML controls

Draft HTML is treated as malicious or malformed input. Controls include:

- tag, attribute, URL, and CSS-property allowlists;
- removal of scripts, frames, objects, forms, metadata, stylesheets, and interactive form controls;
- removal of event attributes and `contenteditable` state;
- rejection of `javascript:`, executable data, CSS `url()`, `expression()`, and `@import` values;
- removal of position, z-index, transform, animation, and other layout-escape properties;
- subject escaping with `textContent`;
- local-only image rendering.

Automated browser tests exercise active markup, unsafe links/styles, SVG, remote images, safe inline images, and DOM-escape attempts.

## Extension-page security

- Manifest V3 is used.
- Popup and Landing scripts are local packaged files.
- Extension pages use `script-src 'self'; object-src 'self'`.
- No resource is declared web-accessible.
- No external connection or background service worker is declared.
- No dynamic code execution is used.

## Known limitations

- A compromised Gmail renderer or malicious browser extension may observe data available in the page; the product does not provide renderer isolation from Gmail itself.
- The sanitizer is purpose-built and must remain covered by tests. It is not a third-party security audit or formal HTML parser proof.
- Real Gmail DOM changes may cause the extension to read the wrong editable region or fail to initialize; manual regression testing remains mandatory.
- User-selected links can navigate to external sites.
- Gmail may load draft images independently of Preview.

## Secure-development rules

- Never add draft logging, analytics, telemetry, external APIs, or network image loading without an explicit product/privacy decision.
- Do not widen permissions to compensate for fragile selectors.
- Add an automated regression case for every sanitizer policy change.
- Treat all Compose markup, attributes, URLs, computed styles, and labels as untrusted.
- Inspect the final ZIP and run the network/storage manual checks before release.
- Report vulnerabilities privately according to `SECURITY.md`; never attach real email data to a public issue.
