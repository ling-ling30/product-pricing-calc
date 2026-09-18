"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  ArrowRightLeft,
  RefreshCw,
  Sliders,
  TrendingUp,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface FxConversionBarProps {
  baseCurrency: string;
  targetCurrency: string;
  rates: Record<string, number>;
  bufferPct: number;
  customRate: number | null;
  isLoading: boolean;
  lastUpdated?: string;
  onTargetCurrencyChange: (curr: string) => void;
  onBufferChange: (pct: number) => void;
  onCustomRateChange: (rate: number | null) => void;
  onRefresh: () => void;
  onConvertAllComponents?: () => void;
}

const COMMON_TARGET_CURRENCIES = [
  { code: "IDR", label: "IDR (Indonesian Rupiah)" },
  { code: "USD", label: "USD (US Dollar)" },
  { code: "EUR", label: "EUR (Euro)" },
  { code: "SGD", label: "SGD (Singapore Dollar)" },
  { code: "GBP", label: "GBP (British Pound)" },
  { code: "AUD", label: "AUD (Australian Dollar)" },
];

export function FxConversionBar({
  baseCurrency,
  targetCurrency,
  rates,
  bufferPct,
  customRate,
  isLoading,
  lastUpdated,
  onTargetCurrencyChange,
  onBufferChange,
  onCustomRateChange,
  onRefresh,
  onConvertAllComponents,
}: FxConversionBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Compute spot rate: 1 baseCurrency = X targetCurrency
  const fromRate = rates[baseCurrency] || 1;
  const toRate = rates[targetCurrency] || 1;
  const rawMarketRate = toRate / fromRate;

  const activeRate =
    customRate !== null && customRate > 0
      ? customRate
      : rawMarketRate * (1 + bufferPct / 100);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-sm space-y-3">
      {/* Top Ticker Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Live FX Spot Ticker */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live FX Rate</span>
          </div>

          <div className="text-sm font-semibold tracking-tight text-foreground tabular-nums font-mono">
            1 {baseCurrency} ={" "}
            {targetCurrency === "IDR"
              ? `Rp ${Math.round(activeRate).toLocaleString("id-ID")}`
              : activeRate.toFixed(4)}{" "}
            {targetCurrency}
          </div>

          {bufferPct !== 0 && (
            <Badge variant="warning" className="text-[10px] px-1.5 py-0">
              +{bufferPct}% Buffer
            </Badge>
          )}

          {customRate !== null && (
            <Badge variant="accent" className="text-[10px] px-1.5 py-0">
              Custom Lock
            </Badge>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Target Currency Selector */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Convert to:</span>
            <div className="w-28">
              <Select
                value={targetCurrency}
                onChange={(e) => onTargetCurrencyChange(e.target.value)}
                className="h-8 text-xs font-medium"
              >
                {COMMON_TARGET_CURRENCIES.filter((c) => c.code !== baseCurrency).map(
                  (c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  )
                )}
              </Select>
            </div>
          </div>

          {/* Toggle Advanced Controls */}
          <Button
            variant={showAdvanced ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-8 text-xs"
            title="Adjust bank spread buffer or override rate"
          >
            <Sliders className="h-3.5 w-3.5 mr-1" />
            Adjust
          </Button>

          {/* Refresh Rates */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-90 disabled:opacity-50"
            title="Refresh exchange rates"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin text-primary" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Advanced Buffer & Override Accordion */}
      {showAdvanced && (
        <div className="pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fade-in">
          {/* Buffer preset pills */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Bank / Spread Cushion:
            </label>
            <div className="flex items-center gap-1">
              {[0, 1, 1.5, 2, 3].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onBufferChange(pct)}
                  className={`px-2 py-1 rounded-md text-xs font-mono transition-all duration-160 active:scale-95 ${
                    bufferPct === pct
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  +{pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Custom Fixed Rate Override */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Manual Rate Lock (Optional):
            </label>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                step="0.01"
                placeholder={`Market: ${rawMarketRate.toFixed(2)}`}
                value={customRate ?? ""}
                onChange={(e) => {
                  const val = e.target.value ? parseFloat(e.target.value) : null;
                  onCustomRateChange(val);
                }}
                className="h-8 text-xs font-mono tabular-nums"
              />
              {customRate !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCustomRateChange(null)}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                  title="Clear custom override"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Batch Convert All Values Button */}
          {onConvertAllComponents && (
            <div className="flex flex-col justify-end">
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Batch Transform:
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={onConvertAllComponents}
                className="h-8 text-xs border-accent/40 text-accent hover:bg-accent/10"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
                Convert All Items to {targetCurrency}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
