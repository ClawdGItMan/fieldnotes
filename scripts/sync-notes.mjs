import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
export function sanitize(body) {
  const cleaned = body
    .split('\n')
    .filter((l) => !/^\*\*(You asked|Sources of the discussion)/.test(l))
    .join('\n')
    .replace(/\bthe voice discussion\b/gi, 'the study reference')
    .replace(/\bvoice conversation\b/gi, 'study review')
    .replace(/\bthe conversation\b/gi, 'the study discussion')
    .replace(/\bClaude conversation\b/gi, 'source discussion');
  if (
    /(?:\/Users\/|originating_task_id|synced_deliverable|canonical_vault_path|obsidian:\/\/|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|BEGIN.*PRIVATE KEY|sk-[A-Za-z0-9]{20,})/i.test(
      cleaned,
    )
  )
    throw new Error('Private metadata detected');
  return cleaned.trim();
}
export function sync({
  manifest,
  root,
  prior = { schemaVersion: 1, notes: [] },
}) {
  const byId = new Map(prior.notes.map((n) => [n.id, n]));
  const issues = [];
  for (const config of manifest.notes) {
    let text;
    try {
      text = fs.readFileSync(path.join(root, config.file), 'utf8');
    } catch {
      issues.push({
        source: config.label,
        issue: 'Source unavailable; retained last good notes',
      });
      continue;
    }
    const front = text.match(/^---\n([\s\S]*?)\n---/);
    const reviewed = front?.[1].match(
      /^last_reviewed:\s*(\d{4}-\d{2}-\d{2})/m,
    )?.[1];
    if (!reviewed) {
      issues.push({
        source: config.label,
        issue: 'Missing review date; retained last good notes',
      });
      continue;
    }
    for (const item of config.sections) {
      const re = new RegExp(
        '^## ' +
          item.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
          '\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))',
        'm',
      );
      const found = text.match(re);
      if (!found) {
        issues.push({
          id: item.id,
          issue: 'Expected section missing; retained last good note',
        });
        continue;
      }
      try {
        const body = sanitize(found[1]);
        if (body.length < 40) throw new Error('Section unexpectedly empty');
        const urls = [
          ...new Set(
            [...body.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((m) => m[1]),
          ),
        ];
        byId.set(item.id, {
          id: item.id,
          title: item.title,
          topic: item.topic,
          markdown: body,
          reviewedAt: reviewed,
          sourceLabel: config.label,
          sourceUrls: urls,
          provenance: { kind: 'curated-vault-section', label: config.label },
          contentHash: crypto.createHash('sha256').update(body).digest('hex'),
        });
      } catch (e) {
        issues.push({
          id: item.id,
          issue: e.message + '; retained last good note',
        });
      }
    }
  }
  return {
    schemaVersion: 1,
    notes: [...byId.values()].sort((a, b) => a.id.localeCompare(b.id)),
    issues,
  };
}
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const manifest = JSON.parse(
    fs.readFileSync('docs/update-manifest.json', 'utf8'),
  );
  const output = manifest.output;
  const prior = fs.existsSync(output)
    ? JSON.parse(fs.readFileSync(output, 'utf8'))
    : undefined;
  const result = sync({ manifest, root: manifest.vaultRoot, prior });
  const encoded = JSON.stringify(result, null, 2) + '\n';
  const changed =
    !fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== encoded;
  if (changed) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output + '.tmp', encoded);
    fs.renameSync(output + '.tmp', output);
  }
  console.log(
    JSON.stringify({
      changed,
      notes: result.notes.length,
      issues: result.issues,
    }),
  );
  if (!result.notes.length) process.exitCode = 1;
}
