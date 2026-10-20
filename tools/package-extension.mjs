import { createHash } from "node:crypto";
import {
  access,
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  utimes,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
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

// ZIP entries record each file's mtime and mode, which differ between
// checkouts. Stage copies with a fixed mtime and mode so the same commit
// always produces a byte-identical archive.
const sourceDateEpoch = Number(process.env.SOURCE_DATE_EPOCH ?? 315532800); // 1980-01-01T00:00:00Z
const sortedFiles = [...packageFiles].sort();
const staging = await mkdtemp(path.join(tmpdir(), "gmail-recipient-preview-"));

try {
  for (const file of sortedFiles) {
    const staged = path.join(staging, file);
    await mkdir(path.dirname(staged), { recursive: true });
    await copyFile(path.join(root, file), staged);
    await chmod(staged, 0o644);
    await utimes(staged, sourceDateEpoch, sourceDateEpoch);
  }

  const result = spawnSync("zip", ["-X", "-q", output, ...sortedFiles], {
    cwd: staging,
    encoding: "utf8",
    // DOS timestamps are stored in local time; pin the zone.
    env: { ...process.env, TZ: "UTC" },
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || `zip exited with status ${result.status}`);
  }
} finally {
  await rm(staging, { recursive: true, force: true });
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
