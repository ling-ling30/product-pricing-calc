"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PricingComponent, CalculationPreset } from "@/types/calculator";
import { calculatePricing } from "@/services/calculation.service";
import { LocalStorageManager } from "@/lib/storage";
import { useSession } from "@/lib/auth-client";
import { PricingComponentList } from "@/components/calculator/pricing-component-list";
import { PriceSummaryHero } from "@/components/calculator/price-summary-hero";
import { WaterfallBreakdown } from "@/components/calculator/waterfall-breakdown";
import { PresetManagerBar } from "@/components/calculator/preset-manager-bar";
import { AuthButton } from "@/components/calculator/auth-button";
import { Calculator } from "lucide-react";

export default function ProductCalculatorPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);

  // Active calculator state - fresh blank canvas by default
  const [components, setComponents] = useState<PricingComponent[]>([]);
  const [currency, setCurrency] = useState<string>("USD");
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage on mount
  useEffect(() => {
    const savedComps = LocalStorageManager.getActiveComponents();
    const savedCurr = LocalStorageManager.getActiveCurrency();
    setComponents(savedComps);
    if (savedCurr) {
      setCurrency(savedCurr);
    }
    setIsInitialized(true);
  }, []);

  // Save changes to LocalStorage on edit
  useEffect(() => {
    if (!isInitialized) return;
    LocalStorageManager.saveActiveComponents(components);
    LocalStorageManager.saveActiveCurrency(currency);
  }, [components, currency, isInitialized]);

  // Handle base currency change
  const handleCurrencyChange = (newBase: string) => {
    setCurrency(newBase);
  };

  // Fetch presets via TanStack Query
  const { data: presetsData } = useQuery({
    queryKey: ["presets", session?.user?.id || "guest"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/presets");
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        return (json.data as CalculationPreset[]) || [];
      } catch {
        return LocalStorageManager.getLocalPresets();
      }
    },
    initialData: () => LocalStorageManager.getLocalPresets(),
  });

  // Mutate preset (Save)
  const savePresetMutation = useMutation({
    mutationFn: async (preset: CalculationPreset) => {
      LocalStorageManager.saveLocalPreset(preset);
      try {
        await fetch("/api/presets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preset),
        });
      } catch (e) {
        console.warn("API sync skipped, preserved locally:", e);
      }
      return preset;
    },
    onSuccess: (savedPreset) => {
      setActivePresetId(savedPreset.id);
      queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });

  // Delete preset
  const deletePresetMutation = useMutation({
    mutationFn: async (id: string) => {
      LocalStorageManager.deleteLocalPreset(id);
      try {
        await fetch(`/api/presets/${id}`, { method: "DELETE" });
      } catch (e) {
        console.warn("API delete skipped, removed locally:", e);
      }
      return id;
    },
    onSuccess: (deletedId) => {
      if (activePresetId === deletedId) {
        setActivePresetId(undefined);
      }
      queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });

  // Pure functional calculation evaluation
  const summary = useMemo(
    () => calculatePricing(components, currency),
    [components, currency]
  );

  const activeCount = useMemo(
    () => components.filter((c) => c.enabled).length,
    [components]
  );

  const handleSelectPreset = (preset: CalculationPreset) => {
    setActivePresetId(preset.id);
    setComponents(preset.components);
    if (preset.currency) {
      handleCurrencyChange(preset.currency);
    }
  };

  const handleNewScratchpad = () => {
    setActivePresetId(undefined);
    setComponents([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary/10">
      {/* Apple Translucent Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 apple-glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Calculator className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-foreground">
                Product Calculator
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Build your price step by step.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-7 flex-1">
        <div className="space-y-6">
          {/* Saved Products Toolbar */}
          <PresetManagerBar
            presets={presetsData || []}
            activePresetId={activePresetId}
            currentComponents={components}
            currency={currency}
            isAuthenticated={isAuthenticated}
            onSelectPreset={handleSelectPreset}
            onSavePreset={(preset) => savePresetMutation.mutate(preset)}
            onDeletePreset={(id) => deletePresetMutation.mutate(id)}
            onNewScratchpad={handleNewScratchpad}
            onCurrencyChange={handleCurrencyChange}
          />

          {/* Dual-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Cost Items Builder (7 cols) */}
            <div className="lg:col-span-7 bg-card p-5 sm:p-6 rounded-2xl border border-border/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <PricingComponentList
                components={components}
                lines={summary.lines}
                currency={currency}
                onChange={setComponents}
              />
            </div>

            {/* Right Column: Hero Selling Price & Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-21">
              <PriceSummaryHero
                summary={summary}
                currency={currency}
                onCurrencyChange={handleCurrencyChange}
                activeCount={activeCount}
                totalCount={components.length}
              />

              <WaterfallBreakdown
                summary={summary}
                currency={currency}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Quiet, Minimalist Footer */}
      <footer className="w-full border-t border-border/40 py-5 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>Product Calculator</span>
          <span>Clear, confident pricing</span>
        </div>
      </footer>
    </div>
  );
}
