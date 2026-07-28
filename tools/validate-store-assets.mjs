import { access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const expectedAssets = [
  ["icons/icon-128.png", 128, 128],
  ["assets/store/final/01-live-recipient-view-1280x800.png", 1280, 800],
  ["assets/store/final/02-reference-devices-1280x800.png", 1280, 800],
  ["assets/store/final/03-formatting-checks-1280x800.png", 1280, 800],
  ["assets/store/final/04-preview-zoom-1280x800.png", 1280, 800],
  ["assets/store/final/small-promo-440x280.png", 440, 280],
];

for (const [relativePath, expectedWidth, expectedHeight] of expectedAssets) {
  const filePath = path.join(root, relativePath);
  await access(filePath);
  const metadata = await sharp(filePath).metadata();
  if (
    metadata.width !== expectedWidth ||
    metadata.height !== expectedHeight ||
    metadata.format !== "png"
  ) {
    throw new Error(
      `${relativePath} must be a ${expectedWidth}x${expectedHeight} PNG; received ${metadata.width}x${metadata.height} ${metadata.format || "unknown"}.`,
    );
  }
}

console.log(
  `Store asset validation passed: ${expectedAssets.length} PNG files match their required dimensions.`,
);
