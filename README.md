# Fieldnotes

Private editorial reference for agentic payments, Solana, institutional adoption and curated study notes. Built with React, TypeScript, Vinext and Sites.

- `npm run dev`: local development
- `npm run sync:notes`: deterministic curated-note import
- `npm run refresh:data`: daily-gated data refresh and source-review flags
- `npm run prepare:publish`: sync, test, typecheck and production build
- `npm run start -- --port 4173`: check the built Worker

Read `docs/UPDATE-RUNBOOK.md` before updates or publishing. The manifests define the allowlisted notes and supported data endpoints. Do not publish raw transcripts or local refresh state. The Site uses owner-only access.
