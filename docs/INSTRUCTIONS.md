# Maintainer instructions

Workflow, Lab porting, and architecture notes for this repo. **Not** the public package readme — see [README.md](../README.md) for npm/GitHub visitors.

---

## Working agreement (current phase)

**`kifuliiru-data-generators` is not modified while we build this package.** It is a **read-only reference**: copy and refactor logic from paths like `src/lib/core/` and `src/lib/phonetics/` into `kifuliiru-core`, add tests here, and strip Next/Supabase/`@/` imports. No Lab dependency on this npm package, no API rewires, no monorepo link—until we explicitly decide otherwise later.

Local Lab checkout (adjust path): `D:\Projects\kifuliiru-data-generators`

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
  numbers/
  verbs/
  grammar/
  phonetics/
  sentences/
  index.ts       # Public API only
tests/
```

Build: ESM + `.d.ts` in `dist/` via tsup.

---

## Ecosystem (reference)

| Project | Role |
| -------- | ----- |
| kifuliiru-data-generators (Lab) | Authoring UI, bulk generation, Supabase publish, export |
| @wekify/kifuliiru-core (this repo) | Pure algorithms + types |
| @wekify/kifuliiru-react (planned) | UI on top of core |
| kifuliiru.com / Tabula / KEd | Published corpus, community, books |

---

## Where data comes from (engines vs corpus)

### 1. In **core** (code or tiny static tables)

| Engine | Lab module(s) | Data shape |
| ------ | ------------- | ---------- |
| Numbers | `src/lib/core/numbers.ts` | Embedded lexicon + composition rules |
| Conjugation | `src/lib/core/conjugation.ts`, `conjugation/*` | Paradigms; **verb rows passed in** |
| Grammar | `src/lib/core/grammar.ts` | Static in-code structures |
| KPG phonetics | `src/lib/phonetics/kpg-engine.ts`, `kp-rules.ts` | Rules; text in, notation out |
| Math (light) | `src/lib/core/math.ts` | Operation + range config |
| Validation / QC | `validation.ts`, `quality-control.ts` | Pure functions |

Target: **dependency-free** (no `@/`, Supabase, Next). **Lexicon / verb rows are not bundled** — host apps pass `KifuliiruVerbs`, `SentenceLexicon`, etc.

### 2. **Inputs** to engines (not in core by default)

| Seed | Source | Used by |
| ---- | ------ | ------- |
| Verb lexicon | lab_* / verbs, CSV | Conjugation, sentences, quiz |
| Dictionary POS | dictionary_* | Sentences, semantics |
| Conjugation rules | conjugation_rules | Bulk conjugation |
| Semantics | semantics_dictionary | Constrained generation |
| Sentence patterns | DB + sentences.ts | Bulk sentences |
| Conversations | templates + vocabulary | Dialogues |

Design: `conjugate(verb: VerbSeed, …)`, `generateSentence(pattern, slots)` with plain types; callers load DB/JSON.

Optional later: `@wekify/kifuliiru-data` JSON snapshots.

### 3. Stays in **Lab** (not core)

- `mass-generator.ts`, `data-generator.ts`, Puppeteer, Python scripts
- Supabase mapper, publish-to-cloud, AI enrichment
- `src/app/api/*`, data-generation pages
- `data-engines-catalog.ts`, `lab-engines-registry.ts`

Checklists: read `LAB_ENGINES` and `DATA_ENGINES` in Lab; **do not edit Lab** during porting.

---

## Suggested port order

1. **Numbers** — `KifuliiruNumbers` in `numbers.ts`
2. **Phonetics (KPG)** — `kpg-engine`, `kp-rules`
3. **Grammar** — `grammar.ts`
4. **Conjugation** — `KifuliiruConjugationEngine` in `conjugation.ts` (catalog may say `kifuliiru-conjugation-engine.ts`; use `conjugation.ts` as source of truth)
5. **Sentences** — combinatorics; templates stay external
6. **Quiz / math** — if shared across apps

After each slice: match Lab behavior; changes **only in this repo**.

---

## Tooling notes

- `.npmrc`: `legacy-peer-deps=true` if npm hits `edgesOut` on Vitest 4
- TypeScript **~5.8** — tsup `.dts` unreliable on TS 7

---

## Publishing (when ready)

1. `@wekify` scope on npm
2. Bump semver in `package.json`
3. `npm run build && npm test`
4. `npm publish --access public`

---

## Architecture notes

### Sentences: results vs products

- **Result** (`tier: "result"`): combinatorial / pattern output; may fail semantic rules after retries.
- **Product** (`tier: "product"`, `semanticallyValid: true`): passed `semanticRules` — treat as finished corpus lines in apps.
- Apps store products in published tables; results stay in bulk / QA pipelines.

### Display rules (formulas → page text)

- Use `collectCoreDisplayRules()` / `groupDisplayRulesByEngine()` from `src/rules/display-rules.ts`.
- Each row: `formula` (notation) + `summary` (human text) for `/rules`-style pages.
- DB-backed rule previews (conjugation rows, number_nouns_agreement_rules) stay in the app; core ships code-derived rules only.

### Interactive helpers (from Lab `src/lib/kifuliiru/`)

- **In core:** noun pluralizer (`src/noun-pluralizer.ts`).
- **Later:** translator helpers, text analyzer logic — port when needed; UI stays in apps.

### Number + noun agreement

- Algorithm: `src/numbers/number-noun-agreement.ts` (uses pluralizer + agreement suffixes).
- Dictionary + `number_nouns_agreement_rules` tables remain in Lab/DB; pass rows for admin UI only.

---

## Roadmap

- [x] Port numbers + tests (`src/numbers/kifuliiru-numbers.ts`)
- [x] Port KPG + tests (`src/phonetics/`)
- [x] Port conjugation + `VerbData` types (`src/verbs/`, `src/types/`)
- [x] Port grammar (`src/grammar/kifuliiru-grammar.ts`)
- [x] Port sentence generator (`src/sentences/kifuliiru-sentences.ts`)
- [ ] Port math / quiz / validation (optional; still in Lab only)
- [ ] Trim debug `console.log` from ported modules when stabilizing API
- [ ] (Later) Lab consumes package — out of scope until parity
