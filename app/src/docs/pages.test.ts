import { describe, expect, it } from 'vitest';
import { DOC_SLUGS, findDocPage } from './pages';
import { presentDocsMarkdown, splitDocsMarkdown } from './presentDocsMarkdown';
import { resolveDocsHref } from './resolveDocsHref';

describe('splitDocsMarkdown', () => {
  it('parses frontmatter fields and returns the body without fences', () => {
    const { frontmatter, body } = splitDocsMarkdown(
      "---\nstatus: Accepted\ndate: 2026-08-10\ndeciders: ['SteerLens']\n---\n\n# Title\n",
    );
    expect(frontmatter).toEqual({
      status: 'Accepted',
      date: '2026-08-10',
      deciders: 'SteerLens',
    });
    expect(body).toContain('# Title');
    expect(body).not.toContain('```yaml');
    expect(presentDocsMarkdown('---\nstatus: Accepted\n---\n\n# Title\n')).toBe('\n# Title\n');
  });

  it('leaves markdown without frontmatter unchanged', () => {
    expect(splitDocsMarkdown('# Hello\n')).toEqual({ frontmatter: null, body: '# Hello\n' });
  });
});

describe('ADR docs pages', () => {
  it('registers the ADR index and individual ADRs', () => {
    expect(findDocPage('adrs').title).toBe('ADRs');
    expect(DOC_SLUGS.has('adrs/0001-cloudflare-pages-pulumi-wrangler')).toBe(true);
    const page = findDocPage('adrs/0001-cloudflare-pages-pulumi-wrangler');
    expect(page.markdown).toContain('status: Accepted');
  });

  it('resolves relative ADR links from the index', () => {
    expect(resolveDocsHref('./0001-cloudflare-pages-pulumi-wrangler.md', 'adrs', DOC_SLUGS)).toBe(
      '/docs/adrs/0001-cloudflare-pages-pulumi-wrangler',
    );
  });
});
