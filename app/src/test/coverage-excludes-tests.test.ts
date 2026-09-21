import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const vitestConfig = readFileSync(resolve(import.meta.dirname, '../../vitest.config.ts'), 'utf8');

describe('coverage report omits test files', () => {
  it('excludes *.test and *.spec modules from Vitest coverage include set', () => {
    expect(vitestConfig).toMatch(/include:\s*\['src\/\*\*\/\*\.\{ts,tsx\}'\]/);
    expect(vitestConfig).toMatch(/\*\*\/\*\.\{test,spec\}\.\{ts,tsx\}/);
  });
});
