#!/usr/bin/env bash
# Push the GitHub Actions secrets CI uses to deploy Pages.
# Pages project name and hostnames live in infra/cloudflare/hosting.yaml and wrangler.toml.
# Matching environment variables are used as-is. Missing ones are prompted.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "✗ GitHub CLI (gh) is required. Install: https://cli.github.com/" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "✗ gh is not authenticated. Run: gh auth login" >&2
  exit 1
fi

# Use a same-named environment variable when it is set. Otherwise ask.
ensure_value() {
  local name="$1" kind="$2" current="" reply=""
  current="${!name-}"
  if [[ -n "$current" ]]; then
    return 0
  fi
  if [[ "$kind" == "secret" ]]; then
    if ! read -r -s -p "${name}: " reply; then
      echo >&2
      echo "✗ No value for ${name}. Export it or answer the prompt." >&2
      exit 1
    fi
    echo
  else
    if ! read -r -p "${name}: " reply; then
      echo "✗ No value for ${name}. Export it or answer the prompt." >&2
      exit 1
    fi
  fi
  if [[ -z "$reply" ]]; then
    echo "✗ ${name} is required" >&2
    exit 1
  fi
  printf -v "$name" '%s' "$reply"
  export "$name"
}

ensure_value CLOUDFLARE_API_TOKEN secret
ensure_value PULUMI_ACCESS_TOKEN secret

echo "→ Setting GitHub deploy secrets"
printf '%s' "$CLOUDFLARE_API_TOKEN" | gh secret set CLOUDFLARE_API_TOKEN
printf '%s' "$PULUMI_ACCESS_TOKEN" | gh secret set PULUMI_ACCESS_TOKEN
echo "✓ Cloudflare and Pulumi deploy secrets are set"
