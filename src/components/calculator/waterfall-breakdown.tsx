"use client";

import React from "react";
import { CalculationSummary } from "@/types/calculator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Layers, Activity } from "lucide-react";

interface WaterfallBreakdownProps {
  summary: CalculationSummary;
  currency: string;
}

export function WaterfallBreakdown({
  summary,
  currency,
}: WaterfallBreakdownProps) {
  const finalTotal = summary.finalSellPrice || 1;
  const activeLines = summary.lines.filter((l) => l.enabled && l.monetaryValue > 0);

  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3 border-b border-border/70">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <Activity className="h-4 w-4 text-primary" />
            Cost Distribution Waterfall
          </CardTitle>
          <span className="text-xs font-mono font-semibold text-muted-foreground">
            {activeLines.length} active layers
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Multi-Segment Proportion Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden flex border border-border">
            {activeLines.map((line, idx) => {
              const pct = (line.monetaryValue / finalTotal) * 100;
              const isProfit = line.type === "margin" || line.type === "markup";
              return (
                <div
                  key={line.componentId}
                  style={{ width: `${Math.max(1, pct)}%` }}
                  className={`${isProfit ? "bg-emerald-500" : colors[idx % colors.length]} transition-all duration-200`}
                  title={`${line.name}: ${formatCurrency(line.monetaryValue, currency)} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] font-mono text-muted-foreground font-semibold">
            <span>0%</span>
            <span>50%</span>
            <span>100% ({formatCurrency(summary.finalSellPrice, currency)})</span>
          </div>
        </div>

        {/* Step-by-Step Waterfall List */}
        <div className="space-y-2 divide-y divide-border/40">
          {summary.lines.map((line, idx) => {
            if (!line.enabled) return null;
            const pctOfTotal = (line.monetaryValue / finalTotal) * 100;
            const isProfit = line.type === "margin" || line.type === "markup";

            return (
              <div
                key={line.componentId}
                className="pt-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isProfit ? "bg-emerald-400" : colors[idx % colors.length]
                    }`}
                  />
                  <div className="truncate">
                    <span className="font-semibold text-foreground">
                      {line.name}
                    </span>
                    {line.referenceDetail && (
                      <span className="text-[10px] text-muted-foreground ml-1.5 font-mono">
                        ({line.referenceDetail})
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono ml-3">
                  <div
                    className={`font-bold ${
                      isProfit ? "text-emerald-400" : "text-foreground"
                    }`}
                  >
                    +{formatCurrency(line.monetaryValue, currency)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {pctOfTotal.toFixed(1)}% of price
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
