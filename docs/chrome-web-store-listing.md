# Chrome Web Store Submission Copy

**Candidate:** 0.8.3

**Primary language:** English

**Category:** Productivity

**Distribution:** Public
**Pricing:** Free

Use this document as the source of truth when completing the Chrome Web Store Developer Dashboard. Recheck every field against the final release ZIP before submission.

## Store listing

### Name

Gmail Recipient Preview

### Summary

Preview how a Gmail draft may appear to recipients across common devices, themes, and Gmail surfaces.

### Detailed description

Gmail Recipient Preview adds a Preview control to Gmail Compose so you can inspect a draft from a recipient-oriented reading view before sending it.

Keep editing your Gmail draft while the preview updates beside it. Compare common mobile reading widths, switch between Light and approximate Dark Mode, and use a movable Floating preview when you need more room to write.

The extension also flags a focused set of formatting risks, including low-contrast or hidden text, very small text, excessive blank space, long URLs, unbroken strings, wide media or tables, and network-backed images that are intentionally hidden inside Preview.

Key features:

- Live synchronization for the active Gmail draft
- Mobile and desktop reference views
- iPhone, Pixel, and Samsung Galaxy reference viewports
- Light and approximate Dark Mode
- Adjustable preview size and draggable Floating preview
- Local formatting checks with warning highlighting and per-draft controls
- English and Traditional Chinese interface
- No account, backend, analytics, telemetry, advertising, or external AI API

Privacy is part of the product design. Draft content is processed locally in the active Gmail tab and is not uploaded or stored by the extension. Network-backed images are replaced with a local placeholder inside Preview. Only interface language, reference device, and preview size are stored in Chrome local extension storage.

This is an approximate pre-send inspection tool, not a native Gmail App emulator. Rendering can still vary by email client, version, device, display settings, accessibility preferences, and server-side transformations.

Gmail is a trademark of Google LLC. Gmail Recipient Preview is an independent project and is not affiliated with, endorsed by, or guaranteed by Google.

## URLs

- **Homepage:** `https://andrehungmy.github.io/gmail-recipient-preview/`
- **Privacy policy:** `https://andrehungmy.github.io/gmail-recipient-preview/privacy.html`
- **Support:** `https://github.com/andrehungmy/gmail-recipient-preview/issues`
- **Source repository:** `https://github.com/andrehungmy/gmail-recipient-preview`

Before the first deployment, set **Repository Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The Pages workflow must complete successfully before these URLs are entered in the Developer Dashboard.

## Privacy tab

### Single purpose

Allow a user to preview the currently open Gmail draft across common recipient reading layouts and identify visible formatting risks before sending it.

### `storage` permission justification

Stores only three local interface preferences: selected language, selected reference device, and selected preview size. It does not store email subjects, recipients, bodies, images, attachments, or warning results.

### Host permission justification

Access to `https://mail.google.com/*` is required to add the Preview control to Gmail Compose and read the draft the user actively chooses to preview. Draft content is processed locally in the active tab and is not transmitted to the developer or a third party.

### Remote code

No. All JavaScript and CSS are included in the extension package. The extension does not load remote code.

### Data handling disclosure

The extension locally handles website content, user-generated content, and personal communications contained in the Gmail draft the user actively previews. It does not transmit this content off the user's device, store it after the preview closes, sell it, use it for advertising, or make it available for human review.

The extension stores only interface language, reference device, and preview size in `chrome.storage.local`.

### Required certifications

- Data is used only to provide the disclosed single-purpose preview feature.
- Data is not sold or transferred to third parties outside the allowed Limited Use exceptions.
- Data is not used or transferred for personalized advertising.
- Data is not used to determine creditworthiness or for lending purposes.
- The developer does not allow humans to read draft content through the extension.
- The public Privacy Policy matches the implemented behavior.

### Limited Use statement

Gmail Recipient Preview's use of information received from Google services adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Test instructions

No product account or paid subscription is required. A reviewer needs access to a Gmail account in Chrome.

1. Open `https://mail.google.com/` and sign in to Gmail.
2. Compose a new message or open an existing draft.
3. Enter a subject and message body.
4. Select the Preview control beside Gmail's discard-draft control.
5. Confirm that the recipient preview opens and the Gmail draft remains editable.
6. Edit the subject or body and confirm that Preview updates.
7. Switch Mobile/Desktop, Light/approximate Dark, and reference-device controls.
8. Use the Floating control to move the preview, then return to the full panel.
9. Close Preview and confirm that Gmail's Compose layout is restored and the draft is unchanged.

Suggested synthetic test content:

```text
Subject: Mobile layout test

Hi Maya,

Thank you for your time today. This paragraph is intentionally long enough to compare wrapping between desktop and mobile reading widths.

Next steps:
1. Share the first draft by Tuesday.
2. Review the proposal with the team.

https://example.com/this-is-a-deliberately-long-address-for-testing-mobile-line-wrapping
```

## Submission assets

- Icon: `icons/icon-128.png`
- Screenshot 1: `assets/store/final/01-live-recipient-view-1280x800.png`
- Screenshot 2: `assets/store/final/02-reference-devices-1280x800.png`
- Screenshot 3: `assets/store/final/03-formatting-checks-1280x800.png`
- Screenshot 4: `assets/store/final/04-preview-zoom-1280x800.png`
- Small promo tile: `assets/store/final/small-promo-440x280.png`

## Pre-submit account checks

- Developer account registration is complete.
- Two-step verification is enabled.
- Developer contact email is current and verified.
- GitHub Pages homepage and Privacy Policy open without authentication.
- The final ZIP has passed the release checklist and clean-profile smoke test.
- Deferred publishing is selected if the release should not go live immediately after approval.
