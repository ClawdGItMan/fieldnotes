# Fieldnotes

An editorial reference on three questions I kept getting asked in 2026: how AI agents pay for things, what Solana's numbers actually measure, and which institutional announcements turned into real usage. Every claim carries a date and a source. Anything that is a guess is labelled as one.

It is deployed as a private site. Screenshots are on [maxallaire.com](https://maxallaire.com/work/fieldnotes).

## Status (September 2026)

First edition published 2026-09-05. Ten authored articles, a curated institutions timeline, a metrics panel on Solana liquidity, and six study notes imported from my research vault. The data refresh has run on 6, 8 and 9 September; article review dates have not moved since the first edition because nothing has been substantively re-reviewed yet. Not a live news product; a dated reference that gets updated deliberately.

## What is in it

Five routes:

| Route | What it does |
|---|---|
| `/` | Front page. The lead story plus the other sections, newspaper-style. |
| `/payments` | Agentic payments. An interactive explorer of the authorize → pay → settle → verify flow, the two "ACP" protocols side by side, and where a blockchain does and does not earn its place. |
| `/solana` | Solana liquidity, DEX volume, chain fees and stablecoin supply, with a metric selector and a data-disclosure panel that shows exactly what each number is and when it was checked. |
| `/institutions` | A filterable timeline of bank, remittance, capital-markets and infrastructure events on Solana, each tagged Announced / Pilot / Live product / Demonstrated transaction. |
| `/library` | Search across every article, note and source, plus the method note on how to read the site. |

Articles live at `/article/[slug]` and imported study notes at `/notes/[slug]`.

## Editorial rules

These are enforced by the content model and the tests, not just by intention:

- **Evidence has a date; a hypothesis has a label.** Every section is `evidence`, `analysis` or `outlook`. Every article has an `asOf` date (what it describes) and a `checkedAt` date (when someone last verified it), and they are different fields on purpose.
- **Every claim has a source or an analysis label.** Sources keep their URL, publication date, as-of date and scope. The build fails if a referenced source id does not resolve.
- **Event status reflects the evidence at the event date.** A planned integration is never shown as live. Each institution entry has a `limit` field that says what the announcement does *not* cover.
- **Metrics say what they measure.** Each metric carries a definition, a scope, a period and whether it is historical, a snapshot or a target. Estimates keep their upper bound.
- **Authored content is never overwritten by a script.** The importer only touches `content/generated-notes.json`.
- **No private material.** A test rejects anything that looks like a private path, an internal task id, a transcript or a token before it can be published.

## The refresh pipeline

Two scripts, both deterministic and both designed to do nothing when they are unsure.

`npm run sync:notes` imports an allowlist of sections from specific notes in my research vault (`docs/update-manifest.json`). It uses stable ids and the source note's own review date, strips discussion prompts, and ignores any heading that has not been explicitly mapped. If a source is missing, the last good version stays and an issue is reported.

`npm run refresh:data` is gated to once per calendar day (America/New_York) by a local state file. It pulls four DefiLlama series (stablecoin supply, TVL, monthly DEX volume, monthly chain fees), validates the schema, excludes the partial current month, never interpolates missing points, rejects snapshots older than what is already published, and keeps the last good value on any failure. It also fetches a short list of source pages and compares response hashes: a changed page becomes a **review flag** for a human, never an automatic edit, and never advances an article's reviewed date. Figures that need judgement (RWA value, payment estimates, developer counts, app-only revenue) are excluded from auto-refresh entirely.

A partial success is normal. The output is a JSON report of what updated, what was retained and what needs review.

## How to run

Node 22.13 or later.

```bash
npm install
npm run dev              # local development
npm run check            # sync notes, nine tests, typecheck, lint
npm run build            # production Cloudflare Worker build
npm run start -- --port 4173   # serve the built Worker locally
```

The note importer expects the vault path in `docs/update-manifest.json`; without it the sync reports issues and keeps the committed notes, which is fine for running the site.

`docs/UPDATE-RUNBOOK.md` is the operating manual for updates and publishing.

## Stack

React 19, TypeScript, [Vinext](https://github.com/cloudflare/vinext) (Next.js-style routing on Vite), shadcn primitives, Recharts, deployed as a Cloudflare Worker. Content is plain JSON under `content/`; there is no database and no CMS.

## What I learned

- Separating "as of" from "checked at" is the single most useful decision in the content model. Most crypto dashboards blur them, which is how stale numbers get quoted as current.
- A refresh pipeline that refuses to guess is more trustworthy than one that fills gaps. Retain-last-good plus a review flag beat interpolation every time I looked at the output.
- Institutional adoption is easier to reason about as a timeline with a `stage` and a `limit` than as a list of logos. Half the entries are "one securities transaction" or "select participants", and saying so is the point.

## Built with AI

The content model, editorial rules and refresh policy were written first as documents. Claude Code and Codex built the site and the pipeline from them; I reviewed by reading the rendered pages at 1440 px and 390 px and by reading the refresh reports.
