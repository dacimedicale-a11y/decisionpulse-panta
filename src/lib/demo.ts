import type { Market } from "./types";

export const demoMarkets: Market[] = [
  {
    marketId: "demo-1",
    category: "Crypto",
    title: "Will SOL close above a major resistance level this week?",
    description: "Demo fallback market shown until a Panta API key is configured.",
    phase: "active",
    yesPrice: "0.71",
    noPrice: "0.29",
    totalVolumeUsdc: "18420",
    region: "Global"
  },
  {
    marketId: "demo-2",
    category: "Macro",
    title: "Will the next major inflation print come in below consensus?",
    description: "DecisionPulse can convert any Panta market into a monitored decision trigger.",
    phase: "active",
    yesPrice: "0.43",
    noPrice: "0.57",
    totalVolumeUsdc: "9630",
    region: "Global"
  },
  {
    marketId: "demo-3",
    category: "Technology",
    title: "Will a major AI product milestone ship before quarter end?",
    description: "Use prediction markets as an intelligence layer rather than a betting destination.",
    phase: "active",
    yesPrice: "0.82",
    noPrice: "0.18",
    totalVolumeUsdc: "22100",
    region: "Global"
  },
  {
    marketId: "demo-4",
    category: "Sports",
    title: "Will the favorite win the featured event?",
    description: "The dashboard remains category-agnostic.",
    phase: "active",
    yesPrice: "0.54",
    noPrice: "0.46",
    totalVolumeUsdc: "31200",
    region: "Global"
  }
];
