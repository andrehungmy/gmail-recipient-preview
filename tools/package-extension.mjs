import { createHash } from "node:crypto";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { packageFiles } from "./package-files.mjs";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  await readFile(path.join(root, "manifest.json"), "utf8"),
);
const outputDirectory = path.join(root, "dist");
const output = path.join(
  outputDirectory,
  `gmail-recipient-preview-v${manifest.version}.zip`,
);

await Promise.all(packageFiles.map((file) => access(path.join(root, file))));
await mkdir(outputDirectory, { recursive: true });
await rm(output, { force: true });

const result = spawnSync("zip", ["-X", "-q", output, ...packageFiles], {
  cwd: root,
  encoding: "utf8",
});

if (result.error) throw result.error;
if (result.status !== 0) {
  throw new Error(result.stderr || `zip exited with status ${result.status}`);
}

const archive = await readFile(output);
const checksum = createHash("sha256").update(archive).digest("hex");
await writeFile(
  `${output}.sha256`,
  `${checksum}  ${path.basename(output)}\n`,
  "utf8",
);

console.log(
  `Created ${path.relative(root, output)} with ${packageFiles.length} runtime files. SHA-256: ${checksum}`,
);
