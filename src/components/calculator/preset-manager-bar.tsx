"use client";

import React, { useState } from "react";
import { CalculationPreset, PricingComponent } from "@/types/calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";
import { Bookmark, Save, Plus, Trash2, Cloud, HardDrive, Coins } from "lucide-react";
import { toast } from "sonner";

interface PresetManagerBarProps {
  presets: CalculationPreset[];
  activePresetId?: string;
  currentComponents: PricingComponent[];
  currency: string;
  isAuthenticated: boolean;
  onSelectPreset: (preset: CalculationPreset) => void;
  onSavePreset: (preset: CalculationPreset) => void;
  onDeletePreset: (id: string) => void;
  onNewScratchpad: () => void;
  onCurrencyChange?: (currency: string) => void;
}

export function PresetManagerBar({
  presets,
  activePresetId,
  currentComponents,
  currency,
  isAuthenticated,
  onSelectPreset,
  onSavePreset,
  onDeletePreset,
  onNewScratchpad,
  onCurrencyChange,
}: PresetManagerBarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetNotes, setPresetNotes] = useState("");

  const activePreset = presets.find((p) => p.id === activePresetId);

  const handleOpenSaveDialog = () => {
    setPresetName(activePreset ? `${activePreset.name} (Copy)` : "My Product");
    setPresetNotes(activePreset?.notes || "");
    setIsDialogOpen(true);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) {
      toast.error("Please give your product a name");
      return;
    }

    const savedName = presetName.trim();
    const newPreset: CalculationPreset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: savedName,
      currency,
      components: currentComponents,
      notes: presetNotes.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onSavePreset(newPreset);
    setIsDialogOpen(false);
    toast.success(`Saved "${savedName}"`, {
      description: `${currentComponents.length} items saved in ${currency}.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!activePreset) return;
    const deletedName = activePreset.name;
    onDeletePreset(activePreset.id);
    setIsDeleteDialogOpen(false);
    toast.success(`Deleted "${deletedName}"`);
  };

  const handleSelect = (preset: CalculationPreset) => {
    onSelectPreset(preset);
    toast.info(`Loaded "${preset.name}"`);
  };

  const handleNew = () => {
    onNewScratchpad();
    toast.info("Cleared canvas", {
      description: "Ready for a new product calculation.",
    });
  };

  const handleCurrencySelect = (newCurrency: string) => {
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
      toast.info(`Currency set to ${newCurrency}`);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/70 shadow-xs">
        {/* Saved Products Selector */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[220px]">
          <Bookmark className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1 max-w-xs">
            <Select
              value={activePresetId || ""}
              onChange={(e) => {
                const found = presets.find((p) => p.id === e.target.value);
                if (found) handleSelect(found);
              }}
            >
              <option value="" disabled>
                {presets.length === 0 ? "No saved products yet" : "Saved products..."}
              </option>
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            {isAuthenticated ? (
              <Badge variant="outline" className="gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 border-emerald-500/25">
                <Cloud className="h-3 w-3" />
                Cloud
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 text-[11px]">
                <HardDrive className="h-3 w-3" />
                On device
              </Badge>
            )}
          </div>
        </div>

        {/* Currency & Actions */}
        <div className="flex items-center gap-2">
          {onCurrencyChange && (
            <div className="flex items-center gap-1.5 border-r border-border/60 pr-2 mr-1">
              <Coins className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              <select
                value={currency}
                onChange={(e) => handleCurrencySelect(e.target.value)}
                className="h-8 text-xs font-medium px-2 py-1 rounded-lg bg-secondary/70 border border-border/60 text-foreground cursor-pointer focus:outline-none transition-colors"
                title="Currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-popover text-popover-foreground">
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNew}
            title="Start fresh"
            className="text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenSaveDialog}
            className="text-xs"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>

          {activePreset && (
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2 rounded-lg text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-90"
              title="Delete product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Apple-style Save Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save Product</DialogTitle>
            <DialogDescription>
              Save this pricing setup so you can load it anytime.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmSave} className="space-y-4 mt-1">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Product Name
              </label>
              <Input
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g. Arabica 250g, Leather Tote, T-Shirt"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Notes (optional)
              </label>
              <Input
                value={presetNotes}
                onChange={(e) => setPresetNotes(e.target.value)}
                placeholder="Suppliers, batch size, packaging notes..."
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Product?"
        description={`Are you sure you want to delete "${activePreset?.name}"? This can't be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
