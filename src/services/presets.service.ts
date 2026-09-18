import { PresetsRepository } from "@/db/repositories/presets.repository";
import { CalculationPreset, PricingComponent } from "@/types/calculator";
import { DEFAULT_COMPONENTS } from "./calculation.service";

export class PresetsService {
  static async getUserPresets(userId: string): Promise<CalculationPreset[]> {
    return await PresetsRepository.findByUserId(userId);
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
