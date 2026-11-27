# Cloudflare hosting: secrets checklist

Companion to **[Custom domains](./custom-domains.md)**. Shared CI/bootstrap tooling lives in [edge-dns](https://github.com/mzworthington/edge-dns) ([reusable Cloudflare CI](https://github.com/mzworthington/edge-dns/blob/main/docs/reusable-cloudflare-ci.md)). This repo keeps thin shims only.

API tokens, the Pulumi access token, the account id, and the zone id belong in **Bitwarden**, **GitHub Actions secrets**, or a local `.env`. The Pages project name and hostnames are committed in `infra/cloudflare/hosting.yaml`. Wrangler reads the project name from `wrangler.toml`.

## Pages deploy

A push to `main` deploys with Wrangler. Pulumi on `main` also requires the zone id and a Pulumi access token:

| Key                     | Kind   | Used by               |
| ----------------------- | ------ | --------------------- |
| `CLOUDFLARE_API_TOKEN`  | secret | Wrangler Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | secret | Wrangler Pages deploy |
| `CLOUDFLARE_ZONE_ID`    | secret | Pulumi DNS / domains  |
| `PULUMI_ACCESS_TOKEN`   | secret | Pulumi workflow       |

```bash
bin/set-github-deploy-secrets.sh
```

Run it from the product clone, with `gh` authenticated for that repo. Each secret is taken from the environment when it is already set. Missing secrets are prompted (input is hidden). The next push to `main` publishes `https://<name in wrangler.toml>.pages.dev`.

Custom domain hostnames still go through the bootstrap below.

## Bootstrap

```bash
export BWS_ACCESS_TOKEN="..."
export BWS_PROJECT_ID="..."

# Site identity (or use a gitignored .env — see .env.example)
export PULUMI_STACK=prod
export DOMAIN=example.com
export PAGES_HOSTNAMES=app.example.com
export PAGES_PROJECT_NAME=my-app   # same as init-project slug

gh auth login
pulumi login
bin/setup-cloudflare-hosting.sh
```

The shim downloads the canonical script from edge-dns (`EDGE_DNS_REF`, default `main`).

Then `cd infra/cloudflare && pulumi up`, or merge to `main` for CI.

Set public origin in the app with `bin/init-project.sh --origin https://app.example.com`.

### Existing zone required

The **zone** (`DOMAIN`) must already be active on Cloudflare (managed in edge-dns). Bootstrap only attaches **subdomains** in that zone.

## Secrets / vars

| Key                     | Kind   | Used by                                         |
| ----------------------- | ------ | ----------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | secret | Wrangler + Pulumi                               |
| `CLOUDFLARE_ACCOUNT_ID` | secret | Wrangler + Pulumi                               |
| `CLOUDFLARE_ZONE_ID`    | secret | Pulumi DNS / domains                            |
| `PULUMI_ACCESS_TOKEN`   | secret | Pulumi workflow                                 |
| `POSTHOG_TOKEN`         | secret | Pages build on `main` (PostHog project API key) |

Prefer a **dedicated BWS project** per site. Bootstrap always resolves the zone from `DOMAIN`.

## API token scopes

- Account → **Cloudflare Pages: Edit**
- Account → **Account Settings: Edit** (Web Analytics)
- Zone → **Zone: Read**
- Zone → **DNS: Edit** (custom domains)
- Zone → **Zone Settings: Edit** (Observatory scheduled tests)
