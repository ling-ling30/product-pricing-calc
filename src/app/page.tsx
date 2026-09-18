"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PricingComponent, CalculationPreset } from "@/types/calculator";
import { calculatePricing, DEFAULT_COMPONENTS } from "@/services/calculation.service";
import { LocalStorageManager } from "@/lib/storage";
import { useSession } from "@/lib/auth-client";
import { PricingComponentList } from "@/components/calculator/pricing-component-list";
import { PriceSummaryHero } from "@/components/calculator/price-summary-hero";
import { WaterfallBreakdown } from "@/components/calculator/waterfall-breakdown";
import { PresetManagerBar } from "@/components/calculator/preset-manager-bar";
import { AuthButton } from "@/components/calculator/auth-button";
import { Calculator, Sparkles, Check, ArrowRight } from "lucide-react";

export default function ProductCalculatorPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);

  // Active calculator state
  const [components, setComponents] = useState<PricingComponent[]>(DEFAULT_COMPONENTS);
  const [currency, setCurrency] = useState<string>("USD");
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage on mount
  useEffect(() => {
    const savedComps = LocalStorageManager.getActiveComponents();
    const savedCurr = LocalStorageManager.getActiveCurrency();
    setComponents(savedComps);
    setCurrency(savedCurr);
    setIsInitialized(true);
  }, []);

  // Save changes to LocalStorage on edit
  useEffect(() => {
    if (!isInitialized) return;
    LocalStorageManager.saveActiveComponents(components);
    LocalStorageManager.saveActiveCurrency(currency);
  }, [components, currency, isInitialized]);

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
        // Fallback to local storage if API is unreachable
        return LocalStorageManager.getLocalPresets();
      }
    },
    initialData: () => LocalStorageManager.getLocalPresets(),
  });

  // Mutate preset (Save)
  const savePresetMutation = useMutation({
    mutationFn: async (preset: CalculationPreset) => {
      // 1. Always save in localStorage
      LocalStorageManager.saveLocalPreset(preset);

      // 2. Sync to API if online
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
    if (preset.currency) setCurrency(preset.currency);
  };

  const handleNewScratchpad = () => {
    setActivePresetId(undefined);
    setComponents([
      {
        id: `c-base-${Date.now()}`,
        name: "Direct Base Material",
        type: "fixed",
        value: 100,
        enabled: true,
        category: "material",
      },
      {
        id: `c-margin-${Date.now()}`,
        name: "Commercial Margin",
        type: "margin",
        value: 20,
        enabled: true,
        category: "profit",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-accent/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-foreground">
                  Product Price Calculator
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-semibold uppercase tracking-wider">
                  Modular Cost Engine
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Dynamic cost waterfall, subtotal %, yield loss, and target margins.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main App Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="space-y-6">
          {/* Preset Manager Toolbar */}
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
          />

          {/* Dual-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Component Builder (7 cols) */}
            <div className="lg:col-span-7 bg-card/60 p-5 md:p-6 rounded-2xl border border-border shadow-sm">
              <PricingComponentList
                components={components}
                lines={summary.lines}
                currency={currency}
                onChange={setComponents}
              />
            </div>

            {/* Right Column: Hero Price & Waterfall (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <PriceSummaryHero
                summary={summary}
                currency={currency}
                onCurrencyChange={setCurrency}
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

      {/* Footer with Craft Notes */}
      <footer className="w-full border-t border-border/60 py-6 mt-12 bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Built with TanStack Query, Better Auth, Drizzle ORM on Cloudflare D1, and Emil Kowalski Design Engineering.
          </div>
          <div className="flex items-center gap-3">
            <span>Offline-first LocalStorage</span>
            <span>•</span>
            <span>Zero-layout-shift tabular figures</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
