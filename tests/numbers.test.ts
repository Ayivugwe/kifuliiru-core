import { describe, expect, it } from "vitest";
import { kifuliiruNumbers } from "../src/numbers/index.js";

describe("KifuliiruNumbers", () => {
  it("generates multilingual rows for a range", () => {
    const row = kifuliiruNumbers.generateNumberData(5, 5)[0];
    expect(row?.value).toBe(5);
    expect(row?.kifuliiru).toBe("Butanu");
    expect(row?.english).toBe("Five");
    expect(row?.metadata.category).toBe("basic");
  });

  it("handles thousands", () => {
    expect(kifuliiruNumbers.numberToKifuliiru(1000)).toBe("Kihumbi");
    expect(kifuliiruNumbers.numberToKifuliiru(2000)).toMatch(/^Bihumbi/);
  });
});
