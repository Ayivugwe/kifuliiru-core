import { describe, expect, it } from "vitest";
import {
  PACKAGE_NAME,
  VERSION,
  grammarEngine,
  kifuliiruNumbers,
  generateKpg,
  KifuliiruVerbs,
  KifuliiruSentenceGenerator,
} from "../src/index.js";
import { sampleLexicon, sampleSemanticRules } from "./fixtures/sample-lexicon.js";
import { sampleVerbs } from "./fixtures/sample-verbs.js";

describe("@wekify/kifuliiru-core", () => {
  it("exposes package metadata", () => {
    expect(PACKAGE_NAME).toBe("@wekify/kifuliiru-core");
    expect(VERSION).toBe("0.1.0");
  });

  it("numbers engine matches Lab baseline", () => {
    expect(kifuliiruNumbers.numberToKifuliiru(0)).toBe("Ubusha");
    expect(kifuliiruNumbers.numberToKifuliiru(1)).toBe("Higuma");
    expect(kifuliiruNumbers.numberToKifuliiru(12)).toBe("Ikumi na bubiri");
    expect(kifuliiruNumbers.numberToKifuliiru(-3)).toBe("Butali Bushatu");
  });

  it("grammar engine loads categories", () => {
    const cats = grammarEngine.getAvailableCategories();
    expect(cats.some((c) => c.id === "pronouns")).toBe(true);
    expect(grammarEngine.getGrammarStatistics().pronouns).toBeGreaterThan(0);
  });

  it("KPG phonetics tokenizes sample words", () => {
    const r = generateKpg("mbwa");
    expect(r.practical).toContain("bh");
    expect(r.units.length).toBeGreaterThan(0);
  });

  it("verbs registry starts empty; app supplies data", () => {
    const registry = new KifuliiruVerbs();
    expect(registry.getAllVerbs()).toHaveLength(0);
    registry.setVerbs(sampleVerbs);
    expect(registry.getVerbsByCategory("action")).toHaveLength(2);
  });

  it("sentence generator requires injected lexicon", () => {
    const verbs = new KifuliiruVerbs(sampleVerbs);
    const gen = new KifuliiruSentenceGenerator({
      verbs,
      lexicon: sampleLexicon,
      semanticRules: sampleSemanticRules,
    });
    expect(gen).toBeInstanceOf(KifuliiruSentenceGenerator);
    expect(gen.generateSentences(["daily_life"], ["beginner"], 1).length).toBe(1);
  });
});
