(() => {
  const translations = {
    en: {
      pageTitle: "Gmail Recipient Preview",
      pageDescription:
        "Preview how a Gmail draft may look to recipients on common mobile viewports before you send.",
      skip: "Skip to content",
      productName: "Gmail Recipient Preview",
      homeAria: "Gmail Recipient Preview home",
      navAria: "Primary navigation",
      languageAria: "Language",
      factsAria: "Product facts",
      productScreenshotAria: "Gmail Recipient Preview product screenshot",
      supportedDevicesAria: "Supported reference devices",
      navWhy: "Why preview",
      navHow: "How it works",
      navPrivacy: "Privacy",
      navInstall: "Install",
      heroEyebrow: "Chrome extension · Available on the Chrome Web Store",
      heroTitle: "Write in Gmail.\nSee the recipient view.",
      heroBody:
        "Check common mobile layouts, Dark Mode, and formatting risks while the Gmail draft remains editable beside the preview.",
      installCta: "Install from the Chrome Web Store",
      viewGithub: "View on GitHub",
      trustLocal: "Draft stays in the active Gmail tab",
      trustAccount: "No account",
      trustCost: "Free and non-commercial",
      livePreviewLabel: "Live recipient preview",
      risksKicker: "What changes after send",
      risksTitle: "Desktop confidence can disappear on a phone.",
      risksBody:
        "A wide compose window hides the conditions your recipient actually reads in. Preview the likely trouble spots before they become part of the message.",
      riskOneTitle: "Unexpected wrapping",
      riskOneBody:
        "Short desktop lines may become fragmented paragraphs on a narrow screen.",
      riskTwoTitle: "Dark Mode contrast",
      riskTwoBody:
        "Text colors and backgrounds may be remapped by the receiving app.",
      riskThreeTitle: "Pasted formatting",
      riskThreeBody:
        "Content copied from Docs, Word, or AI tools can carry styles you did not notice.",
      workflowKicker: "One writing surface, two views",
      workflowTitle: "Compose, preview, adjust.",
      workflowBody:
        "The preview stays connected to the active draft, so you can check the recipient experience without sending a test email.",
      stepOneTitle: "Open a Gmail draft",
      stepOneBody: "Write a new message or open an existing draft.",
      stepTwoTitle: "Select Preview",
      stepTwoBody: "Use the Preview button beside Gmail’s discard control.",
      stepThreeTitle: "Keep editing",
      stepThreeBody:
        "Subject, body, formatting, and safe local inline images update as you type.",
      floatingKicker: "Made for long drafts",
      floatingTitle: "Keep only the phone when you need more room.",
      floatingBody:
        "Switch to a draggable floating preview, set the zoom, and continue editing without a full control panel covering the draft.",
      factOneTitle: "Live",
      factOneBody: "Updates while you type",
      factTwoTitle: "Flexible",
      factTwoBody: "Show the full device, 70%, or 100% detail",
      factThreeTitle: "Approximate preview",
      factThreeBody: "Approximate, not pixel-identical",
      devicesKicker: "Reference viewports",
      devicesTitle: "Compare common reading widths.",
      devicesBody:
        "Device presets compare the layout at common screen widths. They are not physical-size replicas or pixel-identical Gmail App renders.",
      privacyLabel: "Privacy, stated plainly",
      privacyTitle: "Your draft stays in the Gmail tab.",
      privacyBody:
        "There is no backend, analytics SDK, account system, or external AI API. The extension reads only the draft you actively preview.",
      privacyPointUpload: "No message uploads",
      privacyPointStorage: "No draft storage",
      privacyPointTracking: "No behavioral tracking",
      privacyPointAccount: "No account required",
      privacyPolicyLink: "Read the full Privacy Policy",
      installKicker: "Available now",
      installTitle: "Add it to Chrome.",
      installBody:
        "Gmail Recipient Preview is available on the Chrome Web Store. Add it to Chrome, then open a Gmail draft to start previewing.",
      installOneTitle: "Open the Chrome Web Store",
      installOneBody: "Visit the Gmail Recipient Preview listing.",
      installTwoTitle: "Add it to Chrome",
      installTwoBody: "Select Add to Chrome and confirm the installation.",
      installThreeTitle: "Open a Gmail draft",
      installThreeBody:
        "Start a new message or open a saved draft, then select Preview beside the discard button.",
      storeCta: "Open the Chrome Web Store",
      sourceGithub: "View source on GitHub",
      contactTitle: "Found a rendering difference?",
      contactBody:
        "Share the Gmail version, operating system, and reference device so the preview can keep improving.",
      reportIssue: "Open a GitHub issue",
      githubProfile: "Andre Hung on GitHub",
      footerNote: "Free, local, and non-commercial.",
    },
    "zh-TW": {
      pageTitle: "Gmail 收件者預覽",
      pageDescription: "寄出 Gmail 草稿前，先預覽常見手機寬度下的收件畫面。",
      skip: "跳到主要內容",
      productName: "Gmail 收件者預覽",
      homeAria: "Gmail 收件者預覽首頁",
      navAria: "主要導覽",
      languageAria: "語言",
      factsAria: "產品資訊",
      productScreenshotAria: "Gmail 收件者預覽功能畫面",
      supportedDevicesAria: "支援的參考裝置",
      navWhy: "為什麼需要預覽",
      navHow: "使用方式",
      navPrivacy: "隱私",
      navInstall: "安裝",
      heroEyebrow: "Chrome 擴充功能 · 已於 Chrome Web Store 上架",
      heroTitle: "你的 Email 在對方眼中\n可能跟你現在看到的不一樣",
      heroBody:
        "用 Gmail 寄信前，先預覽草稿在不同裝置、淺色與深色模式下的呈現效果，提早發現換行、對比與格式問題。",
      installCta: "前往 Chrome Web Store 安裝",
      viewGithub: "前往 GitHub",
      trustLocal: "信件內容只在目前的瀏覽器分頁中處理，不會上傳或儲存",
      trustAccount: "不必建立帳號",
      trustCost: "免費、非商業用途",
      livePreviewLabel: "即時查看收件畫面",
      risksKicker: "為什麼需要預覽",
      risksTitle: "信寄出去後，版面可能和你想的不一樣。",
      risksBody:
        "在電腦版 Gmail 編輯草稿時，排版、斷句與文字顏色仍可能因螢幕寬度或顯示模式而改變。寄出前先檢查常見問題，提早找出手機版可能跑版或難以閱讀的地方。",
      riskOneTitle: "換行與預期不同",
      riskOneBody:
        "在電腦上刻意分行的短句，到了較窄的手機螢幕，可能變成零碎的多行段落，影響閱讀節奏。",
      riskTwoTitle: "深色模式對比不足",
      riskTwoBody:
        "Gmail App 的深色模式可能重新調整文字、背景與連結顏色，造成對比下降，讓顯示結果與寄件者預期不同。",
      riskThreeTitle: "貼上時帶入隱藏格式",
      riskThreeBody:
        "從 Google Docs、Word 或 AI 工具複製內容時，可能把不易察覺的字型、尺寸與樣式一起貼入。",
      workflowKicker: "同一封草稿，兩個畫面",
      workflowTitle: "邊寫邊看，立即調整。",
      workflowBody:
        "你可以一邊編輯 Gmail 草稿，一邊查看收件者可能看到的畫面。不用開啟開發人員工具，也不用在電腦與手機之間反覆切換。",
      stepOneTitle: "開啟 Gmail 草稿",
      stepOneBody: "撰寫新信，或直接開啟已儲存的草稿。",
      stepTwoTitle: "點選「預覽」",
      stepTwoBody: "按鈕位於 Gmail 垃圾桶旁。",
      stepThreeTitle: "繼續編輯",
      stepThreeBody:
        "主旨、內文、文字格式與安全的本機內嵌圖片，都會即時同步到預覽畫面。",
      floatingKicker: "預覽長信時，草稿仍可繼續編輯",
      floatingTitle: "需要更多空間時，只留下手機畫面。",
      floatingBody:
        "你可以把預覽切換成可拖曳的浮動視窗，並自由調整顯示比例，避免控制面板遮住草稿內容。",
      factOneTitle: "即時同步",
      factOneBody: "輸入文字或調整格式時，預覽畫面同步更新",
      factTwoTitle: "自由縮放",
      factTwoBody: "可顯示完整裝置，或切換 70% 與 100% 細節",
      factThreeTitle: "近似預覽",
      factThreeBody:
        "依參考裝置的顯示寬度模擬；實際結果仍可能因裝置與 Gmail 版本而異",
      devicesKicker: "參考顯示寬度",
      devicesTitle: "比較常見裝置上的閱讀版面。",
      devicesBody:
        "裝置選項用常見螢幕寬度比較排版，並不是實機截圖或手機的實際大小。",
      privacyLabel: "隱私說清楚",
      privacyTitle: "預覽只在目前的 Gmail 分頁中產生。",
      privacyBody:
        "這項擴充功能不使用後端伺服器、分析工具、帳號系統或外部 AI API。只有在你主動開啟預覽時，才會讀取目前的 Gmail 草稿；草稿內容不會上傳或儲存。",
      privacyPointUpload: "不上傳信件內容",
      privacyPointStorage: "不儲存草稿",
      privacyPointTracking: "不追蹤使用行為",
      privacyPointAccount: "不必登入帳號",
      privacyPolicyLink: "閱讀完整隱私權政策",
      installKicker: "現已正式上架",
      installTitle: "從 Chrome Web Store 安裝。",
      installBody:
        "Gmail 收件者預覽已在 Chrome Web Store 上架。安裝後開啟 Gmail 草稿，就能開始預覽。",
      installOneTitle: "開啟 Chrome Web Store",
      installOneBody: "前往 Gmail Recipient Preview 商品頁。",
      installTwoTitle: "加到 Chrome",
      installTwoBody: "點選「加到 Chrome」，再確認安裝。",
      installThreeTitle: "開啟 Gmail 草稿",
      installThreeBody:
        "撰寫新信或開啟已儲存的草稿，再點選垃圾桶旁的「預覽」。",
      storeCta: "前往 Chrome Web Store",
      sourceGithub: "在 GitHub 查看原始碼",
      contactTitle: "實際畫面與預覽不同嗎？",
      contactBody:
        "回報時請附上作業系統、裝置型號、Gmail App 或瀏覽器版本，以及預覽時選擇的參考裝置，方便後續比對與調整。",
      reportIssue: "建立 GitHub Issue",
      githubProfile: "Andre Hung 的 GitHub",
      footerNote: "免費、本機處理、非商業用途。",
    },
  };

  let locale = "en";

  async function readLocale() {
    try {
      const storage = globalThis.chrome?.storage?.local;
      if (storage)
        return (await storage.get(["gmailReaderPreviewLocale"]))
          .gmailReaderPreviewLocale;
    } catch (_) {}
    return null;
  }

  async function writeLocale(value) {
    try {
      const storage = globalThis.chrome?.storage?.local;
      if (storage) {
        await storage.set({ gmailReaderPreviewLocale: value });
      }
    } catch (_) {}
  }

  function applyLocale(value, persist = false) {
    locale = translations[value] ? value : "en";
    const messages = translations[locale];

    document.documentElement.lang = locale;
    document.title = messages.pageTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", messages.pageDescription);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      const message = messages[element.dataset.i18n];
      if (message) element.textContent = message;
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      const message = messages[element.dataset.i18nAlt];
      if (message) element.setAttribute("alt", message);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      const message = messages[element.dataset.i18nAriaLabel];
      if (message) element.setAttribute("aria-label", message);
    });

    document.querySelectorAll("[data-locale]").forEach((button) => {
      if (!(button instanceof HTMLElement)) return;
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.locale === locale),
      );
    });

    if (persist) writeLocale(locale);
  }

  document.querySelectorAll("[data-locale]").forEach((button) => {
    if (!(button instanceof HTMLElement)) return;
    button.addEventListener("click", () =>
      applyLocale(button.dataset.locale, true),
    );
  });

  readLocale().then((stored) => applyLocale(stored || "en"));
})();
