import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const date = (t) => new Date(Number(t) * 1000).toISOString().slice(0, 10);
const valid = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0;
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
function write(file, value) {
  const text = JSON.stringify(value, null, 2) + '\n';
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text)
    return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file + '.tmp', text);
  fs.renameSync(file + '.tmp', file);
  return true;
}
export function parseMetric(payload, kind, today) {
  if (kind === 'monthly') {
    if (!Array.isArray(payload.totalDataChart))
      throw Error('Missing daily chart');
    const groups = new Map();
    for (const row of payload.totalDataChart) {
      if (
        !Array.isArray(row) ||
        !valid(row[0]) ||
        typeof row[1] !== 'number' ||
        !Number.isFinite(row[1]) ||
        row[1] < 0
      )
        throw Error('Unexpected daily chart schema');
      const d = date(row[0]);
      const month = d.slice(0, 7);
      if (month >= today.slice(0, 7)) continue;
      if (!groups.has(month)) groups.set(month, new Map());
      const days = groups.get(month);
      if (days.has(d)) throw Error('Duplicate daily observation');
      days.set(d, row[1]);
    }
    const complete = [...groups]
      .filter(
        ([m, days]) =>
          days.size ===
          new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0)).getUTCDate(),
      )
      .sort(([a], [b]) => a.localeCompare(b));
    if (!complete.length) throw Error('No complete months');
    const series = complete
      .slice(-3)
      .map(([period, days]) => ({
        period,
        value: [...days.values()].reduce((a, b) => a + b, 0),
      }));
    const latest = series.at(-1);
    if (!valid(latest.value)) throw Error('Unexpected empty aggregate');
    return {
      value: latest.value,
      series,
      asOf:
        latest.period +
        '-' +
        new Date(
          Date.UTC(+latest.period.slice(0, 4), +latest.period.slice(5, 7), 0),
        ).getUTCDate(),
      period:
        latest.period +
        '-01 to ' +
        latest.period +
        '-' +
        new Date(
          Date.UTC(+latest.period.slice(0, 4), +latest.period.slice(5, 7), 0),
        ).getUTCDate(),
    };
  }
  if (!Array.isArray(payload) || payload.length < 2)
    throw Error('Missing time series');
  const points = payload
    .map((row) => {
      if (!valid(Number(row.date)))
        throw Error('Missing observation timestamp');
      const d = date(row.date);
      let value;
      if (kind === 'stablecoins') {
        if (
          !row.totalCirculatingUSD ||
          typeof row.totalCirculatingUSD !== 'object'
        )
          throw Error('Missing circulating value');
        const vals = Object.values(row.totalCirculatingUSD);
        if (
          !vals.length ||
          vals.some(
            (v) => typeof v !== 'number' || !Number.isFinite(v) || v < 0,
          )
        )
          throw Error('Invalid circulating value');
        value = vals.reduce((a, b) => a + b, 0);
      } else {
        value = row.tvl;
      }
      if (!valid(value)) throw Error('Invalid observation value');
      return { period: d, value };
    })
    .filter((p) => p.period <= today)
    .sort((a, b) => a.period.localeCompare(b.period));
  const latest = points.at(-1);
  if (!latest) throw Error('No dated observations');
  const byDate = new Map();
  for (const p of points) {
    if (byDate.has(p.period)) throw Error('Duplicate point date');
    byDate.set(p.period, p);
  }
  const series = points.filter(
    (p) =>
      p.period >= '2025-12-31' &&
      (new Date(p.period + 'T00:00:00Z').getUTCDate() ===
        new Date(
          Date.UTC(+p.period.slice(0, 4), +p.period.slice(5, 7), 0),
        ).getUTCDate() ||
        p.period === latest.period),
  );
  if (series.length < 2) throw Error('Insufficient comparable points');
  return {
    value: latest.value,
    period: latest.period,
    asOf: latest.period,
    series,
  };
}
export function safeRefresh(prior, payload, kind, today) {
  try {
    const update = parseMetric(payload, kind, today);
    if (update.asOf < prior.asOf) throw Error('Upstream data is older');
    return {
      metric: {
        ...prior,
        ...update,
        ...(prior.series ? {} : { series: undefined }),
      },
      issue: null,
    };
  } catch (e) {
    return { metric: prior, issue: e.message + '; retained last good value' };
  }
}
export async function run({ force = false } = {}) {
  const config = JSON.parse(
    fs.readFileSync('docs/refresh-manifest.json', 'utf8'),
  );
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: config.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const statePath = '.local/refresh-state.json';
  const prior = fs.existsSync(statePath)
    ? JSON.parse(fs.readFileSync(statePath, 'utf8'))
    : {};
  if (prior.attemptedOn === today && !force) {
    console.log(
      JSON.stringify({ skipped: true, reason: 'Already attempted today' }),
    );
    return;
  }
  const metrics = JSON.parse(fs.readFileSync('content/metrics.json', 'utf8'));
  const sources = JSON.parse(fs.readFileSync('content/sources.json', 'utf8'));
  const flags = [];
  const checks = [];
  const pageHashes = { ...prior.pageHashes };
  for (const item of config.metrics) {
    const index = metrics.findIndex((m) => m.id === item.id);
    try {
      const response = await fetch(item.url, {
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw Error('HTTP ' + response.status);
      const payload = await response.json();
      const result = safeRefresh(metrics[index], payload, item.parser, today);
      if (result.issue) throw Error(result.issue);
      const changed =
        JSON.stringify(result.metric) !== JSON.stringify(metrics[index]);
      if (changed) {
        metrics[index] = { ...result.metric, checkedAt: today };
        const s = sources.find((s) => s.id === metrics[index].sourceId);
        s.asOf = metrics[index].asOf;
        s.checkedAt = today;
      }
      checks.push({
        id: item.id,
        ok: true,
        asOf: metrics[index].asOf,
        changed,
      });
    } catch (e) {
      flags.push({ id: item.id, reason: e.message });
      checks.push({ id: item.id, ok: false });
    }
  }
  for (const id of config.reviewSourceIds) {
    const source = sources.find((s) => s.id === id);
    try {
      if (!source) throw Error('Unknown source ID');
      const r = await fetch(source.url, { signal: AbortSignal.timeout(12000) });
      if (!r.ok) throw Error('HTTP ' + r.status);
      const body = await r.text();
      if (body.length < 300) throw Error('Unexpectedly short response');
      const digest = hash(body);
      if (pageHashes[id] && pageHashes[id] !== digest)
        flags.push({
          id,
          reason:
            'Page response changed; substantive review needed before editing claims',
        });
      pageHashes[id] = digest;
      checks.push({
        id,
        ok: true,
        meaning: 'Reachability/hash only; not a substantive claim review',
      });
    } catch (e) {
      flags.push({ id, reason: e.message });
      checks.push({ id, ok: false });
    }
  }
  const changed =
    write('content/metrics.json', metrics) |
    write('content/sources.json', sources);
  write(statePath, { attemptedOn: today, checks, pageHashes, flags });
  console.log(JSON.stringify({ changed: !!changed, checks, flags }));
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await run({ force: process.argv.includes('--force') });
