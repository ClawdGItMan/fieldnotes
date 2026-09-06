import {
  PageIntro,
  SectionHeading,
  ReadingList,
  Sources,
} from '@/components/editorial/shared';
import {
  PaymentExplorer,
  ProtocolComparison,
} from '@/components/editorial/explorers';
export const metadata = { title: 'Agentic payments' };
export default function Payments() {
  return (
    <main id="main">
      <PageIntro
        kicker="01 / AGENTIC PAYMENTS"
        title="Software can pay. Should it?"
        description="The emerging stack, from permission to delivery. Follow the money, identify the responsibility, and keep the settlement rail in perspective."
      />
      <div className="intro-rule">
        <p>
          <strong>The useful distinction</strong> · Authorization says what may
          be bought. Commerce defines the deal. Payment moves value. Evaluation
          asks whether the result was any good.
        </p>
        <a href="/article/when-software-buys" className="text-link">
          Start with the explainer ↗
        </a>
      </div>
      <section id="explorer" className="content-section">
        <SectionHeading
          number="01"
          title="Follow one payment"
          description="Three illustrative workflows. Click through the steps to see who acts, who authorizes and what can fail."
        />
        <PaymentExplorer />
      </section>
      <section className="content-section" id="stack">
        <SectionHeading
          number="02"
          title="One stack. Different jobs."
          description="A commerce protocol, a wallet and a blockchain solve different problems. The names are easy to confuse; their responsibilities need not be."
        />
        <ProtocolComparison />
      </section>
      <section className="content-section">
        <SectionHeading number="03" title="Evidence, before extrapolation" />
        <div className="adoption-grid">
          <div>
            <span className="small-meta">
              FILTERED HISTORICAL x402 ACTIVITY
            </span>
            <strong>$15M</strong>
            <p>
              109.6 million transactions
              <br />
              May 2025–April 21, 2026
            </p>
          </div>
          <div>
            <span className="small-meta">FILTERED HISTORICAL MPP ACTIVITY</span>
            <strong>$25K</strong>
            <p>
              115,000 transactions
              <br />
              Mid-March–April 21, 2026
            </p>
          </div>
          <p>
            Visa’s July 14 article cites Visa-funded Artemis research excluding
            identified wash and test activity. These are different observation
            windows, not current global totals or a head-to-head ranking.
            Transaction counts do not establish unique autonomous buyers.
          </p>
        </div>
        <Sources ids={['adoption']} />
      </section>
      <section className="content-section">
        <SectionHeading
          number="04"
          title="The choices that matter"
          description="When a chain helps, why chains want the activity, and what a plausible future could look like."
        />
        <ReadingList ids={['blockchain-fit', 'two-acps', 'payments-outlook']} />
      </section>
    </main>
  );
}
