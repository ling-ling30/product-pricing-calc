import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { convertAmount, FALLBACK_RATES } from "./fx.service";

describe("FX Service", () => {
  it("should convert USD to IDR accurately", () => {
    const rates = { USD: 1, IDR: 16000 };
    const { convertedAmount, effectiveRate } = convertAmount(10, "USD", "IDR", rates);
    assert.equal(convertedAmount, 160000);
    assert.equal(effectiveRate, 16000);
  });

  it("should convert IDR to USD accurately", () => {
    const rates = { USD: 1, IDR: 16000 };
    const { convertedAmount, effectiveRate } = convertAmount(160000, "IDR", "USD", rates);
    assert.equal(convertedAmount, 10);
    assert.equal(effectiveRate, 1 / 16000);
  });

  it("should apply buffer percentage correctly", () => {
    const rates = { USD: 1, IDR: 10000 };
    // With 2% buffer, rate should be 10200
    const { convertedAmount, effectiveRate } = convertAmount(10, "USD", "IDR", rates, 2);
    assert.equal(convertedAmount, 102000);
    assert.equal(effectiveRate, 10200);
  });
});
