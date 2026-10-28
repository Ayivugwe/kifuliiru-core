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

Maintainers: [docs/INSTRUCTIONS.md](./docs/INSTRUCTIONS.md) (porting, architecture, roadmap).

## License

MIT — see [LICENSE](./LICENSE).
