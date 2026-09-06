import { PageIntro } from '@/components/editorial/shared';
import { LibraryExplorer } from '@/components/editorial/explorers';
export const metadata = { title: 'The library' };
export default function Library() {
  return (
    <main id="main">
      <PageIntro
        kicker="04 / THE LIBRARY"
        title="A place to connect the dots."
        description="Browse the explainers, evidence and study references. Search by a mechanism, a project or a question."
      />
      <LibraryExplorer />
      <section id="method" className="method-note">
        <p className="eyebrow">HOW TO READ THIS REFERENCE</p>
        <h2>
          Evidence has a date.
          <br />A hypothesis has a label.
        </h2>
        <div>
          <p>
            Explainers connect mechanisms. Evidence sections cite dated
            documentation, issuer announcements and public data. Analysis is
            editorial interpretation. Outlook sections describe scenarios rather
            than promises.
          </p>
          <p>
            “Reviewed” records a substantive source or note review. It is not a
            live-data guarantee. Public page checks alone do not renew that
            date. API snapshots keep their own observation dates; missing or
            uncertain data stays unavailable.
          </p>
          <p>
            Study notes are selected, sanitized excerpts from a curated research
            reference. They update in place without replacing the authored
            explainers. Links between pieces help distinguish a quick reminder
            from the fuller argument.
          </p>
        </div>
      </section>
    </main>
  );
}
