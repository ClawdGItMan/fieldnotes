import { notFound } from 'next/navigation';
import { articles, dateLabel } from '@/content/data';
import { Sources, ReadingList } from '@/components/editorial/shared';
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.id }));
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.id === slug);
  if (!a) notFound();
  return (
    <main id="main">
      <article className="article">
        <header>
          <p className="eyebrow">
            <a href={a.topic === 'study' ? '/library' : '/' + a.topic}>
              {a.topic}
            </a>{' '}
            / {a.kind}
          </p>
          <h1>{a.title}</h1>
          <p className="standfirst">{a.dek}</p>
          <p className="small-meta">
            {a.readMinutes} MIN READ · Reviewed {dateLabel(a.checkedAt)} ·
            Evidence as of {dateLabel(a.asOf)}
          </p>
        </header>
        <div className="takeaway">
          <p className="eyebrow">THE IDEA TO KEEP</p>
          <p>{a.takeaway}</p>
        </div>
        <div className="article-grid">
          <aside className="article-toc">
            <p className="eyebrow">IN THIS PIECE</p>
            {a.sections.map((s, i) => (
              <a href={'#section-' + i} key={s.title}>
                {s.title}
              </a>
            ))}
          </aside>
          <div className="article-body">
            {a.sections.map((s, i) => (
              <section id={'section-' + i} key={s.title} className="prose">
                <p className={'section-kind ' + s.kind}>
                  {s.kind || 'analysis'}
                </p>
                <h2>{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.sourceIds?.length ? (
                  <Sources ids={s.sourceIds} compact />
                ) : null}
              </section>
            ))}
            <details className="disclosure recall">
              <summary>Quick recall: explain it in one breath</summary>
              <p>{a.takeaway}</p>
              <p>Then name one thing the evidence does not yet establish.</p>
            </details>
            <Sources ids={a.sourceIds} />
            <p className="small-meta provenance">{a.provenance.label}</p>
          </div>
        </div>
      </article>
      <section className="content-section">
        <h2 className="related-title">Keep connecting the dots</h2>
        <ReadingList ids={a.related} />
      </section>
    </main>
  );
}
