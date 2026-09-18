"use client";

import React from "react";
import { ComponentType, PricingComponent, CalculationLineResult } from "@/types/calculator";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";
import { getCurrencySymbol } from "@/lib/currencies";
import { Trash2, GripVertical, CornerDownRight, Tag } from "lucide-react";

interface PricingComponentRowProps {
  component: PricingComponent;
  index: number;
  availableTargets: PricingComponent[];
  lineResult?: CalculationLineResult;
  currency: string;
  onUpdate: (updated: PricingComponent) => void;
  onDelete: (id: string) => void;
}

export function PricingComponentRow({
  component,
  index,
  availableTargets,
  lineResult,
  currency,
  onUpdate,
  onDelete,
}: PricingComponentRowProps) {
  const isPercentageType =
    component.type === "pct_subtotal" ||
    component.type === "pct_component" ||
    component.type === "margin" ||
    component.type === "markup";

  const isProfit = component.type === "margin" || component.type === "markup";

  const handleTypeChange = (newType: ComponentType) => {
    onUpdate({
      ...component,
      type: newType,
      targetComponentId:
        newType === "pct_component"
          ? availableTargets[0]?.id || ""
          : undefined,
    });
  };

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case "material":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "labor":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "overhead":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "logistics":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "profit":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-500/15 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-120 ${
        component.enabled
          ? isProfit
            ? "bg-emerald-950/20 border-emerald-500/40 shadow-sm"
            : "bg-card border-border shadow-sm hover:border-primary/50"
          : "bg-secondary/40 border-dashed border-border/60 opacity-50"
      }`}
    >
      {/* Main Row Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          {/* Index Pill */}
          <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
            <span className="text-xs font-mono font-bold w-5 h-5 rounded-md bg-secondary flex items-center justify-center border border-border">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Active Switch */}
          <div className="shrink-0">
            <Switch
              checked={component.enabled}
              onCheckedChange={(checked) => onUpdate({ ...component, enabled: checked })}
              title={component.enabled ? "Disable this cost item" : "Enable this cost item"}
            />
          </div>

          {/* Component Name Input */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={component.name}
              onChange={(e) => onUpdate({ ...component, name: e.target.value })}
              placeholder="Cost item name (e.g. Raw Material, Packaging)..."
              disabled={!component.enabled}
              className="w-full bg-secondary/50 px-3 py-1.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 border border-border focus:border-primary focus:bg-secondary rounded-lg transition-colors focus:outline-none"
            />
          </div>

          {/* Evaluated Monetary Value Display */}
          <div className="text-right shrink-0 min-w-[110px]">
            {lineResult && component.enabled ? (
              <div>
                <div
                  className={`text-base font-bold tabular-nums font-mono ${
                    isProfit ? "text-emerald-400" : "text-foreground"
                  }`}
                >
                  {lineResult.monetaryValue >= 0 ? "+" : ""}
                  {formatCurrency(lineResult.monetaryValue, currency)}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  Subtotal: {formatCurrency(lineResult.subtotalAfter, currency)}
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground font-mono font-semibold">
                Disabled
              </div>
            )}
          </div>

          {/* Delete Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onDelete(component.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-colors active:scale-90"
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Configuration Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border/60 pl-8 text-xs">
          {/* Left: Type Picker & Target Link */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type selector */}
            <select
              value={component.type}
              onChange={(e) => handleTypeChange(e.target.value as ComponentType)}
              disabled={!component.enabled}
              className="h-8 px-2.5 bg-secondary text-foreground text-xs font-semibold rounded-lg border border-border cursor-pointer focus:outline-none focus:border-primary"
            >
              <option value="fixed">Fixed Cost Amount ({getCurrencySymbol(currency)})</option>
              <option value="pct_component">% of Specific Item (Shrinkage/Waste)</option>
              <option value="pct_subtotal">% of Subtotal (Overhead / Gateway Fee)</option>
              <option value="margin">Target Gross Margin %</option>
              <option value="markup">Cost Markup %</option>
            </select>

            {/* Target item dropdown when type is pct_component */}
            {component.type === "pct_component" && (
              <div className="flex items-center gap-1">
                <CornerDownRight className="h-3.5 w-3.5 text-primary shrink-0" />
                <select
                  value={component.targetComponentId || ""}
                  onChange={(e) =>
                    onUpdate({ ...component, targetComponentId: e.target.value })
                  }
                  disabled={!component.enabled}
                  className="h-8 px-2.5 bg-secondary text-foreground text-xs font-semibold rounded-lg border border-primary/50 cursor-pointer focus:outline-none"
                >
                  <option value="" disabled>
                    Select source item...
                  </option>
                  {availableTargets.map((t) => (
                    <option key={t.id} value={t.id}>
                      Link to: {t.name || "Untitled"}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right: Numeric Input with clear prefix/suffix */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium text-muted-foreground">Value:</span>
            <div className="relative flex items-center">
              {!isPercentageType && (
                <span className="absolute left-2.5 text-xs font-mono font-bold text-muted-foreground">
                  {getCurrencySymbol(currency)}
                </span>
              )}
              <input
                type="number"
                step={isPercentageType ? "0.1" : "1"}
                value={component.value === 0 ? "" : component.value}
                onChange={(e) =>
                  onUpdate({
                    ...component,
                    value: e.target.value === "" ? 0 : parseFloat(e.target.value),
                  })
                }
                disabled={!component.enabled}
                className={`h-8 w-28 text-right font-mono font-bold text-sm bg-secondary text-foreground rounded-lg border border-border focus:border-primary focus:outline-none transition-colors ${
                  isPercentageType ? "pr-6 pl-2.5" : "pl-6 pr-2.5"
                }`}
                placeholder="0"
              />
              {isPercentageType && (
                <span className="absolute right-2 text-xs font-mono font-bold text-muted-foreground">
                  %
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
