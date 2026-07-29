import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const manifest = JSON.parse(await read("manifest.json"));
const packageJson = JSON.parse(await read("package.json"));
const packageLock = JSON.parse(await read("package-lock.json"));
const englishMessages = JSON.parse(await read("_locales/en/messages.json"));
const traditionalChineseMessages = JSON.parse(
  await read("_locales/zh_TW/messages.json"),
);
const content = await read("content.js");
const popup = await read("popup.js");
const landing = await read("landing.js");
const popupHtml = await read("popup.html");
const landingHtml = await read("landing.html");

check(manifest.manifest_version === 3, "Manifest must remain version 3.");
check(
  packageJson.version === manifest.version,
  "Package and manifest versions must match.",
);
check(
  packageLock.version === manifest.version &&
    packageLock.packages?.[""]?.version === manifest.version,
  "Package lock and manifest versions must match.",
);
check(
  manifest.default_locale === "en",
  "English must remain the fallback locale.",
);
check(
  manifest.name === "__MSG_appName__" &&
    manifest.description === "__MSG_appDescription__",
  "Manifest name and description must use localized message keys.",
);
check(
  englishMessages.appName?.message === "Gmail Recipient Preview" &&
    traditionalChineseMessages.appName?.message === "Gmail Recipient Preview",
  "The product name must remain consistent across locales.",
);
check(
  Boolean(englishMessages.appDescription?.message) &&
    Boolean(traditionalChineseMessages.appDescription?.message),
  "Both supported locales must provide an extension summary.",
);
check(
  JSON.stringify(manifest.permissions) === JSON.stringify(["storage"]),
  "Only the storage permission is expected.",
);
check(
  JSON.stringify(manifest.host_permissions) ===
    JSON.stringify(["https://mail.google.com/*"]),
  "Host access must remain limited to mail.google.com.",
);
check(!manifest.background, "A background service worker is not expected.");
check(
  !manifest.externally_connectable,
  "External connections are not expected.",
);
check(
  !manifest.web_accessible_resources,
  "No web-accessible resource is expected.",
);
check(
  manifest.content_security_policy?.extension_pages ===
    "script-src 'self'; object-src 'self'",
  "Extension pages must use the explicit self-only Content Security Policy.",
);

const productionScripts = [content, popup, landing].join("\n");
const forbiddenNetworkClients = [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /\bsendBeacon\s*\(/,
  /\bEventSource\b/,
];
forbiddenNetworkClients.forEach((pattern) =>
  check(
    !pattern.test(productionScripts),
    `Unexpected network client matched ${pattern}.`,
  ),
);

check(
  !/\beval\s*\(|\bnew\s+Function\b|document\.write\s*\(/.test(
    productionScripts,
  ),
  "Dynamic code execution is not allowed.",
);
check(
  !/<script(?![^>]+src=)[^>]*>/i.test(`${popupHtml}\n${landingHtml}`),
  "Extension pages must not contain inline scripts.",
);

for (const html of [popupHtml, landingHtml]) {
  const externalLinks = [
    ...html.matchAll(/<a\b[^>]*href="https?:\/\/[^\"]+"[^>]*>/gi),
  ].map((match) => match[0]);
  externalLinks.forEach((link) => {
    check(
      /target="_blank"/i.test(link),
      `External link must open explicitly: ${link}`,
    );
    check(
      /rel="[^"]*noopener[^"]*"/i.test(link),
      `External link must use noopener: ${link}`,
    );
  });
}

check(content.includes("SAFE_EMAIL_TAGS"), "Email tag allowlist is missing.");
check(
  content.includes("DROP_WITH_CONTENT_TAGS"),
  "Active-content drop list is missing.",
);
check(
  content.includes("SAFE_STYLE_PROPERTIES"),
  "Inline-style allowlist is missing.",
);
check(
  content.includes("SAFE_INLINE_IMAGE_PATTERN"),
  "Inline-image allowlist is missing.",
);
check(
  content.includes("replaceImageWithPlaceholder"),
  "Blocked images must render a safe placeholder.",
);
check(
  content.includes("noopener noreferrer"),
  "Preview links must use noopener noreferrer.",
);
check(
  content.includes("'META'"),
  "Meta elements must remain on the active-content drop list.",
);
check(
  content.includes("'LINK'"),
  "Link elements must remain on the active-content drop list.",
);
check(
  !/SAFE_STYLE_PROPERTIES[\s\S]{0,1600}'position'/.test(content),
  "Position must not be allowed in draft inline styles.",
);
check(
  !/SAFE_STYLE_PROPERTIES[\s\S]{0,1600}'z-index'/.test(content),
  "z-index must not be allowed in draft inline styles.",
);
check(
  !productionScripts.includes("localStorage"),
  "Production scripts must persist preferences only through chrome.storage.local.",
);

const storedKeys = [
  ...content.matchAll(/gmailReaderPreview(?:Locale|DevicePreset|Scale)/g),
].map((match) => match[0]);
check(
  new Set(storedKeys).size === 3,
  "Only locale, device preset, and preview scale may be persisted.",
);

if (failures.length) {
  console.error(`Security check failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  "Security check passed: permissions, network boundary, script policy, link safety, sanitizer controls, and stored keys are within the expected scope.",
);
