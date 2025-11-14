# Release checklist

1. **Pre-flight**
   - Update `CHANGELOG.md` with the upcoming release notes.
   - Bump the version in `package.json` (and `package-lock.json` if necessary) to match the release (use semantic versioning).
2. **Run validations**
   - `npm run lint`
   - `npm run tsc`
   - `npm run test`
   - `npm run build` (optional for sanity) and verify `dist` contents.
3. **Assets**
   - Confirm that `DevPortfolioEditor` and `DevPortfolioEditor` are only available when `import.meta.env.DEV`.
   - Ensure `storage` version marker (`__portfolio_storage_schema_version__`) stays in sync if overriding data structures.
4. **Package & publish**
   - Create a `git tag` for the release (e.g., `vX.Y.Z`) and push it.
   - If publishing to npm/CF Pages, ensure environment (Intl) uses Node 20.
   - For Cloudflare Pages, update the `deploy` workflow if new environment variables are needed.
5. **Post-release**
   - Merge release changes into `main`.
   - Inform stakeholders via README/Slack/Notes pointing to the new Dev editor and ZIP workflow.
