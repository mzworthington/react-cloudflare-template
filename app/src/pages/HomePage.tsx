import { SITE_NAME, SITE_TAGLINE } from '../siteConfig';

export function HomePage() {
  return (
    <section className="hero" data-testid="home">
      <div className="hero-inner">
        <h1 className="hero-brand">{SITE_NAME}</h1>
        <p className="hero-lead">{SITE_TAGLINE}</p>
        <div className="hero-actions">
          <a href="/docs" className="btn-primary">
            What's included
          </a>
          <a href="/docs/setup" className="btn-secondary">
            Get started →
          </a>
        </div>
      </div>
    </section>
  );
}
