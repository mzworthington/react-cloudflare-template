import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const workspaceYaml = readFileSync(
  resolve(import.meta.dirname, '../../pnpm-workspace.yaml'),
  'utf8',
);

const lockfile = readFileSync(resolve(import.meta.dirname, '../../pnpm-lock.yaml'), 'utf8');

describe('pnpm workspace security overrides', () => {
  it('pins sharp to a release that includes the libheif GHSA fix', () => {
    expect(workspaceYaml).toMatch(/^\s+sharp:\s*['"]>=0\.35\.4['"]/m);
  });

  it('pins js-yaml to the empty-merge-source CPU DoS fix', () => {
    expect(workspaceYaml).toMatch(/^\s+js-yaml:\s*3\.15\.2\s*$/m);
    expect(lockfile).toMatch(/^ {2}js-yaml@3\.15\.2:/m);
    expect(lockfile).not.toMatch(/^ {2}js-yaml@3\.15\.1:/m);
  });

  it('replaces @puppeteer/browsers so extract-zip leaves the lockfile', () => {
    expect(workspaceYaml).toMatch(/^\s+'@puppeteer\/browsers':\s*3\.2\.2\s*$/m);
    expect(lockfile).toMatch(/^ {2}'@puppeteer\/browsers@3\.2\.2':/m);
    expect(lockfile).not.toMatch(/^ {2}extract-zip@/m);
  });
});
