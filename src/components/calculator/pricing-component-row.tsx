"use client";

import React from "react";
import { ComponentType, PricingComponent, CalculationLineResult } from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getCurrencySymbol } from "@/lib/currencies";
import { Trash2, GripVertical, Percent, ArrowRight } from "lucide-react";

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

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ComponentType;
    onUpdate({
      ...component,
      type: newType,
      targetComponentId:
        newType === "pct_component"
          ? availableTargets[0]?.id || ""
          : undefined,
    });
  };

  const isProfit = component.type === "margin" || component.type === "markup";

  return (
    <div
      className={`group relative rounded-xl border p-3.5 transition-all duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        component.enabled
          ? "bg-card border-border/80 shadow-sm hover:border-primary/40 hover:shadow"
          : "bg-muted/30 border-dashed border-border/70 opacity-60"
      }`}
    >
      {/* Upper Row: Controls, Full-Width Name, Nominal Result & Trash */}
      <div className="flex items-center gap-3">
        {/* Grip & Index */}
        <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
          <GripVertical className="h-4 w-4 opacity-30 group-hover:opacity-80 transition-opacity cursor-grab" />
          <span className="text-xs font-mono font-medium w-4 text-center text-muted-foreground/70">
            {index + 1}
          </span>
        </div>

        {/* High-Contrast Toggle */}
        <div className="shrink-0">
          <Switch
            checked={component.enabled}
            onCheckedChange={(checked) => onUpdate({ ...component, enabled: checked })}
            title={component.enabled ? "Disable this cost component" : "Enable this cost component"}
          />
        </div>

        {/* Component Name - Full Width Inline Input (Never Truncated) */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={component.name}
            onChange={(e) => onUpdate({ ...component, name: e.target.value })}
            placeholder="e.g. Green Coffee Beans, Toll Roasting, Degassing Bags..."
            disabled={!component.enabled}
            className="w-full bg-transparent px-2 py-1 text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 border-b border-transparent hover:border-border focus:border-primary focus:bg-background/80 rounded transition-colors focus:outline-none"
          />
        </div>

        {/* Live Evaluated Line Impact */}
        <div className="text-right shrink-0 min-w-[100px]">
          {lineResult && component.enabled ? (
            <div
              className={`text-sm font-bold font-mono tabular-nums ${
                isProfit ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
              }`}
            >
              {lineResult.monetaryValue >= 0 ? "+" : ""}
              {formatCurrency(lineResult.monetaryValue, currency)}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground/60 font-mono tabular-nums">
              Excluded
            </div>
          )}
        </div>

        {/* Delete Button with Emil Press Physics */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onDelete(component.id)}
            className="p-1.5 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all duration-160 active:scale-90"
            title="Remove component"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lower Row: Method Selector, Target Selection, Value Input, and Context */}
      <div className="mt-2.5 pt-2.5 border-t border-border/40 pl-11 flex flex-wrap items-center gap-3 text-xs">
        {/* Calculation Method Dropdown */}
        <div className="w-[160px] shrink-0">
          <Select
            value={component.type}
            onChange={handleTypeChange}
            disabled={!component.enabled}
            className="h-8 text-xs font-medium"
          >
            <option value="fixed">Fixed Amount</option>
            <option value="pct_subtotal">% of Subtotal</option>
            <option value="pct_component">% of Specific Item</option>
            <option value="margin">Target Margin %</option>
            <option value="markup">Markup %</option>
          </Select>
        </div>

        {/* Target Component Dropdown (Only when type === 'pct_component') */}
        {component.type === "pct_component" && (
          <div className="w-[180px] shrink-0">
            <Select
              value={component.targetComponentId || ""}
              onChange={(e) =>
                onUpdate({ ...component, targetComponentId: e.target.value })
              }
              disabled={!component.enabled}
              className="h-8 text-xs"
            >
              <option value="" disabled>
                Select referenced item...
              </option>
              {availableTargets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || "Untitled Item"}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Numeric Value Input */}
        <div className="w-[130px] shrink-0">
          <Input
            type="number"
            step={isPercentageType ? "0.1" : "1"}
            value={component.value}
            onChange={(e) =>
              onUpdate({
                ...component,
                value: parseFloat(e.target.value) || 0,
              })
            }
            disabled={!component.enabled}
            prefixNode={
              isPercentageType ? (
                <Percent className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">
                  {getCurrencySymbol(currency)}
                </span>
              )
            }
            className="h-8 text-xs text-right tabular-nums font-mono font-medium"
          />
        </div>

        {/* Running Subtotal & Formula Context Note */}
        {lineResult && component.enabled && (
          <div className="ml-auto flex items-center gap-2 text-muted-foreground text-[11px] tabular-nums">
            {lineResult.referenceDetail && (
              <span className="hidden sm:inline-block opacity-80">
                {lineResult.referenceDetail}
              </span>
            )}
            <span className="font-medium text-foreground/80 bg-secondary/80 px-2 py-0.5 rounded-md border border-border/50">
              Subtotal: {formatCurrency(lineResult.subtotalAfter, currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
