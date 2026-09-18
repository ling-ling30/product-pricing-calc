"use client";

import React from "react";
import { CalculationSummary } from "@/types/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, DollarSign, PieChart, ShieldCheck } from "lucide-react";

interface PriceSummaryHeroProps {
  summary: CalculationSummary;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  activeCount: number;
  totalCount: number;
}

const SUPPORTED_CURRENCIES = [
  { code: "USD", label: "USD ($)" },
  { code: "IDR", label: "IDR (Rp)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "SGD", label: "SGD ($)" },
];

export function PriceSummaryHero({
  summary,
  currency,
  onCurrencyChange,
  activeCount,
  totalCount,
}: PriceSummaryHeroProps) {
  return (
    <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 shadow-md">
      <CardContent className="p-6">
        {/* Top Header & Currency Switcher */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Final Quoted Price
            </span>
            <Badge variant="secondary" className="text-[10px] px-2 py-0">
              {activeCount} of {totalCount} active
            </Badge>
          </div>

          {/* Currency Pill Selector */}
          <div className="flex items-center rounded-lg bg-secondary/80 p-0.5 border border-border/60">
            {SUPPORTED_CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => onCurrencyChange(c.code)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-160 active:scale-95 ${
                  currency === c.code
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Price Display */}
        <div className="py-6">
          <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground tabular-nums font-mono">
            {formatCurrency(summary.finalSellPrice, currency)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>Recommended customer selling price per unit</span>
            <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/60" />
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {formatPercent(summary.grossMarginPct)} Gross Margin
            </span>
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/60">
          {/* Direct Total Cost */}
          <div className="p-3 rounded-xl bg-background border border-border/60">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              Total Cost
            </div>
            <div className="text-base font-bold text-foreground tabular-nums font-mono mt-1">
              {formatCurrency(summary.totalCost, currency)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Accumulated costs
            </div>
          </div>

          {/* Net Commercial Profit */}
          <div className="p-3 rounded-xl bg-background border border-border/60">
            <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              Net Profit
            </div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums font-mono mt-1">
              {formatCurrency(summary.netProfit, currency)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Price minus cost
            </div>
          </div>

          {/* Margin & Markup Rates */}
          <div className="p-3 rounded-xl bg-background border border-border/60">
            <div className="text-[11px] font-medium text-accent uppercase tracking-wider flex items-center gap-1">
              <PieChart className="h-3 w-3 text-accent" />
              Margin / Markup
            </div>
            <div className="text-base font-bold text-foreground tabular-nums font-mono mt-1">
              {formatPercent(summary.grossMarginPct)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Markup: {formatPercent(summary.markupPct)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
