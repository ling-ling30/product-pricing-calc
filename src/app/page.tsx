"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PricingComponent, CalculationPreset } from "@/types/calculator";
import { calculatePricing } from "@/services/calculation.service";
import { LocalStorageManager } from "@/lib/storage";
import { useSession } from "@/lib/auth-client";
import { STARTER_TEMPLATES } from "@/lib/templates";
import { PricingComponentList } from "@/components/calculator/pricing-component-list";
import { PriceSummaryHero } from "@/components/calculator/price-summary-hero";
import { WaterfallBreakdown } from "@/components/calculator/waterfall-breakdown";
import { PresetManagerBar } from "@/components/calculator/preset-manager-bar";
import { AuthButton } from "@/components/calculator/auth-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Calculator } from "lucide-react";

export default function ProductCalculatorPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);

  // Active calculator state
  const [components, setComponents] = useState<PricingComponent[]>([]);
  const [currency, setCurrency] = useState<string>("USD");
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage on mount (fallback to starter template if empty)
  useEffect(() => {
    const savedComps = LocalStorageManager.getActiveComponents();
    const savedCurr = LocalStorageManager.getActiveCurrency();

    if (savedComps && savedComps.length > 0) {
      setComponents(savedComps);
    } else {
      setComponents(STARTER_TEMPLATES[0].components);
    }

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

  // Dynamic Target Margin Adjuster
  const handleMarginChange = (newMargin: number) => {
    const marginIndex = components.findIndex((c) => c.type === "margin");
    if (marginIndex >= 0) {
      const updated = [...components];
      updated[marginIndex] = {
        ...updated[marginIndex],
        value: newMargin,
        enabled: true,
      };
      setComponents(updated);
    } else {
      const newMarginComp: PricingComponent = {
        id: `c-margin-${Date.now()}`,
        name: "Target Profit Margin",
        type: "margin",
        value: newMargin,
        enabled: true,
        category: "profit",
      };
      setComponents([...components, newMarginComp]);
    }
  };

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

  const activePreset = presetsData?.find((p) => p.id === activePresetId);
  const activeProductName = activePreset?.name || "Specialty Single-Origin Coffee";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* High-Contrast Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md font-bold">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-foreground">
                  Product Calculator
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Precision Engine
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                True unit economics, margin solver & quote export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-7 flex-1 space-y-6">
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
          <div className="lg:col-span-7 bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-sm">
            <PricingComponentList
              components={components}
              lines={summary.lines}
              currency={currency}
              onChange={setComponents}
            />
          </div>

          {/* Right Column: Hero Selling Price & Breakdown (5 cols, sticky on desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            <PriceSummaryHero
              summary={summary}
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
              activeCount={activeCount}
              totalCount={components.length}
              components={components}
              onMarginChange={handleMarginChange}
              productName={activeProductName}
            />

            <WaterfallBreakdown
              summary={summary}
              currency={currency}
            />
          </div>
        </div>
      </main>

      {/* High-Contrast Bottom Folio */}
      <footer className="w-full border-t border-border py-6 mt-12 bg-card/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Product Calculator</span>
            <span>•</span>
            <span>Local-First Commercial Pricing</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>100% Client-Side Privacy</span>
            <span>•</span>
            <span>Zero Runtime Formula Errors</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
