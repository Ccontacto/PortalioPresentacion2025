#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

: "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID}" 
: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN}" 
: "${CLOUDFLARE_PROJECT:?Set CLOUDFLARE_PROJECT}" 

npm run build

npx wrangler pages deploy dist \
  --account-id "$CLOUDFLARE_ACCOUNT_ID" \
  --project-name "$CLOUDFLARE_PROJECT" \
  --branch main \
  --commit-hash "$(git rev-parse HEAD)" \
  --commit-message "$(git log -1 --pretty=%s)"
