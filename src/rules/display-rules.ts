/**
 * Machine-oriented formulas → human-readable rule rows for docs / Lab rule pages.
 * Host apps render `summary` or `formula` + `meaning` in tables (see Lab /rules UI).
 */

import { KP_DOCUMENTED_RULES } from "../phonetics/kp-rules.js";

export type DisplayRuleStatus = "verified" | "review" | "documented" | "planned";

export interface DisplayRule {
  id: string;
  engineId: string;
  name: string;
  /** Optional formula notation (Unicode / plain math). */
  formula?: string;
  /** Primary text for UI pages. */
  summary: string;
  status: DisplayRuleStatus;
  docRef?: string;
}

export interface DisplayRuleTable {
  engineId: string;
  engineName: string;
  rules: DisplayRule[];
}

/** Flat list of core engines with displayable rules (no DB). */
export function collectCoreDisplayRules(): DisplayRule[] {
  const phonetics: DisplayRule[] = KP_DOCUMENTED_RULES.map((r) => ({
    id: `kpg-${r.id}`,
    engineId: "kpg-phonetics",
    name: r.name,
    formula: r.mapping,
    summary: r.meaning,
    status: r.status === "verified" ? "verified" : "review",
  }));

  const numbers: DisplayRule[] = [
    {
      id: "numbers-compound",
      engineId: "numerals",
      name: "Compound numeral construction",
      formula: "scale(base, multiplier) + connectors (na / ne' / n')",
      summary: "Build Kifuliiru numerals from units, tens, and scales.",
      status: "verified",
      docRef: "Lab ALL_FORMULAS.md §1",
    },
    {
      id: "numbers-negative",
      engineId: "numerals",
      name: "Negative numerals",
      formula: "Butali { |n| }",
      summary: "Prefix Butali for negative values.",
      status: "verified",
    },
  ];

  const numberNoun: DisplayRule[] = [
    {
      id: "agreement-class",
      engineId: "number-noun-agreement",
      name: "Class–number pairing",
      formula: "agree(noun_class, n) → prefix + agreement suffix | invariable",
      summary:
        "For 1–5 and 7, noun class prefix + suffix (guma, biri, …); 6, 8–10 and round tens often invariable.",
      status: "verified",
      docRef: "Lab numbers-nouns-agreement UI",
    },
  ];

  const conjugation: DisplayRule[] = [
    {
      id: "conjugation-capacity",
      engineId: "conjugation",
      name: "Conjugation capacity",
      formula: "C_max ≈ N_verbs × 240",
      summary: "14 tenses × persons × polarity/mood surfaces per verb seed.",
      status: "documented",
      docRef: "Lab CONJUGATION_CAPACITY.md",
    },
  ];

  const sentences: DisplayRule[] = [
    {
      id: "sentence-semantic-gate",
      engineId: "sentence-generator",
      name: "Semantic product gate",
      formula: "product ⇔ validateSemantic(verb, subject, object, adj)",
      summary:
        "Combinatorial output is a result; passing semantic rules marks a finished product sentence.",
      status: "verified",
    },
  ];

  return [
    ...phonetics,
    ...numbers,
    ...numberNoun,
    ...conjugation,
    ...sentences,
  ];
}

export function groupDisplayRulesByEngine(
  rules: DisplayRule[],
): DisplayRuleTable[] {
  const byEngine = new Map<string, DisplayRuleTable>();
  for (const rule of rules) {
    let table = byEngine.get(rule.engineId);
    if (!table) {
      table = {
        engineId: rule.engineId,
        engineName: rule.engineId,
        rules: [],
      };
      byEngine.set(rule.engineId, table);
    }
    table.rules.push(rule);
  }
  return [...byEngine.values()];
}
