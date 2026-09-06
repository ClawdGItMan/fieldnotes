import {
  PageIntro,
  SectionHeading,
  ReadingList,
} from '@/components/editorial/shared';
import { MetricsExplorer } from '@/components/editorial/explorers';
export const metadata = { title: 'Solana' };
export default function Solana() {
  return (
    <main id="main">
      <PageIntro
        kicker="02 / SOLANA"
        title="Follow the useful money."
        description="A network can gain new institutional integrations while parts of its liquidity base contract. Read each indicator for the question it actually answers."
      />
      <div className="intro-rule">
        <p>
          <strong>The research lens</strong> · Stablecoin liquidity, DeFi
          deposits, asset issuance, trading and fee economics belong on separate
          lines of the page.
        </p>
        <a className="text-link" href="/article/solana-opportunities">
          Read the opportunity map ↗
        </a>
      </div>
      <section id="indicators" className="content-section">
        <SectionHeading
          number="01"
          title="The numbers, with their definitions"
          description="Dated source observations. Select a measure, inspect a point, or open the exact underlying values."
        />
        <MetricsExplorer />
      </section>
      <section className="content-section">
        <SectionHeading number="02" title="Understand the network" />
        <ReadingList ids={['finality', 'decentralization', 'value-capture']} />
      </section>
      <section className="split-callout">
        <div>
          <p className="eyebrow">FROM INFRASTRUCTURE TO DISTRIBUTION</p>
          <h2>Partnerships have stages.</h2>
          <p>
            Follow Foundation initiatives alongside banks, fund issuers and
            payments companies, with the evidence boundary attached to every
            event.
          </p>
          <a className="text-link" href="/institutions">
            Explore institutional activity ↗
          </a>
        </div>
        <div>
          <p className="eyebrow">QUICK RECALL</p>
          <h2>Seven familiar protocols.</h2>
          <p>
            Jupiter, Kamino, Jito, Raydium, Meteora, Huma and Exponent. A short
            reminder of what each does.
          </p>
          <a className="text-link" href="/notes/study-protocols">
            Open the protocol reference ↗
          </a>
        </div>
      </section>
    </main>
  );
}
