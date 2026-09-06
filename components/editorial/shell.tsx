'use client';

import { usePathname } from 'next/navigation';
const nav = [
  ['/payments', 'Agentic payments'],
  ['/solana', 'Solana'],
  ['/institutions', 'Institutions'],
  ['/library', 'The library'],
];
export function SiteHeader() {
  const path = usePathname();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="edition-top">
        <span>A PERSONAL RESEARCH REFERENCE</span>
        <span>THE SEPTEMBER 2026 EDITION</span>
      </div>
      <header className="masthead">
        <a href="/" aria-label="Fieldnotes home" className="wordmark">
          Fieldnotes<span>.</span>
        </a>
        <p>Crypto, AI & the systems between them</p>
      </header>
      <nav className="navigation" aria-label="Main navigation">
        <a href="/" aria-current={path === '/' ? 'page' : undefined}>
          Front page
        </a>
        {nav.map(([url, title]) => (
          <a
            key={url}
            href={url}
            aria-current={path.startsWith(url) ? 'page' : undefined}
          >
            {title}
          </a>
        ))}
      </nav>
    </>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="/" className="footer-brand">
        Fieldnotes.
      </a>
      <p>
        A working reference. Evidence is dated. Outlook is labelled. Questions
        stay open.
      </p>
      <a href="/library#method">How to read this reference ↗</a>
    </footer>
  );
}
