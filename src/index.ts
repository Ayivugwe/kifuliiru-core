export type { ConjugationData, NumberData, VerbData } from "./types/index.js";
export type {
  SentenceLexicon,
  SentenceNounEntry,
  SentenceWordEntry,
  VerbSemanticRule,
  VerbSemanticRules,
} from "./types/sentence-lexicon.js";
export { EMPTY_SENTENCE_LEXICON } from "./types/sentence-lexicon.js";

export {
  KifuliiruNumbers,
  kifuliiruNumbers,
  buildNumberNounPhrase,
  generateNumberNoun,
  getNounClassPrefix,
  getNumberWordForAgreement,
  type NumberNounPhrase,
} from "./numbers/index.js";

export {
  detectNounGroup,
  singularToPlural,
  pluralToSingular,
  isLikelyPlural,
  getAllNounGroups,
  getNounGroupInfo,
  NOUN_GROUPS,
  type NounGroup,
} from "./noun-pluralizer.js";

export {
  KifuliiruGrammar,
  grammarEngine,
  type GrammarCategory,
  type GrammarData,
  type GrammarElement,
} from "./grammar/index.js";

export {
  generateKpg,
  tokenize,
  syllabify,
  practicalForSource,
  KP_DOCUMENTED_RULES,
  type KpUnit,
  type KpgGenerateResult,
} from "./phonetics/index.js";

export {
  KifuliiruVerb,
  KifuliiruVerbs,
  kifuliiruVerbs,
  KifuliiruConjugationEngine,
  kifuliiruConjugationEngine,
  type ConjugationResult,
  type ConjugationTable,
  type Person,
  type Tense,
} from "./verbs/index.js";

export {
  KifuliiruSentenceGenerator,
  type SentenceData,
  type SentenceGeneratorOptions,
  type SentenceTemplate,
} from "./sentences/index.js";

export const PACKAGE_NAME = "@wekify/kifuliiru-core" as const;
export const VERSION = "0.1.1" as const;
