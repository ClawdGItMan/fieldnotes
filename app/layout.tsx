import type { Metadata } from 'next';
import { SiteHeader, SiteFooter } from '@/components/editorial/shell';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'Fieldnotes — Crypto & AI', template: '%s · Fieldnotes' },
  description:
    'An editorial reference for agentic payments, Solana and institutional finance. Explore mechanisms, evidence and open questions.',
  icons: { icon: '/favicon.svg' },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="edition">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
