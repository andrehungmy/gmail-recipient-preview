# Product Case Study

## Background

Gmail Recipient Preview is an early Chrome extension MVP for people who write in Gmail but do not work with HTML email, responsive layout tools, or browser developer tools. The project is local-first, free, non-commercial, and intended to remain small enough for one maintainer to understand.

## Problem

The Gmail Compose view optimizes writing, while recipients read across narrower screens, different font/display settings, and email clients that transform markup and colors. A sender can miss wrapping, spacing, contrast, pasted-style, and width problems until after send.

## Target user

A non-technical Gmail user who wants a quick pre-send confidence check without creating an account, uploading a draft, sending test emails, or learning HTML email tooling.

## User journey

1. The user opens a new or saved Gmail draft.
2. The extension adds Preview near familiar Compose controls.
3. The user opens a recipient-oriented side or Floating preview.
4. The user keeps editing in the original Compose surface.
5. The preview updates and shows a small set of understandable risks.
6. The user adjusts the draft in Gmail, closes Preview, and sends through Gmail as usual.

The extension never sends or rewrites the email.

## Product requirements

- Keep Gmail Compose as the source of truth and editable surface.
- Provide synchronized reference views for common mobile widths and approximate Dark Mode.
- Explain limitations without implying guaranteed client fidelity.
- Process draft content locally with no account, backend, analytics, telemetry, or remote logging.
- Request the minimum Chrome permissions.
- Handle Gmail's dynamic Compose lifecycle and multiple drafts.
- Remain usable by keyboard and understandable in English and Traditional Chinese.
- Be maintainable as an early MVP rather than a framework-heavy platform.

## Key decisions

### Local image privacy over maximum fidelity

Network-backed draft images are replaced by local placeholders. This prevents Preview from contacting an image host, but the preview cannot fully represent externally hosted image layout. The warning makes the compromise visible instead of hiding it behind a broad privacy claim.

### Approximation over false precision

Reference devices use logical layout dimensions and recognizable surfaces. Copy states that client Dark Mode and rendering vary. The project does not claim pixel-identical Gmail behavior.

### Direct source shipping over a new framework

The extension uses local HTML, CSS, and JavaScript with no production dependencies. Tooling adds validation, tests, and packaging without changing the runtime architecture.

### Local fixture over mailbox automation

Automated tests use a Gmail-like harness and block external requests. This covers high-risk logic without credentials or real email data. Real Gmail remains a manual release gate.

## Privacy model

The content script reads only the selected Compose subject/body needed for Preview. Draft HTML and audit results live in memory and are discarded when the panel closes or the page unloads. Only three interface preferences are persisted in `chrome.storage.local`. No content-script fallback writes to Gmail page storage.

## Technical architecture

A Manifest V3 content script observes Gmail's dynamic DOM, binds one control per Compose, sanitizes the active draft, computes heuristic formatting risks, and renders a side/floating panel. Input listeners and filtered DOM mutations refresh the active preview. Cleanup restores Gmail-owned geometry and disconnects observers/listeners when the panel or Compose closes.

The architecture remains deliberately compact; details are in `docs/architecture.md`.

## Challenges

- Gmail exposes private, changing DOM rather than a stable Compose API.
- Draft HTML can include malformed, active, or network-bearing content.
- High visual fidelity can conflict with privacy when images are remote.
- Dark Mode behavior differs across clients and versions.
- Multiple, minimized, maximized, cloned, or replaced Compose trees create lifecycle edge cases.
- Product copy must be helpful without overstating certainty.

## Trade-offs

- A purpose-built sanitizer is small and auditable but requires sustained regression coverage.
- One active preview simplifies state while per-Compose controls still support multiple drafts.
- Blocking remote images protects privacy but lowers image fidelity.
- A local harness is repeatable but cannot certify real Gmail selectors or native clients.
- Keeping a large runtime file avoids a risky rewrite but raises future review cost.

## Testing strategy

The repository now combines formatting/lint/type/security checks, a deterministic browser suite, explicit package inspection, and a documented manual Gmail/native-client matrix. Tests focus on behaviors that can fail silently: sanitization, network boundaries, synchronization, multiple drafts, cleanup, stale controls, and duplicate initialization.

## Results currently demonstrated by the repository

The code and automated checks demonstrate:

- a Gmail-only Manifest V3 permission boundary;
- no explicit production network client or remote JavaScript;
- local-only preview image rendering;
- sanitizer enforcement against active markup, unsafe attributes, URL schemes, and CSS;
- live subject/body synchronization in the fixture;
- multiple-Compose control binding and active-draft cleanup;
- English/Traditional Chinese switching;
- deterministic packaging that includes required Landing assets and excludes development files.

The repository does **not** demonstrate user adoption, business impact, delivery metrics, complete native-client fidelity, or Chrome Web Store approval.

## Next steps

1. Complete and record the real Gmail release matrix on Chrome Stable.
2. Add versioned native Gmail comparison evidence.
3. Add an unpacked-extension smoke test for manifest injection and `chrome.storage.local`.
4. Select an explicit license and complete Chrome Web Store policy/asset review if public distribution is approved.
