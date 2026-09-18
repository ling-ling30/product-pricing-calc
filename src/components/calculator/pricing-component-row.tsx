"use client";

import React from "react";
import { ComponentType, PricingComponent, CalculationLineResult } from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Trash2, GripVertical, Percent, DollarSign, TrendingUp } from "lucide-react";

interface PricingComponentRowProps {
  component: PricingComponent;
  index: number;
  availableTargets: PricingComponent[];
  lineResult?: CalculationLineResult;
  currency: string;
  onUpdate: (updated: PricingComponent) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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

  return (
    <div
      className={`group relative flex flex-col md:flex-row md:items-center gap-3 p-3.5 rounded-xl border transition-all duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        component.enabled
          ? "bg-card border-border shadow-sm hover:border-primary/40"
          : "bg-muted/40 border-dashed border-border/70 opacity-60"
      }`}
    >
      {/* Drag & Enable indicator */}
      <div className="flex items-center justify-between md:justify-start gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <GripVertical className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity cursor-grab" />
          <span className="text-xs font-mono w-5 text-center text-muted-foreground/80">
            {index + 1}
          </span>
        </div>

        <Switch
          checked={component.enabled}
          onCheckedChange={(checked) => onUpdate({ ...component, enabled: checked })}
          title={component.enabled ? "Disable component" : "Enable component"}
        />
      </div>

      {/* Component Name */}
      <div className="flex-1 min-w-[140px]">
        <Input
          value={component.name}
          onChange={(e) => onUpdate({ ...component, name: e.target.value })}
          placeholder="e.g. Green Coffee, Packaging, Margin"
          disabled={!component.enabled}
          className="font-medium text-sm"
        />
      </div>

      {/* Component Type Selector */}
      <div className="w-full md:w-[170px]">
        <Select
          value={component.type}
          onChange={handleTypeChange}
          disabled={!component.enabled}
        >
          <option value="fixed">Fixed Amount</option>
          <option value="pct_subtotal">% of Subtotal</option>
          <option value="pct_component">% of Item</option>
          <option value="margin">Target Margin %</option>
          <option value="markup">Markup %</option>
        </Select>
      </div>

      {/* Target Item Reference (Only visible if pct_component) */}
      {component.type === "pct_component" && (
        <div className="w-full md:w-[150px]">
          <Select
            value={component.targetComponentId || ""}
            onChange={(e) =>
              onUpdate({ ...component, targetComponentId: e.target.value })
            }
            disabled={!component.enabled}
          >
            <option value="" disabled>
              Select item...
            </option>
            {availableTargets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name || "Untitled"}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Value Input */}
      <div className="w-full md:w-[120px]">
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
              <Percent className="h-3.5 w-3.5" />
            ) : currency === "IDR" ? (
              <span className="text-xs">Rp</span>
            ) : (
              <DollarSign className="h-3.5 w-3.5" />
            )
          }
          className="text-right tabular-nums font-mono"
        />
      </div>

      {/* Live Calculated Impact Badge */}
      <div className="flex items-center justify-between md:justify-end gap-2 md:min-w-[130px]">
        {lineResult ? (
          <div className="text-right">
            <div className="text-xs font-semibold tabular-nums font-mono">
              {lineResult.monetaryValue >= 0 ? "+" : ""}
              {formatCurrency(lineResult.monetaryValue, currency)}
            </div>
            <div className="text-[10px] text-muted-foreground tabular-nums">
              Sub: {formatCurrency(lineResult.subtotalAfter, currency)}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground tabular-nums">—</div>
        )}

        {/* Delete button with Emil press */}
        <button
          type="button"
          onClick={() => onDelete(component.id)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-160 active:scale-90"
          title="Remove component"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
