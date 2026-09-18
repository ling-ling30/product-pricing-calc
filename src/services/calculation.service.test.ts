import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculatePricing } from "./calculation.service";
import { PricingComponent } from "@/types/calculator";

describe("Calculation Service", () => {
  it("should calculate fixed components correctly", () => {
    const components: PricingComponent[] = [
      { id: "1", name: "Material", type: "fixed", value: 50, enabled: true },
      { id: "2", name: "Labor", type: "fixed", value: 25, enabled: true },
    ];

    const result = calculatePricing(components, "USD");
    assert.equal(result.totalCost, 75);
    assert.equal(result.finalSellPrice, 75);
    assert.equal(result.netProfit, 0);
  });

  it("should calculate percentage of subtotal correctly", () => {
    const components: PricingComponent[] = [
      { id: "1", name: "Material", type: "fixed", value: 100, enabled: true },
      { id: "2", name: "Waste", type: "pct_subtotal", value: 10, enabled: true }, // +10 = 110
      { id: "3", name: "Shipping", type: "fixed", value: 10, enabled: true }, // +10 = 120
      { id: "4", name: "Handling Fee", type: "pct_subtotal", value: 5, enabled: true }, // +6 = 126
    ];

    const result = calculatePricing(components, "USD");
    assert.equal(result.lines[1].monetaryValue, 10);
    assert.equal(result.lines[3].monetaryValue, 6);
    assert.equal(result.finalSellPrice, 126);
  });

  it("should calculate percentage of target component correctly", () => {
    const components: PricingComponent[] = [
      { id: "mat", name: "Material", type: "fixed", value: 200, enabled: true },
      { id: "fee", name: "Import Duty", type: "pct_component", targetComponentId: "mat", value: 15, enabled: true }, // 15% of 200 = 30
    ];

    const result = calculatePricing(components, "USD");
    assert.equal(result.lines[1].monetaryValue, 30);
    assert.equal(result.finalSellPrice, 230);
  });

  it("should calculate target gross margin correctly", () => {
    // Total cost = 80. Target Gross Margin = 20%.
    // SellPrice = 80 / (1 - 0.20) = 100.
    // Profit = 20. Gross Margin % = 20%. Markup % = 25%.
    const components: PricingComponent[] = [
      { id: "1", name: "Cost Basis", type: "fixed", value: 80, enabled: true },
      { id: "2", name: "Target Margin", type: "margin", value: 20, enabled: true },
    ];

    const result = calculatePricing(components, "USD");
    assert.equal(result.totalCost, 80);
    assert.equal(result.finalSellPrice, 100);
    assert.equal(result.netProfit, 20);
    assert.equal(Math.round(result.grossMarginPct), 20);
    assert.equal(Math.round(result.markupPct), 25);
  });

  it("should bypass disabled components", () => {
    const components: PricingComponent[] = [
      { id: "1", name: "Cost 1", type: "fixed", value: 100, enabled: true },
      { id: "2", name: "Cost 2", type: "fixed", value: 50, enabled: false },
    ];

    const result = calculatePricing(components, "USD");
    assert.equal(result.finalSellPrice, 100);
    assert.equal(result.lines[1].monetaryValue, 0);
  });
});
