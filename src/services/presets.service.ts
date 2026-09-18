import { PresetsRepository } from "@/db/repositories/presets.repository";
import { CalculationPreset, PricingComponent } from "@/types/calculator";
import { DEFAULT_COMPONENTS } from "./calculation.service";

export class PresetsService {
  static async getUserPresets(userId: string): Promise<CalculationPreset[]> {
    const existing = await PresetsRepository.findByUserId(userId);
    if (existing.length === 0) {
      // Create initial default preset for new user
      const defaultPreset: CalculationPreset = {
        id: "preset-default-1",
        name: "Standard Product Cost Model",
        currency: "USD",
        components: DEFAULT_COMPONENTS,
        notes: "Default starter cost model with fixed materials, processing %, packaging, labor, and target margin.",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await PresetsRepository.upsert(defaultPreset, userId);
      return [defaultPreset];
    }
    return existing;
  }

  static async savePreset(
    userId: string,
    presetData: {
      id?: string;
      name: string;
      currency?: string;
      components: PricingComponent[];
      notes?: string;
    }
  ): Promise<CalculationPreset> {
    if (!presetData.name || presetData.name.trim() === "") {
      throw new Error("Preset name is required");
    }

    const preset: CalculationPreset = {
      id: presetData.id || `preset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: presetData.name.trim(),
      currency: presetData.currency || "USD",
      components: presetData.components || [],
      notes: presetData.notes || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return await PresetsRepository.upsert(preset, userId);
  }

  static async deletePreset(userId: string, presetId: string): Promise<boolean> {
    return await PresetsRepository.delete(presetId, userId);
  }
}
