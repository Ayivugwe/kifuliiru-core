import { describe, expect, it } from "vitest";
import {
  PACKAGE_NAME,
  VERSION,
  grammar,
  numbers,
  phonetics,
  sentences,
  verbs,
} from "../src/index.js";

describe("@wekify/kifuliiru-core", () => {
  it("exposes package metadata", () => {
    expect(PACKAGE_NAME).toBe("@wekify/kifuliiru-core");
    expect(VERSION).toBe("0.1.0");
  });

  it("exposes domain modules", () => {
    expect(numbers.name).toBe("numbers");
    expect(verbs.name).toBe("verbs");
    expect(grammar.name).toBe("grammar");
    expect(phonetics.name).toBe("phonetics");
    expect(sentences.name).toBe("sentences");
  });
});
