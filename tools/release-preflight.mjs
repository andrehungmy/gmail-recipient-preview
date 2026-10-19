import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const args = new Set(process.argv.slice(2));
const allowDirty = args.has("--allow-dirty");
const requireManualComplete = args.has("--require-manual-complete");
const failures = [];
const warnings = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function read(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch (error) {
    failures.push(`Unable to read ${relativePath}: ${error.message}`);
    return "";
  }
}

function git(...gitArgs) {
  return execFileSync("git", gitArgs, {
    cwd: root,
    encoding: "utf8",
  }).trim();
}

const manifest = JSON.parse(await read("manifest.json"));
const packageJson = JSON.parse(await read("package.json"));
const packageLock = JSON.parse(await read("package-lock.json"));
const version = manifest.version;
const releaseNotesPath = `docs/releases/v${version}.md`;
const artifactPath = `dist/gmail-recipient-preview-v${version}.zip`;
const checksumPath = `${artifactPath}.sha256`;
const releaseNotes = await read(releaseNotesPath);
const checklist = await read("docs/release-checklist.md");
const artifact = await readFile(path.join(root, artifactPath)).catch(
  (error) => {
    failures.push(`Unable to read ${artifactPath}: ${error.message}`);
    return Buffer.alloc(0);
  },
);
const checksumFile = await read(checksumPath);

check(
  /^\d+\.\d+\.\d+$/.test(version),
  `Manifest version is invalid: ${version}`,
);
check(
  packageJson.version === version,
  "package.json version does not match manifest.json.",
);
check(
  packageLock.version === version &&
    packageLock.packages?.[""]?.version === version,
  "package-lock.json version does not match manifest.json.",
);
check(
  releaseNotes.includes(version) && !/\b(?:TODO|TBD)\b/.test(releaseNotes),
  `${releaseNotesPath} must identify the candidate and contain no TODO or TBD markers.`,
);

const checklistCandidate = checklist
  .match(/^\*\*Candidate:\*\*\s*`?([^`\n]+)`?/m)?.[1]
  ?.trim();
check(
  checklistCandidate === version,
  `docs/release-checklist.md candidate is ${checklistCandidate || "missing"}; expected ${version}.`,
);

const expectedChecksum = createHash("sha256").update(artifact).digest("hex");
const recordedChecksum = checksumFile.match(/^([a-f0-9]{64})\s+/)?.[1];
const checklistChecksum = checklist
  .match(/^\*\*SHA-256:\*\*\s*`?([a-f0-9]{64})`?/m)?.[1]
  ?.trim();
check(
  artifact.length > 0 && recordedChecksum === expectedChecksum,
  `${checksumPath} does not match the packaged artifact.`,
);
check(
  checklistChecksum === expectedChecksum,
  `docs/release-checklist.md checksum is ${checklistChecksum || "missing"}; expected ${expectedChecksum}.`,
);

let branch = "unknown";
let dirty = "";
try {
  branch = git("rev-parse", "--abbrev-ref", "HEAD");
  dirty = git("status", "--porcelain=v1", "--untracked-files=all");
} catch (error) {
  failures.push(`Unable to inspect Git state: ${error.message}`);
}

if (dirty) {
  const message = `Working tree is not clean:\n${dirty}`;
  if (allowDirty) warnings.push(message);
  else failures.push(message);
}

const manualPending = [...checklist.matchAll(/^- \[ \] (.+)$/gm)].map(
  (match) => match[1],
);

if (requireManualComplete && manualPending.length) {
  failures.push(
    `${manualPending.length} manual release checklist items remain incomplete.`,
  );
}

console.log(`Release candidate: v${version}`);
console.log(`Git branch: ${branch}`);
console.log(`Artifact: ${artifactPath}`);
console.log(`SHA-256: ${expectedChecksum}`);

if (warnings.length) {
  console.warn(`Warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (manualPending.length) {
  console.warn(`Manual gates still pending (${manualPending.length}):`);
  manualPending.forEach((item) => console.warn(`- ${item}`));
} else {
  console.log("Manual release checklist is complete.");
}

if (failures.length) {
  console.error(`Release preflight failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  manualPending.length
    ? "Automated release preflight passed; Chrome Web Store submission remains blocked on the listed manual gates and maintainer approval."
    : "Release preflight passed. Submission still requires explicit maintainer approval.",
);
