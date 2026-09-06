/* oxlint-disable jsx-a11y/prefer-tag-over-role -- An inline SVG chart needs role="img" and cannot be replaced by an img element. */
'use client';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import flows from '@/content/flows.json';
import comparison from '@/content/comparison.json';
import {
  articles,
  notes,
  metrics,
  institutions,
  money,
  dateLabel,
  sourceById,
} from '@/content/data';
import unavailable from '@/content/metric-availability.json';
import { Sources } from './shared';

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="filter-select">
      <span id={'label-' + label.replaceAll(' ', '-')}>{label}</span>
      <Select value={value} onValueChange={(v) => onChange(v || options[0])}>
        <SelectTrigger aria-labelledby={'label-' + label.replaceAll(' ', '-')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start">
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function PaymentExplorer() {
  const [scenario, setScenario] = useState('api');
  const [step, setStep] = useState(0);
  const flow = flows.find((f) => f.id === scenario)!;
  const current = flow.steps[step];
  return (
    <div className="payment-explorer">
      <Tabs
        value={scenario}
        onValueChange={(v) => {
          setScenario(v as string);
          setStep(0);
        }}
      >
        <TabsList className="editorial-tabs" aria-label="Payment scenario">
          {flows.map((f) => (
            <TabsTrigger key={f.id} value={f.id}>
              {f.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {flows.map((f) => (
          <TabsContent key={f.id} value={f.id}>
            <div className="scenario-intro">
              <p className="eyebrow">{f.rail}</p>
              <p>{f.setup}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="step-track" aria-label="Payment steps">
        {flow.steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setStep(i)}
            aria-pressed={step === i}
            aria-controls="step-detail"
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <strong>{s.title}</strong>
            <small>{s.owner}</small>
          </button>
        ))}
      </div>
      <div id="step-detail" className="step-detail" aria-live="polite">
        <div>
          <p className="eyebrow">
            STEP {step + 1} OF {flow.steps.length}
          </p>
          <h3>{current.title}</h3>
          <p className="step-description">{current.detail}</p>
        </div>
        <div className="step-boundaries">
          <div>
            <span>THE PERMISSION BOUNDARY</span>
            <p>{current.boundary}</p>
          </div>
          <div>
            <span>WHEN SOMETHING GOES WRONG</span>
            <p>{current.failure}</p>
          </div>
        </div>
      </div>
      <div className="explorer-bottom">
        <span className="small-meta">
          Click each step to follow responsibility.
        </span>
        <button
          className="text-link"
          type="button"
          onClick={() => setStep((step + 1) % flow.steps.length)}
        >
          {step === flow.steps.length - 1 ? 'Start again' : 'Next step'} →
        </button>
      </div>
      <Sources ids={flow.sourceIds} compact />
    </div>
  );
}

export function ProtocolComparison() {
  const [layer, setLayer] = useState('All layers');
  const rows = comparison.filter(
    (r) => layer === 'All layers' || r.layer === layer,
  );
  return (
    <div>
      <div className="filter-bar">
        <p>Different layers can work together.</p>
        <FilterSelect
          label="Protocol layer"
          value={layer}
          onChange={setLayer}
          options={['All layers', ...new Set(comparison.map((p) => p.layer))]}
        />
      </div>
      <div className="table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PROJECT / STANDARD</TableHead>
              <TableHead>ROLE IN THE STACK</TableHead>
              <TableHead>WHAT TO KEEP DISTINCT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <strong>{r.name}</strong>
                  <span className="layer-tag">{r.layer}</span>
                </TableCell>
                <TableCell>
                  <p>{r.contribution}</p>
                  <small>{r.status}</small>
                </TableCell>
                <TableCell>
                  <p>{r.limit}</p>
                  <div className="inline-sources">
                    {r.sourceIds.map(
                      (id) =>
                        sourceById[id] && (
                          <a
                            key={id}
                            href={sourceById[id].url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Source ↗
                          </a>
                        ),
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <output className="small-meta results-count">
        {rows.length} entries · Reviewed September 5, 2026 · Layers, not a
        ranking.
      </output>
    </div>
  );
}

export function MetricsExplorer() {
  const [metricId, setMetricId] = useState('stablecoins');
  const [point, setPoint] = useState<number | null>(null);
  const m = metrics.find((x) => x.id === metricId)!;
  const series = m.series!;
  const picked = series[point ?? series.length - 1];
  const max = Math.max(...series.map((p) => p.value)) * 1.1;
  const first = series[0].value;
  const change = (series[series.length - 1].value / first - 1) * 100;
  const monthly = metricId === 'dex-volume';
  const coords = series.map((p, i) => ({
    x: 55 + (i * 770) / Math.max(1, series.length - 1),
    y: 225 - (p.value / max) * 190,
    ...p,
  }));
  return (
    <div>
      <Tabs
        value={metricId}
        onValueChange={(v) => {
          setMetricId(v as string);
          setPoint(null);
        }}
      >
        <TabsList className="editorial-tabs" aria-label="Solana metric">
          {metrics
            .filter((x) => x.series)
            .map((x) => (
              <TabsTrigger key={x.id} value={x.id}>
                {x.id === 'tvl'
                  ? 'DeFi TVL'
                  : x.id === 'dex-volume'
                    ? 'DEX turnover'
                    : 'Stablecoins'}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>
      <div className="chart-heading">
        <div>
          <p className="small-meta">{m.label} · USD</p>
          <strong>{money(picked.value)}</strong>
          <p>
            {dateLabel(picked.period)}
            {monthly
              ? ' · complete calendar month'
              : ' · point-in-time observation'}
          </p>
        </div>
        <div className="chart-interpretation">
          <span className="change">
            {change > 0 ? '+' : ''}
            {change.toFixed(2)}%
          </span>
          <p>
            {dateLabel(series[0].period)} to{' '}
            {dateLabel(series[series.length - 1].period)}
            <br />
            {monthly
              ? 'Change in monthly turnover'
              : 'Change between selected endpoints'}
          </p>
        </div>
      </div>
      <div className="chart">
        <svg
          viewBox="0 0 870 265"
          role="img"
          aria-label={
            m.label +
            ' in USD. Exact values follow in an accessible data table.'
          }
        >
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line
                x1="55"
                x2="835"
                y1={225 - f * 190}
                y2={225 - f * 190}
                stroke="#c9cece"
                strokeDasharray={f ? '3 5' : undefined}
              />
              <text x="0" y={229 - f * 190}>
                {money(max * f)}
              </text>
            </g>
          ))}
          {monthly ? (
            coords.map((p, i) => (
              <rect
                key={p.period}
                x={p.x - 23}
                y={p.y}
                width="46"
                height={225 - p.y}
                fill={
                  i === (point ?? series.length - 1) ? '#174fdb' : '#a9baf0'
                }
              />
            ))
          ) : (
            <>
              <path
                d={'M' + coords.map((p) => p.x + ',' + p.y).join(' L')}
                fill="none"
                stroke="#174fdb"
                strokeWidth="3"
              />
              {coords.map((p, i) => (
                <circle
                  key={p.period}
                  cx={p.x}
                  cy={p.y}
                  r={i === (point ?? series.length - 1) ? 6 : 4}
                  fill="#174fdb"
                />
              ))}
            </>
          )}
          {coords
            .filter(
              (_, i) =>
                monthly || i === 0 || i === 4 || i === coords.length - 1,
            )
            .map((p) => (
              <text key={p.period} x={p.x} y="253" textAnchor="middle">
                {dateLabel(p.period)}
              </text>
            ))}
        </svg>
      </div>
      <div
        className="chart-point-picker"
        aria-label="Inspect chart observation"
      >
        {series.map((p, i) => (
          <button
            key={p.period}
            type="button"
            aria-pressed={i === (point ?? series.length - 1)}
            onClick={() => setPoint(i)}
          >
            {p.period.slice(5)}
          </button>
        ))}
      </div>
      <p className="chart-note">
        {m.definition}{' '}
        {monthly
          ? 'Daily UTC observations summed only for complete months.'
          : 'Month-end snapshots plus the latest dated observation; the line connects observed points and does not supply missing daily values.'}
      </p>
      <details className="disclosure">
        <summary>View exact chart data & source</summary>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Observation / period</TableHead>
              <TableHead>Value (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {series.map((p) => (
              <TableRow key={p.period}>
                <TableCell>{p.period}</TableCell>
                <TableCell>
                  {p.value.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Sources ids={[m.sourceId]} />
      </details>
      <div className="metric-grid">
        {metrics
          .filter((x) => !x.series && x.kind !== 'target')
          .map((x) => (
            <div className="metric-box" key={x.id}>
              <p className="small-meta">{x.label}</p>
              <strong>
                {x.upper
                  ? money(x.value) + '–' + money(x.upper)
                  : money(x.value)}
              </strong>
              <p>
                {x.period} · {x.scope}
              </p>
              <details className="disclosure">
                <summary>Definition & evidence</summary>
                <p>{x.definition}</p>
                <Sources ids={[x.sourceId]} />
              </details>
            </div>
          ))}
      </div>
      <div className="unavailable">
        <p className="eyebrow">LEFT OPEN, ON PURPOSE</p>
        {unavailable.map((x) => (
          <p key={x.id}>
            <strong>{x.label}: </strong>
            {x.id === 'developers'
              ? 'Awaiting a reproducible current count.'
              : 'An app-only aggregate needs filtering before publication.'}{' '}
            <a href={x.source} target="_blank" rel="noreferrer">
              Source under review ↗
            </a>
          </p>
        ))}
      </div>
    </div>
  );
}

export function InstitutionTimeline() {
  const [stage, setStage] = useState('All stages');
  const [group, setGroup] = useState('All activities');
  const rows = institutions
    .filter(
      (i) =>
        (stage === 'All stages' || i.stage === stage) &&
        (group === 'All activities' || i.group === group),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <div className="filter-bar">
        <FilterSelect
          label="Evidence stage"
          value={stage}
          onChange={setStage}
          options={[
            'All stages',
            'Announced',
            'Pilot',
            'Live product',
            'Demonstrated transaction',
          ]}
        />
        <FilterSelect
          label="Activity"
          value={group}
          onChange={setGroup}
          options={[
            'All activities',
            'Bank settlement',
            'Cash & remittances',
            'Capital markets',
            'Infrastructure',
          ]}
        />
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setStage('All stages');
            setGroup('All activities');
          }}
        >
          Reset filters
        </button>
      </div>
      <output className="small-meta results-count">
        {rows.length} milestones · Status describes evidence at the event date.
      </output>
      <div className="timeline">
        {rows.map((i) => (
          <article key={i.id} className="timeline-row">
            <div className="timeline-date">
              <time dateTime={i.date}>{dateLabel(i.date)}</time>
              <span>{i.group}</span>
            </div>
            <div>
              <span
                className={
                  'status-badge status-' + i.stage.split(' ')[0].toLowerCase()
                }
              >
                {i.stage}
              </span>
              <h3>{i.name}</h3>
              <p>{i.summary}</p>
              <p className="evidence-boundary">
                <strong>What this establishes:</strong> {i.limit}
              </p>
              <Sources ids={i.sourceIds} compact />
            </div>
          </article>
        ))}
      </div>
      {rows.length === 0 && (
        <div className="empty-state">
          <h3>No milestones match these filters.</h3>
          <p>
            Try another activity or reset the filters. Missing evidence is not
            evidence of inactivity.
          </p>
        </div>
      )}
    </div>
  );
}

export function LibraryExplorer() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All topics');
  const all = [
    ...articles.map((a) => ({
      id: a.id,
      title: a.title,
      dek: a.dek,
      topic: a.topic,
      kind: a.kind,
      url: '/article/' + a.id,
      search:
        a.tags.join(' ') + ' ' + a.sections.flatMap((s) => s.body).join(' '),
      date: a.checkedAt,
    })),
    ...notes.map((n) => ({
      id: n.id,
      title: n.title,
      dek: 'A compact study reference with sources and a quick recall prompt.',
      topic: 'study',
      kind: 'Study note',
      url: '/notes/' + n.id,
      search: n.markdown,
      date: n.reviewedAt,
    })),
  ];
  const labels: Record<string, string> = {
    payments: 'Agentic payments',
    solana: 'Solana',
    institutions: 'Institutions',
    study: 'Study notes',
  };
  const rows = all.filter(
    (a) =>
      (topic === 'All topics' || labels[a.topic] === topic) &&
      [a.title, a.dek, a.search]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <div className="library-controls">
        <div>
          <label htmlFor="library-search">SEARCH THE REFERENCE</label>
          <Input
            id="library-search"
            type="search"
            placeholder="Try escrow, buybacks, finality…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <FilterSelect
          label="Topic"
          value={topic}
          onChange={setTopic}
          options={['All topics', ...Object.values(labels)]}
        />
      </div>
      <output className="small-meta results-count">
        {rows.length} {rows.length === 1 ? 'piece' : 'pieces'}
        {query ? ' matching “' + query + '”' : ''}
      </output>
      <div className="library-results">
        {rows.map((a, i) => (
          <article key={a.id}>
            <span className="result-number">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="eyebrow">
                {labels[a.topic]} <span className="quiet">/ {a.kind}</span>
              </p>
              <h2>
                <a href={a.url}>{a.title}</a>
              </h2>
              <p>{a.dek}</p>
            </div>
            <div className="result-meta">
              <span>
                Reviewed
                <br />
                {dateLabel(a.date)}
              </span>
              <a href={a.url} aria-label={'Read ' + a.title}>
                Read ↗
              </a>
            </div>
          </article>
        ))}
      </div>
      {!rows.length && (
        <div className="empty-state">
          <h2>No pieces found.</h2>
          <p>Try a broader term or clear the filters.</p>
          <button
            className="text-link"
            onClick={() => {
              setQuery('');
              setTopic('All topics');
            }}
          >
            Clear search & filters
          </button>
        </div>
      )}
    </>
  );
}
