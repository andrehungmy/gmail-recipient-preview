# Security Policy

## Supported versions

This project is an early MVP without a published Chrome Web Store release or formal supported-version window. Security fixes should target the current default branch unless the maintainer documents otherwise.

## Reporting a vulnerability

Please use the repository's **Private vulnerability reporting** / GitHub Security Advisory flow when available. Do not open a public issue for a vulnerability involving draft disclosure, code execution, unsafe HTML, unexpected network transmission, permissions, or Chrome extension boundaries.

Include:

- affected version or commit;
- concise reproduction steps using synthetic content;
- observed and expected behavior;
- security/privacy impact;
- browser and operating-system versions;
- a suggested mitigation if known.

Never include real email bodies, addresses, mailbox screenshots, cookies, account tokens, or credentials. Use minimal synthetic fixtures.

The maintainer should acknowledge a complete report, validate impact, prepare a tested fix, and coordinate disclosure before publishing details. No response-time or bounty promise is made by this early project.

## Security boundaries

High-priority reports include:

- draft content leaving the browser or being persisted unexpectedly;
- preview-triggered remote image or external requests;
- sanitizer bypass or markup escaping the preview body;
- script execution through draft content;
- unsafe link handling;
- permissions broader than documented;
- extension message spoofing if message passing is introduced;
- sensitive data in logs, packages, screenshots, or CI artifacts.

Rendering differences without a security/privacy impact should use the normal bug report template.
