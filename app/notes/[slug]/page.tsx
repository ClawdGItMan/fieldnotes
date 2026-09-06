import { notFound } from 'next/navigation';
import { notes, dateLabel } from '@/content/data';
import { Markdown } from '@/components/editorial/markdown';
export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.id }));
}
export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = notes.find((n) => n.id === slug);
  if (!n) notFound();
  return (
    <main id="main">
      <article className="article study-note">
        <header>
          <p className="eyebrow">
            <a href="/library">THE LIBRARY</a> / STUDY NOTE
          </p>
          <h1>{n.title}</h1>
          <p className="small-meta">
            Reviewed {dateLabel(n.reviewedAt)} · {n.sourceLabel}
          </p>
        </header>
        <div className="study-body">
          <Markdown text={n.markdown} />
          <div className="source-list">
            <p className="eyebrow">REFERENCE PROVENANCE</p>
            <p>
              A selected section of the curated study reference. The source
              links above carry the supporting evidence; the review date is
              preserved from the note.
            </p>
          </div>
          <a className="text-link" href="/library">
            ← Back to the library
          </a>
        </div>
      </article>
    </main>
  );
}
