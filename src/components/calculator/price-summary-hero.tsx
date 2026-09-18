"use client";

import React from "react";
import { CalculationSummary } from "@/types/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, DollarSign, PieChart, ArrowRightLeft } from "lucide-react";

interface PriceSummaryHeroProps {
  summary: CalculationSummary;
  currency: string;
  targetCurrency: string;
  convertedSellPrice: number;
  convertedTotalCost: number;
  convertedNetProfit: number;
  effectiveRate: number;
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
  targetCurrency,
  convertedSellPrice,
  convertedTotalCost,
  convertedNetProfit,
  effectiveRate,
  onCurrencyChange,
  activeCount,
  totalCount,
}: PriceSummaryHeroProps) {
  return (
    <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 shadow-md">
      <CardContent className="p-6">
        {/* Top Header & Base Currency Switcher */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Final Quoted Price
            </span>
            <Badge variant="secondary" className="text-[10px] px-2 py-0">
              {activeCount} of {totalCount} active
            </Badge>
          </div>

          {/* Base Currency Pill Selector */}
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

        {/* Hero Price Display with Real-Time Dual Conversion */}
        <div className="py-6">
          <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground tabular-nums font-mono">
            {formatCurrency(summary.finalSellPrice, currency)}
          </div>

          {/* Real-time Converted Price Equivalent */}
          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/15 border border-accent/30 text-accent text-sm font-semibold tabular-nums font-mono">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>
                {formatCurrency(convertedSellPrice, targetCurrency)}
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">
                ({targetCurrency})
              </span>
            </div>

            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              {formatPercent(summary.grossMarginPct)} Gross Margin
            </span>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            Quoted per unit • Real-time live converted rate
          </div>
        </div>

        {/* Metric Grid with Dual-Currency Tabular Numerals */}
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
            <div className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
              ≈ {formatCurrency(convertedTotalCost, targetCurrency)}
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
            <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 tabular-nums mt-0.5">
              ≈ {formatCurrency(convertedNetProfit, targetCurrency)}
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
