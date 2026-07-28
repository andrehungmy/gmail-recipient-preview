import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { packageFiles } from "./package-files.mjs";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  await readFile(path.join(root, "manifest.json"), "utf8"),
);
const archive = path.join(
  root,
  "dist",
  `gmail-recipient-preview-v${manifest.version}.zip`,
);
const result = spawnSync("unzip", ["-Z1", archive], { encoding: "utf8" });

if (result.error) throw result.error;
if (result.status !== 0) {
  throw new Error(result.stderr || `unzip exited with status ${result.status}`);
}

const actual = result.stdout.trim().split("\n").filter(Boolean).sort();
const expected = [...packageFiles].sort();
const missing = expected.filter((file) => !actual.includes(file));
const unexpected = actual.filter((file) => !expected.includes(file));

if (missing.length || unexpected.length) {
  throw new Error(
    [
      missing.length ? `Missing: ${missing.join(", ")}` : "",
      unexpected.length ? `Unexpected: ${unexpected.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

const { size } = await stat(archive);
const archiveBuffer = await readFile(archive);
const expectedChecksum = createHash("sha256")
  .update(archiveBuffer)
  .digest("hex");
const checksumRecord = await readFile(`${archive}.sha256`, "utf8");
if (
  checksumRecord.trim() !== `${expectedChecksum}  ${path.basename(archive)}`
) {
  throw new Error("Package checksum record does not match the release ZIP.");
}
console.log(
  `Package inspection passed: ${actual.length} allowlisted files, ${(size / 1024).toFixed(1)} KiB, SHA-256 ${expectedChecksum}.`,
);
