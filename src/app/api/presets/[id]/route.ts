import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PresetsService } from "@/services/presets.service";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id || "anonymous-guest";
    const success = await PresetsService.deletePreset(userId, id);

    return NextResponse.json({ success });
  } catch (error: unknown) {
    console.error("DELETE /api/presets/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete preset",
      },
      { status: 500 }
    );
  }
}
