(() => {
  const translations = {
    en: {
      skip: 'Skip to content', tagline: 'See what they may see before you send', heroLead: 'Your important email should not be a blind send.', heroBody: 'Preview common mobile recipient views directly from Gmail, while your draft stays in the browser tab where you wrote it.',
      installCta: 'Install the local Chrome build', localBuild: 'local build', guideCta: 'Read the product guide', guideMeta: '3 steps · no account required', freeTool: 'Free, non-commercial browser tool', privacyLink: 'Privacy', devicesLink: 'Reference devices', contactLink: 'Contact',
      latestLabel: 'Latest build', updatesTitle: 'A clearer reference scale', newBadge: 'New', fixedBadge: 'Fixed', updateOne: 'Fit, 70%, and 100% detail shortcuts make preview zoom easier to understand.', updateTwo: '100% is now clearly defined as a 1× logical viewport, not physical phone size.', updateThree: 'Floating preview returns to the full panel and resizes only once after a zoom gesture.',
      whyTitle: 'Why make Gmail Recipient Preview?', whyBody: 'A message written on a wide desktop can feel fragmented on a phone. Dark Mode and pasted formatting add more uncertainty, but checking with developer tools or sending test emails is too much friction for everyday Gmail users.', reasonOneTitle: 'Recipient context:', reasonOneBody: 'compare wrapping and reading rhythm against common logical viewports.', reasonTwoTitle: 'Live editing:', reasonTwoBody: 'keep writing while the preview updates beside the draft.', reasonThreeTitle: 'Local processing:', reasonThreeBody: 'draft content is never uploaded, stored, or sent to an external API.',
      comparisonTitle: 'From desktop draft to recipient view', draftCaption: 'Your Gmail draft', recipientCaption: 'Approximate recipient view', comparisonNote: 'Formatting, links, inline images, and reading order stay visible while you write.',
      featuresTitle: 'Features', featureOneTitle: 'Live recipient view', featureOneBody: 'Subject, body, formatting, and inline images update without reopening Preview.', featureTwoTitle: 'Mobile and Desktop', featureTwoBody: 'Compare a common phone viewport with a representative Gmail Web reading surface.', featureThreeTitle: 'Light and Dark Mode', featureThreeBody: 'Review contrast and color behavior using an honest approximation of common themes.', featureFourTitle: 'Floating preview', featureFourBody: 'Collapse the controls into a draggable phone and keep the draft fully editable.', featureFiveTitle: 'Formatting checks', featureFiveBody: 'Flag faint, hidden, tiny, oversized, or awkwardly wrapping content locally.', featureSixTitle: 'Bilingual interface', featureSixBody: 'Switch immediately between English and Traditional Chinese.',
      devicesTitle: 'Reference devices', devicesBody: 'Presets are reference viewports for comparing layout—not physical-size replicas or pixel-identical native Gmail renders.', privacyTitle: 'Private by design', privacyBody: 'Your selected draft is processed in the active Gmail tab. There is no backend, analytics SDK, account system, or external AI API.',
      installTitle: 'Manual installation', installOneTitle: 'Open Chrome Extensions', installOneBody: 'Visit', installOneEnd: 'and enable Developer mode.', installTwoTitle: 'Load the Extension', installTwoBody: 'Select Load unpacked and choose the Gmail Recipient Preview folder.', installThreeTitle: 'Refresh Gmail', installThreeBody: 'Open a draft and select Preview beside the discard button.',
      contactTitle: 'Report a problem', contactBody: 'Found a Gmail rendering difference or have an idea for another device preset? Feedback is welcome.', reportIssue: 'Open a GitHub issue', githubProfile: 'GitHub profile', footerNote: 'Free, local, and non-commercial.'
    },
    'zh-TW': {
      skip: '跳至主要內容', tagline: '寄出前，先看看對方可能看到的畫面', heroLead: '重要信件不該在毫無預覽的情況下寄出。', heroBody: '直接在 Gmail 預覽常見的行動裝置收件畫面；草稿只會留在你撰寫信件的瀏覽器分頁中。',
      installCta: '安裝 Chrome 本機版本', localBuild: '本機版本', guideCta: '閱讀產品指南', guideMeta: '3 個步驟 · 不需建立帳號', freeTool: '免費、非商業用途的瀏覽器工具', privacyLink: '隱私', devicesLink: '參考裝置', contactLink: '聯絡方式',
      latestLabel: '最新版本', updatesTitle: '更清楚的參考縮放', newBadge: '新增', fixedBadge: '修正', updateOne: '新增「符合畫面」、70% 與 100% 細節快捷選項，讓預覽縮放更容易理解。', updateTwo: '100% 現在明確定義為 1× logical viewport，而不是手機實體大小。', updateThree: '浮動預覽可返回完整面板，並只會在完成縮放手勢後調整一次外框。',
      whyTitle: '為什麼製作 Gmail 收件者預覽？', whyBody: '在寬螢幕上撰寫的信件，到了手機上可能顯得破碎；Dark Mode 與跨工具貼上的格式也增加更多不確定性。對一般 Gmail 使用者而言，開發者工具或反覆寄測試信又太麻煩。', reasonOneTitle: '收件者情境：', reasonOneBody: '透過常見 logical viewport 比較換行與閱讀節奏。', reasonTwoTitle: '即時編輯：', reasonTwoBody: '持續撰寫時，旁邊的預覽會同步更新。', reasonThreeTitle: '本機處理：', reasonThreeBody: '草稿內容不會上傳、儲存或傳送至外部 API。',
      comparisonTitle: '從桌面草稿到收件者畫面', draftCaption: '你的 Gmail 草稿', recipientCaption: '近似收件者畫面', comparisonNote: '撰寫時仍可查看格式、連結、內嵌圖片與閱讀順序。',
      featuresTitle: '功能特色', featureOneTitle: '即時收件者畫面', featureOneBody: '主旨、內文、格式與內嵌圖片會同步更新，不必重開預覽。', featureTwoTitle: '行動裝置與電腦', featureTwoBody: '比較常見手機 viewport 與具代表性的 Gmail Web 閱讀畫面。', featureThreeTitle: '淺色與深色模式', featureThreeBody: '透過誠實標示的近似效果，檢查對比與顏色表現。', featureFourTitle: '浮動預覽', featureFourBody: '將控制面板收合成可拖曳的手機畫面，同時保持草稿可編輯。', featureFiveTitle: '格式風險檢查', featureFiveBody: '在本機提醒過淡、隱藏、過小、超出範圍或換行異常的內容。', featureSixTitle: '雙語介面', featureSixBody: '可立即切換英文與繁體中文。',
      devicesTitle: '參考裝置', devicesBody: '裝置選項用於比較版面配置，不代表手機實體大小，也不承諾與原生 Gmail 完全一致。', privacyTitle: '隱私優先設計', privacyBody: '你選擇的草稿只會在目前 Gmail 分頁中處理；沒有後端、分析工具、帳號系統或外部 AI API。',
      installTitle: '手動安裝', installOneTitle: '開啟 Chrome Extensions', installOneBody: '前往', installOneEnd: '並開啟「開發人員模式」。', installTwoTitle: '載入 Extension', installTwoBody: '選擇「載入未封裝項目」，再選取 Gmail Recipient Preview 資料夾。', installThreeTitle: '重新整理 Gmail', installThreeBody: '開啟草稿，點選垃圾桶旁的「預覽」。',
      contactTitle: '回報問題', contactBody: '發現 Gmail 顯示差異，或希望加入其他參考裝置嗎？歡迎提供意見。', reportIssue: '建立 GitHub Issue', githubProfile: 'GitHub 個人頁面', footerNote: '免費、本機處理、非商業用途。'
    }
  };

  let locale = 'en';

  async function readLocale() {
    try {
      const storage = globalThis.chrome?.storage?.local;
      if (storage) return (await storage.get(['gmailReaderPreviewLocale'])).gmailReaderPreviewLocale;
    } catch (_) {}
    try { return localStorage.getItem('gmailReaderPreviewLocale'); } catch (_) { return null; }
  }

  async function writeLocale(value) {
    try {
      const storage = globalThis.chrome?.storage?.local;
      if (storage) { await storage.set({ gmailReaderPreviewLocale: value }); return; }
    } catch (_) {}
    try { localStorage.setItem('gmailReaderPreviewLocale', value); } catch (_) {}
  }

  function applyLocale(value, persist = false) {
    locale = translations[value] ? value : 'en';
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const message = translations[locale][element.dataset.i18n];
      if (message) element.textContent = message;
    });
    document.querySelectorAll('[data-locale]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.locale === locale));
    });
    if (persist) writeLocale(locale);
  }

  document.querySelectorAll('[data-locale]').forEach((button) => {
    button.addEventListener('click', () => applyLocale(button.dataset.locale, true));
  });

  readLocale().then((stored) => applyLocale(stored || 'en'));
})();
