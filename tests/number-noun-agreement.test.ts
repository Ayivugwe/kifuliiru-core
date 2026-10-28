import { describe, expect, it } from "vitest";
import { generateNumberNoun } from "../src/numbers/number-noun-agreement.js";
import { singularToPlural } from "../src/noun-pluralizer.js";

describe("number–noun agreement", () => {
  it("applies class prefix for small counts", () => {
    expect(generateNumberNoun("umuundu", 1)).toMatch(/guma$/);
    expect(generateNumberNoun("umuundu", 2)).toMatch(/biri$/);
  });

  it("pluralizer supports agreement pipeline", () => {
    expect(singularToPlural("umuundu")).toBeTruthy();
  });
});
