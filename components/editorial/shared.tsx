import { articles, sourceById, dateLabel } from '@/content/data';
import type { Article } from '@/content/model';
export function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <article className={'story-card' + (featured ? ' featured' : '')}>
      <p className="eyebrow">
        {article.kind}{' '}
        <span className="quiet">/ {article.readMinutes} MIN READ</span>
      </p>
      <h3>
        <a href={'/article/' + article.id}>{article.title}</a>
      </h3>
      <p>{article.dek}</p>
      <a className="text-link" href={'/article/' + article.id}>
        Read the piece <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
export function ReadingList({ ids }: { ids: string[] }) {
  return (
    <div className="story-grid">
      {ids
        .map((id) => articles.find((a) => a.id === id))
        .filter((a): a is Article => !!a)
        .map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
    </div>
  );
}
export function Sources({
  ids,
  compact = false,
}: {
  ids: string[];
  compact?: boolean;
}) {
  return (
    <div className={'source-list' + (compact ? ' compact' : '')}>
      <p className="eyebrow">
        {compact ? 'SOURCE REFERENCES' : 'SOURCES & SCOPE'}
      </p>
      {[...new Set(ids)].map((id) => {
        const s = sourceById[id];
        if (!s) return null;
        return (
          <div className="source-item" key={id}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.title} ↗
            </a>
            {!compact && (
              <p>
                Source as of {dateLabel(s.asOf)} · Reviewed{' '}
                {dateLabel(s.checkedAt)}
                {s.scope ? ' · ' + s.scope : ''}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
export function PageIntro({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      <p className="standfirst">{description}</p>
    </header>
  );
}
