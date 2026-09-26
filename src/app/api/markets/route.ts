import { NextResponse } from "next/server";
import { demoMarkets } from "@/lib/demo";

export const dynamic = "force-dynamic";

export async function GET() {
  const base =
    process.env.PANTA_API_BASE_URL || "https://live-api.panta.market/api/v1";
  const apiKey = process.env.PANTA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      source: "demo",
      items: demoMarkets,
      note: "Set PANTA_API_KEY to switch this deployment to live Panta data."
    });
  }

  try {
    const response = await fetch(`${base}/markets/?limit=50`, {
      headers: {
        Accept: "application/json",
        "X-Api-Key": apiKey
      },
      cache: "no-store"
    });

    const raw = await response.text();
    let body: unknown;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch {
      body = { raw };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          source: "panta-error",
          status: response.status,
          upstream: body,
          items: demoMarkets
        },
        { status: 200 }
      );
    }

    const data = body as { items?: unknown[] };
    return NextResponse.json({
      ...((body && typeof body === "object" && !Array.isArray(body)) ? body : {}),
      source: "panta-live",
      items: Array.isArray(data?.items) ? data.items : []
    });
  } catch (error) {
    return NextResponse.json({
      source: "network-fallback",
      error: error instanceof Error ? error.message : "Unknown error",
      items: demoMarkets
    });
  }
}
