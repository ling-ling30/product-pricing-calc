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
      name: preset?.name || "New Cost Item",
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
    toast.info("All components cleared", {
      action: {
        label: "Undo",
        onClick: () => {
          onChange(previous);
          toast.success("Restored components");
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
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Cost & Margin Components
            </h2>
            <span className="text-xs text-muted-foreground font-mono tabular-nums px-2 py-0.5 rounded-full bg-secondary">
              {activeCount} active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure direct raw materials, process shrinkage/loss, packaging, and commercial margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {components.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              title="Clear all components"
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
            className="shadow-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Component
          </Button>
        </div>
      </div>

      {/* Quick Starter Templates */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-secondary/40 border border-border/60">
        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-accent" />
          Quick insert:
        </span>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Raw Material Basis",
              type: "fixed",
              value: currency === "IDR" ? 170000 : 100,
              category: "material",
            })
          }
          className="text-xs px-2.5 py-1 rounded-md bg-card hover:bg-muted border border-border/80 text-foreground transition-all duration-160 active:scale-95 font-medium"
        >
          + Raw Material
        </button>
        <button
          type="button"
          onClick={() => {
            const firstMaterial = components.find((c) => c.category === "material") || components[0];
            handleAddComponent({
              name: "Processing Shrinkage / Waste",
              type: "pct_component",
              value: 15,
              targetComponentId: firstMaterial?.id,
              category: "overhead",
            });
          }}
          className="text-xs px-2.5 py-1 rounded-md bg-card hover:bg-muted border border-border/80 text-foreground transition-all duration-160 active:scale-95 font-medium"
        >
          + Shrinkage (% of Item)
        </button>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Packaging & Bagging",
              type: "fixed",
              value: currency === "IDR" ? 8000 : 0.85,
              category: "material",
            })
          }
          className="text-xs px-2.5 py-1 rounded-md bg-card hover:bg-muted border border-border/80 text-foreground transition-all duration-160 active:scale-95 font-medium"
        >
          + Packaging
        </button>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Logistics & Forwarder",
              type: "fixed",
              value: currency === "IDR" ? 35000 : 1.8,
              category: "logistics",
            })
          }
          className="text-xs px-2.5 py-1 rounded-md bg-card hover:bg-muted border border-border/80 text-foreground transition-all duration-160 active:scale-95 font-medium"
        >
          + Logistics
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
          className="text-xs px-2.5 py-1 rounded-md bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent font-semibold transition-all duration-160 active:scale-95"
        >
          + 20% Margin
        </button>
      </div>

      {/* Component Rows List */}
      <div className="space-y-3">
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
          <div className="py-12 px-6 text-center rounded-2xl border border-dashed border-border/80 bg-card/30 space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Start with a fresh product calculation
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                Add your direct material costs, processing percentages, logistics, or target margins to begin.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddComponent({ name: "Base Material", type: "fixed", value: 100 })}
                className="shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add First Component
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Proper Radix Confirmation Dialog for Clear/Reset */}
      <ConfirmDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Clear All Components?"
        description="This will remove all pricing components from the current session. You can undo this action immediately from the notification."
        confirmText="Clear Canvas"
        variant="destructive"
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
