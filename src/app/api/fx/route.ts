import { NextResponse } from "next/server";
import { FALLBACK_RATES } from "@/services/fx.service";

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 1800 }, // Cache for 30 minutes on edge
    });

    if (!res.ok) {
      throw new Error(`Open FX API responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      provider: "open.er-api.com",
      updatedAt: data.time_last_update_utc || new Date().toISOString(),
      rates: data.rates || FALLBACK_RATES,
    });
  } catch (error: unknown) {
    console.warn("FX fetch failed, serving fallback exchange rates:", error);
    return NextResponse.json({
      success: true,
      provider: "fallback",
      updatedAt: new Date().toISOString(),
      rates: FALLBACK_RATES,
    });
  }
}
