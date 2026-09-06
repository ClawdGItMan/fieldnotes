import {
  PageIntro,
  SectionHeading,
  ReadingList,
} from '@/components/editorial/shared';
import { InstitutionTimeline } from '@/components/editorial/explorers';
export const metadata = { title: 'Institutions' };
export default function Institutions() {
  return (
    <main id="main">
      <PageIntro
        kicker="03 / INSTITUTIONS"
        title="From logos to actual use."
        description="Who is doing what, on which part of the stack? A dated record of money movement, capital markets and infrastructure around Solana."
      />
      <div className="evidence-legend">
        {[
          ['Announced', 'An intention or a planned rollout.'],
          ['Pilot', 'A sandbox or bounded test.'],
          ['Live product', 'A launched capability; usage may be undisclosed.'],
          [
            'Demonstrated transaction',
            'A completed transaction; repeat volume not assumed.',
          ],
        ].map(([t, d]) => (
          <div key={t}>
            <strong>{t}</strong>
            <p>{d}</p>
          </div>
        ))}
      </div>
      <section className="content-section">
        <SectionHeading
          number="01"
          title="The evidence timeline"
          description="Filter by activity and evidence stage. Foundation collaborations remain distinct from companies’ products and customer usage."
        />
        <InstitutionTimeline />
      </section>
      <section className="content-section">
        <SectionHeading number="02" title="Reading beyond the announcement" />
        <ReadingList
          ids={['institutions-evidence', 'clarity', 'solana-opportunities']}
        />
      </section>
    </main>
  );
}
