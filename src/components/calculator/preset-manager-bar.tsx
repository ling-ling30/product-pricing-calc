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
    setPresetName(activePreset ? `${activePreset.name} (Copy)` : "My Custom Product");
    setPresetNotes(activePreset?.notes || "");
    setIsDialogOpen(true);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) {
      toast.error("Please enter a valid preset name");
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
    toast.success(`Preset "${savedName}" saved successfully`, {
      description: `${currentComponents.length} cost component(s) saved in ${currency}.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!activePreset) return;
    const deletedName = activePreset.name;
    onDeletePreset(activePreset.id);
    setIsDeleteDialogOpen(false);
    toast.success(`Preset "${deletedName}" deleted`);
  };

  const handleSelect = (preset: CalculationPreset) => {
    onSelectPreset(preset);
    toast.info(`Loaded preset: "${preset.name}"`, {
      description: `Switched currency to ${preset.currency || currency}.`,
    });
  };

  const handleNew = () => {
    onNewScratchpad();
    toast.info("Started fresh blank canvas", {
      description: "Ready for a new product calculation.",
    });
  };

  const handleCurrencySelect = (newCurrency: string) => {
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
      toast.info(`Base currency changed to ${newCurrency}`);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-sm">
        {/* Preset Selector & Sync Status */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
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
                Select saved model...
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
              <Badge variant="outline" className="gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                <Cloud className="h-3 w-3" />
                Cloud Synced (D1)
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 text-[11px]">
                <HardDrive className="h-3 w-3" />
                Local Storage
              </Badge>
            )}
          </div>
        </div>

        {/* Currency Selector & Actions */}
        <div className="flex items-center gap-2">
          {onCurrencyChange && (
            <div className="flex items-center gap-1.5 border-r border-border/60 pr-2 mr-1">
              <Coins className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              <select
                value={currency}
                onChange={(e) => handleCurrencySelect(e.target.value)}
                className="h-8 text-xs font-semibold px-2 py-1 rounded-md bg-secondary/80 border border-border/60 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-160"
                title="Select Base Currency"
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
            variant="outline"
            size="sm"
            onClick={handleNew}
            title="Start a blank calculator session"
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
            Save Preset
          </Button>

          {activePreset && (
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-90"
              title="Delete this saved preset"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Proper Radix Save Preset Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save Calculation Configuration</DialogTitle>
            <DialogDescription>
              Save your component stack and pricing parameters ({currency}) for future quotes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmSave} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Preset Name
              </label>
              <Input
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g. Specialty Washed Arabica 25% Margin"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Description / Notes (Optional)
              </label>
              <Input
                value={presetNotes}
                onChange={(e) => setPresetNotes(e.target.value)}
                placeholder="Notes on supplier terms, forwarder, packaging..."
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm & Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Proper Radix Confirm Dialog for Preset Deletion */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Preset"
        description={`Are you sure you want to delete "${activePreset?.name}"? This action cannot be undone.`}
        confirmText="Delete Preset"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
