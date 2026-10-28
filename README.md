# @wekify/kifuliiru-core

Standalone TypeScript library for **Kifuliiru linguistic logic**: numerals, verb morphology, grammar paradigms, phonetics (KPG), and sentence composition. It is the reusable engine layer for Wekify’s Kifuliiru products—not a web app, database client, or export pipeline.

**Related repos (ecosystem):**

| Project | Role |
| -------- | ----- |
| **[kifuliiru-data-generators](https://github.com/wekify/kifuliiru-data-generators)** (Lab) | Next.js operator UI: authoring, bulk generation, Supabase publish, PDF/KEd export |
| **@wekify/kifuliiru-core** (this repo) | Pure algorithms + types; importable from apps, scripts, and the Lab |
| **@wekify/kifuliiru-react** (planned) | UI components (search, conjugator widgets, playgrounds) built on core |
| **kifuliiru.com / Tabula / KEd** | Published corpus, community input, books |

### Working agreement (current phase)

**`kifuliiru-data-generators` is not modified while we build this package.** It is a **read-only reference**: copy and refactor logic from paths like `src/lib/core/` and `src/lib/phonetics/` into `kifuliiru-core`, add tests here, and strip Next/Supabase/`@/` imports. No Lab dependency on this npm package, no API rewires, no monorepo link—until we explicitly decide otherwise later.

---

## Why this package exists

Today, most generator **engines** live under the Lab app at `src/lib/core/` and `src/lib/phonetics/`. That couples linguistic rules to Next.js routes, Supabase, and Puppeteer. Extracting engines here keeps:

- One tested source of truth for “how Kifuliiru works”
- Apps that only need `numberToKifuliiru(n)` or conjugation without running the full Lab
- Smaller publish surface (no secrets, no generated corpus in git)

The Lab remains the **authoring and orchestration** surface; core holds **deterministic language logic**.

---

## Package layout

```
src/
  numbers/       # Numeral system (compound scales, negatives, …)
  verbs/         # Verb model helpers, lexicon-oriented utilities
  grammar/       # Pronouns, connectors, static paradigms
  phonetics/     # KP → KPG rules, tokenization, syllabification
  sentences/     # Pattern-based sentence generation (inputs = verbs + slots)
  index.ts       # Public API (only re-export what you support semver-wise)
tests/           # Vitest — linguistic rules and regressions
```

Build output: ESM + `.d.ts` in `dist/` (via [tsup](https://tsup.egoist.dev/)).

---

## Where data comes from (engines vs corpus)

Not everything belongs in this npm package. Use this split:

### 1. In **core** (code or tiny static tables)

Rules and algorithms that are **fully defined by linguistics**, not by editorial corpus size:

| Engine (Lab reference) | Lab module(s) | Data shape |
| ---------------------- | ------------- | ---------- |
| Numbers | `src/lib/core/numbers.ts` | Embedded digit/scale lexicon + composition rules |
| Conjugation | `src/lib/core/conjugation.ts`, `conjugation/*` | Paradigms + rules; **per-verb fields passed in** |
| Grammar elements | `src/lib/core/grammar.ts` | Static in-code structures |
| KPG phonetics | `src/lib/phonetics/kpg-engine.ts`, `kp-rules.ts` | Grapheme–phoneme rules; text in, notation out |
| Math (lightweight) | `src/lib/core/math.ts` | Operation + range config |
| Validation / QC helpers | `src/lib/core/validation.ts`, `quality-control.ts` | Pure functions over strings/rows |

These modules should end up **dependency-free** (no `@/`, no Supabase, no Next).

### 2. **Inputs** to engines (not shipped inside core by default)

Generators **consume** rows authored in the Lab or synced from cloud:

| Seed | Typical source | Used by |
| ---- | -------------- | ------- |
| Verb lexicon | `lab_*` / verbs tables, CSV, manual UI | Conjugation, sentences, quiz |
| Dictionary POS | `dictionary_*` tables | Sentences, text builder, semantics |
| Conjugation rules config | `conjugation_rules` table | Bulk conjugation coverage |
| Semantics matrix | `semantics_dictionary` | Constrained generation |
| Sentence templates / patterns | DB + `sentences.ts` patterns | Bulk sentence generator |
| Conversation templates | `conversation_templates`, vocabulary | Conversations builder |

**Design:** core exports functions like `conjugate(verb: VerbSeed, options)` and `generateSentence(pattern, slots)` where `VerbSeed` / slots are **plain TypeScript types**. Callers (Lab API routes, kifuliiru.com, tests) load JSON or DB rows and pass them in.

Optional later package: `@wekify/kifuliiru-data` — versioned JSON snapshots for offline demos (not required for v0.1).

### 3. Stays in **kifuliiru-data-generators** (not core)

Orchestration, I/O, and product glue:

- `mass-generator.ts`, `data-generator.ts`, Puppeteer PDF, Python legacy scripts
- Supabase `db-mapper`, publish-to-cloud, AI enrichment services
- API routes under `src/app/api/*`, pages under `data-generation/*`
- Progress/catalog metadata: `data-engines-catalog.ts`, `lab-engines-registry.ts`

In the Lab repo, `LAB_ENGINES` and `DATA_ENGINES` are the **checklist of what to port into this repo** (read those files locally; do not change them for now).

---

## Suggested port order (Lab code → this repo)

1. **Numbers** — already algorithmic; lowest coupling (`KifuliiruNumbers` class).
2. **Phonetics (KPG)** — rules-only; DB only supplies example lemmas in the UI.
3. **Grammar** — static `grammar.ts`.
4. **Conjugation** — extract `KifuliiruConjugationEngine` + paradigm types; define `VerbData` in core (mirror Lab `@/types`).
5. **Sentences** — extract combinatorics; keep template **storage** in Lab/DB.
6. **Quiz / math** — if needed for shared assessment logic across apps.

After each slice: behavior should match the Lab reference; keep all changes in **this** repository only.

---

## Install

```bash
npm install @wekify/kifuliiru-core
```

Requires the `@wekify` npm scope to exist on your org/account before public publish.

---

## Development

```bash
npm install
npm run build      # dist/index.js + dist/index.d.ts
npm test           # vitest
npm run typecheck  # tsc --noEmit
```

### npm note

If `npm install` fails with `Cannot read properties of null (reading 'edgesOut')`, this project uses `.npmrc` with `legacy-peer-deps=true` (Vitest 4 peer graph on npm 10).

TypeScript is pinned to **~5.8** because tsup’s `.dts` step is not yet reliable on TypeScript 7.

---

## Publishing

1. Ensure `@wekify` scope access on [npm](https://www.npmjs.com/).
2. Bump `version` in `package.json` (semver).
3. `npm run build && npm test`
4. `npm publish --access public`

Only the `dist/` folder is included in the package (`files` field).

---

## Roadmap (scaffold → parity with Lab)

- [ ] Port `numbers.ts` engine and golden tests from Lab
- [ ] Port KPG phonetics engine + rule tests
- [ ] Port conjugation engine + shared `VerbData` types
- [ ] Port grammar paradigms
- [ ] Port sentence combinatorics with injectable templates
- [ ] (Later) Optional: Lab consumes this package—out of scope until core reaches parity

---

## License

MIT — see [LICENSE](./LICENSE).
