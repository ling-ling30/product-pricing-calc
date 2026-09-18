"use client";

import React, { useState } from "react";
import { CalculationSummary } from "@/types/calculator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Copy, Check, Layers } from "lucide-react";

interface WaterfallBreakdownProps {
  summary: CalculationSummary;
  currency: string;
}

export function WaterfallBreakdown({
  summary,
  currency,
}: WaterfallBreakdownProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyQuote = () => {
    let text = `========================================\n`;
    text += `COMMERCIAL PRICE QUOTE & BREAKDOWN\n`;
    text += `========================================\n\n`;

    summary.lines.forEach((line, idx) => {
      if (line.enabled) {
        text += `${idx + 1}. ${line.name}: +${formatCurrency(
          line.monetaryValue,
          currency
        )}${line.referenceDetail ? ` (${line.referenceDetail})` : ""}\n`;
      }
    });

    text += `\n----------------------------------------\n`;
    text += `Total Cost: ${formatCurrency(summary.totalCost, currency)}\n`;
    text += `FINAL SELLING PRICE: ${formatCurrency(
      summary.finalSellPrice,
      currency
    )}\n`;
    text += `Net Commercial Profit: ${formatCurrency(
      summary.netProfit,
      currency
    )} (${formatPercent(summary.grossMarginPct)} Margin / ${formatPercent(
      summary.markupPct
    )} Markup)\n`;
    text += `========================================\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finalTotal = summary.finalSellPrice || 1;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Cost Waterfall & Build-up
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step-by-step contribution to final selling price.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyQuote}
          className="text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy Price Breakdown
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Waterfall Stacked Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden flex shadow-inner">
            {summary.lines
              .filter((l) => l.enabled && l.monetaryValue > 0)
              .map((line, idx) => {
                const pctOfTotal = (line.monetaryValue / finalTotal) * 100;
                const colors = [
                  "bg-amber-700 dark:bg-amber-600",
                  "bg-amber-600 dark:bg-amber-500",
                  "bg-amber-500 dark:bg-amber-400",
                  "bg-stone-500 dark:bg-stone-400",
                  "bg-stone-400 dark:bg-stone-500",
                  "bg-emerald-600 dark:bg-emerald-500",
                  "bg-teal-600 dark:bg-teal-500",
                ];
                const bg = colors[idx % colors.length];

                return (
                  <div
                    key={line.componentId}
                    style={{ width: `${Math.max(1, pctOfTotal)}%` }}
                    className={`${bg} transition-all duration-300 relative group`}
                    title={`${line.name}: ${formatCurrency(
                      line.monetaryValue,
                      currency
                    )} (${pctOfTotal.toFixed(1)}%)`}
                  />
                );
              })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
            <span>Direct Cost Basis: {formatCurrency(summary.totalCost, currency)}</span>
            <span>Final Quote: {formatCurrency(summary.finalSellPrice, currency)}</span>
          </div>
        </div>

        {/* Breakdown Line Items */}
        <div className="divide-y divide-border/60 text-xs">
          {summary.lines.map((line) => {
            const pct = (line.monetaryValue / finalTotal) * 100;
            const isProfitComponent =
              line.type === "margin" || line.type === "markup";

            return (
              <div
                key={line.componentId}
                className={`py-2.5 flex items-center justify-between gap-3 ${
                  line.enabled ? "" : "opacity-40 italic"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {line.name}
                    </span>
                    <Badge
                      variant={isProfitComponent ? "success" : "secondary"}
                      className="text-[9px] px-1.5 py-0"
                    >
                      {line.type === "fixed"
                        ? "Fixed"
                        : line.type === "pct_subtotal"
                        ? "% Subtotal"
                        : line.type === "pct_component"
                        ? "% Item"
                        : line.type === "margin"
                        ? "Margin %"
                        : "Markup %"}
                    </Badge>
                  </div>
                  {line.referenceDetail && line.enabled && (
                    <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {line.referenceDetail}
                    </div>
                  )}
                </div>

                <div className="text-right whitespace-nowrap">
                  <div
                    className={`font-semibold tabular-nums font-mono ${
                      isProfitComponent
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-foreground"
                    }`}
                  >
                    {line.enabled ? (
                      <>
                        {line.monetaryValue >= 0 ? "+" : ""}
                        {formatCurrency(line.monetaryValue, currency)}
                      </>
                    ) : (
                      "Excluded"
                    )}
                  </div>
                  {line.enabled && (
                    <div className="text-[10px] text-muted-foreground tabular-nums">
                      {pct.toFixed(1)}% of quote
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
