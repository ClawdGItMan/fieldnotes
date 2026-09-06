import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseMetric, safeRefresh } from '../scripts/refresh-data.mjs';
const read = (name) => JSON.parse(fs.readFileSync('content/' + name + '.json'));
test('All published source and article references resolve', () => {
  const sourceIds = new Set(read('sources').map((s) => s.id));
  const articleIds = new Set(read('articles').map((s) => s.id));
  for (const file of ['articles', 'flows', 'comparison', 'institutions'])
    for (const row of read(file)) {
      for (const id of [
        ...(row.sourceIds || []),
        ...(row.sections || []).flatMap((s) => s.sourceIds || []),
      ])
        assert.ok(sourceIds.has(id), file + ': ' + id);
      for (const id of row.related || []) assert.ok(articleIds.has(id), id);
    }
  for (const m of read('metrics')) assert.ok(sourceIds.has(m.sourceId));
});
test('Publishable content contains no private provenance or machine secrets', () => {
  for (const file of fs
    .readdirSync('content')
    .filter((f) => f.endsWith('.json'))) {
    const s = fs.readFileSync('content/' + file, 'utf8');
    assert.doesNotMatch(
      s,
      /\/Users\/|originating_task_id|canonical_vault_path|synced_deliverable|obsidian:\/\/|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}|BEGIN.*PRIVATE KEY|sk-[A-Za-z0-9]{20,}/i,
      file,
    );
  }
});
test('Dated chart points and estimates keep valid units and provenance', () => {
  for (const m of read('metrics')) {
    assert.ok(Number.isFinite(m.value) && m.value > 0);
    assert.ok(m.period && m.definition && m.checkedAt && m.asOf && m.unit);
    if (m.series) {
      assert.equal(
        new Set(m.series.map((p) => p.period)).size,
        m.series.length,
      );
      assert.equal(m.series.at(-1).value, m.value);
    }
  }
});
test('Malformed, failed and stale data preserve the last-good metric', () => {
  const prior = { value: 5, asOf: '2026-09-05', period: '2026-09-05' };
  assert.equal(safeRefresh(prior, {}, 'tvl', '2026-09-06').metric, prior);
  assert.equal(
    safeRefresh(
      prior,
      [
        { date: 1767139200, tvl: 3 },
        { date: 1769817600, tvl: 4 },
      ],
      'tvl',
      '2026-09-06',
    ).metric,
    prior,
  );
});
test('Monthly aggregation excludes incomplete current month and requires every day', () => {
  const rows = Array.from({ length: 31 }, (_, i) => [
    Date.UTC(2026, 7, i + 1) / 1000,
    2,
  ]);
  rows.push([Date.UTC(2026, 8, 1) / 1000, 999]);
  const parsed = parseMetric({ totalDataChart: rows }, 'monthly', '2026-09-05');
  assert.equal(parsed.value, 62);
  assert.equal(parsed.asOf, '2026-08-31');
  assert.throws(
    () =>
      parseMetric({ totalDataChart: rows.slice(1) }, 'monthly', '2026-09-05'),
    /No complete months/,
  );
});
