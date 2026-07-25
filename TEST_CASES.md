# Gmail Recipient Preview — Test Cases

## Test environment

- Chrome Stable at 100% browser zoom unless a case specifies otherwise.
- Gmail Web with the extension reloaded from `chrome://extensions`.
- Test both English and Traditional Chinese Gmail interfaces when validating DOM integration.
- Use Android Studio Emulator with a Google Play system image for repeatable Android Gmail App comparison.
- Use a physical iPhone or real-device cloud for iOS Gmail App comparison. Xcode Simulator may validate Gmail mobile web only because it cannot install the App Store build of Gmail.
- Record Gmail version, OS version, display size, text size, theme, account type, and screenshot timestamp for every native comparison.

## P0 acceptance tests

| ID | Area | Setup and action | Expected result |
|---|---|---|---|
| UI-001 | Compose placement | Open a fullscreen new-message Compose window. | Preview is horizontally positioned 8 px to the left of Gmail's discard-draft button and vertically center-aligned with it. |
| UI-002 | Responsive placement | Resize Compose between standard and fullscreen layouts. | Preview follows the discard button without overlapping it. The text label collapses below 720 px Compose width. |
| UI-003 | Tooltip | Hover Preview for at least 500 ms. | Tooltip uses Gmail-style Roboto 12 px regular text, white foreground, `#3c4043` background, 4 px radius, 4 × 8 px padding, a 2 px anchor gap, and remains fully visible. |
| UI-004 | Standard Compose visibility | Open a standard floating Compose and wait for Gmail's bottom actions to finish rendering. | A blue compact Preview button remains visible 8 px to the left of discard. It repositions if Gmail replaces or resizes the action row. |
| UI-005 | Compact action dimensions | Compare Preview with adjacent native Gmail actions in standard Compose. | Preview's responsive circle is 32 × 32 px, the icon is vertically centered, and its tooltip baseline and delay match adjacent actions. |
| UI-006 | Header action alignment | Focus Settings and compare it with Close. | Both 40 × 40 px action surfaces share the same vertical center; the settings and close glyph centers differ by no more than 1 px. |
| UI-007 | Label alignment | Compare Reference device and Preview zoom in English and Traditional Chinese. | Both labels start on the same horizontal position and use the same 13 px Google Sans medium typography and line height. |
| UI-008 | Product title localization | Switch between English and Traditional Chinese. | English surfaces use “Gmail Recipient Preview”; Traditional Chinese surfaces use “Gmail 收件者預覽,” including the Extension popup and open preview panel. |
| LNG-001 | Immediate locale switch | Open Settings and choose the other language. | The open panel, Compose buttons, accessible labels, settings menu, risk copy, and empty-state copy repaint immediately without closing or reopening preview. |
| LIVE-001 | Live subject and body | Open preview, then keep it open while typing in the subject and body on the left. | The right-side subject and body reflect each change after the 120 ms debounce without reopening the preview. |
| LIVE-002 | Non-modal editing | With preview open, click in different draft paragraphs, select text, type, paste, undo, and redo. | The draft remains fully interactive, focus is not trapped in the preview, and the panel stays open. |
| LIVE-003 | Rich-content mutation | With preview open, apply bold or color formatting and insert an inline image. | Formatting and the image update in the preview without reopening it. |
| LIVE-004 | Side-by-side layout | Open preview from a standard floating Compose on a viewport wide enough for both surfaces. | Compose moves to the left with a 20 px gap before the 560 px preview panel. Closing preview restores the original Compose position exactly. |
| LIVE-005 | Escape scope | Focus the draft and press Escape, then focus a preview control and press Escape. | Escape in the draft does not close preview. Escape inside preview closes it; an open settings menu closes first. |
| LIVE-006 | Fullscreen safety | Open Preview from an already fullscreen or maximized Compose. | Preview opens directly in Floating mode at 40%; Gmail retains full ownership of Compose position and size, and no full panel overlays or narrows the draft. |
| LIVE-007 | Narrow desktop split | At a viewport between 720 and 1120 px, open preview and type in the draft. | The panel uses 50% of the viewport; Compose retains at least 340 px, ends 12 px before the panel, stays editable, and updates preview live. |
| LIVE-008 | Panel event isolation | With standard Compose and preview open, use Settings, scale, device, and theme controls. | Panel pointer and click events do not reach Gmail's outside-click handlers; the draft and preview remain open. |
| LIVE-009 | Floating preview | From a fullscreen Compose, select Floating preview. | The full panel collapses into a compact phone-only window at 40%, Compose immediately returns to its full editable layout, and live subject/body/image updates continue. |
| LIVE-010 | Floating drag | Drag the floating toolbar to each viewport edge, then change scale. | The window follows the pointer smoothly, remains at least 8 px inside the viewport, expands inward when needed, and does not select text or modify the draft. |
| LIVE-011 | Floating scale and return | Drag the floating scale continuously between 20% and 100%, release it, then select Return to full preview. | During the gesture, the phone changes size without repeatedly resizing or repositioning the outer window. On release, the outer window adjusts once. At 100%, the complete reference device is visible when the viewport can contain it; otherwise only the outer stage scrolls. Return always restores the complete panel and controls. |
| LIVE-012 | Maximize while previewing | Open the full side panel from a standard Compose, then select Gmail's maximize/fullscreen control. | The Extension restores the original Compose inline geometry before Gmail handles the control and switches Preview to Floating mode. The maximized draft remains fully visible and editable. |
| LIVE-013 | Restore or minimize after maximize | From LIVE-012, restore the Compose window or use Gmail's minimize control. | Gmail completes the transition without the draft moving off-screen or being covered. Floating preview remains visible; Return to full preview becomes available after Compose returns to a standard size. |
| LIVE-014 | Full-preview override | While Compose is still fullscreen, select Return to full preview. | The control remains enabled and restores the complete panel as a right-side overlay without changing Gmail's fullscreen Compose geometry. Selecting Floating preview returns to the unobstructed phone-only window. |
| PRE-001 | iPhone 16 preset | Choose iPhone 16. | Screen bounds are 393 × 852 reference px, including system chrome. iOS status bar, Dynamic Island, and Home indicator are present. |
| PRE-002 | iPhone 17 presets | Choose iPhone 17, iPhone 17 Pro, then iPhone 17 Pro Max. | Reference bounds switch to 402 × 874, 402 × 874, and 440 × 956 respectively without changing draft content or theme. |
| PRE-003 | Pixel preset | Choose Pixel 9. | Screen bounds are 412 × 925 reference px. Android status bar, punch-hole camera, and gesture handle are present. |
| PRE-004 | Samsung presets | Choose Galaxy A07 and Galaxy A17. | Reference bounds switch to 360 × 800 and 393 × 851. The teardrop camera cutout replaces the Pixel punch-hole treatment. |
| PRE-005 | Mobile Gmail chrome | Compare iOS and Android presets in Light and Dark Mode. | The reading surface includes a representative Gmail action bar, subject label/star, sender actions, and fixed reply/forward controls. Controls do not overlap message content. |
| PRE-006 | Desktop Gmail chrome | Select Desktop. | The mobile status/navigation bars and fixed reply bar disappear; the representative Gmail Web toolbar appears. |
| SCR-001 | Long message | Preview a message longer than one device screen, then scroll inside the email body. | Subject, sender, body, inline content, and signature are reachable. Device app bar and system bars remain fixed. The panel itself does not close or move. |
| SCR-002 | Preview zoom | Drag Preview zoom continuously through arbitrary values and test 10%, 50%, 80%, and 100%. | The thumb moves in 1% increments without snapping to 10% steps; the device tracks the gesture without visible backlog, its reference wrapping remains unchanged, and the final percentage persists after reopen. |
| SCR-005 | Scale click and keyboard | Click several points on the range track, use ± controls, then use arrow keys. | Track clicks move to the expected percentage, ± controls change by 10%, arrow keys change by 1%, and all values remain between 10% and 100%. |
| SCR-006 | Zoom presets and disclosure | Select Fit, 70%, and 100% detail on both an iPhone and Android reference. | Fit calculates a scale that contains the logical viewport in the available stage, 70% and 100% set exact values, active preset styling follows the selection, and manual slider input clears the preset state. The interface states that 100% is 1× logical viewport rather than physical phone size. |
| SCR-007 | Reference confidence | Switch between iPhone and Android presets. | iPhone presets display “iOS logical reference” and Android presets display “Android calibrated reference” without implying physical-size or pixel-identical Gmail accuracy. |
| SCR-003 | Short-message scroll chain | At 100% scale, use a message shorter than one device screen and wheel over the phone center. | The outer preview stage scrolls so the entire device can be reached even though the message itself has no overflow. |
| SCR-004 | Long-message scroll chain | Wheel over a long message, then continue after reaching its bottom. | The message scrolls first; at its boundary, scrolling passes to the outer stage so the device bottom remains reachable. |
| IMG-001 | Wide inline image | Insert a 640 × 320 image between two paragraphs. | Image appears in the correct document position, preserves its 2:1 aspect ratio, and scales to the available message width without horizontal overflow. |
| IMG-002 | Image plus long copy | Insert an image followed by enough text to exceed one screen. | Scrolling continues smoothly past the image. No text or image overlaps the gesture area. |
| SAF-001 | Draft integrity | Open, interact with, and close the preview. | Gmail subject, body HTML, cursor position, and attachments are unchanged. |
| SAF-002 | Extension reload context | Keep Gmail open, reload the Extension, and trigger preference reads or writes from the stale content script. | Rejected or unavailable `chrome.storage` calls fall back safely without an uncaught promise error. Refreshing Gmail then loads the new Extension context normally. |
| WEB-001 | Popup guide entry | Open the Extension popup in English and Traditional Chinese. | A localized “Open product guide” entry replaces the small tutorial; selecting it opens `landing.html` in a new tab. |
| WEB-002 | Landing page content | Review the Landing page at 1440, 1024, 768, and 390 px widths. | The centered product-document structure presents positioning, current updates, rationale, draft/recipient comparison, features, supported devices, privacy, local installation, and contact sections without horizontal page overflow. |
| WEB-003 | Reduced motion | Enable Reduce Motion and reload the Landing page. | Content is immediately visible and no reveal transition is required to read or navigate the page. |
| WEB-004 | Product palette | Compare the Landing page with the Extension popup and preview panel. | Primary actions use `#0b57d0`, icon and selected containers use `#d3e3fd`, supporting surfaces use `#eaf1fb` or `#f8fafd`, and text/outline colors follow the same Extension tokens. |
| WEB-005 | Landing localization | Switch the Landing page between English and Traditional Chinese, then reopen the Extension popup. | All product-guide copy changes immediately, the active language control updates, and the shared locale persists to the popup and preview panel. |
| BRAND-001 | Extension icon palette | Compare the Chrome toolbar icon, popup mark, and full preview mark. | All use the same light-blue container, dark navy device outline, and Google blue accent family. |
| COPY-001 | English copy audit | Review manifest, popup, preview panel, README, and QA harness. | Product name is consistently “Gmail Recipient Preview”; short surface labels use “Preview” and “recipient view” consistently. |

