import type { SentenceLexicon, VerbSemanticRules } from "../../src/types/sentence-lexicon.js";

export const sampleLexicon: SentenceLexicon = {
  nouns: {
    people: {
      umuundu: {
        class: "BA-",
        plural: "Bandu",
        english: "person",
        semantic: ["human", "animate", "living", "adult"],
      },
    },
  },
  adjectives: {
    good: {
      kifuliiru: "mwija",
      english: "good",
      semantic: ["abstract"],
      appliesTo: ["human", "object"],
    },
  },
  adverbs: {
    now: {
      kifuliiru: "bwobuno",
      english: "now",
      semantic: ["abstract"],
      appliesTo: ["animate"],
    },
  },
  questionWords: {
    what: { kifuliiru: "biki", english: "what" },
  },
  placeAdverbs: {
    here: { kifuliiru: "hano", english: "here" },
  },
  timeAdverbs: {
    today: { kifuliiru: "zeene", english: "today" },
  },
};

export const sampleSemanticRules: VerbSemanticRules = {
  ukukola: {
    requires: ["human"],
    description: "Only humans can work",
  },
};
