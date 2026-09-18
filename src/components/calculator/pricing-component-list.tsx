"use client";

import React, { useState } from "react";
import { PricingComponent, CalculationLineResult } from "@/types/calculator";
import { PricingComponentRow } from "./pricing-component-row";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const lineMap = new Map(lines.map((l) => [l.componentId, l]));

  const handleUpdate = (updated: PricingComponent) => {
    onChange(components.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDelete = (id: string) => {
    const target = components.find((c) => c.id === id);
    const targetIndex = components.findIndex((c) => c.id === id);
    onChange(components.filter((c) => c.id !== id));

    if (target) {
      toast.info(`Removed "${target.name || "item"}"`, {
        action: {
          label: "Undo",
          onClick: () => {
            const restored = [...components];
            restored.splice(targetIndex, 0, target);
            onChange(restored);
            toast.success(`Restored "${target.name || "item"}"`);
          },
        },
      });
    }
  };

  const handleAddComponent = (
    preset?: Partial<PricingComponent>
  ) => {
    const newComponent: PricingComponent = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: preset?.name || "New Item",
      type: preset?.type || "fixed",
      value: preset?.value ?? (preset?.type === "margin" ? 20 : 10),
      targetComponentId: preset?.targetComponentId,
      enabled: true,
      category: preset?.category || "custom",
    };
    onChange([...components, newComponent]);
    toast.success(`Added "${newComponent.name}"`);
  };

  const handleConfirmReset = () => {
    const previous = [...components];
    onChange([]);
    setIsResetConfirmOpen(false);
    toast.info("Cleared all items", {
      action: {
        label: "Undo",
        onClick: () => {
          onChange(previous);
          toast.success("Restored items");
        },
      },
    });
  };

  const activeCount = components.filter((c) => c.enabled).length;

  return (
    <div className="space-y-4">
      {/* Header & Main Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Costs & Margin
            </h2>
            <span className="text-xs text-muted-foreground font-mono tabular-nums px-2 py-0.5 rounded-full bg-secondary">
              {activeCount} active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add your materials, labor, fees, and profit margin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {components.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              title="Clear all"
              className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAddComponent()}
            className="shadow-xs font-medium"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Quick Starter Suggestions */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-secondary/50 border border-border/50">
        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-primary" />
          Quick add:
        </span>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Raw Material",
              type: "fixed",
              value: currency === "IDR" ? 150000 : 80,
              category: "material",
            })
          }
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border/60 text-foreground transition-all duration-120 active:scale-95 font-medium"
        >
          + Material
        </button>
        <button
          type="button"
          onClick={() => {
            const firstMaterial = components.find((c) => c.category === "material") || components[0];
            handleAddComponent({
              name: "Waste & Loss",
              type: "pct_component",
              value: 10,
              targetComponentId: firstMaterial?.id,
              category: "overhead",
            });
          }}
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border/60 text-foreground transition-all duration-120 active:scale-95 font-medium"
        >
          + Waste / Loss
        </button>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Packaging",
              type: "fixed",
              value: currency === "IDR" ? 5000 : 1.5,
              category: "material",
            })
          }
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border/60 text-foreground transition-all duration-120 active:scale-95 font-medium"
        >
          + Packaging
        </button>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Shipping & Handling",
              type: "fixed",
              value: currency === "IDR" ? 25000 : 2.5,
              category: "logistics",
            })
          }
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border/60 text-foreground transition-all duration-120 active:scale-95 font-medium"
        >
          + Shipping
        </button>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Target Profit",
              type: "margin",
              value: 20,
              category: "profit",
            })
          }
          className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold transition-all duration-120 active:scale-95"
        >
          + 20% Profit
        </button>
      </div>

      {/* Item Rows */}
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
          <div className="py-12 px-6 text-center rounded-2xl border border-dashed border-border bg-secondary/20 space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                No costs added yet
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                Start by adding your first cost item below, like materials, labor, or packaging.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddComponent({ name: "Base Material", type: "fixed", value: 50 })}
                className="shadow-xs"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add First Cost
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Clear All Items?"
        description="This will remove all costs from your current calculation. You can undo this right after if you change your mind."
        confirmText="Clear"
        variant="destructive"
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
