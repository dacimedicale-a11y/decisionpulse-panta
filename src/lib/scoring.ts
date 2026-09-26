import type { Market, Trade } from "./types";

export function numberish(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function probability(market: Market): number {
  const yes = numberish(market.yesPrice ?? market.primaryYesPrice, NaN);
  if (Number.isFinite(yes)) return Math.min(1, Math.max(0, yes));
  const no = numberish(market.noPrice ?? market.primaryNoPrice, NaN);
  if (Number.isFinite(no)) return Math.min(1, Math.max(0, 1 - no));
  return 0.5;
}

export function volume(market: Market): number {
  return numberish(market.totalVolumeUsdc ?? market.volumeUsdc, 0);
}

export function conviction(market: Market): number {
  // A transparent, intentionally simple signal:
  // distance from 50/50 × a mild volume confidence boost.
  const p = probability(market);
  const directional = Math.abs(p - 0.5) * 2;
  const volBoost = Math.min(1, Math.log10(volume(market) + 1) / 5);
  return Math.round((directional * 0.75 + volBoost * 0.25) * 100);
}

export function signalLabel(market: Market): string {
  const p = probability(market);
  const c = conviction(market);
  if (c < 35) return "Uncertain";
  if (p >= 0.72) return "Strong YES";
  if (p >= 0.58) return "Leaning YES";
  if (p <= 0.28) return "Strong NO";
  if (p <= 0.42) return "Leaning NO";
  return "Balanced";
}

export function decisionText(market: Market): string {
  const p = probability(market);
  const c = conviction(market);
  if (c < 35) {
    return "Evidence is still mixed. Treat this market as a monitoring signal, not a trigger.";
  }
  if (p >= 0.72) {
    return "YES probability is high enough to justify preparing the YES scenario now.";
  }
  if (p <= 0.28) {
    return "NO probability dominates. Prioritize the NO scenario and keep a reversal trigger.";
  }
  return "The market has a directional lean, but the edge is not yet decisive. Stage both scenarios.";
}

export function flowBias(trades: Trade[]): { label: string; score: number } {
  let yes = 0;
  let no = 0;

  for (const t of trades) {
    const amount = numberish(t.amountUsdc, 0);
    const side = String(t.side || "").toLowerCase();
    const yesShares = numberish(t.yesAmount, 0);
    const noShares = numberish(t.noAmount, 0);

    if (side.includes("yes")) {
      yes += amount || yesShares;
    } else if (side.includes("no")) {
      no += amount || noShares;
    } else if (yesShares > noShares) {
      // Catalog share values are 1e6 base units in Panta's official playground.
      yes += yesShares / 1_000_000;
    } else if (noShares > yesShares) {
      no += noShares / 1_000_000;
    }
  }

  const total = yes + no;
  if (total <= 0) return { label: "No recent flow", score: 50 };
  const yesPct = Math.round((yes / total) * 100);
  if (yesPct >= 65) return { label: "YES flow", score: yesPct };
  if (yesPct <= 35) return { label: "NO flow", score: yesPct };
  return { label: "Balanced flow", score: yesPct };
}
