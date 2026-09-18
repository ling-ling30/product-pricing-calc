"use client";

import React, { useState } from "react";
import { PricingComponent, CalculationLineResult } from "@/types/calculator";
import { PricingComponentRow } from "./pricing-component-row";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { STARTER_TEMPLATES } from "@/lib/templates";
import { Plus, RotateCcw, Sparkles, Layers, Box, Wrench, Percent, Truck } from "lucide-react";
import { toast } from "sonner";

interface PricingComponentListProps {
  components: PricingComponent[];
  lines: CalculationLineResult[];
  currency: string;
  onChange: (updated: PricingComponent[]) => void;
  onSelectTemplate?: (templateId: string) => void;
}

export function PricingComponentList({
  components,
  lines,
  currency,
  onChange,
  onSelectTemplate,
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
      value: preset?.value ?? (preset?.type === "margin" ? 25 : 10),
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
    toast.info("Cleared all cost items", {
      action: {
        label: "Undo",
        onClick: () => {
          onChange(previous);
          toast.success("Restored cost items");
        },
      },
    });
  };

  const handleLoadStarter = (templateId: string) => {
    const tpl = STARTER_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    onChange(tpl.components);
    toast.success(`Loaded "${tpl.name}" template!`, {
      description: tpl.description,
    });
  };

  const activeCount = components.filter((c) => c.enabled).length;

  return (
    <div className="space-y-5">
      {/* Starter Templates Bar */}
      <div className="p-3.5 rounded-xl bg-secondary/70 border border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Quick Starter Templates:
          </span>
          {components.length > 0 && (
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors font-semibold"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {STARTER_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleLoadStarter(tpl.id)}
              className="p-2.5 rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary/50 text-left transition-all duration-120 active:scale-95 group shadow-xs"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-foreground group-hover:text-primary">
                <span>{tpl.icon}</span>
                <span className="truncate">{tpl.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                {tpl.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Costs & Components
            </h2>
            <span className="text-xs text-foreground font-mono font-bold tabular-nums px-2 py-0.5 rounded-full bg-secondary border border-border">
              {activeCount} active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add materials, labor, yield loss, and transaction fees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAddComponent()}
            className="shadow-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1 stroke-[2.5]" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Quick Add Buttons Row */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-secondary/40 border border-border">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
          Add:
        </span>
        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Raw Material",
              type: "fixed",
              value: currency === "IDR" ? 150000 : 50,
              category: "material",
            })
          }
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border text-foreground hover:text-primary transition-all font-semibold flex items-center gap-1"
        >
          <Box className="h-3 w-3 text-blue-400" />
          + Material
        </button>

        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Direct Labor / Assembly",
              type: "fixed",
              value: currency === "IDR" ? 50000 : 15,
              category: "labor",
            })
          }
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border text-foreground hover:text-primary transition-all font-semibold flex items-center gap-1"
        >
          <Wrench className="h-3 w-3 text-purple-400" />
          + Labor
        </button>

        <button
          type="button"
          onClick={() => {
            const firstComp = components[0];
            handleAddComponent({
              name: "Yield Loss / Shrinkage (10%)",
              type: "pct_component",
              value: 10,
              targetComponentId: firstComp?.id,
              category: "overhead",
            });
          }}
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border text-foreground hover:text-primary transition-all font-semibold flex items-center gap-1"
        >
          <Percent className="h-3 w-3 text-amber-400" />
          + Shrinkage %
        </button>

        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Packaging & Mailer",
              type: "fixed",
              value: currency === "IDR" ? 20000 : 5,
              category: "logistics",
            })
          }
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border text-foreground hover:text-primary transition-all font-semibold flex items-center gap-1"
        >
          <Truck className="h-3 w-3 text-cyan-400" />
          + Shipping & Pack
        </button>

        <button
          type="button"
          onClick={() =>
            handleAddComponent({
              name: "Platform / Payment Fee (3.5%)",
              type: "pct_subtotal",
              value: 3.5,
              category: "overhead",
            })
          }
          className="text-xs px-2.5 py-1 rounded-lg bg-card hover:bg-secondary border border-border text-foreground hover:text-primary transition-all font-semibold flex items-center gap-1"
        >
          <Percent className="h-3 w-3 text-emerald-400" />
          + Gateway %
        </button>
      </div>

      {/* Cost Component Rows */}
      {components.length === 0 ? (
        <div className="p-8 rounded-2xl border-2 border-dashed border-border text-center space-y-4 bg-card/40">
          <div className="h-12 w-12 rounded-2xl bg-secondary mx-auto flex items-center justify-center border border-border">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              No cost components yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              Select one of the starter templates above to see a full commercial breakdown, or click below to build from scratch.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleAddComponent()}
            className="shadow-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {components.map((comp, idx) => (
            <PricingComponentRow
              key={comp.id}
              component={comp}
              index={idx}
              availableTargets={components.filter((c) => c.id !== comp.id)}
              lineResult={lineMap.get(comp.id)}
              currency={currency}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Clear All Cost Items?"
        description="This will remove all components from your scratchpad. You will have an immediate Undo option to restore them."
        confirmText="Clear All Items"
        cancelText="Keep Items"
        onConfirm={handleConfirmReset}
        variant="destructive"
      />
    </div>
  );
}
