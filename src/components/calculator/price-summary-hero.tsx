"use client";

import React, { useState } from "react";
import { CalculationSummary, PricingComponent } from "@/types/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";
import { generateCommercialQuoteText } from "@/lib/quote-export";
import { TrendingUp, DollarSign, PieChart, Coins, Copy, Check, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

interface PriceSummaryHeroProps {
  summary: CalculationSummary;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  activeCount: number;
  totalCount: number;
  components: PricingComponent[];
  onMarginChange?: (newMargin: number) => void;
  productName?: string;
}

export function PriceSummaryHero({
  summary,
  currency,
  onCurrencyChange,
  activeCount,
  totalCount,
  components,
  onMarginChange,
  productName = "Product Price Breakdown",
}: PriceSummaryHeroProps) {
  const [copied, setCopied] = useState(false);
  const quickCurrencies = ["USD", "IDR", "EUR", "GBP", "SGD"];
  const isOtherCurrency = !quickCurrencies.includes(currency);
  const marginPresets = [15, 20, 25, 30, 40, 50];

  const currentMargin = Math.round(summary.grossMarginPct * 10) / 10;

  const handleCurrencySelect = (newCode: string) => {
    if (newCode && newCode !== currency) {
      onCurrencyChange(newCode);
      toast.info(`Currency set to ${newCode}`);
    }
  };

  const handleCopyQuote = async () => {
    try {
      const quoteText = generateCommercialQuoteText(summary, components, currency, productName);
      await navigator.clipboard.writeText(quoteText);
      setCopied(true);
      toast.success("Commercial quote copied to clipboard!", {
        description: "Formatted and ready to paste into WhatsApp, Slack, or Email.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  const costRatio = summary.finalSellPrice > 0 ? (summary.totalCost / summary.finalSellPrice) * 100 : 100;
  const profitRatio = summary.finalSellPrice > 0 ? (summary.netProfit / summary.finalSellPrice) * 100 : 0;

  return (
    <Card className="overflow-hidden border-border bg-card shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Top Header & Base Currency Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Selling Price
            </span>
            <Badge variant="secondary" className="text-[11px] px-2 py-0.5 font-mono font-semibold">
              {activeCount} active items
            </Badge>
          </div>

          {/* High-Contrast Segmented Currency Selector */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Coins className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex items-center rounded-xl bg-secondary p-0.5 border border-border">
              {quickCurrencies.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCurrencySelect(c)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-120 active:scale-95 ${
                    currency === c
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
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
                className={`px-2 py-1 text-xs font-semibold rounded-lg bg-transparent border-0 cursor-pointer focus:outline-none transition-colors ${
                  isOtherCurrency
                    ? "bg-primary text-primary-foreground shadow-sm"
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
                    className="bg-popover text-popover-foreground font-mono"
                  >
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hero Selling Price Display */}
        <div className="py-2">
          <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Recommended Commercial Price
          </div>
          <div className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground tabular-nums font-mono mt-1">
            {formatCurrency(summary.finalSellPrice, currency)}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-bold tracking-tight font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {formatPercent(summary.grossMarginPct)} Target Margin
            </span>

            {summary.netProfit > 0 && (
              <span className="text-xs font-semibold text-muted-foreground">
                +<strong className="text-foreground">{formatCurrency(summary.netProfit, currency)}</strong> net profit / unit
              </span>
            )}
          </div>

          {/* Visual Cost vs Profit Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground font-medium">
              <span>Cost Basis ({costRatio.toFixed(0)}%)</span>
              <span className="text-emerald-400 font-semibold">Net Profit ({profitRatio.toFixed(0)}%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden flex border border-border/60">
              <div
                style={{ width: `${Math.min(100, Math.max(0, costRatio))}%` }}
                className="bg-slate-500 transition-all duration-300"
              />
              <div
                style={{ width: `${Math.min(100, Math.max(0, profitRatio))}%` }}
                className="bg-emerald-500 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Interactive Target Margin Slider & Quick Pills */}
        {onMarginChange && (
          <div className="p-4 rounded-xl bg-secondary/70 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                Target Margin Solver
              </label>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {currentMargin}%
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="75"
              step="1"
              value={currentMargin}
              onChange={(e) => onMarginChange(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />

            {/* Quick Preset Margin Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground font-semibold mr-1">
                Presets:
              </span>
              {marginPresets.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onMarginChange(pct)}
                  className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-md border transition-all active:scale-95 ${
                    currentMargin === pct
                      ? "bg-emerald-500 text-white border-emerald-400 shadow-sm"
                      : "bg-card text-muted-foreground hover:text-foreground border-border"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Total Cost */}
          <div className="p-3.5 rounded-xl bg-secondary border border-border">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              Total Cost
            </div>
            <div className="text-base sm:text-lg font-bold text-foreground tabular-nums font-mono mt-1">
              {formatCurrency(summary.totalCost, currency)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Unit COGS
            </div>
          </div>

          {/* Profit */}
          <div className="p-3.5 rounded-xl bg-secondary border border-border">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              Net Return
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 tabular-nums font-mono mt-1">
              {formatCurrency(summary.netProfit, currency)}
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">
              Per unit profit
            </div>
          </div>

          {/* Markup */}
          <div className="p-3.5 rounded-xl bg-secondary border border-border">
            <div className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
              <PieChart className="h-3.5 w-3.5 text-primary" />
              Markup
            </div>
            <div className="text-base sm:text-lg font-bold text-foreground tabular-nums font-mono mt-1">
              +{formatPercent(summary.markupPct)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Cost multiplier
            </div>
          </div>
        </div>

        {/* One-Tap Copy Commercial Quote Button */}
        <button
          type="button"
          onClick={handleCopyQuote}
          disabled={summary.finalSellPrice === 0}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all duration-150 active:scale-[0.98] ${
            copied
              ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
              : summary.finalSellPrice > 0
              ? "bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-sm hover:shadow"
              : "bg-secondary text-muted-foreground border-border cursor-not-allowed opacity-60"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Copied Quote to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Commercial Quote</span>
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
