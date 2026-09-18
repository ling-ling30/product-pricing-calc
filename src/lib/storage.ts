import { CalculationPreset, PricingComponent } from "@/types/calculator";
import { DEFAULT_COMPONENTS } from "@/services/calculation.service";

const LOCAL_STORAGE_ACTIVE_KEY = "cpc_active_components";
const LOCAL_STORAGE_PRESETS_KEY = "cpc_saved_presets";
const LOCAL_STORAGE_CURRENCY_KEY = "cpc_currency";

export class LocalStorageManager {
  static getActiveComponents(): PricingComponent[] {
    if (typeof window === "undefined") return DEFAULT_COMPONENTS;
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_ACTIVE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
    }
    return DEFAULT_COMPONENTS;
  }

  static saveActiveComponents(components: PricingComponent[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(components));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }

  static getActiveCurrency(): string {
    if (typeof window === "undefined") return "USD";
    return localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY) || "USD";
  }

  static saveActiveCurrency(currency: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, currency);
  }

  static getLocalPresets(): CalculationPreset[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_PRESETS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Failed to read presets from localStorage", e);
    }
    return [];
  }

  static saveLocalPreset(preset: CalculationPreset): void {
    if (typeof window === "undefined") return;
    try {
      const presets = this.getLocalPresets();
      const idx = presets.findIndex((p) => p.id === preset.id);
      if (idx >= 0) {
        presets[idx] = preset;
      } else {
        presets.unshift(preset);
      }
      localStorage.setItem(LOCAL_STORAGE_PRESETS_KEY, JSON.stringify(presets));
    } catch (e) {
      console.error("Failed to save preset to localStorage", e);
    }
  }

  static deleteLocalPreset(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const presets = this.getLocalPresets().filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_PRESETS_KEY, JSON.stringify(presets));
    } catch (e) {
      console.error("Failed to delete preset from localStorage", e);
    }
  }
}
