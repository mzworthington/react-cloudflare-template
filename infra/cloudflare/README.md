# Cloudflare infrastructure (Pulumi)

Pages project + custom **subdomain** hostnames on an existing active zone. The SPA is built in CI and deployed with `wrangler pages deploy`.

Real zone/hostname values live in gitignored `Pulumi.<stack>.yaml`, local `.env`, or GitHub Actions vars; see [Custom domains](../../docs/custom-domains.md) and [secrets checklist](../../docs/cloudflare-secrets.md).

## Quick setup

```bash
cp ../../.env.example ../../.env   # edit DOMAIN, PAGES_HOSTNAMES, tokens
../../bin/setup-cloudflare-hosting.sh
pulumi up
```

Or merge to `main`. `.github/workflows/pulumi-cloudflare.yml` previews, then waits for **pulumi-prod** environment approval before `pulumi up`.

## Related

| Path                       | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `wrangler.toml`            | Pages project name + `app/dist` output    |
| `app/public/_redirects`    | SPA routing                               |
| `.github/workflows/ci.yml` | Build + wrangler deploy                   |
