# Changelog

All notable changes to this project are recorded in this file.

## Unreleased

- **Runtime hardening**
  - Added storage helpers (`storage.ts`, `ensureStorageVersion`) that are consumed by Theme, Language, Hero, Dev contexts plus a zone for per-language overrides that merge safely into the canonical data model.
  - Implemented a singleton-based `BodyScrollLockManager`, passive listeners for floating panels, and a `useCvDownload` guard that validates languages and races the PDF generation with a timeout.
  - Toasts now use incremental IDs, rate limiting (max 5 at once), and automatic cleanup.

- **Content tooling**
  - Introduced `validateAndSanitizeUrl` with tests plus a dev-only “Editor Dev” modal that edits overrides in real-time and exports a branded ZIP (mocks JSZip implementation) while automatically marking the hero/footer with domain-specific greetings.
  - Added `createZip` helper and the `DevPortfolioEditor` component (Dev only) that writes overrides, merges them into `LanguageContext`, and allows downloading a `portfolio.zip` containing the JSON + watermark text.

- **QA & compatibility**
  - Brought lint/tsc/test coverage back up through stricter typings (expanded `PortfolioData`, `UIStrings`, strong typed `nav`, etc.), updated `Projects`/`CommandPalette` to handle optional URLs safely, and documented the new utilities in `README.md`.

