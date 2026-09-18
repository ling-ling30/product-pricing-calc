"use client";

import React from "react";
import { PricingComponent, CalculationLineResult } from "@/types/calculator";
import { PricingComponentRow } from "./pricing-component-row";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Sparkles } from "lucide-react";
import { DEFAULT_COMPONENTS } from "@/services/calculation.service";

interface PricingComponentListProps {
  components: PricingComponent[];
  lines: CalculationLineResult[];
  currency: string;
  onChange: (updated: PricingComponent[]) => void;
}

export function PricingComponentList({
  components,
  lines,
  currency,
  onChange,
}: PricingComponentListProps) {
  const lineMap = new Map(lines.map((l) => [l.componentId, l]));

  const handleUpdate = (updated: PricingComponent) => {
    onChange(components.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDelete = (id: string) => {
    onChange(components.filter((c) => c.id !== id));
  };

  const handleAddComponent = (
    preset?: Partial<PricingComponent>
  ) => {
    const newComponent: PricingComponent = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: preset?.name || "New Cost Item",
      type: preset?.type || "fixed",
      value: preset?.value ?? (preset?.type === "margin" ? 20 : 10),
      targetComponentId: preset?.targetComponentId,
      enabled: true,
      category: preset?.category || "custom",
    };
    onChange([...components, newComponent]);
  };

  const handleReset = () => {
    if (window.confirm("Reset all components to standard defaults?")) {
      onChange(DEFAULT_COMPONENTS);
    }
  };

  return (
    <div className="space-y-4">
      {/* List Header & Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Cost & Price Components
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add fixed expenses, dynamic yield/scrap percentages, or target profit margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            title="Reset to default structure"
            className="text-xs text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAddComponent()}
            className="shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Component
          </Button>
        </div>
      </div>

      {/* Quick Template Pills */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-secondary/50 border border-border/60">
        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-accent" />
          Quick add:
        </span>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Raw Material",
              type: "fixed",
              value: 100,
              category: "material",
            })
          }
          className="text-xs px-2.5 py-1 rounded-md bg-card hover:bg-muted border border-border text-foreground transition-all duration-160 active:scale-95"
        >
          + Raw Material (Fixed)
        </button>
        <button
          type="button"
          onClick={() => {
            const firstMaterial = components.find((c) => c.category === "material") || components[0];
            handleAddComponent({
              name: "Processing Loss / Shrinkage",
              type: "pct_component",
              value: 15,
              targetComponentId: firstMaterial?.id,
              category: "overhead",
            });
          }}
          className="text-xs px-2.5 py-1 rounded-md bg-card hover:bg-muted border border-border text-foreground transition-all duration-160 active:scale-95"
        >
          + Yield Loss (% of Item)
        </button>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Packaging & Bagging",
              type: "fixed",
              value: 5,
              category: "material",
            })
          }
          className="text-xs px-2.5 py-1 rounded-md bg-card hover:bg-muted border border-border text-foreground transition-all duration-160 active:scale-95"
        >
          + Packaging (Fixed)
        </button>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Shipping & Handling",
              type: "pct_subtotal",
              value: 8,
              category: "logistics",
            })
          }
          className="text-xs px-2.5 py-1 rounded-md bg-card hover:bg-muted border border-border text-foreground transition-all duration-160 active:scale-95"
        >
          + Logistics (% Subtotal)
        </button>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Commercial Target Margin",
              type: "margin",
              value: 20,
              category: "profit",
            })
          }
          className="text-xs px-2.5 py-1 rounded-md bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent font-medium transition-all duration-160 active:scale-95"
        >
          + Target Margin (20%)
        </button>
      </div>

      {/* Component Rows */}
      <div className="space-y-2.5">
        {components.map((comp, idx) => (
          <PricingComponentRow
            key={comp.id}
            component={comp}
            index={idx}
            availableTargets={components.slice(0, idx)}
            lineResult={lineMap.get(comp.id)}
            currency={currency}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}

        {components.length === 0 && (
          <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card/50">
            <p className="text-sm font-medium text-muted-foreground">
              No pricing components defined yet.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange(DEFAULT_COMPONENTS)}
              className="mt-3"
            >
              Load Standard Starter Components
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
