import articleData from './articles.json';
import sourceData from './sources.json';
import metricData from './metrics.json';
import institutionData from './institutions.json';
import generated from './generated-notes.json';
import type { Article, Source, Metric, Institution } from './model';
export const articles = articleData as Article[];
export const sources = sourceData as Source[];
export const metrics = metricData as Metric[];
export const institutions = institutionData as Institution[];
export const notes = generated.notes;
export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));
export function dateLabel(value: string) {
  if (!/^\d{4}-\d{2}(-\d{2})?$/.test(value)) return value;
  const monthOnly = value.length === 7;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    ...(monthOnly ? {} : { day: 'numeric' }),
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value + (monthOnly ? '-01' : '') + 'T00:00:00Z'));
}
export function money(n: number) {
  return (
    '$' +
    (n >= 1e9
      ? (n / 1e9).toFixed(2) + 'B'
      : n >= 1e6
        ? (n / 1e6).toFixed(2) + 'M'
        : n.toLocaleString('en-US'))
  );
}
