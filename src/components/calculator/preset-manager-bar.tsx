"use client";

import React, { useState } from "react";
import { CalculationPreset, PricingComponent } from "@/types/calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Save, Plus, Trash2, Cloud, HardDrive } from "lucide-react";

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
}: PresetManagerBarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    if (!presetName.trim()) return;

    const newPreset: CalculationPreset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: presetName.trim(),
      currency,
      components: currentComponents,
      notes: presetNotes.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onSavePreset(newPreset);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-sm">
        {/* Preset Selector */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <Bookmark className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1 max-w-xs">
            <Select
              value={activePresetId || ""}
              onChange={(e) => {
                const found = presets.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
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

        {/* Preset Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNewScratchpad}
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
              onClick={() => onDeletePreset(activePreset.id)}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-90"
              title="Delete this saved preset"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Save Preset Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Save Calculation Configuration"
        description="Save your component stack and pricing parameters for future quotes."
      >
        <form onSubmit={handleConfirmSave} className="space-y-4 mt-4">
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

          <div className="flex justify-end gap-2 pt-2">
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
          </div>
        </form>
      </Dialog>
    </>
  );
}
