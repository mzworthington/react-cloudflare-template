import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(import.meta.dirname, '../../..');
const script = join(repoRoot, 'bin/set-github-deploy-secrets.sh');

function fakeGhDir(logPath: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'fake-gh-'));
  const bin = join(dir, 'gh');
  writeFileSync(
    bin,
    `#!/bin/sh
if [ "$1" = "auth" ]; then
  exit 0
fi
if [ "$1" = "secret" ] && [ "$2" = "set" ]; then
  value=$(cat)
  printf 'secret %s %s\\n' "$3" "$value" >> ${JSON.stringify(logPath)}
  exit 0
fi
if [ "$1" = "variable" ] && [ "$2" = "set" ]; then
  printf 'variable %s %s\\n' "$3" "$5" >> ${JSON.stringify(logPath)}
  exit 0
fi
echo "unexpected gh args: $*" >&2
exit 1
`,
  );
  chmodSync(bin, 0o755);
  return dir;
}

describe('set-github-deploy-secrets', () => {
  it('writes GitHub secrets and the Pages project variable from matching env vars', () => {
    const logPath = join(mkdtempSync(join(tmpdir(), 'gh-log-')), 'log');
    writeFileSync(logPath, '');
    const ghDir = fakeGhDir(logPath);

    execFileSync('bash', [script], {
      env: {
        PATH: `${ghDir}:${process.env.PATH ?? ''}`,
        DEPLOY_SECRETS_DOTENV: '/dev/null',
        CLOUDFLARE_API_TOKEN: 'cf-token',
        CLOUDFLARE_ACCOUNT_ID: 'cf-account',
        PULUMI_PAGES_PROJECT_NAME: 'yusur',
      },
    });

    expect(readFileSync(logPath, 'utf8')).toBe(
      [
        'secret CLOUDFLARE_API_TOKEN cf-token',
        'secret CLOUDFLARE_ACCOUNT_ID cf-account',
        'variable PULUMI_PAGES_PROJECT_NAME yusur',
        '',
      ].join('\n'),
    );
  });

  it('asks for each deploy setting that is missing from the environment', () => {
    const logPath = join(mkdtempSync(join(tmpdir(), 'gh-log-')), 'log');
    writeFileSync(logPath, '');
    const ghDir = fakeGhDir(logPath);

    execFileSync('bash', [script], {
      input: 'prompt-token\nprompt-account\nprompt-project\n',
      env: {
        PATH: `${ghDir}:${process.env.PATH ?? ''}`,
        DEPLOY_SECRETS_DOTENV: '/dev/null',
      },
    });

    expect(readFileSync(logPath, 'utf8')).toBe(
      [
        'secret CLOUDFLARE_API_TOKEN prompt-token',
        'secret CLOUDFLARE_ACCOUNT_ID prompt-account',
        'variable PULUMI_PAGES_PROJECT_NAME prompt-project',
        '',
      ].join('\n'),
    );
  });
});
