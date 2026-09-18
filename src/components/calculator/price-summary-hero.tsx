"use client";

import React from "react";
import { CalculationSummary } from "@/types/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from "@/lib/currencies";
import { TrendingUp, DollarSign, PieChart, Coins } from "lucide-react";
import { toast } from "sonner";

interface PriceSummaryHeroProps {
  summary: CalculationSummary;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  activeCount: number;
  totalCount: number;
}

export function PriceSummaryHero({
  summary,
  currency,
  onCurrencyChange,
  activeCount,
  totalCount,
}: PriceSummaryHeroProps) {
  const quickCurrencies = ["USD", "IDR", "EUR", "GBP", "SGD"];
  const isOtherCurrency = !quickCurrencies.includes(currency);
  const handleCurrencySelect = (newCode: string) => {
    if (newCode && newCode !== currency) {
      onCurrencyChange(newCode);
      toast.info(`Base currency set to ${newCode}`);
    }
  };

  return (
    <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 shadow-md">
      <CardContent className="p-6">
        {/* Top Header & Base Currency Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Final Quoted Price
            </span>
            <Badge variant="secondary" className="text-[10px] px-2 py-0">
              {activeCount} of {totalCount} active
            </Badge>
          </div>

          {/* Base Currency Selector */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Coins className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground font-medium hidden xs:inline">
              Base Currency:
            </span>

            {/* Quick-select pills */}
            <div className="flex items-center rounded-lg bg-secondary/80 p-0.5 border border-border/60">
              {quickCurrencies.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCurrencySelect(c)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-160 active:scale-95 ${
                    currency === c
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}

              {/* Extended Currencies Dropdown */}
              <select
                value={isOtherCurrency ? currency : ""}
                onChange={(e) => {
                  if (e.target.value) handleCurrencySelect(e.target.value);
                }}
                className={`px-2 py-1 text-xs font-medium rounded-md bg-transparent border-0 cursor-pointer focus:outline-none transition-colors ${
                  isOtherCurrency
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Select other currency"
              >
                <option value="" disabled className="bg-popover text-popover-foreground">
                  {isOtherCurrency ? currency : "More..."}
                </option>
                {SUPPORTED_CURRENCIES.filter((c) => !quickCurrencies.includes(c.code)).map((c) => (
                  <option
                    key={c.code}
                    value={c.code}
                    className="bg-popover text-popover-foreground"
                  >
                    {c.code} ({c.symbol}) - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hero Price Display */}
        <div className="py-6">
          <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground tabular-nums font-mono">
            {formatCurrency(summary.finalSellPrice, currency)}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              {formatPercent(summary.grossMarginPct)} Gross Margin
            </span>

            {summary.netProfit > 0 && (
              <span className="text-xs text-muted-foreground">
                +{formatCurrency(summary.netProfit, currency)} profit/unit
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            Quoted per unit based on itemized cost model
          </div>
        </div>

        {/* Metric Grid with Tabular Numerals */}
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
              Cost basis
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
            <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
              Commercial return
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
