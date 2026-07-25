# Privacy Policy

**Effective date:** July 24, 2026

Gmail Recipient Preview processes the content of the Gmail draft that a user explicitly chooses to preview. All processing happens locally in the active browser tab.

The extension does not collect, transmit, sell, store, or share email content, account data, personal information, or usage analytics. It has no backend service, analytics SDK, or external API integration. Images already embedded in a draft may still be loaded by Gmail or the browser as part of displaying that draft. Preview data exists only in the page while the preview panel is open and is discarded when the panel closes or the page is unloaded.

The extension stores only three interface preferences in Chrome's local extension storage: the selected interface language, the selected reference-device preset, and the selected preview size. These preferences do not contain email subjects, recipients, message bodies, attachments, or other mailbox information.

The extension requests access to `mail.google.com` so it can add the preview control to Gmail Compose and read the currently selected draft for local rendering and checks. It also requests Chrome's `storage` permission for the three interface preferences described above. It does not access contacts, mailbox history, attachments outside the open draft, or the ability to send email.

Questions or changes to this policy should be handled by the project maintainer before public distribution.
