import { metrics, money, dateLabel } from '@/content/data';
import { ReadingList, SectionHeading } from '@/components/editorial/shared';
export default function Home() {
  return (
    <main id="main">
      <section className="front-grid">
        <article className="lead-story">
          <p className="eyebrow">
            THE BIG QUESTION <span className="quiet">/ AGENTIC PAYMENTS</span>
          </p>
          <h1 className="display">
            <a href="/payments">
              When software
              <br />
              becomes the buyer.
            </a>
          </h1>
          <p className="standfirst">
            Who gives an agent permission to spend? Where does the money settle?
            And who decides the work was worth paying for?
          </p>
          <a
            className="flow-preview"
            href="/payments#explorer"
            aria-label="Explore the agent payment flow"
          >
            <span>
              <small>01</small>Authorize
            </span>
            <b>→</b>
            <span>
              <small>02</small>Pay
            </span>
            <b>→</b>
            <span>
              <small>03</small>Settle
            </span>
            <b>→</b>
            <span>
              <small>04</small>Verify
            </span>
          </a>
          <a className="text-link" href="/payments">
            Explore the payment stack ↗
          </a>
        </article>
        <aside className="front-aside">
          <p className="eyebrow">ALSO IN THIS EDITION</p>
          <article>
            <span className="small-meta">SOLANA / AN UNEVEN GROWTH STORY</span>
            <h2>
              <a href="/solana">
                Follow the
                <br />
                useful money.
              </a>
            </h2>
            <p>
              Liquidity, trading and network economics. A closer look at what
              the network’s numbers actually measure.
            </p>
            <a className="text-link" href="/solana">
              Read the indicators ↗
            </a>
          </article>
          <article>
            <span className="small-meta">INSTITUTIONS / EVIDENCE TRACKER</span>
            <h2>
              <a href="/institutions">
                From logos
                <br />
                to actual use.
              </a>
            </h2>
            <p>
              A partnership, a pilot and a live product are three different
              kinds of evidence.
            </p>
            <a className="text-link" href="/institutions">
              Follow the timeline ↗
            </a>
          </article>
        </aside>
      </section>
      <section className="indicator-strip" aria-label="Dated Solana indicators">
        <div className="indicator-label">
          <span className="eyebrow">BY THE NUMBERS</span>
          <p>Solana, in context</p>
          <small>
            Dated observations
            <br />
            not a live feed
          </small>
        </div>
        {['stablecoins', 'tvl', 'dex-volume'].map((id) => {
          const m = metrics.find((x) => x.id === id)!;
          return (
            <a href={'/solana#indicators'} key={id} className="indicator">
              <span>{m.label}</span>
              <strong>{money(m.value)}</strong>
              <small>
                {id === 'dex-volume'
                  ? dateLabel(m.asOf.slice(0, 7)) + ' · full month'
                  : dateLabel(m.asOf) + ' · snapshot'}
              </small>
            </a>
          );
        })}
      </section>
      <section className="home-reading">
        <SectionHeading
          number="01"
          title="Build the mental model"
          description="Short pieces for the questions beneath the headlines."
        />
        <ReadingList ids={['blockchain-fit', 'value-capture', 'finality']} />
      </section>
      <section className="library-callout">
        <p className="eyebrow">A REFERENCE THAT CONNECTS THE DOTS</p>
        <h2>
          Read a little deeper.
          <br />
          Remember the important part.
        </h2>
        <p>
          Mechanisms, source notes and quick recall prompts in one searchable
          library.
        </p>
        <a className="text-link" href="/library">
          Open the library ↗
        </a>
      </section>
    </main>
  );
}
