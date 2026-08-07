#!/usr/bin/env bash
# Customize a clone of this template: slug, display name, description, tagline, origin.
#
# Usage:
#   bin/init-project.sh --name "Acme App" --slug acme-app
#   bin/init-project.sh --name "Acme App" --slug acme-app \
#     --description "Acme on Cloudflare Pages" \
#     --tagline "Ship Acme faster." \
#     --origin https://acme.example.com
#
# Options:
#   --name          Display / brand name (required)
#   --slug          kebab-case package + Pages project id (default: derived from --name)
#   --description   Meta description / short summary
#   --tagline       Home hero supporting sentence
#   --origin        Public https origin, no trailing slash (for future SEO/canonical)
#   --force         Allow re-running after an earlier customization
#   -h, --help      Show this help
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TEMPLATE_SLUG="react-cloudflare-template"
TEMPLATE_NAME="React Cloudflare Template"
TEMPLATE_DESCRIPTION="React + Cloudflare Pages starter with CI, docs, changelog, and Lighthouse."
TEMPLATE_TAGLINE="Ship a Vite + React + TypeScript app to Cloudflare Pages with CI, changelog, docs media, and Lighthouse already wired."
TEMPLATE_ORIGIN="https://example.com"

NAME=""
SLUG=""
DESCRIPTION=""
TAGLINE=""
ORIGIN=""
FORCE=0

usage() {
  cat <<'EOF'
Customize a clone of this template: slug, display name, description, tagline, origin.

Usage:
  bin/init-project.sh --name "Acme App" --slug acme-app
  bin/init-project.sh --name "Acme App" --slug acme-app \
    --description "Acme on Cloudflare Pages" \
    --tagline "Ship Acme faster." \
    --origin https://acme.example.com

Options:
  --name          Display / brand name (required)
  --slug          kebab-case package + Pages project id (default: derived from --name)
  --description   Meta description / short summary
  --tagline       Home hero supporting sentence
  --origin        Public https origin, no trailing slash (for future SEO/canonical)
  --force         Allow re-running after an earlier customization
  -h, --help      Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) NAME="${2:-}"; shift 2 ;;
    --slug) SLUG="${2:-}"; shift 2 ;;
    --description) DESCRIPTION="${2:-}"; shift 2 ;;
    --tagline) TAGLINE="${2:-}"; shift 2 ;;
    --origin) ORIGIN="${2:-}"; shift 2 ;;
    --force) FORCE=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

[[ -n "$NAME" ]] || { echo "✗ --name is required" >&2; usage >&2; exit 1; }

slugify() {
  # Lowercase, non-alnum → hyphen, trim hyphens (Cloudflare Pages–safe).
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g'
}

if [[ -z "$SLUG" ]]; then
  SLUG="$(slugify "$NAME")"
fi

if ! [[ "$SLUG" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]]; then
  echo "✗ --slug must be kebab-case (a-z, 0-9, hyphens): got '$SLUG'" >&2
  exit 1
fi

CURRENT_SLUG="$(python3 - <<'PY'
import json, pathlib
print(json.loads(pathlib.Path("app/package.json").read_text())["name"])
PY
)"

if [[ "$CURRENT_SLUG" != "$TEMPLATE_SLUG" && "$FORCE" != "1" ]]; then
  echo "✗ Project already customized (package name is '$CURRENT_SLUG')." >&2
  echo "  Re-run with --force to replace from the current values, or edit app/src/siteConfig.ts." >&2
  exit 1
fi

FROM_SLUG="$CURRENT_SLUG"
if [[ "$FORCE" == "1" && "$CURRENT_SLUG" != "$TEMPLATE_SLUG" ]]; then
  FROM_NAME="$(python3 - <<'PY'
import re, pathlib
text = pathlib.Path("app/src/siteConfig.ts").read_text()
m = re.search(r"export const SITE_NAME = '([^']*)'", text)
print(m.group(1) if m else "")
PY
)"
  FROM_DESCRIPTION="$(python3 - <<'PY'
import re, pathlib
text = pathlib.Path("app/src/siteConfig.ts").read_text()
m = re.search(r"export const SITE_DESCRIPTION =\n  '([^']*)'", text)
print(m.group(1) if m else "")
PY
)"
  FROM_TAGLINE="$(python3 - <<'PY'
import re, pathlib
text = pathlib.Path("app/src/siteConfig.ts").read_text()
m = re.search(r"export const SITE_TAGLINE =\n  '([^']*)'", text)
print(m.group(1) if m else "")
PY
)"
  FROM_ORIGIN="$(python3 - <<'PY'
import re, pathlib
text = pathlib.Path("app/src/siteConfig.ts").read_text()
m = re.search(r"export const SITE_ORIGIN = '([^']*)'", text)
print(m.group(1) if m else "")
PY
)"
else
  FROM_NAME="$TEMPLATE_NAME"
  FROM_DESCRIPTION="$TEMPLATE_DESCRIPTION"
  FROM_TAGLINE="$TEMPLATE_TAGLINE"
  FROM_ORIGIN="$TEMPLATE_ORIGIN"
fi

DESCRIPTION="${DESCRIPTION:-$FROM_DESCRIPTION}"
TAGLINE="${TAGLINE:-$FROM_TAGLINE}"
ORIGIN="${ORIGIN:-$FROM_ORIGIN}"
ORIGIN="${ORIGIN%/}"

