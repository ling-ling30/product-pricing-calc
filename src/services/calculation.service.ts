import {
  CalculationLineResult,
  CalculationSummary,
  PricingComponent,
} from "@/types/calculator";

/**
 * Pure Functional Calculation Service
 * Evaluates a sequence of pricing components (fixed amounts, subtotal percentages,
 * component-relative percentages, markups, and gross margins).
 */
export function calculatePricing(
  components: PricingComponent[],
  currency: string = "USD"
): CalculationSummary {
  let runningSubtotal = 0;
  let baseCost = 0;
  const lines: CalculationLineResult[] = [];
  const linesById = new Map<string, CalculationLineResult>();

  // Track whether we've passed the cost-building phase into profit/margin phase
  let accumulatedCostBeforeMargins = 0;
  let hasMarginOrMarkup = false;

  for (const comp of components) {
    if (!comp.enabled) {
      const inactiveLine: CalculationLineResult = {
        componentId: comp.id,
        name: comp.name,
        type: comp.type,
        inputValue: comp.value,
        monetaryValue: 0,
        subtotalAfter: runningSubtotal,
        enabled: false,
        referenceDetail: "Disabled",
      };
      lines.push(inactiveLine);
      linesById.set(comp.id, inactiveLine);
      continue;
    }

    let monetaryValue = 0;
    let referenceDetail = "";

    switch (comp.type) {
      case "fixed": {
        monetaryValue = Number(comp.value) || 0;
        referenceDetail = `Fixed flat amount`;
        if (!hasMarginOrMarkup) {
          baseCost += Math.max(0, monetaryValue);
        }
        break;
      }

      case "pct_subtotal": {
        const rate = (Number(comp.value) || 0) / 100;
        monetaryValue = runningSubtotal * rate;
        referenceDetail = `${comp.value}% of subtotal ($${runningSubtotal.toFixed(2)})`;
        break;
      }

      case "pct_component": {
        const target = comp.targetComponentId
          ? linesById.get(comp.targetComponentId)
          : undefined;

        const targetBase = target ? target.monetaryValue : 0;
        const rate = (Number(comp.value) || 0) / 100;
        monetaryValue = targetBase * rate;
        referenceDetail = target
          ? `${comp.value}% of ${target.name} ($${targetBase.toFixed(2)})`
          : `${comp.value}% of referenced item (not found)`;
        break;
      }

      case "markup": {
        if (!hasMarginOrMarkup) {
          accumulatedCostBeforeMargins = runningSubtotal;
          hasMarginOrMarkup = true;
        }
        const rate = (Number(comp.value) || 0) / 100;
        monetaryValue = runningSubtotal * rate;
        referenceDetail = `${comp.value}% markup on accumulated cost`;
        break;
      }

      case "margin": {
        if (!hasMarginOrMarkup) {
          accumulatedCostBeforeMargins = runningSubtotal;
          hasMarginOrMarkup = true;
        }
        // Gross Margin Formula: SellPrice = Cost / (1 - Margin%)
        // Profit = SellPrice - Cost
        const marginPct = Math.min(99, Math.max(0, Number(comp.value) || 0)) / 100;
        if (marginPct < 1 && runningSubtotal > 0) {
          const sellPrice = runningSubtotal / (1 - marginPct);
          monetaryValue = sellPrice - runningSubtotal;
        } else {
          monetaryValue = 0;
        }
        referenceDetail = `${comp.value}% target gross margin`;
        break;
      }
    }

    runningSubtotal += monetaryValue;

    const lineResult: CalculationLineResult = {
      componentId: comp.id,
      name: comp.name || "Untitled Component",
      type: comp.type,
      inputValue: comp.value,
      monetaryValue,
      subtotalAfter: runningSubtotal,
      enabled: true,
      referenceDetail,
    };

    lines.push(lineResult);
    linesById.set(comp.id, lineResult);
  }

  // If no explicit margin or markup component was present, total cost equals final subtotal
  const totalCost = hasMarginOrMarkup
    ? accumulatedCostBeforeMargins
    : runningSubtotal;

  const finalSellPrice = Math.max(0, runningSubtotal);
  const netProfit = Math.max(0, finalSellPrice - totalCost);
  const grossMarginPct =
    finalSellPrice > 0 ? (netProfit / finalSellPrice) * 100 : 0;
  const markupPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return {
    lines,
    baseCost,
    totalCost,
    finalSellPrice,
    netProfit,
    grossMarginPct,
    markupPct,
    currency,
  };
}

/**
 * Default starter templates for new users
 */
export const DEFAULT_COMPONENTS: PricingComponent[] = [
  {
    id: "c-material",
    name: "Raw Material (Green Coffee)",
    type: "fixed",
    value: 10.5,
    enabled: true,
    category: "material",
  },
  {
    id: "c-processing",
    name: "Processing & Roasting Loss",
    type: "pct_component",
    value: 16.0,
    targetComponentId: "c-material",
    enabled: true,
    category: "overhead",
  },
  {
    id: "c-packaging",
    name: "Degassing Valve Bag & Carton",
    type: "fixed",
    value: 0.85,
    enabled: true,
    category: "material",
  },
  {
    id: "c-labor",
    name: "Direct Labor & Packing",
    type: "fixed",
    value: 1.2,
    enabled: true,
    category: "labor",
  },
  {
    id: "c-logistics",
    name: "Export Handling & Forwarder (FOB)",
    type: "fixed",
    value: 1.8,
    enabled: true,
    category: "logistics",
  },
  {
    id: "c-margin",
    name: "Target Commercial Margin",
    type: "margin",
    value: 25.0,
    enabled: true,
    category: "profit",
  },
];
