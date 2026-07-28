import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const root = path.resolve(import.meta.dirname, "..");
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }
  throw new Error(
    "Chrome was not found. Set CHROME_PATH to a Chrome or Chromium executable.",
  );
}

function startServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestedPath = decodeURIComponent(
        new URL(request.url || "/", "http://127.0.0.1").pathname,
      );
      const relativePath =
        requestedPath === "/"
          ? "qa/harness.html"
          : requestedPath.replace(/^\/+/, "");
      const filePath = path.resolve(root, relativePath);
      if (!filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
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
      if (!address || typeof address === "string") {
        reject(new Error("Could not resolve the test server address."));
        return;
      }
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function runTest(name, callback) {
  try {
    await callback();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const chromePath = await findChrome();
const { server, baseUrl } = await startServer();
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});
const context = await browser.newContext();
const page = await context.newPage();
const externalRequests = [];

await context.route("**/*", async (route) => {
  const url = new URL(route.request().url());
  if (url.hostname !== "127.0.0.1") {
    externalRequests.push(url.href);
    await route.abort("blockedbyclient");
    return;
  }
  await route.continue();
});

try {
  await page.goto(`${baseUrl}/qa/harness.html`);
  await page.locator(".gmail-reader-preview-button").waitFor();

  await runTest(
    "keeps Preview in Gmail's discard group across Compose sizes",
    async () => {
      const compose = page.locator('[role="dialog"]');
      const button = compose.locator(".gmail-reader-preview-button");
      const discard = compose.getByRole("button", { name: "Discard draft" });
      const more = compose.getByRole("button", { name: "More options" });

      const assertNativePlacement = async () => {
        const placement = await button.evaluate((element) => {
          const discardControl = element.parentElement?.querySelector(
            '[aria-label="Discard draft"]',
          );
          const buttonRect = element.getBoundingClientRect();
          const discardRect = discardControl?.getBoundingClientRect();
          return {
            sameHost: Boolean(discardControl),
            beforeDiscard: element.nextElementSibling === discardControl,
            position:
              element.ownerDocument.defaultView?.getComputedStyle(element)
                .position || "",
            gap: discardRect ? discardRect.left - buttonRect.right : -1,
          };
        });
        assert.equal(placement.sameHost, true);
        assert.equal(placement.beforeDiscard, true);
        assert.equal(placement.position, "relative");
        assert.ok(placement.gap >= 7);
      };

      await assertNativePlacement();
      assert.equal(await button.getAttribute("data-compact"), "");
      const compactRects = await Promise.all([
        more.evaluate((element) => element.getBoundingClientRect().toJSON()),
        button.evaluate((element) => element.getBoundingClientRect().toJSON()),
      ]);
      assert.ok(compactRects[0].right <= compactRects[1].left);

      await compose.evaluate((element) => {
        element.style.width = "900px";
      });
      const expandedComposeWidth = await compose.evaluate(
        (element) => element.getBoundingClientRect().width,
      );
      assert.ok(
        expandedComposeWidth >= 890,
        `Expected expanded Compose width, received ${expandedComposeWidth}`,
      );
      await page.waitForFunction(
        () =>
          !document
            .querySelector(".gmail-reader-preview-button")
            ?.hasAttribute("data-compact"),
      );
      await assertNativePlacement();

      await compose.evaluate((element) => {
        element.style.width = "560px";
      });
      await page.waitForFunction(() =>
        document
          .querySelector(".gmail-reader-preview-button")
          ?.hasAttribute("data-compact"),
      );
      await assertNativePlacement();
      assert.ok(await discard.isVisible());
    },
  );

  await runTest(
    "detects Compose and synchronizes the active draft",
    async () => {
      assert.equal(
        await page.locator(".gmail-reader-preview-button").count(),
        1,
      );
      await page.locator(".gmail-reader-preview-button").click();
      await page.locator("#gmail-reader-preview-root").waitFor();
      if (process.env.CAPTURE_SCREENSHOT) {
        await page.screenshot({
          path: process.env.CAPTURE_SCREENSHOT,
          fullPage: true,
        });
      }
      await assertText(
        page.locator("[data-preview-subject]"),
        "A thoughtful follow-up after our conversation",
      );
      assert.equal(await page.locator(".grp-image-placeholder").count(), 1);
      await assertText(
        page.locator("[data-risk-list]"),
        "network-backed image",
      );
      assert.deepEqual(externalRequests, []);

      await page.locator('input[name="subjectbox"]').fill("Updated subject");
      await page
        .locator('[contenteditable="true"]')
        .fill("Updated body for the recipient.");
      await assertText(
        page.locator("[data-preview-subject]"),
        "Updated subject",
      );
      await assertText(
        page.locator("[data-preview-body]"),
        "Updated body for the recipient.",
      );
    },
  );

  await runTest(
    "keeps Gmail's minimized draft tray visible below the full preview",
    async () => {
      const root = page.locator("#gmail-reader-preview-root");
      const panel = root.locator(".grp-panel");
      await page.evaluate(() => {
        const tray = document.createElement("section");
        tray.id = "qa-minimized-draft";
        tray.setAttribute("role", "dialog");
        tray.setAttribute("aria-label", "Minimized draft");
        Object.assign(tray.style, {
          position: "fixed",
          right: "620px",
          bottom: "0",
          width: "280px",
          height: "48px",
          background: "white",
        });
        document.body.appendChild(tray);
      });
      await page.waitForFunction(
        () =>
          document
            .getElementById("gmail-reader-preview-root")
            ?.style.getPropertyValue("--grp-compose-tray-safe-area") === "56px",
      );
      const panelRect = await panel.evaluate((element) =>
        element.getBoundingClientRect().toJSON(),
      );
      assert.equal(
        Math.round(panelRect.bottom),
        page.viewportSize().height - 56,
      );

      await page
        .locator("#qa-minimized-draft")
        .evaluate((element) => element.remove());
      await page.waitForFunction(
        () =>
          document
            .getElementById("gmail-reader-preview-root")
            ?.style.getPropertyValue("--grp-compose-tray-safe-area") === "0px",
      );
    },
  );

  await runTest(
    "keeps controls honest, accessible, and draft-safe",
    async () => {
      const editorMarkup = await page
        .locator('[contenteditable="true"]')
        .evaluate((element) => element.innerHTML);
      await page.locator('[data-theme="dark"]').click();
      assert.equal(
        await page
          .locator("[data-preview-device]")
          .getAttribute("class")
          .then((value) => value.includes("grp-theme-dark")),
        true,
      );
      await assertText(
        page.locator(".grp-preview-limit"),
        "Approximate preview only",
      );
      await assertText(
        page.locator('[data-scale-preset="fit"]'),
        "Show full device",
      );
      assert.equal(
        (await page.locator(".grp-reference-scale-note").innerText()).includes(
          "logical viewport",
        ),
        false,
      );
      const details = page.locator("[data-preview-details]");
      const expandedHeaderHeight = await page
        .locator(".grp-header")
        .evaluate((element) => element.getBoundingClientRect().height);
      await details.locator("summary").click();
      assert.equal(await details.getAttribute("open"), null);
      const collapsedHeaderHeight = await page
        .locator(".grp-header")
        .evaluate((element) => element.getBoundingClientRect().height);
      assert.ok(collapsedHeaderHeight < expandedHeaderHeight);
      await details.locator("summary").click();
      assert.notEqual(await details.getAttribute("open"), null);
      assert.equal(
        await page.locator(".grp-audit-status").getAttribute("aria-live"),
        "polite",
      );
      assert.equal(
        await page
          .locator('[contenteditable="true"]')
          .evaluate((element) => element.innerHTML),
        editorMarkup,
      );

      await page.locator("[data-settings-button]").click();
      await page.locator('[data-locale="zh-TW"]').click();
      await assertText(page.locator("#grp-title"), "Gmail 收件者預覽");
      await assertText(
        page.locator('[data-scale-preset="fit"]'),
        "顯示完整裝置",
      );
      await assertText(page.locator(".grp-reference-kind"), "參考版面");
      assert.equal(
        await page.locator("#gmail-reader-preview-root").getAttribute("lang"),
        "zh-TW",
      );
      assert.deepEqual(
        await page.evaluate(() =>
          Object.keys(localStorage).filter((key) =>
            key.startsWith("gmailReaderPreview"),
          ),
        ),
        [],
      );

      await page.locator(".grp-header [data-close]").click();
      await page
        .locator("#gmail-reader-preview-root")
        .waitFor({ state: "detached" });
      assert.equal(
        await page
          .locator('[contenteditable="true"]')
          .evaluate((element) => document.activeElement === element),
        true,
      );
    },
  );

  await runTest(
    "sanitizes active content without loading remote images",
    async () => {
      await page.locator('[contenteditable="true"]').evaluate((editor) => {
        editor.innerHTML = [
          "<script>globalThis.__previewXss = true</script>",
          "<svg><script>globalThis.__previewSvgXss = true</script><circle /></svg>",
          '<a href="javascript:alert(1)" onclick="alert(1)" style="position:fixed;background-image:url(https://tracker.invalid/bg.png)">Unsafe link</a>',
          '<img src="https://tracker.invalid/pixel.png" alt="Tracking pixel">',
          '<img src="data:image/png;base64,iVBORw0KGgo=" alt="Inline image">',
          '<p style="color:#333;font-weight:700">Safe text</p>',
        ].join("");
        editor.dispatchEvent(
          new InputEvent("input", { bubbles: true, inputType: "insertText" }),
        );
      });
      await page.waitForTimeout(50);
      await page.evaluate(() => {
        globalThis.__previewXss = false;
        globalThis.__previewSvgXss = false;
      });
      externalRequests.length = 0;

      await page.locator(".gmail-reader-preview-button").click();
      const previewBody = page.locator("[data-preview-body]");
      await previewBody.waitFor();
      assert.equal(await previewBody.locator("script, svg").count(), 0);
      assert.equal(await previewBody.locator("img").count(), 1);
      assert.equal(
        await previewBody.locator(".grp-image-placeholder").count(),
        1,
      );
      assert.equal(await previewBody.locator("a").getAttribute("href"), null);
      assert.equal(
        await previewBody.locator("a").getAttribute("onclick"),
        null,
      );
      assert.equal(
        (await previewBody.locator("a").getAttribute("style")) || "",
        "",
      );
      assert.equal(
        await page.evaluate(() =>
          Boolean(globalThis.__previewXss || globalThis.__previewSvgXss),
        ),
        false,
      );
      assert.ok((await page.locator("[data-risk-list] li").count()) >= 1);
      assert.deepEqual(externalRequests, []);
      await page.locator(".grp-header [data-close]").click();
    },
  );

  await runTest(
    "highlights, ignores, mutes, and restores warning instances per draft",
    async () => {
      const editor = page.locator('[contenteditable="true"]');
      await editor.evaluate((element) => {
        element.innerHTML = [
          "<p>Opening context</p>",
          '<div data-blank="first"><br></div>',
          '<div data-blank="first"><br></div>',
          '<div data-blank="first"><br></div>',
          '<div data-blank="first"><br></div>',
          "<p>Image context</p>",
          '<img data-test-image="first" src="data:image/png;base64,iVBORw0KGgo=" width="640" alt="First wide image">',
          "<p>Closing context</p>",
        ].join("");
        element.dispatchEvent(
          new InputEvent("input", { bubbles: true, inputType: "insertText" }),
        );
      });

      await page.locator(".gmail-reader-preview-button").click();
      const blankRisk = page.locator('[data-risk-type="riskBlank"]');
      const oversizedRisk = page.locator('[data-risk-type="riskOversized"]');
      await blankRisk.waitFor();
      await blankRisk.locator(".grp-risk-location").hover();
      assert.ok(
        (await page.locator(".grp-email-body .grp-risk-highlight").count()) >=
          1,
      );

      await blankRisk.locator("[data-risk-ignore]").click();
      assert.equal(await blankRisk.count(), 0);
      assert.equal(await page.locator("[data-risk-reset]").isVisible(), true);

      await editor.evaluate((element) => {
        element.querySelectorAll('[data-blank="first"]')[3]?.remove();
        element.dispatchEvent(
          new InputEvent("input", {
            bubbles: true,
            inputType: "deleteContent",
          }),
        );
      });
      await page.waitForTimeout(180);
      assert.equal(await blankRisk.count(), 0);

      await editor.evaluate((element) => {
        element.insertAdjacentHTML(
          "beforeend",
          [
            "<p>Another section</p>",
            '<div data-blank="second"><br></div>',
            '<div data-blank="second"><br></div>',
            '<div data-blank="second"><br></div>',
          ].join(""),
        );
        element.dispatchEvent(
          new InputEvent("input", { bubbles: true, inputType: "insertText" }),
        );
      });
      await blankRisk.waitFor();
      assert.equal(await blankRisk.count(), 1);

      await blankRisk.locator("[data-risk-mute]").click();
      assert.equal(await blankRisk.count(), 0);

      await oversizedRisk.waitFor();
      await oversizedRisk.locator("[data-risk-ignore]").click();
      await editor.evaluate((element) => {
        element
          .querySelector('[data-test-image="first"]')
          ?.setAttribute("width", "620");
        element.dispatchEvent(
          new InputEvent("input", {
            bubbles: true,
            inputType: "formatBackColor",
          }),
        );
      });
      await page.waitForTimeout(180);
      assert.equal(await oversizedRisk.count(), 0);

      await editor.evaluate((element) => {
        element.insertAdjacentHTML(
          "beforeend",
          '<p>New image location</p><img data-test-image="second" src="data:image/png;base64,iVBORw0KGgo=" width="640" alt="Second wide image">',
        );
        element.dispatchEvent(
          new InputEvent("input", { bubbles: true, inputType: "insertText" }),
        );
      });
      await oversizedRisk.waitFor();
      assert.equal(await oversizedRisk.count(), 1);
      await oversizedRisk.locator("[data-risk-mute]").click();
      assert.equal(await oversizedRisk.count(), 0);

      await page.locator("[data-risk-reset]").click();
      assert.ok(await blankRisk.count());
      assert.ok((await oversizedRisk.count()) >= 2);
      assert.equal(await page.locator("[data-risk-reset]").isVisible(), false);
      await page.locator(".grp-header [data-close]").click();
    },
  );

  await runTest(
    "supports multiple Compose windows and cleans up removed drafts",
    async () => {
      await page.locator('section[role="dialog"]').evaluate((compose) => {
        const clone = compose.cloneNode(true);
        clone.querySelector('input[name="subjectbox"]').value = "Second draft";
        clone.querySelector('[contenteditable="true"]').innerHTML =
          "<p>Second body</p>";
        clone.style.right = "620px";
        document.body.appendChild(clone);
      });
      await page.waitForFunction(
        () =>
          document.querySelectorAll(".gmail-reader-preview-button").length ===
          2,
      );

      await page
        .locator('section[role="dialog"]')
        .first()
        .locator(".gmail-reader-preview-button")
        .evaluate((button) => button.remove());
      await page.waitForFunction(
        () =>
          document.querySelectorAll(".gmail-reader-preview-button").length ===
          2,
      );

      const secondCompose = page.locator('section[role="dialog"]').nth(1);
      await secondCompose.locator(".gmail-reader-preview-button").click();
      await assertText(page.locator("[data-preview-subject]"), "Second draft");
      await secondCompose.evaluate((compose) => compose.remove());
      await page
        .locator("#gmail-reader-preview-root")
        .waitFor({ state: "detached" });
      assert.equal(
        await page.locator(".gmail-reader-preview-button").count(),
        1,
      );
    },
  );

  await runTest("prevents duplicate initialization", async () => {
    await page.evaluate(() => {
      const script = document.createElement("script");
      script.src = "../content.js";
      document.body.appendChild(script);
    });
    await page.waitForTimeout(150);
    assert.equal(await page.locator(".gmail-reader-preview-button").count(), 1);
    assert.equal(await page.locator("#gmail-reader-preview-root").count(), 0);
  });

  await runTest(
    "localizes the bundled product guide without remote dependencies",
    async () => {
      externalRequests.length = 0;
      await page.goto(`${baseUrl}/landing.html`);
      await page.locator('[data-locale="zh-TW"]').click();
      await assertText(page.locator("#hero-title"), "你的 Email 在對方眼中");
      assert.equal(await page.title(), "Gmail 收件者預覽");
      const landingImages = page.locator(
        ".product-stage img, .workflow-visual img, .floating-visual img",
      );
      for (let index = 0; index < (await landingImages.count()); index += 1) {
        const image = landingImages.nth(index);
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((element) => element.decode());
      }
      const landingImageDimensions = await landingImages.evaluateAll((images) =>
        images.map((image) => [image.naturalWidth, image.naturalHeight]),
      );
      assert.deepEqual(landingImageDimensions.slice(0, 2), [
        [1140, 900],
        [900, 640],
      ]);
      assert.ok(landingImageDimensions[2][0] >= 350);
      assert.ok(landingImageDimensions[2][0] <= 380);
      assert.ok(landingImageDimensions[2][1] >= 700);
      assert.ok(landingImageDimensions[2][1] <= 770);
      for (const width of [390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const imageRatios = await landingImages.evaluateAll((images) =>
          images.map((image) => {
            const bounds = image.getBoundingClientRect();
            return {
              natural: image.naturalWidth / image.naturalHeight,
              rendered: bounds.width / bounds.height,
              fit:
                image.ownerDocument.defaultView?.getComputedStyle(image)
                  .objectFit || "",
            };
          }),
        );
        imageRatios.forEach(({ natural, rendered, fit }) => {
          assert.ok(Math.abs(natural - rendered) < 0.005);
          assert.equal(fit, "contain");
        });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= globalThis.innerWidth,
          ),
          true,
        );
      }
      assert.notEqual(
        await page
          .locator(".workflow-intro")
          .evaluate(
            (element) =>
              element.ownerDocument.defaultView?.getComputedStyle(element)
                .position || "",
          ),
        "sticky",
      );
      assert.deepEqual(externalRequests, []);
    },
  );

  await runTest("publishes a readable local-first privacy policy", async () => {
    externalRequests.length = 0;
    await page.goto(`${baseUrl}/privacy.html`);
    await assertText(page.locator("h1"), "Your draft is processed locally");
    await assertText(
      page.locator("#english-policy").locator("xpath=.."),
      "Chrome Web Store User Data Policy",
    );
    await assertText(
      page.locator("#traditional-chinese-policy").locator("xpath=.."),
      "開發者無法透過這項擴充功能讀取你的草稿",
    );
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= globalThis.innerWidth,
        ),
        true,
      );
    }
    assert.deepEqual(externalRequests, []);
  });
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

console.log(
  "Browser tests passed: sync, privacy, sanitization, controls, localization, public policy, multiple drafts, cleanup, and duplicate initialization.",
);

async function assertText(locator, expectedSubstring) {
  await locator.waitFor();
  await locator.evaluate(
    (element, expected) =>
      new Promise((resolve, reject) => {
        const deadline = Date.now() + 2000;
        const check = () => {
          if ((element.textContent || "").includes(expected)) {
            resolve();
            return;
          }
          if (Date.now() >= deadline) {
            reject(
              new Error(
                `Expected text to include "${expected}", received "${element.textContent || ""}".`,
              ),
            );
            return;
          }
          setTimeout(check, 25);
        };
        check();
      }),
    expectedSubstring,
  );
}