## Native Gmail comparison acceptance

| ID | Surface | Setup and action | Expected result |
|---|---|---|---|
| NAT-001 | Android Gmail App | On Android Studio Emulator with Google Play, set default display/text size, update Gmail, open each fixture, and capture Light/Dark screenshots. | Message width, wrapping, media scaling, scroll order, and major bar placement are compared against the matching Extension preset. Differences and Gmail version are recorded. |
| NAT-002 | iOS Gmail App | Send fixtures to an account opened in Gmail on a physical iPhone or real-device cloud; capture Light/Dark screenshots. | The same content hierarchy and comparison log as NAT-001 are completed. Xcode Simulator evidence is not accepted for the native Gmail App. |
| NAT-003 | Gmail mobile web | Open Gmail web in iOS Simulator Safari and Android Emulator Chrome. | Results are labeled “mobile web,” kept separate from native App evidence, and compared only to the intended mobile-web surface. |
| NAT-004 | Image fixture | Open a message containing a 640 × 320 inline image followed by long copy on every native reference surface. | The image retains its ratio, fits the reading width, appears in the correct position, and scrolls without overlapping fixed Gmail controls. |

## Compose variants

| ID | Variant | Expected result |
|---|---|---|
| CMP-001 | New message | Preview button targets the active new-message draft. |
| CMP-002 | Reply and Reply all | Preview contains the active reply body and quoted content. |
| CMP-003 | Forward | Preview preserves forwarded content structure and inline images. |
| CMP-004 | Pop-out Compose | Preview remains beside the pop-out window's discard button. |
| CMP-005 | Multiple drafts | Each Preview button opens only its own Compose instance. |
| CMP-006 | Existing draft opened directly | From the Drafts list, open a saved draft directly in standard floating Compose without maximizing it. | Preview appears after Gmail hydrates the editor attributes; no resize or maximize/minimize cycle is required. |

## Content and risk checks

| ID | Content | Expected result |
|---|---|---|
| CNT-001 | Plain text and manual line breaks | Mobile wrapping matches the selected logical viewport. |
| CNT-002 | Bold, italic, lists, links, and signature | Supported Gmail formatting is preserved. |
| CNT-003 | White or near-white text | A low-contrast or hidden-content warning is shown. |
| CNT-004 | Long URL | URL wraps without horizontal scrolling and produces a risk warning. |
| CNT-005 | Oversized image or table | Preview constrains the content and reports an overflow risk. |

## Regression matrix

- Interface language: English, Traditional Chinese.
- Preview theme: Light, Dark.
- Reference device: iPhone 16, iPhone 17, iPhone 17 Pro, iPhone 17 Pro Max, Pixel 9, Galaxy A07, Galaxy A17, Desktop.
- Compose width: standard, fullscreen, resized narrow.
- Chrome zoom: 80%, 100%, 125%.
