/** Lexicon slots supplied by the host app (Lab, site, JSON) — not shipped in core. */

export interface SentenceNounEntry {
  class?: string;
  plural?: string;
  english: string;
  semantic: string[];
}

export type SentenceNounGroups = Record<string, Record<string, SentenceNounEntry>>;

export interface SentenceWordEntry {
  kifuliiru: string;
  english: string;
  semantic?: string[];
  appliesTo?: string[];
}

export type SentenceWordMap = Record<string, SentenceWordEntry>;

export interface SentenceLexicon {
  nouns: SentenceNounGroups;
  adjectives: SentenceWordMap;
  adverbs: SentenceWordMap;
  questionWords: Record<string, { kifuliiru: string; english: string }>;
  placeAdverbs: Record<string, { kifuliiru: string; english: string }>;
  timeAdverbs: Record<string, { kifuliiru: string; english: string }>;
}

export interface VerbSemanticRule {
  requires?: string[];
  objects?: string[];
  description?: string;
}

export type VerbSemanticRules = Record<string, VerbSemanticRule>;

export const EMPTY_SENTENCE_LEXICON: SentenceLexicon = {
  nouns: {},
  adjectives: {},
  adverbs: {},
  questionWords: {},
  placeAdverbs: {},
  timeAdverbs: {},
};
