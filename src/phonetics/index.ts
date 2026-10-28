export type { KpDocumentedRule, KpRuleStatus, KpUnit, KpgGenerateResult } from "./types.js";
export {
  GLIDE_ONSETS,
  KP_DOCUMENTED_RULES,
  LONG_VOWELS,
  ONSET_RULE_SUMMARY,
  PRENASALIZED_IPA,
  PRENASALIZED_ONSETS,
  SINGLE_GRAPHEME_IPA,
  SWAHILI_DIGRAPHS,
  buildGlideOnsets,
  buildPrenasalizedOnsets,
  getTokenPatterns,
  ipaForPrenasalized,
  type GraphemeRule,
} from "./kp-rules.js";
export {
  generate,
  generateKpg,
  practicalForSource,
  syllabify,
  tokenize,
} from "./kpg-engine.js";
