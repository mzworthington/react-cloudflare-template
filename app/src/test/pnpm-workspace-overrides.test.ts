import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const workspaceYaml = readFileSync(
  resolve(import.meta.dirname, '../../pnpm-workspace.yaml'),
  'utf8',
);

describe('pnpm workspace security overrides', () => {
  it('pins sharp to a release that includes the libheif GHSA fix', () => {
    expect(workspaceYaml).toMatch(/^\s+sharp:\s*['"]>=0\.35\.4['"]/m);
  });
});
