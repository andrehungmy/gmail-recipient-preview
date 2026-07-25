(() => {
  const translations = {
    en: {
      productName: 'Gmail Recipient Preview',
      subtitle: 'Live recipient view before you send',
      guideCta: 'Open product guide',
      guideHint: 'Features, setup, privacy, and contact',
      privacyTitle: 'Private by design',
      privacyBody: 'Your draft stays in this browser tab and is never uploaded or stored.',
      ready: 'Ready on mail.google.com'
    },
    'zh-TW': {
      productName: 'Gmail 收件者預覽',
      subtitle: '寄出前即時查看收件者畫面',
      guideCta: '開啟產品指南',
      guideHint: '功能、安裝、隱私與聯絡方式',
      privacyTitle: '隱私優先設計',
      privacyBody: '草稿只會在目前的瀏覽器分頁中處理，不會上傳或儲存。',
      ready: '已可在 mail.google.com 使用'
    }
  };

  let locale = 'en';

  async function readStoredLocale() {
    try {
      const extensionStorage = globalThis.chrome?.storage?.local;
      if (extensionStorage) return await extensionStorage.get(['gmailReaderPreviewLocale']);
    } catch (_) {}
    try {
      return { gmailReaderPreviewLocale: localStorage.getItem('gmailReaderPreviewLocale') };
    } catch (_) {
      return {};
    }
  }

  function applyLocale() {
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = translations[locale][element.dataset.i18n];
    });
  }

  readStoredLocale().then((stored) => {
    locale = translations[stored.gmailReaderPreviewLocale] ? stored.gmailReaderPreviewLocale : 'en';
    applyLocale();
  });
})();
