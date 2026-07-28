import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "assets/store/raw/01-live-mobile-light.png");
const iconPath = path.join(root, "icons/icon-128.png");
const outputDir = path.join(root, "assets/store/final");
const size = { width: 1280, height: 800 };

await mkdir(outputDir, { recursive: true });

function escapeXml(value) {
  return String(value).replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );
}

function svg(markup) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">${markup}</svg>`,
  );
}

function sizedSvg(markup, dimensions) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}">${markup}</svg>`,
  );
}

function textBlock({
  x,
  y,
  lines,
  size: fontSize,
  weight = 650,
  color = "#12233f",
  lineHeight = 1.12,
  family = "Avenir Next, Segoe UI, Arial, sans-serif",
  anchor = "start",
}) {
  const tspans = lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : Math.round(fontSize * lineHeight)}">${escapeXml(line)}</tspan>`,
    )
    .join("");
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-family="${family}" font-size="${fontSize}" font-weight="${weight}" letter-spacing="-${Math.max(0, fontSize * 0.025)}">${tspans}</text>`;
}

function smallLabel(x, y, value, color = "#0b57d0") {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="2">${escapeXml(value.toUpperCase())}</text>`;
}

async function icon(width) {
  return sharp(iconPath).resize(width, width).png().toBuffer();
}

async function screenshotCrop(extract, resize) {
  let image = sharp(sourcePath).extract(extract);
  if (resize) image = image.resize(resize);
  return image.png().toBuffer();
}

async function exportImage(filename, background, layers) {
  const canvas = sharp({ create: { ...size, channels: 4, background } });
  await canvas
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, filename));
}

const brandIcon = await icon(62);

await exportImage("01-live-recipient-view-1280x800.png", "#09162c", [
  {
    input: svg(`
      ${smallLabel(72, 116, "Gmail Recipient Preview", "#8eb9ff")}
      ${textBlock({ x: 72, y: 214, lines: ["Write in Gmail.", "Preview the", "recipient view."], size: 54, color: "#ffffff", lineHeight: 1.02 })}
      ${textBlock({ x: 72, y: 470, lines: ["Keep editing while the mobile", "preview updates beside your draft."], size: 20, weight: 450, color: "#bdc9db", lineHeight: 1.45 })}
      <rect x="72" y="590" width="288" height="50" rx="12" fill="#4d8df7"/>
      <text x="216" y="622" text-anchor="middle" fill="#07162e" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="17" font-weight="700">Live recipient preview</text>
    `),
    left: 0,
    top: 0,
  },
  {
    input: await screenshotCrop(
      { left: 540, top: 60, width: 1508, height: 1220 },
      { width: 824, height: 700, fit: "cover", position: "right" },
    ),
    left: 456,
    top: 50,
  },
  { input: brandIcon, left: 72, top: 34 },
]);

await exportImage("02-reference-devices-1280x800.png", "#f7f8f4", [
  {
    input: svg(`
      ${smallLabel(70, 84, "Reference viewports")}
      ${textBlock({ x: 70, y: 166, lines: ["Compare common", "reading widths."], size: 50, lineHeight: 1.04 })}
      ${textBlock({ x: 70, y: 300, lines: ["Switch between iPhone, Pixel, and", "Samsung Galaxy reference sizes", "without changing the draft."], size: 19, weight: 450, color: "#5f6368", lineHeight: 1.45 })}
      <line x1="70" y1="486" x2="500" y2="486" stroke="#12233f" stroke-width="2"/>
      <line x1="70" y1="478" x2="70" y2="502" stroke="#12233f" stroke-width="2"/>
      <line x1="282" y1="478" x2="282" y2="498" stroke="#12233f" stroke-width="2"/>
      <line x1="500" y1="478" x2="500" y2="502" stroke="#12233f" stroke-width="2"/>
      <text x="70" y="530" fill="#5f6368" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="15" font-weight="600">320</text>
      <text x="266" y="530" fill="#5f6368" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="15" font-weight="600">393</text>
      <text x="456" y="530" fill="#5f6368" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="15" font-weight="600">412 px</text>
      <rect x="70" y="594" width="198" height="42" rx="21" fill="#d3e3fd"/><text x="169" y="621" text-anchor="middle" fill="#0842a0" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="15" font-weight="700">iOS logical reference</text>
      <rect x="278" y="594" width="228" height="42" rx="21" fill="#e0f2e6"/><text x="392" y="621" text-anchor="middle" fill="#137333" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="15" font-weight="700">Android calibrated</text>
      <text x="142" y="742" fill="#12233f" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="16" font-weight="700">Gmail Recipient Preview</text>
    `),
    left: 0,
    top: 0,
  },
  {
    input: await screenshotCrop(
      { left: 1165, top: 0, width: 883, height: 1120 },
      { width: 600, height: 760, fit: "cover", position: "top" },
    ),
    left: 622,
    top: 40,
  },
  { input: brandIcon, left: 70, top: 694 },
]);

