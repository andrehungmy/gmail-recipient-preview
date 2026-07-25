(() => {
  'use strict';

  const BUTTON_CLASS = 'gmail-reader-preview-button';
  const ROOT_ID = 'gmail-reader-preview-root';
  const STORAGE_KEYS = {
    locale: 'gmailReaderPreviewLocale',
    devicePreset: 'gmailReaderPreviewDevicePreset',
    previewScale: 'gmailReaderPreviewScale'
  };
  const DEVICE_PRESETS = {
    iphone16: { label: 'iPhone 16', width: 393, height: 852, os: 'ios', cutout: 'island' },
    iphone17: { label: 'iPhone 17', width: 402, height: 874, os: 'ios', cutout: 'island' },
    iphone17pro: { label: 'iPhone 17 Pro', width: 402, height: 874, os: 'ios', cutout: 'island' },
    iphone17promax: { label: 'iPhone 17 Pro Max', width: 440, height: 956, os: 'ios', cutout: 'island' },
    pixel9: { label: 'Pixel 9', width: 412, height: 925, os: 'android', cutout: 'punch' },
    galaxya07: { label: 'Samsung Galaxy A07', width: 360, height: 800, os: 'android', cutout: 'teardrop' },
    galaxya17: { label: 'Samsung Galaxy A17', width: 393, height: 851, os: 'android', cutout: 'teardrop' }
  };
  let activeEditor = null;
  let activeCompose = null;
  let shiftedCompose = null;
  let activeDraftObserver = null;
  let composeLayoutObserver = null;
  let composeChromeHandler = null;
  let refreshTimer = null;
  let layoutFrame = null;
  let scaleFrame = null;
  let currentLocale = 'en';
  const viewState = {
    device: 'mobile',
    theme: 'light',
    devicePreset: 'iphone17',
    previewScale: 80,
    previewScalePreset: 'custom',
    floating: false,
    floatingScale: 40,
    floatingPosition: null,
    fullPanelOverride: false
  };

  const copy = {
    en: {
      button: 'Preview',
      buttonTooltip: 'Preview how recipients may see this email',
      title: 'Gmail Recipient Preview',
      subtitle: 'Live recipient view before you send',
      close: 'Close preview',
      settings: 'Settings',
      floatingPreview: 'Floating preview',
      exitFloating: 'Return to full preview',
      dragPreview: 'Drag floating preview',
      floatingScale: 'Floating preview zoom',
      device: 'Device preview',
      mobile: 'Mobile',
      desktop: 'Desktop',
      theme: 'Color mode',
      light: 'Light',
      dark: 'Dark',
      referenceDevice: 'Reference device',
      previewScale: 'Preview zoom',
      fitPreview: 'Fit',
      comfortablePreview: '70%',
      detailPreview: '100% detail',
      referenceScaleNote: '100% = 1× logical viewport, not the phone’s physical size.',
      iosReference: 'iOS logical reference',
      androidReference: 'Android calibrated reference',
      scrollHint: 'Scroll around the phone to move the whole device. Scroll inside a long email to read it.',
      logicalDisplay: '{width} × {height} reference viewport',
      decreaseScale: 'Decrease preview size',
      increaseScale: 'Increase preview size',
      language: 'Language',
      english: 'English',
      traditionalChinese: '繁體中文',
      noSubject: '(No subject)',
      empty: 'Start writing to see your email here.',
      you: 'You',
      recipientMeta: 'to recipient · just now',
      inbox: 'Inbox',
      unsubscribe: 'Unsubscribe',
      reply: 'Reply',
      forward: 'Forward',
      processed: 'Processed on this device',
      looksGood: 'Mobile readability looks good',
      issuesOne: '1 potential issue found',
      issuesMany: '{count} potential issues found',
      riskHidden: 'Some text may be hidden here but visible in another email view.',
      riskContrast: 'Low-contrast text may be difficult to read in Light or Dark Mode.',
      riskTiny: 'Very small text may be hard to read on a phone.',
      riskBlank: 'Several empty lines may create a large gap on mobile.',
      riskUrl: 'A long URL may wrap awkwardly on a narrow screen.',
      riskOversized: 'An image or table may extend beyond the mobile screen.'
    },
    'zh-TW': {
      button: '預覽',
      buttonTooltip: '預覽收件者可能看到的信件畫面',
      title: 'Gmail 收件者預覽',
      subtitle: '寄出前即時查看收件者畫面',
      close: '關閉預覽',
      settings: '設定',
      floatingPreview: '浮動預覽',
      exitFloating: '返回完整預覽',
      dragPreview: '拖曳浮動預覽',
      floatingScale: '浮動預覽縮放',
      device: '裝置預覽',
      mobile: '行動裝置',
      desktop: '電腦',
      theme: '顯示模式',
      light: '淺色',
      dark: '深色',
      referenceDevice: '參考裝置',
      previewScale: '預覽縮放',
      fitPreview: '符合畫面',
      comfortablePreview: '70%',
      detailPreview: '100% 細節',
      referenceScaleNote: '100% = 1× logical viewport，非手機實體大小。',
      iosReference: 'iOS logical reference',
      androidReference: 'Android calibrated reference',
      scrollHint: '在手機外側滑動可移動整台裝置；信件較長時，可在信件內滑動閱讀。',
      logicalDisplay: '{width} × {height} 參考顯示區',
      decreaseScale: '縮小預覽',
      increaseScale: '放大預覽',
      language: '語言',
      english: 'English',
      traditionalChinese: '繁體中文',
      noSubject: '（無主旨）',
      empty: '開始撰寫後，信件內容會顯示在這裡。',
      you: '你',
      recipientMeta: '寄給收件者 · 剛剛',
      inbox: '收件匣',
      unsubscribe: '取消訂閱',
      reply: '回覆',
      forward: '轉寄',
      processed: '僅在這台裝置上處理',
      looksGood: '行動版易讀性良好',
      issuesOne: '發現 1 個潛在問題',
      issuesMany: '發現 {count} 個潛在問題',
      riskHidden: '部分文字在這裡可能不可見，但可能在其他郵件畫面中顯示。',
      riskContrast: '部分文字對比較低，在淺色或深色模式下可能不易閱讀。',
      riskTiny: '部分文字尺寸過小，可能不易在手機上閱讀。',
      riskBlank: '連續空白行可能在行動裝置上形成過大的間距。',
      riskUrl: '長網址可能會在窄螢幕上產生不自然的換行。',
      riskOversized: '圖片或表格可能超出行動裝置畫面。'
    }
  };

  const icons = {
    preview: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="2.75" width="10" height="18.5" rx="2.5" stroke="currentColor" stroke-width="1.75"/><path d="M9.4 8.2 12 10.15l2.6-1.95" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.25 17.75h3.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g transform="translate(0 2.55)"><path d="M9.55 3.65 10.2 2h3.6l.65 1.65 1.35.78 1.76-.27 1.8 3.12-1.1 1.39v1.56L19.36 12l-1.8 3.12-1.76-.27-1.35.78-.65 1.65h-3.6l-.65-1.65-1.35-.78-1.76.27L4.64 12l1.1-1.77V8.67l-1.1-1.39 1.8-3.12 1.76.27 1.35-.78Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><circle cx="12" cy="9.45" r="2.55" stroke="currentColor" stroke-width="1.45"/></g></svg>`,
    back: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14.5 6-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    archive: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8h14v11H5V8Zm-1-4h16v4H4V4Zm5 8h6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    delete: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M9 7l1-3h4l1 3m-8 0 1 13h8l1-13M10 10v7m4-7v7" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    unread: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 6.5h17v12h-17v-12Zm.7.8 7.8 6 7.8-6" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/></svg>`,
    spam: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 3.8-4.2 4.3v7.8L8 20.2h8l4.2-4.3V8.1L16 3.8H8Zm4 4.1v5.2m0 3v.1" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    snooze: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.65"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    move: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 6h6l2 2h9v11h-17V6Zm8.5 5v5m0 0 2-2m-2 2-2-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    label: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h9l7 6-7 6H4V6Zm4 5.9h.1" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    gemini: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.8c.8 5.1 4 8.3 9.2 9.2-5.2.9-8.4 4.1-9.2 9.2-.8-5.1-4-8.3-9.2-9.2C8 11.1 11.2 7.9 12 2.8Z" fill="currentColor"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3.5 2.65 5.37 5.93.86-4.29 4.18 1.01 5.9L12 17.02l-5.3 2.79 1.01-5.9-4.29-4.18 5.93-.86L12 3.5Z" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/></svg>`,
    reply: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 7-6 5 6 5v-3c5.5 0 8.1 1.7 10 4.5-.6-5.1-3.8-8.5-10-8.5V7Z" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/></svg>`,
    forward: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 7 6 5-6 5v-3c-5.5 0-8.1 1.7-10 4.5.6-5.1 3.8-8.5 10-8.5V7Z" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/></svg>`,
    emoji: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.55"/><path d="M8.5 10h.01m7 0h.01M8.5 14.2c1.9 2 5.1 2 7 0" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/></svg>`,
    minus: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    floating: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" stroke-width="1.6"/><rect x="11" y="10.5" width="7" height="6" rx="1" fill="currentColor"/></svg>`,
    expand: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 4.5h-4v4m11-4h4v4m-15 7v4h4m11-4v4h-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    grip: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="7" r="1.2"/><circle cx="15" cy="7" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="17" r="1.2"/><circle cx="15" cy="17" r="1.2"/></svg>`,
    more: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4 21 20H3L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9v5m0 3v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6.5 12.5 3.5 3.5 7.5-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  function t(key, variables = {}) {
    let value = copy[currentLocale]?.[key] || copy.en[key] || key;
    Object.entries(variables).forEach(([name, replacement]) => {
      value = value.replace(`{${name}}`, replacement);
    });
    return value;
  }

  function readLocalPreferences(keys) {
    const values = {};
    try {
      keys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value !== null) values[key] = value;
      });
    } catch (_) {}
    return values;
  }

  function writeLocalPreferences(values) {
    try {
      Object.entries(values).forEach(([key, value]) => localStorage.setItem(key, String(value)));
    } catch (_) {}
  }

  async function storageGet(keys) {
    try {
      const extensionStorage = globalThis.chrome?.storage?.local;
      if (extensionStorage) return await extensionStorage.get(keys);
    } catch (_) {}
    return readLocalPreferences(keys);
  }

  async function storageSet(values) {
    try {
      const extensionStorage = globalThis.chrome?.storage?.local;
      if (extensionStorage) {
        await extensionStorage.set(values);
        return;
      }
    } catch (_) {}
    writeLocalPreferences(values);
  }

  function findComposeRoot(editor) {
    return editor.closest('[role="dialog"]') || editor.closest('form') || editor.parentElement?.parentElement?.parentElement;
  }

  function findDiscardControl(root) {
    const explicitSelectors = [
      '[command="+delete"]',
      '[aria-label*="Discard draft" i]',
      '[data-tooltip*="Discard draft" i]',
      '[aria-label*="捨棄草稿"]',
      '[data-tooltip*="捨棄草稿"]',
      '[aria-label*="刪除草稿"]',
      '[data-tooltip*="刪除草稿"]',
      '[aria-label*="删除草稿"]',
      '[data-tooltip*="删除草稿"]'
    ];
    for (const selector of explicitSelectors) {
      const match = root.querySelector(selector);
      if (match) return match.closest('button, [role="button"]') || match;
    }

    const rootRect = root.getBoundingClientRect();
    return [...root.querySelectorAll('button, [role="button"]')]
      .filter((element) => {
        if (element.classList.contains(BUTTON_CLASS)) return false;
        const rect = element.getBoundingClientRect();
        const visible = rect.width >= 20 && rect.height >= 20 && getComputedStyle(element).visibility !== 'hidden';
        const nearBottom = rootRect.bottom - rect.bottom >= -2 && rootRect.bottom - rect.bottom < 72;
        return visible && nearBottom && rect.left > rootRect.left + rootRect.width * .55;
      })
      .sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right)[0] || null;
  }

  function positionButtonNearDiscard(root, button) {
    if (!root.isConnected || !button.isConnected) return;
    const discard = findDiscardControl(root);
    if (!discard) {
      button.toggleAttribute('data-compact', root.getBoundingClientRect().width < 720);
      button.classList.remove('grp-compose-near-trash');
      button.classList.add('grp-compose-fallback');
      button.style.left = '';
      button.style.top = '';
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const discardRect = discard.getBoundingClientRect();
    const compact = rootRect.width < 720;
    button.toggleAttribute('data-compact', compact);
    button.classList.remove('grp-compose-fallback');
    button.classList.add('grp-compose-near-trash');
    button.style.right = '';
    button.style.bottom = '';

    const buttonWidth = compact ? 32 : button.offsetWidth;
    const buttonHeight = compact ? 32 : 36;
    button.style.left = `${Math.round(discardRect.left - rootRect.left - buttonWidth - 8)}px`;
    button.style.top = `${Math.round(discardRect.top - rootRect.top + (discardRect.height - buttonHeight) / 2)}px`;
  }

  function updateComposeButton(button) {
    const label = button.querySelector('.grp-compose-label');
    const tooltip = button.querySelector('.grp-compose-tooltip');
    if (label) label.textContent = t('button');
    if (tooltip) tooltip.textContent = t('buttonTooltip');
    button.setAttribute('aria-label', t('buttonTooltip'));
  }

  function updateAllComposeButtons() {
    document.querySelectorAll(`.${BUTTON_CLASS}`).forEach(updateComposeButton);
  }

  function addPreviewButton(editor) {
    const root = findComposeRoot(editor);
    if (!root || root.querySelector(`.${BUTTON_CLASS}`)) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = BUTTON_CLASS;
    button.innerHTML = `${icons.preview}<span class="grp-compose-label"></span><span class="grp-compose-tooltip" role="tooltip"></span>`;
    updateComposeButton(button);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openPreview(editor);
    });
    button.addEventListener('mousedown', (event) => event.preventDefault());

    const currentPosition = getComputedStyle(root).position;
    if (currentPosition === 'static') root.style.position = 'relative';
    root.appendChild(button);
    let repositionScheduled = false;
    const scheduleReposition = () => {
      if (repositionScheduled) return;
      repositionScheduled = true;
      requestAnimationFrame(() => {
        repositionScheduled = false;
        positionButtonNearDiscard(root, button);
      });
    };
    button._grpReposition = scheduleReposition;
    scheduleReposition();
    setTimeout(scheduleReposition, 120);
    setTimeout(scheduleReposition, 500);

    if ('ResizeObserver' in globalThis) {
      const resizeObserver = new ResizeObserver(scheduleReposition);
      resizeObserver.observe(root);
      button._grpResizeObserver = resizeObserver;
    }
    const composeObserver = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => !button.contains(mutation.target))) scheduleReposition();
    });
    composeObserver.observe(root, {
      attributes: true,
      attributeFilter: ['aria-label', 'data-tooltip', 'style'],
      childList: true,
      subtree: true
    });
    button._grpComposeObserver = composeObserver;
  }

  function scanForEditors(scope = document) {
    const selector = 'div[contenteditable="true"]';
    const editors = [...(scope.matches?.(selector) ? [scope] : []), ...scope.querySelectorAll(selector)];
    editors.forEach((editor) => {
      if (editor.closest(`#${ROOT_ID}`)) return;
      const root = findComposeRoot(editor);
      const hasSubject = root?.querySelector('input[name="subjectbox"], input[aria-label*="Subject" i], input[aria-label*="主旨"]');
      const hasSend = root?.querySelector('[command="+send"], [aria-label*="Send" i], [data-tooltip*="Send" i], [aria-label*="傳送"], [data-tooltip*="傳送"]');
      const looksLikeCompose = root?.getAttribute('role') === 'dialog' && (hasSubject || hasSend || findDiscardControl(root));
      if (looksLikeCompose) addPreviewButton(editor);
    });
  }

  function getDraft(editor) {
    const compose = findComposeRoot(editor);
    const subject = compose?.querySelector('input[name="subjectbox"]')?.value?.trim() || t('noSubject');
    const body = sanitizeHtml(editor.innerHTML);
    return { subject, body };
  }

  function sanitizeHtml(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    template.content.querySelectorAll('script, style, iframe, object, embed, form, input, button').forEach((node) => node.remove());
    template.content.querySelectorAll('*').forEach((node) => {
      [...node.attributes].forEach((attribute) => {
        if (attribute.name.toLowerCase().startsWith('on')) node.removeAttribute(attribute.name);
        if (attribute.name === 'contenteditable') node.removeAttribute(attribute.name);
      });
      if (node.tagName === 'A') {
        const href = node.getAttribute('href') || '';
        if (/^\s*(javascript|data):/i.test(href)) node.removeAttribute('href');
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
    return template.innerHTML;
  }

  function parseColor(color) {
    const match = color?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    return match ? { r: +match[1], g: +match[2], b: +match[3], a: match[4] === undefined ? 1 : +match[4] } : null;
  }

  function luminance({ r, g, b }) {
    const values = [r, g, b].map((value) => {
      const channel = value / 255;
      return channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    });
    return .2126 * values[0] + .7152 * values[1] + .0722 * values[2];
  }

  function contrast(foreground, background) {
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + .05) / (darker + .05);
  }

  function getOpaqueBackground(element) {
    let current = element;
    while (current) {
      const color = parseColor(getComputedStyle(current).backgroundColor);
      if (color && color.a > .9) return color;
      current = current.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  function auditDraft(editor) {
    const risks = [];
    const textElements = [editor, ...editor.querySelectorAll('*')].filter((node) => node.textContent?.trim());
    let hiddenText = false;
    let lowContrast = false;
    let tinyText = false;

    for (const node of textElements.slice(0, 500)) {
      const style = getComputedStyle(node);
      const foreground = parseColor(style.color);
      const background = getOpaqueBackground(node);
      if (style.display === 'none' || style.visibility === 'hidden' || +style.opacity < .15) hiddenText = true;
      if (foreground && foreground.a < .2) hiddenText = true;
      if (foreground && contrast(foreground, background) < 2.2) lowContrast = true;
      if (parseFloat(style.fontSize) > 0 && parseFloat(style.fontSize) < 9) tinyText = true;
    }

    if (hiddenText) risks.push('riskHidden');
    if (lowContrast) risks.push('riskContrast');
    if (tinyText) risks.push('riskTiny');

    const rawText = editor.innerText || '';
    if (/\n\s*\n\s*\n\s*\n/.test(rawText)) risks.push('riskBlank');
    if (/(https?:\/\/|www\.)\S{55,}/i.test(rawText)) risks.push('riskUrl');

    const oversized = [...editor.querySelectorAll('img, table')].some((node) => {
      const width = parseFloat(node.getAttribute('width')) || node.scrollWidth;
      return width > DEVICE_PRESETS[viewState.devicePreset].width && getComputedStyle(node).maxWidth === 'none';
    });
    if (oversized) risks.push('riskOversized');

    return risks.slice(0, 4);
  }

  function auditStatus(risks) {
    if (!risks.length) return t('looksGood');
    return risks.length === 1 ? t('issuesOne') : t('issuesMany', { count: risks.length });
  }

  function riskMarkup(risks) {
    return risks.map((risk) => `<li>${icons.warning}<span>${t(risk)}</span></li>`).join('');
  }

  function systemChromeMarkup() {
    return `
      <div class="grp-system-status" aria-hidden="true">
        <span class="grp-system-time">9:41</span>
        <span class="grp-ios-island"></span>
        <span class="grp-android-camera"></span>
        <span class="grp-system-indicators">
          <span class="grp-signal"><i></i><i></i><i></i><i></i></span>
          <svg class="grp-wifi" viewBox="0 0 18 14" fill="none"><path d="M1.5 4.8A11.7 11.7 0 0 1 9 2.1a11.7 11.7 0 0 1 7.5 2.7M4.2 7.7A7.6 7.6 0 0 1 9 6a7.6 7.6 0 0 1 4.8 1.7M7.1 10.4A3.2 3.2 0 0 1 9 9.8c.7 0 1.3.2 1.9.6M9 12.2h.01" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>
          <span class="grp-battery"><i></i></span>
        </span>
      </div>`;
  }

  function appBarMarkup(surface = viewState.device) {
    if (surface === 'desktop') {
      return `<span class="grp-app-leading">${icons.back}<i></i>${icons.archive}${icons.spam}${icons.delete}<i></i>${icons.unread}${icons.snooze}${icons.move}${icons.label}${icons.more}</span>`;
    }
    return `${icons.back}<span class="grp-app-actions">${icons.gemini}${icons.archive}${icons.delete}${icons.unread}${icons.more}</span>`;
  }

  function deviceOptionsMarkup() {
    return Object.entries(DEVICE_PRESETS).map(([key, preset]) =>
      `<option value="${key}" ${viewState.devicePreset === key ? 'selected' : ''}>${preset.label} · ${preset.width} × ${preset.height}</option>`
    ).join('');
  }

  function panelMarkup(draft, risks) {
    const safeSubject = document.createElement('div');
    safeSubject.textContent = draft.subject;
    const body = draft.body.trim() ? draft.body : `<p class="grp-empty">${t('empty')}</p>`;

    return `
      <aside class="grp-panel" role="complementary" aria-labelledby="grp-title">
        <div class="grp-floating-toolbar" data-drag-handle aria-label="${t('dragPreview')}">
          <span class="grp-drag-grip">${icons.grip}</span>
          <strong>${t('title')}</strong>
          <label><span class="grp-visually-hidden">${t('floatingScale')}</span><input type="range" min="20" max="100" step="1" value="${viewState.floatingScale}" data-floating-scale></label>
          <output data-floating-scale-output>${viewState.floatingScale}%</output>
          <button type="button" aria-label="${t('exitFloating')}" data-floating-exit>${icons.expand}<span class="grp-control-tooltip" role="tooltip">${t('exitFloating')}</span></button>
          <button type="button" aria-label="${t('close')}" data-close>${icons.close}<span class="grp-control-tooltip" role="tooltip">${t('close')}</span></button>
        </div>
        <header class="grp-header">
          <div class="grp-title-row">
            <div class="grp-mark">${icons.preview}</div>
            <div class="grp-heading"><h2 id="grp-title">${t('title')}</h2><p>${t('subtitle')}</p></div>
            <div class="grp-header-actions">
              <button class="grp-icon-button" type="button" aria-label="${t('floatingPreview')}" data-floating-enter>${icons.floating}<span class="grp-control-tooltip" role="tooltip">${t('floatingPreview')}</span></button>
              <button class="grp-icon-button grp-settings-button" type="button" aria-label="${t('settings')}" aria-expanded="false" data-settings-button>${icons.settings}<span class="grp-control-tooltip" role="tooltip">${t('settings')}</span></button>
              <button class="grp-icon-button" type="button" aria-label="${t('close')}" data-close>${icons.close}<span class="grp-control-tooltip" role="tooltip">${t('close')}</span></button>
            </div>
            <div class="grp-settings-menu" data-settings-menu role="menu" aria-label="${t('language')}" hidden>
              <p>${t('language')}</p>
              <button type="button" data-locale="en" role="menuitemradio" aria-checked="${currentLocale === 'en'}"><span>${t('english')}</span>${currentLocale === 'en' ? icons.check : ''}</button>
              <button type="button" data-locale="zh-TW" role="menuitemradio" aria-checked="${currentLocale === 'zh-TW'}"><span>${t('traditionalChinese')}</span>${currentLocale === 'zh-TW' ? icons.check : ''}</button>
            </div>
          </div>
          <div class="grp-controls">
            <div class="grp-segment" aria-label="${t('device')}">
              <button type="button" data-device="mobile" aria-pressed="${viewState.device === 'mobile'}">${t('mobile')}</button>
              <button type="button" data-device="desktop" aria-pressed="${viewState.device === 'desktop'}">${t('desktop')}</button>
            </div>
            <div class="grp-segment" aria-label="${t('theme')}">
              <button type="button" data-theme="light" aria-pressed="${viewState.theme === 'light'}">${t('light')}</button>
              <button type="button" data-theme="dark" aria-pressed="${viewState.theme === 'dark'}">${t('dark')}</button>
            </div>
          </div>
          <div class="grp-preset-control" data-preset-control ${viewState.device === 'desktop' ? 'hidden' : ''}>
            <label for="grp-device-preset">${t('referenceDevice')}</label>
            <div class="grp-device-select-shell">
              <span class="grp-selected-os">${DEVICE_PRESETS[viewState.devicePreset].os === 'ios' ? 'iOS' : 'Android'}</span>
              <select id="grp-device-preset" data-device-preset aria-label="${t('referenceDevice')}">${deviceOptionsMarkup()}</select>
            </div>
            <p class="grp-reference-kind" data-reference-kind>${DEVICE_PRESETS[viewState.devicePreset].os === 'ios' ? t('iosReference') : t('androidReference')}</p>
          </div>
          <div class="grp-scale-section" data-scale-control ${viewState.device === 'desktop' ? 'hidden' : ''}>
            <div class="grp-scale-heading">
              <label for="grp-preview-scale">${t('previewScale')}</label>
              <div class="grp-scale-presets" aria-label="${t('previewScale')}">
                <button type="button" data-scale-preset="fit" aria-pressed="${viewState.previewScalePreset === 'fit'}">${t('fitPreview')}</button>
                <button type="button" data-scale-preset="70" aria-pressed="${viewState.previewScalePreset === '70'}">${t('comfortablePreview')}</button>
                <button type="button" data-scale-preset="100" aria-pressed="${viewState.previewScalePreset === '100'}">${t('detailPreview')}</button>
              </div>
            </div>
            <div class="grp-scale-control">
              <button type="button" class="grp-scale-step" data-scale-step="-10" aria-label="${t('decreaseScale')}">${icons.minus}</button>
              <input id="grp-preview-scale" type="range" min="10" max="100" step="1" value="${viewState.previewScale}" style="--grp-scale-progress:${(viewState.previewScale - 10) / 90 * 100}%" data-preview-scale>
              <button type="button" class="grp-scale-step" data-scale-step="10" aria-label="${t('increaseScale')}">${icons.plus}</button>
              <output for="grp-preview-scale" data-preview-scale-output>${viewState.previewScale}%</output>
            </div>
            <p class="grp-reference-scale-note">${t('referenceScaleNote')}</p>
          </div>
        </header>
        <div class="grp-stage">
          <p class="grp-scroll-hint">${t('scrollHint')}</p>
          <div class="grp-device grp-theme-${viewState.theme} ${viewState.device === 'desktop' ? 'grp-desktop' : ''}" data-preview-device data-os="${DEVICE_PRESETS[viewState.devicePreset].os}" data-cutout="${DEVICE_PRESETS[viewState.devicePreset].cutout}" style="--grp-mobile-width:${DEVICE_PRESETS[viewState.devicePreset].width}px;--grp-mobile-height:${DEVICE_PRESETS[viewState.devicePreset].height}px;--grp-scale:${viewState.device === 'desktop' ? 1 : viewState.previewScale / 100}">
            <article class="grp-mail-app">
              ${systemChromeMarkup()}
              <div class="grp-app-bar" data-app-bar>${appBarMarkup()}</div>
              <div class="grp-message">
                <div class="grp-subject-row"><h3 class="grp-subject" data-preview-subject>${safeSubject.innerHTML}</h3><span class="grp-inbox-label">${t('inbox')}</span>${icons.star}</div>
                <div class="grp-sender-row">
                  <div class="grp-avatar">Y</div>
                  <div class="grp-sender"><strong>${t('you')}</strong><span>${t('recipientMeta')}</span></div>
                  <span class="grp-unsubscribe">${t('unsubscribe')}</span>
                  ${icons.more}
                </div>
                <div class="grp-email-body" data-preview-body>${body}</div>
              </div>
              <div class="grp-mobile-reply-bar"><span>${icons.reply}${t('reply')}</span><span>${icons.forward}${t('forward')}</span><span class="grp-emoji-action">${icons.emoji}</span></div>
              <div class="grp-system-navigation" aria-hidden="true"><span></span></div>
            </article>
          </div>
        </div>
        <footer class="grp-audit ${risks.length ? 'grp-has-risks' : ''}">
          <div class="grp-audit-summary"><div class="grp-audit-status"><span class="grp-status-dot"></span><span data-audit-status>${auditStatus(risks)}</span></div><span class="grp-privacy">${t('processed')}</span></div>
          <ul class="grp-risk-list" data-risk-list>${riskMarkup(risks)}</ul>
        </footer>
      </aside>`;
  }

  function renderPreviewPanel(root) {
    if (!activeEditor?.isConnected) return;
    const draft = getDraft(activeEditor);
    const risks = auditDraft(activeEditor);
    root.innerHTML = panelMarkup(draft, risks);
    bindPanelEvents(root);
    applyFloatingLayout(root);
    updateFloatingExitControl(root);
    if (!viewState.floating && viewState.device === 'mobile' && viewState.previewScalePreset === 'fit') {
      requestAnimationFrame(() => fitPreviewToStage(root));
    }
  }

  function bindPanelEvents(root) {
    const panel = root.querySelector('.grp-panel');
    panel?.addEventListener('pointerdown', (event) => event.stopPropagation());
    panel?.addEventListener('click', (event) => event.stopPropagation());
    root.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', closePreview));
    root.querySelector('[data-floating-enter]')?.addEventListener('click', () => setFloatingMode(root, true));
    root.querySelector('[data-floating-exit]')?.addEventListener('click', () => setFloatingMode(root, false));
    root.querySelectorAll('[data-device]').forEach((button) => button.addEventListener('click', () => setDevice(root, button.dataset.device)));
    root.querySelectorAll('[data-theme]').forEach((button) => button.addEventListener('click', () => setTheme(root, button.dataset.theme)));
    root.querySelector('[data-device-preset]')?.addEventListener('change', (event) => setDevicePreset(root, event.target.value));
    root.querySelector('[data-settings-button]')?.addEventListener('click', () => toggleSettings(root));
    root.querySelectorAll('[data-locale]').forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      setLocale(button.dataset.locale);
    }));
    const scaleInput = root.querySelector('[data-preview-scale]');
    scaleInput?.addEventListener('input', (event) => setPreviewScale(root, event.target.value, false, 'custom'));
    scaleInput?.addEventListener('change', (event) => setPreviewScale(root, event.target.value, true, 'custom'));
    root.querySelectorAll('[data-scale-step]').forEach((button) => button.addEventListener('click', () => {
      setPreviewScale(root, viewState.previewScale + Number(button.dataset.scaleStep), true, 'custom');
    }));
    root.querySelectorAll('[data-scale-preset]').forEach((button) => button.addEventListener('click', () => {
      applyPreviewScalePreset(root, button.dataset.scalePreset);
    }));
    const floatingScale = root.querySelector('[data-floating-scale]');
    floatingScale?.addEventListener('input', (event) => setFloatingScale(root, event.target.value, false));
    floatingScale?.addEventListener('change', (event) => setFloatingScale(root, event.target.value, true));
    bindFloatingDrag(root);
  }

  function composeRequiresFloating(compose) {
    if (!compose?.isConnected) return false;
    const rect = compose.getBoundingClientRect();
    const nearViewportHeight = rect.height >= Math.max(620, window.innerHeight * .78);
    const wideCompose = rect.width >= Math.max(760, window.innerWidth * .56);
    return nearViewportHeight || wideCompose;
  }

  function updateFloatingExitControl(root) {
    const button = root.querySelector('[data-floating-exit]');
    if (!button) return;
    button.disabled = false;
    const label = t('exitFloating');
    button.setAttribute('aria-label', label);
    const tooltip = button.querySelector('.grp-control-tooltip');
    if (tooltip) tooltip.textContent = label;
  }

  function isComposeWindowControl(target) {
    const control = target instanceof Element ? target.closest('button, [role="button"]') : null;
    if (!control) return false;
    const label = [control.getAttribute('aria-label'), control.getAttribute('data-tooltip'), control.getAttribute('title')]
      .filter(Boolean)
      .join(' ');
    return /(full\s?screen|exit\s?full\s?screen|maximi[sz]e|minimi[sz]e|pop.?out|全螢幕|全屏|退出全螢幕|放大|縮小|彈出)/i.test(label);
  }

  function bindComposeLayoutGuard(compose, root) {
    if (!compose) return;
    composeChromeHandler = (event) => {
      if (!isComposeWindowControl(event.target)) return;
      setFloatingMode(root, true);
    };
    compose.addEventListener('pointerdown', composeChromeHandler, true);

    if ('ResizeObserver' in globalThis) {
      composeLayoutObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          if (!compose.isConnected || !root.isConnected) return;
          if (!viewState.floating && !viewState.fullPanelOverride && composeRequiresFloating(compose)) setFloatingMode(root, true);
          updateFloatingExitControl(root);
        });
      });
      composeLayoutObserver.observe(compose);
    }
  }

  function openPreview(editor) {
    closePreview();
    activeEditor = editor;
    activeCompose = findComposeRoot(editor);
    viewState.floating = composeRequiresFloating(activeCompose);
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.lang = currentLocale;
    document.body.appendChild(root);
    renderPreviewPanel(root);
    if (!viewState.floating) arrangeComposeForLivePreview(editor, root);
    bindComposeLayoutGuard(activeCompose, root);
    updateFloatingExitControl(root);

    document.addEventListener('keydown', onEscape);
    editor.addEventListener('input', scheduleRefresh);
    activeCompose?.querySelector('input[name="subjectbox"]')?.addEventListener('input', scheduleRefresh);
    activeDraftObserver = new MutationObserver(scheduleRefresh);
    activeDraftObserver.observe(editor, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
    window.addEventListener('resize', scheduleLiveLayout);
  }

  function arrangeComposeForLivePreview(editor, previewRoot) {
    if (viewState.floating) return;
    const compose = findComposeRoot(editor);
    if (!compose) return;
    if (composeRequiresFloating(compose)) {
      if (!viewState.fullPanelOverride) setFloatingMode(previewRoot, true);
      return;
    }
    const composeRect = compose.getBoundingClientRect();
    const panelWidth = previewRoot.querySelector('.grp-panel')?.getBoundingClientRect().width || 560;
    const gap = panelWidth < 500 ? 12 : 20;
    const targetRight = panelWidth + gap;
    const currentRightMargin = Math.max(0, window.innerWidth - composeRect.right);
    const canMoveWithoutResize = window.innerWidth >= composeRect.width + panelWidth + gap + currentRightMargin;
    const widthAtCurrentLeft = window.innerWidth - targetRight - composeRect.left;
    const canSplitAtCurrentLeft = widthAtCurrentLeft >= 480;
    const fallbackLeft = Math.min(composeRect.left, 12);
    const fallbackWidth = window.innerWidth - targetRight - fallbackLeft;
    const canUseCompactSplit = window.innerWidth >= 720 && fallbackWidth >= 340;
    if (!canMoveWithoutResize && !canSplitAtCurrentLeft && !canUseCompactSplit) return;

    shiftedCompose = {
      element: compose,
      inlineLeft: compose.style.left,
      inlineRight: compose.style.right,
      inlineWidth: compose.style.width,
      inlineTransition: compose.style.transition
    };
    compose.style.transition = 'right 180ms cubic-bezier(.2, 0, 0, 1)';
    if (!canMoveWithoutResize) {
      const splitLeft = canSplitAtCurrentLeft ? composeRect.left : fallbackLeft;
      compose.style.left = `${Math.round(splitLeft)}px`;
      compose.style.width = 'auto';
    }
    compose.style.right = `${Math.round(targetRight)}px`;
    compose.querySelector(`.${BUTTON_CLASS}`)?._grpReposition?.();
  }

  function restoreComposeLayout() {
    if (!shiftedCompose?.element?.isConnected) {
      shiftedCompose = null;
      return;
    }
    shiftedCompose.element.style.left = shiftedCompose.inlineLeft;
    shiftedCompose.element.style.right = shiftedCompose.inlineRight;
    shiftedCompose.element.style.width = shiftedCompose.inlineWidth;
    shiftedCompose.element.style.transition = shiftedCompose.inlineTransition;
    shiftedCompose.element.querySelector(`.${BUTTON_CLASS}`)?._grpReposition?.();
    shiftedCompose = null;
  }

  function scheduleLiveLayout() {
    if (layoutFrame !== null) cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = null;
      const previewRoot = document.getElementById(ROOT_ID);
      if (!previewRoot || !activeEditor?.isConnected) return;
      restoreComposeLayout();
      if (!viewState.floating && !viewState.fullPanelOverride && composeRequiresFloating(activeCompose)) {
        setFloatingMode(previewRoot, true);
        return;
      }
      if (viewState.floating) {
        applyFloatingLayout(previewRoot);
      } else {
        arrangeComposeForLivePreview(activeEditor, previewRoot);
      }
      if (!viewState.floating && viewState.device === 'mobile' && viewState.previewScalePreset === 'fit') {
        fitPreviewToStage(previewRoot);
      }
    });
  }

  function updateFloatingPanelSize(root) {
    const panel = root.querySelector('.grp-panel');
    const preset = DEVICE_PRESETS[viewState.devicePreset];
    if (!panel || !preset || !viewState.floating) return;

    const scale = viewState.floatingScale / 100;
    const desiredWidth = Math.max(236, Math.ceil(preset.width * scale) + 26);
    const desiredHeight = Math.max(240, Math.ceil(preset.height * scale) + 74);
    const renderedWidth = Math.min(desiredWidth, window.innerWidth - 16);
    const renderedHeight = Math.min(desiredHeight, window.innerHeight - 16);
    panel.style.setProperty('--grp-floating-panel-width', `${desiredWidth}px`);
    panel.style.setProperty('--grp-floating-panel-height', `${desiredHeight}px`);

    if (viewState.floatingPosition) {
      const left = Math.min(Math.max(8, window.innerWidth - renderedWidth - 8), Math.max(8, viewState.floatingPosition.left));
      const top = Math.min(Math.max(8, window.innerHeight - renderedHeight - 8), Math.max(8, viewState.floatingPosition.top));
      viewState.floatingPosition = { left, top };
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.right = 'auto';
    } else {
      const top = Math.min(72, Math.max(8, window.innerHeight - renderedHeight - 8));
      panel.style.left = '';
      panel.style.top = `${top}px`;
      panel.style.right = `${Math.min(24, Math.max(8, window.innerWidth - renderedWidth - 8))}px`;
    }
  }

  function applyFloatingLayout(root) {
    root.classList.toggle('grp-is-floating', viewState.floating);
    const panel = root.querySelector('.grp-panel');
    const device = root.querySelector('[data-preview-device]');
    const appBar = root.querySelector('[data-app-bar]');
    if (!panel || !device) return;

    if (viewState.floating) {
      device.classList.remove('grp-desktop');
      device.style.setProperty('--grp-scale', String(viewState.floatingScale / 100));
      if (appBar) appBar.innerHTML = appBarMarkup('mobile');
      updateFloatingPanelSize(root);
    } else {
      panel.style.left = '';
      panel.style.top = '';
      panel.style.right = '';
      device.classList.toggle('grp-desktop', viewState.device === 'desktop');
      device.style.setProperty('--grp-scale', String(viewState.device === 'desktop' ? 1 : viewState.previewScale / 100));
      if (appBar) appBar.innerHTML = appBarMarkup(viewState.device);
    }
  }

  function setFloatingMode(root, enabled) {
    viewState.floating = enabled;
    viewState.fullPanelOverride = !enabled;
    if (enabled) {
      viewState.fullPanelOverride = false;
      restoreComposeLayout();
    }
    applyFloatingLayout(root);
    if (!enabled && activeEditor?.isConnected) arrangeComposeForLivePreview(activeEditor, root);
    updateFloatingExitControl(root);
  }

  function setFloatingScale(root, requestedScale, commit = false) {
    const scale = Math.min(100, Math.max(20, Math.round(Number(requestedScale))));
    if (!Number.isFinite(scale)) return;
    viewState.floatingScale = scale;
    const range = root.querySelector('[data-floating-scale]');
    const output = root.querySelector('[data-floating-scale-output]');
    if (range) range.value = String(scale);
    if (output) output.textContent = `${scale}%`;
    if (scaleFrame !== null) cancelAnimationFrame(scaleFrame);
    scaleFrame = requestAnimationFrame(() => {
      scaleFrame = null;
      if (!viewState.floating) return;
      root.querySelector('[data-preview-device]')?.style.setProperty('--grp-scale', String(scale / 100));
      if (commit) updateFloatingPanelSize(root);
    });
  }

  function bindFloatingDrag(root) {
    const handle = root.querySelector('[data-drag-handle]');
    const panel = root.querySelector('.grp-panel');
    if (!handle || !panel) return;

    handle.addEventListener('pointerdown', (event) => {
      if (!viewState.floating || event.target.closest('button, input, label')) return;
      event.preventDefault();
      const startRect = panel.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      handle.setPointerCapture(event.pointerId);
      panel.classList.add('grp-is-dragging');

      const move = (moveEvent) => {
        const maxLeft = Math.max(8, window.innerWidth - startRect.width - 8);
        const maxTop = Math.max(8, window.innerHeight - startRect.height - 8);
        const left = Math.min(maxLeft, Math.max(8, startRect.left + moveEvent.clientX - startX));
        const top = Math.min(maxTop, Math.max(8, startRect.top + moveEvent.clientY - startY));
        panel.style.left = `${Math.round(left)}px`;
        panel.style.top = `${Math.round(top)}px`;
        panel.style.right = 'auto';
        viewState.floatingPosition = { left: Math.round(left), top: Math.round(top) };
      };

      const end = () => {
        panel.classList.remove('grp-is-dragging');
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', end);
        handle.removeEventListener('pointercancel', end);
      };

      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    });
  }

  function setDevice(root, device) {
    viewState.device = device;
    root.querySelectorAll('[data-device]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.device === device)));
    root.querySelector('[data-preview-device]')?.classList.toggle('grp-desktop', device === 'desktop');
    const presetControl = root.querySelector('[data-preset-control]');
    if (presetControl) presetControl.hidden = device === 'desktop';
    const scaleControl = root.querySelector('[data-scale-control]');
    if (scaleControl) scaleControl.hidden = device === 'desktop';
    const scrollHint = root.querySelector('.grp-scroll-hint');
    if (scrollHint) scrollHint.hidden = device === 'desktop';
    const previewDevice = root.querySelector('[data-preview-device]');
    previewDevice?.style.setProperty('--grp-scale', String(device === 'desktop' ? 1 : viewState.previewScale / 100));
    const appBar = root.querySelector('[data-app-bar]');
    if (appBar) appBar.innerHTML = appBarMarkup();
    if (device === 'mobile' && viewState.previewScalePreset === 'fit') requestAnimationFrame(() => fitPreviewToStage(root));
  }

  function setTheme(root, theme) {
    viewState.theme = theme;
    root.querySelectorAll('[data-theme]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.theme === theme)));
    const device = root.querySelector('[data-preview-device]');
    device?.classList.toggle('grp-theme-dark', theme === 'dark');
    device?.classList.toggle('grp-theme-light', theme === 'light');
  }

  function setDevicePreset(root, presetKey) {
    const preset = DEVICE_PRESETS[presetKey];
    if (!preset) return;
    viewState.devicePreset = presetKey;
    const select = root.querySelector('[data-device-preset]');
    if (select) select.value = presetKey;
    const osLabel = root.querySelector('.grp-selected-os');
    if (osLabel) osLabel.textContent = preset.os === 'ios' ? 'iOS' : 'Android';
    const referenceKind = root.querySelector('[data-reference-kind]');
    if (referenceKind) referenceKind.textContent = preset.os === 'ios' ? t('iosReference') : t('androidReference');
    const device = root.querySelector('[data-preview-device]');
    device?.setAttribute('data-os', preset.os);
    device?.setAttribute('data-cutout', preset.cutout);
    device?.style.setProperty('--grp-mobile-width', `${preset.width}px`);
    device?.style.setProperty('--grp-mobile-height', `${preset.height}px`);
    if (viewState.floating) updateFloatingPanelSize(root);
    if (!viewState.floating && viewState.previewScalePreset === 'fit') requestAnimationFrame(() => fitPreviewToStage(root));
    storageSet({ [STORAGE_KEYS.devicePreset]: presetKey });
    refreshPreview();
  }

  function updateScalePresetControls(root) {
    root.querySelectorAll('[data-scale-preset]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.scalePreset === viewState.previewScalePreset));
    });
  }

  function fitPreviewToStage(root) {
    const stage = root.querySelector('.grp-stage');
    const preset = DEVICE_PRESETS[viewState.devicePreset];
    if (!stage || !preset || viewState.device !== 'mobile' || viewState.floating) return;
    const availableWidth = Math.max(1, stage.clientWidth - 40);
    const availableHeight = Math.max(1, stage.clientHeight - 56);
    const fittedScale = Math.floor(Math.min(1, availableWidth / preset.width, availableHeight / preset.height) * 100);
    setPreviewScale(root, fittedScale, false, 'fit');
  }

  function applyPreviewScalePreset(root, preset) {
    if (preset === 'fit') {
      viewState.previewScalePreset = 'fit';
      updateScalePresetControls(root);
      fitPreviewToStage(root);
      return;
    }
    const scale = Number(preset);
    if (scale !== 70 && scale !== 100) return;
    setPreviewScale(root, scale, true, preset);
  }

  function setPreviewScale(root, requestedScale, persist = false, preset = 'custom') {
    const scale = Math.min(100, Math.max(10, Math.round(Number(requestedScale))));
    if (!Number.isFinite(scale)) return;
    viewState.previewScale = scale;
    viewState.previewScalePreset = preset;
    const range = root.querySelector('[data-preview-scale]');
    const output = root.querySelector('[data-preview-scale-output]');
    if (range) range.value = String(scale);
    if (range) range.style.setProperty('--grp-scale-progress', `${(scale - 10) / 90 * 100}%`);
    if (output) output.textContent = `${scale}%`;
    updateScalePresetControls(root);
    if (scaleFrame !== null) cancelAnimationFrame(scaleFrame);
    scaleFrame = requestAnimationFrame(() => {
      scaleFrame = null;
      if (viewState.device === 'mobile') root.querySelector('[data-preview-device]')?.style.setProperty('--grp-scale', String(scale / 100));
    });
    if (persist) storageSet({ [STORAGE_KEYS.previewScale]: scale }).catch(() => {});
  }

  function toggleSettings(root) {
    const button = root.querySelector('[data-settings-button]');
    const menu = root.querySelector('[data-settings-menu]');
    if (!button || !menu) return;
    const shouldOpen = menu.hidden;
    menu.hidden = !shouldOpen;
    button.setAttribute('aria-expanded', String(shouldOpen));
  }

  function setLocale(locale) {
    if (!copy[locale]) return;
    currentLocale = locale;
    updateAllComposeButtons();
    const root = document.getElementById(ROOT_ID);
    if (root && activeEditor?.isConnected) {
      root.lang = locale;
      renderPreviewPanel(root);
    }
    storageSet({ [STORAGE_KEYS.locale]: locale }).catch(() => {});
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshPreview, 120);
  }

  function refreshPreview() {
    const root = document.getElementById(ROOT_ID);
    if (!root || !activeEditor?.isConnected) return;
    const draft = getDraft(activeEditor);
    const risks = auditDraft(activeEditor);
    root.querySelector('[data-preview-subject]').textContent = draft.subject;
    root.querySelector('[data-preview-body]').innerHTML = draft.body.trim() ? draft.body : `<p class="grp-empty">${t('empty')}</p>`;
    root.querySelector('[data-audit-status]').textContent = auditStatus(risks);
    root.querySelector('[data-risk-list]').innerHTML = riskMarkup(risks);
    root.querySelector('.grp-audit').classList.toggle('grp-has-risks', risks.length > 0);
  }

  function onEscape(event) {
    const root = document.getElementById(ROOT_ID);
    const eventTarget = event.target instanceof Element ? event.target : null;
    if (!eventTarget?.closest(`#${ROOT_ID}`)) return;
    const menu = root?.querySelector('[data-settings-menu]');
    if (event.key !== 'Escape') return;
    if (menu && !menu.hidden) {
      menu.hidden = true;
      root.querySelector('[data-settings-button]')?.setAttribute('aria-expanded', 'false');
      return;
    }
    closePreview();
  }

  function closePreview() {
    document.getElementById(ROOT_ID)?.remove();
    if (layoutFrame !== null) cancelAnimationFrame(layoutFrame);
    if (scaleFrame !== null) cancelAnimationFrame(scaleFrame);
    layoutFrame = null;
    scaleFrame = null;
    restoreComposeLayout();
    document.removeEventListener('keydown', onEscape);
    window.removeEventListener('resize', scheduleLiveLayout);
    activeDraftObserver?.disconnect();
    activeDraftObserver = null;
    composeLayoutObserver?.disconnect();
    composeLayoutObserver = null;
    if (activeCompose && composeChromeHandler) activeCompose.removeEventListener('pointerdown', composeChromeHandler, true);
    composeChromeHandler = null;
    if (activeEditor) {
      activeEditor.removeEventListener('input', scheduleRefresh);
      activeCompose?.querySelector('input[name="subjectbox"]')?.removeEventListener('input', scheduleRefresh);
    }
    viewState.floating = false;
    viewState.floatingPosition = null;
    viewState.fullPanelOverride = false;
    activeEditor = null;
    activeCompose = null;
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const scope = mutation.target.closest?.('[role="dialog"]') || mutation.target;
        scanForEditors(scope);
      }
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) scanForEditors(node);
      });
      const previewButtonWasRemoved = [...mutation.removedNodes].some((node) =>
        node.nodeType === Node.ELEMENT_NODE && (node.matches?.(`.${BUTTON_CLASS}`) || node.querySelector?.(`.${BUTTON_CLASS}`))
      );
      if (previewButtonWasRemoved) scanForEditors();
    }
  });

  async function initialize() {
    const stored = await storageGet(Object.values(STORAGE_KEYS));
    if (copy[stored[STORAGE_KEYS.locale]]) currentLocale = stored[STORAGE_KEYS.locale];
    const legacyPresetMap = { ios: 'iphone16', android: 'pixel9' };
    const requestedPreset = legacyPresetMap[stored[STORAGE_KEYS.devicePreset]] || stored[STORAGE_KEYS.devicePreset];
    if (DEVICE_PRESETS[requestedPreset]) viewState.devicePreset = requestedPreset;
    const storedScale = Number(stored[STORAGE_KEYS.previewScale]);
    if (storedScale >= 10 && storedScale <= 100) viewState.previewScale = Math.round(storedScale);
    scanForEditors();
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['contenteditable', 'role'],
      childList: true,
      subtree: true
    });
  }

  initialize().catch(() => {});
})();
