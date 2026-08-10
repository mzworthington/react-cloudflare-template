import { useEffect } from 'react';
import { CopyableSnippet } from '../components/CopyableSnippet';
import {
  SITE_CREATE_COMMAND,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_REPO_URL,
  SITE_SLUG,
  SITE_TAGLINE,
  hostingBootstrapSnippet,
} from '../siteConfig';

const HOSTING_SNIPPET = hostingBootstrapSnippet();

export function HomePage() {
  useEffect(() => {
    document.title = SITE_NAME;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', SITE_DESCRIPTION);
  }, []);

  return (
    <section
      className="hero"
      data-testid="home"
      data-site-slug={SITE_SLUG}
      data-site-origin={SITE_ORIGIN}
    >
      <div className="hero-inner">
        <h1 className="hero-brand">{SITE_NAME}</h1>
        <p className="hero-lead">{SITE_TAGLINE}</p>
        <div className="hero-actions">
          <a href="/docs" className="btn-primary">
            What's included
          </a>
          <a href={SITE_REPO_URL} className="btn-secondary" target="_blank" rel="noreferrer">
            View on GitHub →
          </a>
        </div>
        <div className="hero-snippets">
          <div className="hero-snippet" data-testid="template-snippet">
            <p className="hero-snippet-label">Use this template</p>
            <CopyableSnippet code={SITE_CREATE_COMMAND} label="Copy create command" />
          </div>
          <div className="hero-snippet" data-testid="hosting-snippet">
            <p className="hero-snippet-label">Host on Cloudflare</p>
            <CopyableSnippet code={HOSTING_SNIPPET} label="Copy hosting commands" />
            <p className="hero-snippet-hint">
              <a href="/docs/custom-domains">Custom domains &amp; secrets →</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