await exportImage("03-formatting-checks-1280x800.png", "#ffede5", [
  {
    input: svg(`
      ${smallLabel(70, 82, "Formatting checks", "#b3421f")}
      ${textBlock({ x: 70, y: 158, lines: ["Catch risky formatting", "before you send."], size: 48, lineHeight: 1.04 })}
      ${textBlock({ x: 70, y: 286, lines: ["The preview flags low contrast, hidden", "text, long URLs, blank space, and media", "that may extend beyond the phone."], size: 18, weight: 450, color: "#725447", lineHeight: 1.45 })}
      <circle cx="86" cy="470" r="8" fill="#e86d43"/><text x="112" y="477" fill="#6d3f31" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="17" font-weight="650">Local checks</text>
      <circle cx="86" cy="520" r="8" fill="#e86d43"/><text x="112" y="527" fill="#6d3f31" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="17" font-weight="650">No external AI API</text>
      <circle cx="86" cy="570" r="8" fill="#e86d43"/><text x="112" y="577" fill="#6d3f31" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="17" font-weight="650">Draft is never stored</text>
      <text x="142" y="742" fill="#12233f" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="16" font-weight="700">Gmail Recipient Preview</text>
    `),
    left: 0,
    top: 0,
  },
  {
    input: await screenshotCrop(
      { left: 760, top: 260, width: 1288, height: 1020 },
      { width: 710, height: 690, fit: "cover", position: "right bottom" },
    ),
    left: 570,
    top: 110,
  },
  { input: brandIcon, left: 70, top: 694 },
]);

await exportImage("04-preview-zoom-1280x800.png", "#d3e3fd", [
  {
    input: svg(`
      ${smallLabel(70, 82, "Preview zoom")}
      ${textBlock({ x: 70, y: 164, lines: ["Inspect the layout", "at the detail you need."], size: 50, lineHeight: 1.04 })}
      ${textBlock({ x: 70, y: 300, lines: ["Use Fit for the complete device,", "70% for comfortable review, or", "100% for the logical viewport."], size: 19, weight: 450, color: "#42526d", lineHeight: 1.45 })}
      <rect x="70" y="482" width="110" height="48" rx="24" fill="#0b57d0"/><text x="125" y="513" text-anchor="middle" fill="#fff" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="17" font-weight="700">Fit</text>
      <rect x="192" y="482" width="110" height="48" rx="24" fill="#ffffff"/><text x="247" y="513" text-anchor="middle" fill="#12233f" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="17" font-weight="700">70%</text>
      <rect x="314" y="482" width="160" height="48" rx="24" fill="#ffffff"/><text x="394" y="513" text-anchor="middle" fill="#12233f" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="17" font-weight="700">100% detail</text>
      <text x="70" y="602" fill="#42526d" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="15" font-weight="600">100% = 1× logical viewport</text>
      <text x="70" y="630" fill="#66758c" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="14" font-weight="450">Not the phone's physical size.</text>
      <text x="142" y="742" fill="#12233f" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="16" font-weight="700">Gmail Recipient Preview</text>
    `),
    left: 0,
    top: 0,
  },
  {
    input: await screenshotCrop(
      { left: 1190, top: 0, width: 858, height: 900 },
      { width: 650, height: 682, fit: "cover", position: "top" },
    ),
    left: 612,
    top: 78,
  },
  { input: brandIcon, left: 70, top: 694 },
]);

const promoSize = { width: 440, height: 280 };
const promoIcon = await icon(54);
await sharp({
  create: {
    ...promoSize,
    channels: 4,
    background: "#f7f9fd",
  },
})
  .composite([
    {
      input: sizedSvg(
        `
      <rect x="0" y="0" width="440" height="8" fill="#0b57d0"/>
      <text x="100" y="55" fill="#12233f" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="17" font-weight="700">Gmail Recipient Preview</text>
      <text x="30" y="142" fill="#12233f" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="36" font-weight="720" letter-spacing="-1.1">Preview before</text>
      <text x="30" y="184" fill="#12233f" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="36" font-weight="720" letter-spacing="-1.1">you send.</text>
      <text x="30" y="230" fill="#5f6670" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="14" font-weight="550">Live Gmail draft preview · processed locally</text>
      <circle cx="410" cy="250" r="7" fill="#0b57d0"/>
    `,
        promoSize,
      ),
      left: 0,
      top: 0,
    },
    { input: promoIcon, left: 30, top: 23 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, "small-promo-440x280.png"));

console.log(`Exported 4 screenshots and 1 small promo tile to ${outputDir}`);
