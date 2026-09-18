import { CalculationSummary, PricingComponent } from "@/types/calculator";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function generateCommercialQuoteText(
  summary: CalculationSummary,
  components: PricingComponent[],
  currency: string,
  productName: string = "Product Price Breakdown"
): string {
  const activeLines = summary.lines.filter((l) => l.enabled && l.type !== "margin" && l.type !== "markup");
  const marginLine = summary.lines.find((l) => l.enabled && (l.type === "margin" || l.type === "markup"));

  const lines = [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `COMMERCIAL PRICING BREAKDOWN`,
    `Product: ${productName}`,
    `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`,
    `Currency: ${currency}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `COST OF GOODS & EXPENSES:`,
  ];

  activeLines.forEach((item, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    const name = item.name.padEnd(32, ".");
    const val = formatCurrency(item.monetaryValue, currency);
    lines.push(`${num}. ${name} ${val}`);
  });

  lines.push(``);
  lines.push(`─────────────────────────────────────`);
  lines.push(`Total Unit Cost (COGS) : ${formatCurrency(summary.totalCost, currency)}`);
  lines.push(`Target Profit Margin   : ${formatPercent(summary.grossMarginPct)}`);
  lines.push(`Net Profit per Unit    : +${formatCurrency(summary.netProfit, currency)}`);
  lines.push(`Markup Equivalent      : +${formatPercent(summary.markupPct)}`);
  lines.push(`─────────────────────────────────────`);
  lines.push(`RECOMMENDED PRICE      : ${formatCurrency(summary.finalSellPrice, currency)}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`Generated via hitung-harga-product.vercel.app`);

  return lines.join("\n");
}
