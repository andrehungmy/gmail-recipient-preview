# Chrome Web Store Submission Copy

**Candidate:** 0.8.4

**Primary language:** English

**Localized language:** Traditional Chinese (Taiwan)

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

## Traditional Chinese store listing

### Name

Gmail Recipient Preview

### Summary

在寄出前預覽 Gmail 草稿在常見裝置、淺色與深色模式下的收件畫面。

### Detailed description

Gmail Recipient Preview 會在 Gmail 撰寫視窗中加入「預覽」按鈕，讓你在寄出前，先從收件者的角度檢查草稿的閱讀畫面。

你可以繼續編輯 Gmail 草稿，預覽會在旁邊即時更新。切換常見的手機顯示寬度、淺色或近似深色模式；需要更多編輯空間時，也可以改用可拖曳的浮動預覽。

工具會提醒幾種常見的格式風險，例如低對比或隱藏文字、過小字級、過多空白、過長網址、無法自然換行的字串，以及超出手機寬度的圖片或表格。為保護隱私，預覽畫面不會載入網路圖片，而會以本機提示取代。

主要功能：

- 編輯目前的 Gmail 草稿時即時同步預覽
- 提供行動裝置與電腦版閱讀畫面
- 可切換 iPhone、Pixel 與 Samsung Galaxy 參考寬度
- 支援淺色與近似深色模式
- 可調整預覽比例，或改用可拖曳的浮動視窗
- 在本機檢查格式問題，並標示可能需要注意的位置
- 介面支援英文與繁體中文
- 不需帳號，也沒有後端、分析追蹤、廣告或外部 AI API

草稿內容只會在目前的 Gmail 分頁中處理，不會由這項擴充功能上傳或儲存。工具只會在 Chrome 的本機擴充功能儲存空間中保存介面語言、參考裝置與預覽比例。

這是一項寄出前的近似預覽工具，並非 Gmail App 模擬器。實際畫面仍可能因郵件 App、版本、裝置、顯示設定、輔助使用偏好或伺服器端處理而有所不同。

Gmail 是 Google LLC 的商標。Gmail Recipient Preview 為獨立專案，與 Google 沒有合作、背書或保證關係。

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