if ! [[ "$ORIGIN" =~ ^https:// ]]; then
  echo "✗ --origin must start with https://" >&2
  exit 1
fi

replace_in_file() {
  local file="$1" old="$2" new="$3"
  [[ -f "$file" ]] || return 0
  [[ "$old" == "$new" ]] && return 0
  if grep -Fq "$old" "$file"; then
    local tmp
    tmp="$(mktemp)"
    # Avoid sed -i portability issues (BSD vs GNU).
    python3 - "$file" "$old" "$new" "$tmp" <<'PY'
import pathlib, sys
path, old, new, tmp = sys.argv[1:5]
text = pathlib.Path(path).read_text()
pathlib.Path(tmp).write_text(text.replace(old, new))
PY
    mv "$tmp" "$file"
  fi
}

echo "→ Customizing project"
echo "   name:        $NAME"
echo "   slug:        $SLUG"
echo "   description: $DESCRIPTION"
echo "   tagline:     $TAGLINE"
echo "   origin:      $ORIGIN"

# Central identity module (source of truth for the SPA).
python3 - "$NAME" "$SLUG" "$DESCRIPTION" "$TAGLINE" "$ORIGIN" <<'PY'
import pathlib, sys

name, slug, description, tagline, origin = sys.argv[1:6]

def q(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")

pathlib.Path("app/src/siteConfig.ts").write_text(
    f"""/** Product identity — customize with `bin/init-project.sh` after creating from the template. */
export const SITE_SLUG = '{q(slug)}';
export const SITE_NAME = '{q(name)}';
export const SITE_DESCRIPTION =
  '{q(description)}';
export const SITE_TAGLINE =
  '{q(tagline)}';
/** Public site origin (no trailing slash). Used for canonical/SEO when enabled. */
export const SITE_ORIGIN = '{q(origin)}';
"""
)
PY

# package.json names
python3 - "$SLUG" <<'PY'
import json, pathlib, sys
slug = sys.argv[1]
for rel, name in (
    ("app/package.json", slug),
    ("infra/cloudflare/package.json", f"{slug}-infra"),
):
    path = pathlib.Path(rel)
    data = json.loads(path.read_text())
    data["name"] = name
    path.write_text(json.dumps(data, indent=2) + "\n")
PY

# Wrangler + CI fallback Pages project name
replace_in_file wrangler.toml "name = \"$FROM_SLUG\"" "name = \"$SLUG\""
replace_in_file .github/workflows/ci.yml \
  "vars.PULUMI_PAGES_PROJECT_NAME || '$FROM_SLUG'" \
  "vars.PULUMI_PAGES_PROJECT_NAME || '$SLUG'"

# Static HTML head (build shell; SPA also uses siteConfig at runtime for brand)
python3 - "$NAME" "$DESCRIPTION" <<'PY'
import pathlib, re, sys
name, description = sys.argv[1:3]
html = pathlib.Path("app/index.html").read_text()
html = re.sub(r"<title>[^<]*</title>", f"<title>{name}</title>", html, count=1)
html = re.sub(
    r'(<meta\s+name="description"\s+content=")[^"]*(")',
    rf"\1{description}\2",
    html,
    count=1,
)
pathlib.Path("app/index.html").write_text(html)
PY

# README title (first H1 only)
python3 - "$NAME" <<'PY'
import pathlib, re, sys
name = sys.argv[1]
path = pathlib.Path("README.md")
text = path.read_text()
path.write_text(re.sub(r"^# .+$", f"# {name}", text, count=1, flags=re.M))
PY

replace_in_file mise.toml \
  "# Toolchain for $FROM_SLUG." \
  "# Toolchain for $SLUG."
replace_in_file bin/setup-dev-env.sh \
  "# $FROM_SLUG mise activation" \
  "# $SLUG mise activation"

# SECURITY advisory URL — prefer current GitHub remote when available
REPO_URL=""
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  REPO_URL="$(gh repo view --json url -q .url 2>/dev/null || true)"
fi
if [[ -z "$REPO_URL" ]]; then
  REPO_URL="$(git remote get-url origin 2>/dev/null | sed -E 's#git@github.com:#https://github.com/#; s#\.git$##' || true)"
fi
if [[ -n "$REPO_URL" ]]; then
  python3 - "$REPO_URL" <<'PY'
import pathlib, re, sys
url = sys.argv[1].rstrip("/")
path = pathlib.Path("SECURITY.md")
text = path.read_text()
text = re.sub(
    r"https://github\.com/[^/]+/[^/]+/security/advisories/new",
    f"{url}/security/advisories/new",
    text,
    count=1,
)
path.write_text(text)
PY
fi

echo
echo "✓ Project customized."
echo
echo "Next:"
echo "  1. bin/setup-dev-env.sh"
echo "  2. cd app && pnpm dev"
echo "  3. Review app/src/siteConfig.ts (brand + origin)"
echo "  4. When ready for hosting:"
echo "       DOMAIN=example.com WWW_DOMAIN=www.example.com \\"
echo "       PAGES_PROJECT_NAME=$SLUG PULUMI_STACK=prod \\"
echo "       bin/setup-cloudflare-hosting.sh"
echo
echo "Tip: commit the customization as its own change before feature work."
