"use client";

import React from "react";
import { CalculationSummary } from "@/types/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";
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
      toast.info(`Currency set to ${newCode}`);
    }
  };

  return (
    <Card className="overflow-hidden border-border/70 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <CardContent className="p-6">
        {/* Top Header & Base Currency Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selling Price
            </span>
            <Badge variant="secondary" className="text-[10px] px-2 py-0">
              {activeCount} of {totalCount} active
            </Badge>
          </div>

          {/* Apple Segmented Currency Selector */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Coins className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <div className="flex items-center rounded-xl bg-secondary/80 p-0.5 border border-border/60">
              {quickCurrencies.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCurrencySelect(c)}
                  className={`px-2 py-1 text-xs font-medium rounded-lg transition-all duration-120 active:scale-95 ${
                    currency === c
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}

              {/* More Currencies Dropdown */}
              <select
                value={isOtherCurrency ? currency : ""}
                onChange={(e) => {
                  if (e.target.value) handleCurrencySelect(e.target.value);
                }}
                className={`px-2 py-1 text-xs font-medium rounded-lg bg-transparent border-0 cursor-pointer focus:outline-none transition-colors ${
                  isOtherCurrency
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="More currencies"
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
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hero Display */}
        <div className="py-6">
          <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground tabular-nums font-mono">
            {formatCurrency(summary.finalSellPrice, currency)}
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              {formatPercent(summary.grossMarginPct)} Profit Margin
            </span>

            {summary.netProfit > 0 && (
              <span className="text-xs text-muted-foreground">
                +{formatCurrency(summary.netProfit, currency)} per unit
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Suggested price based on your cost items.
          </p>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
          {/* Total Cost */}
          <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              Total Cost
            </div>
            <div className="text-base font-semibold text-foreground tabular-nums font-mono mt-1">
              {formatCurrency(summary.totalCost, currency)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Cost basis
            </div>
          </div>

          {/* Profit */}
          <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              Profit
            </div>
            <div className="text-base font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono mt-1">
              {formatCurrency(summary.netProfit, currency)}
            </div>
            <div className="text-[10px] text-emerald-600/75 dark:text-emerald-400/75 mt-0.5">
              Net return
            </div>
          </div>

          {/* Margin */}
          <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
            <div className="text-[11px] font-medium text-primary uppercase tracking-wider flex items-center gap-1">
              <PieChart className="h-3 w-3 text-primary" />
              Margin
            </div>
            <div className="text-base font-semibold text-foreground tabular-nums font-mono mt-1">
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
