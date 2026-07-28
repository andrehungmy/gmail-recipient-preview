import { access, mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "assets", "landing");
const storeRawOutput = path.join(
  root,
  "assets",
  "store",
  "raw",
  "01-live-mobile-light.png",
);
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }
  throw new Error(
    "Chrome was not found. Set CHROME_PATH to a Chrome executable.",
  );
}

function startServer() {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url || "/", "http://127.0.0.1").pathname,
      );
      const relativePath =
        pathname === "/" ? "qa/harness.html" : pathname.replace(/^\/+/, "");
      const filePath = path.resolve(root, relativePath);
      if (!filePath.startsWith(`${root}${path.sep}`))
        return response.writeHead(403).end("Forbidden");
      const body = await readFile(filePath);
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-type":
          mimeTypes.get(path.extname(filePath)) || "application/octet-stream",
      });
      response.end(body);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string")
        return reject(new Error("Could not start capture server."));
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

const chromePath = await findChrome();
const { server, baseUrl } = await startServer();
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

function paddedClip(box, viewport, padding) {
  const x = Math.max(0, Math.floor(box.x - padding.left));
  const y = Math.max(0, Math.floor(box.y - padding.top));
  const right = Math.min(
    viewport.width,
    Math.ceil(box.x + box.width + padding.right),
  );
  const bottom = Math.min(
    viewport.height,
    Math.ceil(box.y + box.height + padding.bottom),
  );
  return { x, y, width: right - x, height: bottom - y };
}

try {
  await mkdir(output, { recursive: true });
  await page.goto(`${baseUrl}/qa/harness.html`);
  await page.locator(".fake-gmail").evaluate((element) => {
    element.textContent = "";
  });
  const previewButton = page.locator(".gmail-reader-preview-button");
  const compose = page.locator('section[role="dialog"]').first();
  await previewButton.waitFor();

  await previewButton.click();
  await page.locator("#gmail-reader-preview-root").waitFor();
  await compose.evaluate((element) => {
    element.style.top = "96px";
    element.style.bottom = "auto";
  });
  const composeBox = await compose.boundingBox();
  const fullPanelBox = await page.locator(".grp-panel").boundingBox();
  if (!composeBox || !fullPanelBox)
    throw new Error("Could not measure the live preview composition.");
  const fullComposition = {
    x: Math.min(composeBox.x, fullPanelBox.x),
    y: Math.min(composeBox.y, fullPanelBox.y),
    width:
      Math.max(
        composeBox.x + composeBox.width,
        fullPanelBox.x + fullPanelBox.width,
      ) - Math.min(composeBox.x, fullPanelBox.x),
    height:
      Math.max(
        composeBox.y + composeBox.height,
        fullPanelBox.y + fullPanelBox.height,
      ) - Math.min(composeBox.y, fullPanelBox.y),
  };
  await page.screenshot({
    path: path.join(output, "01-full-control-panel.jpg"),
    type: "jpeg",
    quality: 92,
    clip: paddedClip(
      fullComposition,
      { width: 1440, height: 900 },
      { top: 12, right: 0, bottom: 0, left: 0 },
    ),
  });

  await page.locator(".grp-header [data-close]").click();
  await page
    .locator("#gmail-reader-preview-root")
    .waitFor({ state: "detached" });
  await compose.evaluate((element) => {
    element.style.width = "900px";
    element.style.height = "640px";
  });
  await page.waitForFunction(
    () =>
      !document
        .querySelector(".gmail-reader-preview-button")
        ?.hasAttribute("data-compact"),
  );
  await compose.screenshot({
    path: path.join(output, "02-preview-button.jpg"),
    type: "jpeg",
    quality: 92,
  });

  await previewButton.click();
  const previewRoot = page.locator("#gmail-reader-preview-root");
  await previewRoot.waitFor();
  if (
    !(await previewRoot.evaluate((element) =>
      element.classList.contains("grp-is-floating"),
    ))
  ) {
    await page.locator("[data-floating-enter]").click();
  }
  await page.locator("[data-floating-scale]").fill("70");
  await page.locator("[data-floating-scale]").dispatchEvent("change");
  await page.waitForTimeout(240);
  await compose.evaluate((element) => {
    element.style.visibility = "hidden";
  });
  const floatingPanelBox = await page.locator(".grp-panel").boundingBox();
  if (!floatingPanelBox)
    throw new Error("Could not measure the floating preview.");
  await page.screenshot({
    path: path.join(output, "03-floating-view.jpg"),
    type: "jpeg",
    quality: 92,
    clip: paddedClip(
      floatingPanelBox,
      { width: 1440, height: 900 },
      { top: 28, right: 18, bottom: 34, left: 40 },
    ),
  });

  await page.setViewportSize({ width: 2048, height: 1280 });
  await page.goto(`${baseUrl}/qa/harness.html`);
  await page.locator(".fake-gmail").evaluate((element) => {
    element.textContent = "";
  });
  const storePreviewButton = page.locator(".gmail-reader-preview-button");
  await storePreviewButton.waitFor();
  await storePreviewButton.click();
  await page.locator("#gmail-reader-preview-root").waitFor();
  await page.locator("[data-floating-scale]").waitFor({ state: "attached" });
  await page.waitForTimeout(180);
  await mkdir(path.dirname(storeRawOutput), { recursive: true });
  await page.screenshot({ path: storeRawOutput, type: "png" });

  if (process.env.GRP_LANDING_QA_SCREENSHOT) {
    await page.setViewportSize({ width: 2048, height: 1152 });
    await page.goto(`${baseUrl}/landing.html`);
    await page.locator('[data-locale="zh-TW"]').click();
    await page.locator("#how-it-works").evaluate((section) => {
      document.documentElement.style.scrollBehavior = "auto";
      globalThis.scrollTo(0, section.offsetTop - 92);
    });
    await page
      .locator(".workflow-visual img")
      .evaluate((image) => image.decode());
    await page.screenshot({
      path: process.env.GRP_LANDING_QA_SCREENSHOT,
      type: "jpeg",
      quality: 90,
    });
  }
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

console.log(
  "Updated Landing and Chrome Web Store source screenshots from the local QA harness.",
);
