import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ marketId: string }> }
) {
  const { marketId } = await context.params;
  const base =
    process.env.PANTA_API_BASE_URL || "https://live-api.panta.market/api/v1";
  const apiKey = process.env.PANTA_API_KEY;

  if (!apiKey || marketId.startsWith("demo-")) {
    return NextResponse.json({ marketId, items: [], source: "demo" });
  }

  try {
    const response = await fetch(
      `${base}/markets/${encodeURIComponent(marketId)}/trades/?limit=50`,
      {
        headers: {
          Accept: "application/json",
          "X-Api-Key": apiKey
        },
        cache: "no-store"
      }
    );

    const raw = await response.text();
    let body: unknown;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch {
      body = { raw };
    }

    if (!response.ok) {
      return NextResponse.json({
        marketId,
        items: [],
        source: "panta-error",
        status: response.status
      });
    }

    return NextResponse.json({
      ...((body && typeof body === "object" && !Array.isArray(body)) ? body : {}),
      source: "panta-live"
    });
  } catch {
    return NextResponse.json({ marketId, items: [], source: "network-fallback" });
  }
}
