import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(import.meta.dirname, '../../..');

function writeFixture(root: string): void {
  mkdirSync(join(root, 'bin'), { recursive: true });
  mkdirSync(join(root, 'app/src'), { recursive: true });
  mkdirSync(join(root, 'infra/cloudflare'), { recursive: true });
  mkdirSync(join(root, '.github/workflows'), { recursive: true });
  cpSync(join(repoRoot, 'bin/init-project.sh'), join(root, 'bin/init-project.sh'));
  writeFileSync(join(root, 'app/package.json'), '{"name":"react-cloudflare-template"}\n');
  writeFileSync(
    join(root, 'infra/cloudflare/package.json'),
    '{"name":"react-cloudflare-template-infra"}\n',
  );
  writeFileSync(
    join(root, 'app/src/siteConfig.ts'),
    'export const SITE_NAME = "React Cloudflare Template";\n',
  );
  writeFileSync(
    join(root, 'app/index.html'),
    `<!doctype html><html><head>
<title>React Cloudflare Template</title>
<meta name="description" content="template" />
<link rel="canonical" href="https://example.com/" />
<meta property="og:url" content="https://example.com/" />
<meta property="og:title" content="React Cloudflare Template" />
<meta property="og:description" content="template" />
<meta property="og:image" content="https://example.com/assets/social-share.png" />
<meta name="twitter:title" content="React Cloudflare Template" />
<meta name="twitter:description" content="template" />
<meta name="twitter:image" content="https://example.com/assets/social-share.png" />
</head><body></body></html>`,
  );
  writeFileSync(
    join(root, 'SECURITY.md'),
    'Report via https://github.com/mzworthington/react-cloudflare-template/security/advisories/new\n',
  );
  writeFileSync(join(root, 'wrangler.toml'), 'name = "react-cloudflare-template"\n');
  writeFileSync(
    join(root, '.github/workflows/ci.yml'),
    "command: pages deploy app/dist --project-name=${{ vars.PULUMI_PAGES_PROJECT_NAME || 'react-cloudflare-template' }}\n",
  );
  writeFileSync(
    join(root, 'infra/cloudflare/Pulumi.yaml'),
    'name: react-cloudflare-template\nruntime:\n  name: nodejs\n',
  );
  writeFileSync(
    join(root, 'infra/cloudflare/hosting.yaml'),
    'pagesProjectName: react-cloudflare-template\npagesHostnames:\n  - app.example.com\nenableWebAnalytics: false\n',
  );
  writeFileSync(
    join(root, 'infra/cloudflare/Pulumi.prod.yaml.example'),
    'config:\n  react-cloudflare-template:accountId: YOUR_CLOUDFLARE_ACCOUNT_ID\n  react-cloudflare-template:zoneId: YOUR_CLOUDFLARE_ZONE_ID\n',
  );
}

describe('init-project pulumi identity', () => {
  it('gives the clone its own Pulumi project and committed hosting config', () => {
    const root = mkdtempSync(join(tmpdir(), 'init-project-'));
    writeFixture(root);

    execFileSync(
      'bash',
      [
        'bin/init-project.sh',
        '--name',
        'Yusur',
        '--slug',
        'yusur',
        '--origin',
        'https://yusur.co.uk',
      ],
      {
        cwd: root,
        env: { ...process.env, CI: '1' },
      },
    );

    expect(readFileSync(join(root, 'infra/cloudflare/Pulumi.yaml'), 'utf8')).toMatch(
      /^name: yusur$/m,
    );
    expect(readFileSync(join(root, 'infra/cloudflare/hosting.yaml'), 'utf8')).toMatch(
      /^pagesProjectName: yusur$/m,
    );
    const example = readFileSync(join(root, 'infra/cloudflare/Pulumi.prod.yaml.example'), 'utf8');
    expect(example).toContain('yusur:accountId:');
    expect(example).not.toContain('react-cloudflare-template:');
  });

  it('replaces the template Cloudflare account and zone with placeholders', () => {
    const root = mkdtempSync(join(tmpdir(), 'init-project-'));
    writeFixture(root);
    writeFileSync(
      join(root, 'infra/cloudflare/hosting.yaml'),
      [
        'pagesProjectName: react-cloudflare-template',
        'pagesHostnames:',
        '  - app.example.com',
        'enableWebAnalytics: false',
        'accountId: fe0bb0a89551958509fe4d65883026cc',
        'zoneId: a60606cf6d3627b9100e2b430dbe0870',
        '',
      ].join('\n'),
    );

    execFileSync(
      'bash',
      [
        'bin/init-project.sh',
        '--name',
        'Yusur',
        '--slug',
        'yusur',
        '--origin',
        'https://yusur.co.uk',
      ],
      {
        cwd: root,
        env: { ...process.env, CI: '1' },
      },
    );

    const hosting = readFileSync(join(root, 'infra/cloudflare/hosting.yaml'), 'utf8');
    expect(hosting).toContain('accountId: YOUR_CLOUDFLARE_ACCOUNT_ID');
    expect(hosting).toContain('zoneId: YOUR_CLOUDFLARE_ZONE_ID');
    expect(hosting).not.toContain('fe0bb0a89551958509fe4d65883026cc');
    expect(hosting).not.toContain('a60606cf6d3627b9100e2b430dbe0870');
  });
});
