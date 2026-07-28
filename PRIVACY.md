# Privacy Policy

**Effective date:** July 28, 2026

Gmail Recipient Preview processes the content of the Gmail draft that a user explicitly chooses to preview. All processing happens locally in the active browser tab.

The extension does not collect, transmit, sell, store, or share email content, account data, personal information, or usage analytics. It has no backend service, analytics SDK, or external API integration. Preview data exists only in the page while the preview panel is open and is discarded when the panel closes or the page is unloaded.

Network-backed images in draft HTML are replaced with a local placeholder inside Preview so opening Preview does not contact the image host. Local `blob:` images and allowlisted raster base64 `data:` images may remain visible. Gmail itself may already load or proxy an image in the original Compose surface before the extension reads the draft; the extension cannot prevent or control Gmail's own network behavior.

The extension stores only three interface preferences in Chrome's local extension storage: the selected interface language, the selected reference-device preset, and the selected preview size. If extension storage is unavailable or an extension reload invalidates a previously injected content script, the content script uses in-memory defaults and does not fall back to Gmail-owned page storage. These values never contain email subjects, recipients, message bodies, attachments, or other mailbox information.

The extension requests access to `mail.google.com` so it can add the preview control to Gmail Compose and read the currently selected draft for local rendering and checks. It also requests Chrome's `storage` permission for the three interface preferences described above. It does not access contacts, mailbox history, attachments outside the open draft, or the ability to send email.

Gmail Recipient Preview's use of information received from Google services adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements. User data is used only for the extension's disclosed preview feature. It is not sold, transferred for advertising, used to determine creditworthiness, or made available for human review by the developer.

For product support, use the repository's GitHub Issues page. For security or privacy concerns, use the repository's private vulnerability-reporting flow described in `SECURITY.md`. Never include real email content, addresses, credentials, or mailbox screenshots in a public report.
