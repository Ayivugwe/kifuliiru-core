# @wekify/kifuliiru-core

TypeScript library for Kifuliiru linguistics: numbers, verbs, grammar, phonetics, and sentences.

## Install

```bash
npm install @wekify/kifuliiru-core
```

## Usage

```ts
import {
  kifuliiruNumbers,
  grammarEngine,
  generateKpg,
  kifuliiruConjugationEngine,
  kifuliiruVerbs,
  KifuliiruSentenceGenerator,
} from "@wekify/kifuliiru-core";

kifuliiruNumbers.numberToKifuliiru(42);
generateKpg("ndugu");
```

API surface grows as modules are implemented; see published types in `dist/index.d.ts` after `npm run build`.

## Development

```bash
npm install
npm run build
npm test
npm run typecheck
```

## Documentation

- **This package:** API types in `dist/index.d.ts` after `npm run build`; maintainer notes in [docs/INSTRUCTIONS.md](./docs/INSTRUCTIONS.md).
- **Engine formulas (plain language):** in the **Kifuliiru Lab** app (`kifuliiru-data-generators`) at **`/docs`** — not duplicated in this repo.

## License

MIT — see [LICENSE](./LICENSE).
