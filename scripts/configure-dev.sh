#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

GIT_USER_NAME=${GIT_USER_NAME:-}
GIT_USER_EMAIL=${GIT_USER_EMAIL:-}

if [[ -z "$GIT_USER_NAME" || -z "$GIT_USER_EMAIL" ]]; then
  echo "[configure-dev] Please export GIT_USER_NAME and GIT_USER_EMAIL before running this script." >&2
  exit 1
fi

git -C "$repo_root" config user.name "$GIT_USER_NAME"
git -C "$repo_root" config user.email "$GIT_USER_EMAIL"

echo "[configure-dev] Git user configured as $GIT_USER_NAME <$GIT_USER_EMAIL>."

echo "[configure-dev] Done."
