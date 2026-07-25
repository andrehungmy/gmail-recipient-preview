# Gmail Recipient Preview

Gmail Recipient Preview is a privacy-first Chrome Extension that lets non-technical Gmail users inspect a draft from an approximate recipient perspective before sending.

## MVP capabilities

- Adds a responsive, labeled preview button to Gmail Compose with a Gmail-style tooltip.
- Positions Preview 8 px to the left of Gmail's discard-draft control and recalculates alignment when Gmail rebuilds or resizes Compose controls.
- Detects existing drafts even when Gmail adds editor attributes after the floating Compose window first appears.
- Uses a non-modal side panel, keeping the draft editable while the preview is open.
- Moves or narrows Compose into the available left area, including a 50/50 split on 720–1120 px desktop viewports, then restores its exact layout on close.
- Shows a recipient-oriented reading view instead of a resized editor.
- Switches between Mobile and Desktop views using persistent reference presets for iPhone 16, the iPhone 17 family, Pixel 9, Samsung Galaxy A07, and Samsung Galaxy A17.
- Recreates recognizable iOS and Android system chrome, including status information, Dynamic Island or camera cutout, and gesture navigation areas.
- Keeps long messages independently scrollable inside the device while app and system bars remain fixed.
- Offers a persistent 10%–100% preview-size control with 1% drag precision and ±10% controls. Short messages pass wheel scrolling to the whole device; long messages scroll internally first and pass scrolling outward at the boundary.
- Labels the control as Preview zoom and provides Fit, 70%, and 100% detail presets. The interface explicitly defines 100% as a 1× logical viewport rather than the phone's physical size, and distinguishes iOS logical references from Android calibrated references.
- Switches between Light and approximate Dark Mode.
- Updates subject, text, formatting, and inline content about 120 ms after the draft changes.
- Checks locally for hidden text, low contrast, tiny text, excessive blank space, long URLs, and oversized media.
- Supports multiple Compose windows by binding each preview button to its own draft.
- Never uploads, stores, or sends draft content.
- Switches immediately between English and Traditional Chinese and persists the selection for later sessions.
- Safely falls back to page-local preferences if Chrome invalidates an old content-script context during an Extension reload; refreshing Gmail is still required to activate the newly loaded code.
- Links from the Extension popup to a responsive product Landing page covering the workflow, privacy model, installation, supported devices, and maintainer contact area.
- Offers a draggable Floating preview that keeps Compose unobstructed, shows only the live phone surface at a default 40% scale, and supports independent 20%–100% resizing. During a slider gesture only the phone preview updates; the outer window resizes once when the gesture ends, avoiding repeated layout animation.
- Lets users return from Floating preview to the complete control panel at any Compose size. Large Compose windows remain Gmail-owned and the full panel overlays the right edge instead of rewriting Gmail's geometry.
- Automatically restores Gmail-owned Compose positioning before maximize, minimize, fullscreen, or pop-out transitions. Large Compose windows open in Floating preview so the Extension never competes with Gmail for the same geometry.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project folder.
5. Open or refresh Gmail, then start a new draft.
6. Select the phone-and-envelope button near the bottom-right Compose controls.

## Product boundary

This extension provides an approximate preview. It models common reading widths and a conservative Dark Mode treatment, but it does not execute the native Gmail iOS or Android rendering engine. Actual appearance can vary with the device, Gmail version, accessibility settings, and message transformations.

## Privacy

- Processing occurs entirely inside the active Gmail browser tab.
- There is no server, analytics SDK, account system, or external API.
- Draft content is neither uploaded nor persisted.
- The extension requests access to `mail.google.com` plus Chrome's local `storage` permission for interface language, reference-device, and preview-size preferences only.
- Stored preferences never include subject lines, recipients, message bodies, or attachments.

## Project structure

- `manifest.json` — Manifest V3 configuration.
- `content.js` — Gmail Compose detection, preview UI, sanitization, and risk checks.
- `content.css` — Compose button and recipient preview styling.
- `popup.html` / `popup.css` / `popup.js` — Localized, Google-native toolbar popup, privacy explanation, and product-guide entry point.
- `landing.html` / `landing.css` / `landing.js` — Responsive bilingual product-guide page using the same Google blue surfaces as the Extension, with workflow, comparison, privacy, installation, release notes, and contact sections.
- `icons/` — Extension icons.
- `TEST_CASES.md` — Acceptance and regression cases, including long-copy and inline-image coverage.
- `DEVICE_RESEARCH_AND_VALIDATION.md` — Official device references and native Gmail comparison protocol.

## Manual QA checklist

- New message, reply, and pop-out Compose views.
- Two Compose windows open simultaneously.
- Subject and body update while preview is open.
- Open an existing saved draft directly in standard Compose; Preview appears without maximizing or resizing first.
- Rich text: bold, italic, lists, links, colors, images, signature, and quoted content.
- Mobile/Desktop and Light/Dark controls.
- Preview-size slider at arbitrary 1% values plus 10%, 50%, 80%, and 100%; short- and long-message scroll chaining.
- White text, faint text, long URL, consecutive blank lines, and oversized image warnings.
- Continue editing while the side panel is open; Escape in the draft does not dismiss the preview.
- Escape inside the preview or the close button dismisses the panel without changing the draft.

## Known limitations

- Gmail's private DOM can change without notice; Compose detection may require maintenance.
- The sender identity is represented as “You” in the MVP.
- Dark Mode is an approximation, not a pixel-identical Gmail App render.
- Native Gmail comparisons are acceptance references, not a promise of pixel-identical rendering across every Gmail release and user setting.
