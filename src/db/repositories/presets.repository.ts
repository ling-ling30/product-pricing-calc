import { isCloudflareD1Configured, queryD1 } from "../index";
import { CalculationPreset, PricingComponent } from "@/types/calculator";
import fs from "fs";
import path from "path";

// Local fallback storage for development without D1
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_PRESETS_FILE = path.join(LOCAL_DATA_DIR, "presets.json");

function getLocalPresets(): Record<string, CalculationPreset[]> {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_PRESETS_FILE)) {
    fs.writeFileSync(LOCAL_PRESETS_FILE, JSON.stringify({}), "utf-8");
    return {};
  }
  try {
    const content = fs.readFileSync(LOCAL_PRESETS_FILE, "utf-8");
    return JSON.parse(content || "{}");
  } catch {
    return {};
  }
}

function saveLocalPresets(data: Record<string, CalculationPreset[]>) {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(LOCAL_PRESETS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export class PresetsRepository {
  static async findByUserId(userId: string): Promise<CalculationPreset[]> {
    if (isCloudflareD1Configured()) {
      const sql = `
        SELECT id, user_id, name, currency, components, notes, created_at, updated_at
        FROM calculation_presets
        WHERE user_id = ?
        ORDER BY updated_at DESC
      `;
      interface D1PresetRow {
        id: string;
        user_id: string;
        name: string;
        currency: string;
        components: string;
        notes?: string;
        created_at: number;
        updated_at: number;
      }
      const rows = await queryD1<D1PresetRow>(sql, [userId]);
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        currency: r.currency || "USD",
        components: JSON.parse(r.components || "[]") as PricingComponent[],
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }

    // Local file fallback
    const localData = getLocalPresets();
    return localData[userId] || [];
  }

  static async findById(id: string): Promise<CalculationPreset | null> {
    if (isCloudflareD1Configured()) {
      const sql = `SELECT * FROM calculation_presets WHERE id = ? LIMIT 1`;
      interface D1PresetRow {
        id: string;
        user_id: string;
        name: string;
        currency: string;
        components: string;
        notes?: string;
        created_at: number;
        updated_at: number;
      }
      const rows = await queryD1<D1PresetRow>(sql, [id]);
      if (!rows.length) return null;
      const r = rows[0];
      return {
        id: r.id,
        name: r.name,
        currency: r.currency || "USD",
        components: JSON.parse(r.components || "[]"),
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    }

    const localData = getLocalPresets();
    for (const list of Object.values(localData)) {
      const found = list.find((p) => p.id === id);
      if (found) return found;
    }
    return null;
  }

  static async upsert(
    preset: CalculationPreset,
    userId: string
  ): Promise<CalculationPreset> {
    const now = Date.now();
    const updatedPreset: CalculationPreset = {
      ...preset,
      updatedAt: now,
      createdAt: preset.createdAt || now,
    };

    if (isCloudflareD1Configured()) {
      const sql = `
        INSERT INTO calculation_presets (id, user_id, name, currency, components, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          currency = excluded.currency,
          components = excluded.components,
          notes = excluded.notes,
          updated_at = excluded.updated_at
      `;
      await queryD1(sql, [
        updatedPreset.id,
        userId,
        updatedPreset.name,
        updatedPreset.currency,
        JSON.stringify(updatedPreset.components),
        updatedPreset.notes || null,
        updatedPreset.createdAt,
        updatedPreset.updatedAt,
      ]);
      return updatedPreset;
    }

    // Local file fallback
    const localData = getLocalPresets();
    const userList = localData[userId] || [];
    const index = userList.findIndex((p) => p.id === updatedPreset.id);

    if (index >= 0) {
      userList[index] = updatedPreset;
    } else {
      userList.unshift(updatedPreset);
    }
    localData[userId] = userList;
    saveLocalPresets(localData);
    return updatedPreset;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    if (isCloudflareD1Configured()) {
      const sql = `DELETE FROM calculation_presets WHERE id = ? AND user_id = ?`;
      await queryD1(sql, [id, userId]);
      return true;
    }

    const localData = getLocalPresets();
    const userList = localData[userId] || [];
    localData[userId] = userList.filter((p) => p.id !== id);
    saveLocalPresets(localData);
    return true;
  }
}
