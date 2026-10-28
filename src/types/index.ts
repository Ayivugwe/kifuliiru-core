/** Shared lexicon / generation types (ported from Lab `@/types`). */

export interface ConjugationData {
  tense: string;
  person: string;
  kifuliiru: string;
  english: string;
  pattern: string;
  irregular: boolean;
}

export interface VerbData {
  verbKifuliiru: string;
  english: string;
  french: string;
  kiswahili: string;
  root: string;
  semanticCategory: string;
  isIrregular: boolean;
  canTakeDirectObject: boolean;
  requiresObject: boolean;
  verbClass: string;
  conjugations?: {
    present: ConjugationData;
    past?: ConjugationData;
    future?: ConjugationData;
  };
  metadata: {
    frequency: number;
    difficulty: "beginner" | "intermediate" | "advanced";
    usage: string[];
  };
}

export interface NumberData {
  value: number;
  kifuliiru: string;
  english: string;
  french: string;
  kiswahili: string;
  metadata: {
    length: number;
    complexity: "simple" | "complex";
    category: "basic" | "advanced";
  };
}
