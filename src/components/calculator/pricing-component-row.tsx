"use client";

import React from "react";
import { ComponentType, PricingComponent, CalculationLineResult } from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";
import { getCurrencySymbol } from "@/lib/currencies";
import { Trash2, GripVertical, Percent } from "lucide-react";

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
      className={`group relative rounded-xl border p-3.5 transition-all duration-120 ease-out ${
        component.enabled
          ? "bg-card border-border/80 shadow-xs hover:border-primary/30"
          : "bg-secondary/30 border-dashed border-border/60 opacity-55"
      }`}
    >
      {/* Upper Row: Toggle, Name, Evaluated Value, Delete */}
      <div className="flex items-center gap-3">
        {/* Grip & Index */}
        <div className="flex items-center gap-1.5 text-muted-foreground/60 shrink-0">
          <GripVertical className="h-3.5 w-3.5 opacity-30 group-hover:opacity-80 transition-opacity cursor-grab" />
          <span className="text-xs font-mono font-medium w-4 text-center">
            {index + 1}
          </span>
        </div>

        {/* Switch */}
        <div className="shrink-0">
          <Switch
            checked={component.enabled}
            onCheckedChange={(checked) => onUpdate({ ...component, enabled: checked })}
            title={component.enabled ? "Disable this cost" : "Enable this cost"}
          />
        </div>

        {/* Name input */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={component.name}
            onChange={(e) => onUpdate({ ...component, name: e.target.value })}
            placeholder="e.g. Raw Material, Labor, Packaging..."
            disabled={!component.enabled}
            className="w-full bg-transparent px-2 py-1 text-sm font-medium text-foreground placeholder:text-muted-foreground/45 border-b border-transparent hover:border-border/60 focus:border-primary focus:bg-secondary/40 rounded-md transition-colors focus:outline-none"
          />
        </div>

        {/* Result Amount */}
        <div className="text-right shrink-0 min-w-[95px]">
          {lineResult && component.enabled ? (
            <div
              className={`text-sm font-semibold tabular-nums font-mono ${
                isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
              }`}
            >
              {lineResult.monetaryValue >= 0 ? "+" : ""}
              {formatCurrency(lineResult.monetaryValue, currency)}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground/50 font-mono tabular-nums">
              Off
            </div>
          )}
        </div>

        {/* Delete */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onDelete(component.id)}
            className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-90"
            title="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lower Row: Type Selector, Value Input, Running Subtotal */}
      <div className="mt-2.5 pt-2 border-t border-border/40 pl-10 flex flex-wrap items-center gap-2.5 text-xs">
        {/* Type Select */}
        <div className="w-[155px] shrink-0">
          <Select
            value={component.type}
            onChange={handleTypeChange}
            disabled={!component.enabled}
            className="h-8 text-xs font-medium rounded-lg"
          >
            <option value="fixed">Fixed amount</option>
            <option value="pct_subtotal">% of subtotal</option>
            <option value="pct_component">% of item</option>
            <option value="margin">Profit margin %</option>
            <option value="markup">Markup %</option>
          </Select>
        </div>

        {/* Target Select */}
        {component.type === "pct_component" && (
          <div className="w-[160px] shrink-0">
            <Select
              value={component.targetComponentId || ""}
              onChange={(e) =>
                onUpdate({ ...component, targetComponentId: e.target.value })
              }
              disabled={!component.enabled}
              className="h-8 text-xs rounded-lg"
            >
              <option value="" disabled>
                Choose item...
              </option>
              {availableTargets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || "Untitled Item"}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Value Input */}
        <div className="w-[120px] shrink-0">
          <Input
            type="number"
            step={isPercentageType ? "0.5" : "1"}
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
            className="h-8 text-xs text-right tabular-nums font-mono font-medium rounded-lg"
          />
        </div>

        {/* Running Subtotal */}
        {lineResult && component.enabled && (
          <div className="ml-auto flex items-center gap-2 text-muted-foreground text-[11px] tabular-nums">
            {lineResult.referenceDetail && (
              <span className="hidden sm:inline-block opacity-75">
                {lineResult.referenceDetail}
              </span>
            )}
            <span className="text-foreground/75 bg-secondary/80 px-2 py-0.5 rounded-md font-medium">
              Subtotal: {formatCurrency(lineResult.subtotalAfter, currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
