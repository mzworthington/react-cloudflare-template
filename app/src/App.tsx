import { Route, Switch } from 'wouter';
import { SITE_NAME } from './siteConfig';
import { DocsPage } from './pages/DocsPage';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <div className="site-shell">
      <header className="site-nav">
        <div className="site-nav-inner">
          <a href="/" className="site-brand">
            {SITE_NAME}
          </a>
          <nav className="site-nav-links" aria-label="Primary">
            <a href="/" className="site-nav-link">
              Home
            </a>
            <a href="/docs" className="site-nav-link">
              Docs
            </a>
            <a href="/docs/setup" className="site-nav-link">
              Setup
            </a>
          </nav>
        </div>
      </header>
      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/docs/:slug*" component={DocsPage} />
          <Route path="/docs" component={DocsPage} />
          <Route>
            <section className="not-found">
              <h1>Not found</h1>
              <p>That page is not part of this starter.</p>
              <a href="/" className="btn-secondary mt-6">
                ← Back home
              </a>
            </section>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
