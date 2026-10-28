/**
 * Sentence outputs: combinatorial "results" vs semantically validated "products".
 * Apps may persist only products; results are exploratory / bulk pipeline output.
 */

import type { SentenceData } from "./kifuliiru-sentences.js";

export type SentenceTier = "result" | "product";

export type SentenceDataWithTier = SentenceData & {
  tier: SentenceTier;
  /** True when semanticRules validation passed (products). */
  semanticallyValid: boolean;
};

export function isSentenceProduct(
  sentence: SentenceDataWithTier,
): sentence is SentenceDataWithTier & { tier: "product" } {
  return sentence.tier === "product" && sentence.semanticallyValid;
}

export function asDisplaySentence(s: SentenceDataWithTier): string {
  return s.kifuliiru;
}
