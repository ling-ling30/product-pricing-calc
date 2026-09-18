import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PresetsService } from "@/services/presets.service";
import { DEFAULT_COMPONENTS } from "@/services/calculation.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If authenticated, fetch user presets; if not, return default starter preset
    const userId = session?.user?.id || "anonymous-guest";
    const presets = await PresetsService.getUserPresets(userId);

    return NextResponse.json({
      success: true,
      data: presets,
      authenticated: Boolean(session?.user),
    });
  } catch (error: unknown) {
    console.error("GET /api/presets error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch presets",
        data: [
          {
            id: "preset-fallback",
            name: "Default Product Model",
            currency: "USD",
            components: DEFAULT_COMPONENTS,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id || "anonymous-guest";
    const body = await request.json();

    if (!body || !body.name) {
      return NextResponse.json(
        { success: false, error: "Preset name is required" },
        { status: 400 }
      );
    }

    const saved = await PresetsService.savePreset(userId, {
      id: body.id,
      name: body.name,
      currency: body.currency,
      components: body.components,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (error: unknown) {
    console.error("POST /api/presets error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save preset",
      },
      { status: 500 }
    );
  }
}
