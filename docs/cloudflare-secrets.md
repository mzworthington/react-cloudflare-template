# Cloudflare hosting — secrets checklist

Companion to **[Custom domains](./custom-domains.md)** (hostname layouts and step-by-step). This page lists where secrets and vars live.

Real account IDs, zone IDs, API tokens, and hostnames belong in **local `.env`** (gitignored), **Bitwarden**, or **GitHub Actions secrets/vars** — never in committed template sources.

## Bootstrap

Copy [`.env.example`](../.env.example) → `.env`, fill in values for _your_ zone, then:

```bash
# Optional: Bitwarden Secrets Manager instead of / alongside .env
export BWS_ACCESS_TOKEN="..."
export BWS_PROJECT_ID="..."

gh auth login
pulumi login

# With .env present, DOMAIN / PAGES_* can be omitted from the shell:
bin/setup-cloudflare-hosting.sh

# Or pass explicitly (no .env):
# DOMAIN=example.com \
# PAGES_HOSTNAMES=app.example.com \
# PAGES_PROJECT_NAME=my-app \
# PULUMI_STACK=prod \
# CLOUDFLARE_API_TOKEN=... \
# bin/setup-cloudflare-hosting.sh
```

Then `cd infra/cloudflare && pulumi up`, or merge to `main` for CI.

Set public origin in the app with `bin/init-project.sh --origin https://app.example.com` (writes `SITE_ORIGIN` in `app/src/siteConfig.ts` — expected after fork/customize, not as template defaults).

### Registrar nameservers (custom domain only)

The **zone** (`DOMAIN`) must already be active on Cloudflare. Subdomains do not need separate registrar changes — Pulumi creates the CNAME in that zone. `*.pages.dev` works without a custom domain.

## Secrets / vars

| Key                         | Kind     | Used by              |
| --------------------------- | -------- | -------------------- |
| `CLOUDFLARE_API_TOKEN`      | secret   | Wrangler + Pulumi    |
| `CLOUDFLARE_ACCOUNT_ID`     | secret   | Wrangler + Pulumi    |
| `CLOUDFLARE_ZONE_ID`        | secret   | Pulumi DNS / domains |
| `PULUMI_ACCESS_TOKEN`       | secret   | Pulumi workflow      |
| `PULUMI_PAGES_PROJECT_NAME` | variable | Deploy + Pulumi      |
| `PULUMI_PAGES_HOSTNAMES`    | variable | Pulumi (JSON array)  |
| `PULUMI_APEX_DOMAIN`        | variable | Legacy apex+www only |
| `PULUMI_WWW_DOMAIN`         | variable | Legacy apex+www only |

Prefer a **dedicated BWS project** (or local `.env`) per site so product-specific IDs like `CLOUDFLARE_ZONE_ID` are not shared across zones. The bootstrap script always resolves the zone from `DOMAIN` and will warn if an injected zone id does not match.

## API token scopes

- Account → **Cloudflare Pages: Edit**
- Zone → **Zone: Read**
- Zone → **DNS: Edit** (custom domains)
