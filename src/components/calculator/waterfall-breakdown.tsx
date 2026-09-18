"use client";

import React, { useState } from "react";
import { CalculationSummary } from "@/types/calculator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Copy, Check, Layers } from "lucide-react";
import { toast } from "sonner";

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
    let text = `Price Breakdown\n`;
    text += `----------------------------------------\n`;

    summary.lines.forEach((line, idx) => {
      if (line.enabled) {
        text += `${idx + 1}. ${line.name}: +${formatCurrency(
          line.monetaryValue,
          currency
        )}${line.referenceDetail ? ` (${line.referenceDetail})` : ""}\n`;
      }
    });

    text += `----------------------------------------\n`;
    text += `Total Cost:    ${formatCurrency(summary.totalCost, currency)}\n`;
    text += `Selling Price: ${formatCurrency(summary.finalSellPrice, currency)}\n`;
    text += `Profit:        ${formatCurrency(summary.netProfit, currency)} (${formatPercent(
      summary.grossMarginPct
    )} Margin)\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Breakdown copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const finalTotal = summary.finalSellPrice || 1;

  return (
    <Card className="border-border/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Cost Breakdown
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            See how your price is built.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyQuote}
          className="text-xs font-normal"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Apple Harmonious Stacked Bar */}
        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded-full bg-secondary/80 overflow-hidden flex">
            {summary.lines
              .filter((l) => l.enabled && l.monetaryValue > 0)
              .map((line, idx) => {
                const pctOfTotal = (line.monetaryValue / finalTotal) * 100;
                // Apple palette: soft indigo, blue, teal, emerald, amber
                const colors = [
                  "bg-blue-600 dark:bg-blue-500",
                  "bg-indigo-500 dark:bg-indigo-400",
                  "bg-teal-500 dark:bg-teal-400",
                  "bg-sky-500 dark:bg-sky-400",
                  "bg-emerald-500 dark:bg-emerald-400",
                  "bg-amber-500 dark:bg-amber-400",
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
          <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>Cost: {formatCurrency(summary.totalCost, currency)}</span>
            <span>Price: {formatCurrency(summary.finalSellPrice, currency)}</span>
          </div>
        </div>

        {/* Breakdown Line Items */}
        <div className="divide-y divide-border/40 text-xs">
          {summary.lines.map((line) => {
            const pct = (line.monetaryValue / finalTotal) * 100;
            const isProfitComponent =
              line.type === "margin" || line.type === "markup";

            return (
              <div
                key={line.componentId}
                className={`py-2 flex items-center justify-between gap-3 ${
                  line.enabled ? "" : "opacity-40"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground truncate">
                      {line.name}
                    </span>
                    <Badge
                      variant={isProfitComponent ? "success" : "secondary"}
                      className="text-[9px] px-1.5 py-0 rounded-md"
                    >
                      {line.type === "fixed"
                        ? "Fixed"
                        : line.type === "pct_subtotal"
                        ? "% Subtotal"
                        : line.type === "pct_component"
                        ? "% Item"
                        : line.type === "margin"
                        ? "Margin"
                        : "Markup"}
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
                    className={`font-medium tabular-nums font-mono ${
                      isProfitComponent
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    {line.enabled ? (
                      <>
                        {line.monetaryValue >= 0 ? "+" : ""}
                        {formatCurrency(line.monetaryValue, currency)}
                      </>
                    ) : (
                      "Off"
                    )}
                  </div>
                  {line.enabled && (
                    <div className="text-[10px] text-muted-foreground tabular-nums">
                      {pct.toFixed(1)}% of price
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
