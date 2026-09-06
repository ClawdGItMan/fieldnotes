# Fieldnotes update runbook

The site owner is the only publisher. Keep the existing private Site and reuse `.openai/hosting.json`. Do not create another Site or change its audience.

## Scheduled cadence

The existing Codex heartbeat owns scheduling: hourly note checks; selected public-data checks at most once per America/New_York calendar day. No timer runs inside the hosted site. The local computer/connected Codex task must be available. Skip duplicate dispatch while the site owner is active. Stay quiet when content has not changed.

From this checkout:

```sh
npm run sync:notes
npm run refresh:data
```

The first command imports only the section allowlist in `docs/update-manifest.json`, using stable IDs and the source note's `last_reviewed` date. It strips discussion prompts and rejects private paths, internal task IDs and token-like secrets. New headings are ignored until deliberately mapped. Missing sections or sources keep their last good published values and produce issues. `content/articles.json` is authored content and is never overwritten by this importer.

The second command is daily-gated by `.local/refresh-state.json`. It validates circulating-stablecoin and default-TVL API observations, plus complete-month DEX volume and chain fees. It excludes partial current months, does not interpolate missing points, rejects schema drift and older snapshots, and retains good values on failure. A same-day second call is a no-op. `npm run refresh:data -- --force` is available only for an intentional retry after resolving a problem.

The public-page checks are reachability and response-hash checks only. A changed page is a review flag, not an automatic change to a claim. Those checks never renew an article's reviewed date. RWA value, payment estimates, developer counts and app-only revenue require a substantive human/agent review of exact definitions before editing. Existing unavailable indicators stay unavailable. Dynamic page chrome can cause hash-change false positives; review the source rather than treating every flag as a changed claim.

A refresh can succeed for some sources and fail for others. Read the emitted JSON and `.local/refresh-state.json`. Failures are actionable review flags, not missing values set to zero. Do not commit local state, page bodies, raw chats or credentials. API snapshots are dated separately from the first-edition articles; update the article's interpretation and review date only after a substantive review.

## Adding new notes and research

The curated source boundary is crypto, AI and finance. The site does not have implicit access to all ChatGPT conversations. The coordinating task may supply new authorized discussion takeaways; review them into the canonical vault note or a newly allowlisted curated note first. Never import a raw transcript. The importer deliberately handles selected second-level sections only; unknown structures must be mapped explicitly and tested.

Authored pieces are in `content/articles.json`, sources in `content/sources.json`, institutional events in `content/institutions.json`, and quantitative observations in `content/metrics.json`. Protocol roles and flows are in their own JSON files. Preserve stable IDs. Source records keep the URL, substantive review date, source as-of date and scope. Every new claim must have a source or an analysis/outlook label. Event status reflects evidence at its event date. Never present a planned integration as live.

## Validate and publish changed content

If published content has no diff, stop; do not create another version. If an importer issue is unexplained, keep the published version and resolve the mapping before publishing.

```sh
npm run prepare:publish
```

This runs note sync, nine content/import/refresh tests, TypeScript and the production Worker build. For a UI change, also exercise the affected page in a real browser. The initial edition was tested at 1440 px and 390 px, including payment scenarios/steps, protocol filters, metric selectors/data disclosure, timeline filters/reset/empty state, library search/no-results and article/study links. Use `npm run start -- --port 4173` to check the built Worker. Stop the local preview after publishing.

Use the installed Sites hosting skill and native connector. Exact sequence:

1. Check the existing Site audience remains owner-only. Initialize Git only in this checkout if absent. Commit the validated source. Exclude `.local`, `.env`, browser logs, raw research and credential files.
2. Request `sites_create_source_repository_write_credential` only when no valid credential remains. Use its exact credential-free remote URL and branch. Pass `Authorization: Bearer <token>` through a per-command Git HTTP header; never persist a token in a file, remote or Git config. The returned credential's documented auth mode governs the header.
3. Push the checked commit. Then run `git rev-parse --verify HEAD` and copy its full output verbatim.
4. Package the unchanged build with the Sites helper:

```sh
bash '/Users/me/.codex/plugins/cache/openai-bundled/sites/0.1.57/scripts/package-site.sh' \
  '/Users/me/Projects/Crypto x AI Research/fieldnotes-site' \
  '/tmp/fieldnotes-site.tar.gz'
```

5. Call `sites_save_site_version` with the manifest project ID, exact pushed SHA and `/tmp/fieldnotes-site.tar.gz`. Wait for success.
6. Call `sites_deploy_private_site_version` using the exact returned version ID and existing project ID. Poll `sites_get_deployment_status` until succeeded or failed. Keep the previous live version on any error; do not change the audience to work around a publishing error.
7. Verify the resulting URL and return it. Background delegated runs skip opening a new user-facing tab. Notify only meaningful publication changes, completion, failures or required review. There is deliberately no token-bearing publish shell script.

## Initial refresh limits

The initial four API checks succeeded. OpenAI's product page and Congress returned HTTP 403 to the simple fetch; Superstate's CUSHY fetch failed. The curated evidence remains dated September 5, 2026, drawn from the independently researched source pack. These failures are recorded for later browser/source review and did not replace content or mark claims newly reviewed.

## Ownership and recovery

Keep old saved Site versions. If a new build or deployment fails, leave the current live deployment in place. Do not claim a refresh occurred because a scheduler ran. A successful publication, retained source date, and explicit source-check results are different facts. When schema or methodology changes, pause that metric's auto-refresh and reconcile it before resuming. Never join incompatible RWA series or infer a current market share from a historical midpoint calculation.
