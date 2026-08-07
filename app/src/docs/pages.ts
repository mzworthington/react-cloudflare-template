import architecture from '../../../docs/architecture.md?raw';
import overview from '../../../docs/overview.md?raw';
import quality from '../../../docs/quality.md?raw';
import setup from '../../../docs/setup.md?raw';
import techStack from '../../../docs/tech-stack.md?raw';
import workflows from '../../../docs/workflows.md?raw';
import adrIndex from '../../../docs/ADRs/README.md?raw';

export type DocPage = {
  slug: string;
  title: string;
  markdown: string;
};

export const DOC_PAGES: DocPage[] = [
  { slug: '', title: "What's included", markdown: overview },
  { slug: 'overview', title: "What's included", markdown: overview },
  { slug: 'workflows', title: 'Workflows', markdown: workflows },
  { slug: 'quality', title: 'Quality', markdown: quality },
  { slug: 'setup', title: 'Setup', markdown: setup },
  { slug: 'tech-stack', title: 'Tech stack', markdown: techStack },
  { slug: 'architecture', title: 'Architecture', markdown: architecture },
  { slug: 'adrs', title: 'ADRs', markdown: adrIndex },
];

export function findDocPage(slug: string | undefined): DocPage {
  const key = (slug ?? '').replace(/^\/+|\/+$/g, '');
  return DOC_PAGES.find((page) => page.slug === key) ?? DOC_PAGES[0];
}
