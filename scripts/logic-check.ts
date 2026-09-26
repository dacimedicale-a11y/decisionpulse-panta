import assert from "node:assert/strict";
import { conviction, flowBias, probability } from "../src/lib/scoring.ts";

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

assert.ok(close(probability({ marketId: "1", category: "x", title: "x", phase: "active", yesPrice: "0.71" }), 0.71));
assert.ok(close(probability({ marketId: "1", category: "x", title: "x", phase: "active", primaryYesPrice: "0.64" }), 0.64));
assert.ok(close(probability({ marketId: "1", category: "x", title: "x", phase: "active", primaryNoPrice: "0.80" }), 0.20));
assert.ok(
  conviction({ marketId: "1", category: "x", title: "x", phase: "active", yesPrice: "0.90", totalVolumeUsdc: "10000" }) >
    conviction({ marketId: "2", category: "x", title: "x", phase: "active", yesPrice: "0.55", totalVolumeUsdc: "10000" }),
);
assert.equal(flowBias([{ yesAmount: "100", noAmount: "0" }]).label, "YES flow");
assert.equal(flowBias([{ yesAmount: "0", noAmount: "100" }]).label, "NO flow");
assert.equal(flowBias([{ side: "YES", amountUsdc: "75" }, { side: "NO", amountUsdc: "25" }]).score, 75);

console.log("DecisionPulse logic checks: PASS");
