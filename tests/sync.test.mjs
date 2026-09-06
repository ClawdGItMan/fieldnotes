import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sync, sanitize } from '../scripts/sync-notes.mjs';
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fieldnotes-sync-'));
const manifest = {
  notes: [
    {
      file: 'note.md',
      label: 'Study',
      sections: [{ id: 'a', heading: 'Topic', title: 'Topic', topic: 'study' }],
    },
  ],
};
const write = (t) => fs.writeFileSync(path.join(root, 'note.md'), t);
const good =
  '---\nlast_reviewed: 2026-09-05\n---\n## Topic\nA useful explanation with enough length and [a source](https://example.com).\n';
test('stable ids and dates; repeated sync is idempotent', () => {
  write(good);
  const first = sync({ manifest, root });
  assert.equal(first.notes[0].reviewedAt, '2026-09-05');
  assert.deepEqual(sync({ manifest, root, prior: first }), first);
});
test('unknown heading and source failure keep the last good note', () => {
  write(good);
  const first = sync({ manifest, root });
  write(good.replace('## Topic', '## Renamed'));
  assert.deepEqual(sync({ manifest, root, prior: first }).notes, first.notes);
  fs.unlinkSync(path.join(root, 'note.md'));
  assert.deepEqual(sync({ manifest, root, prior: first }).notes, first.notes);
});
test('private metadata rejected without destroying prior content', () => {
  write(good);
  const prior = sync({ manifest, root });
  write(good + 'originating_task_id: secret\n');
  assert.deepEqual(sync({ manifest, root, prior }).notes, prior.notes);
  assert.throws(() => sanitize('/Users/me/private-file'));
  assert.equal(
    sanitize('**You asked:** private question\nPublic explanation.'),
    'Public explanation.',
  );
});
test('reviewed changes update note without touching authored articles', () => {
  write(good);
  const first = sync({ manifest, root });
  write(good.replace('useful explanation', 'revised explanation'));
  const next = sync({ manifest, root, prior: first });
  assert.notEqual(first.notes[0].contentHash, next.notes[0].contentHash);
  assert.equal(next.notes[0].id, 'a');
  assert.equal(next.notes[0].reviewedAt, '2026-09-05');
});
