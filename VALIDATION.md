# Validation Notes

## Verified against the official Panta API Playground source

DecisionPulse was cross-checked against `Kaito-HQ/panta-api-playground`.

Confirmed API behavior used by the MVP:

- Market catalog: `GET /markets/`
- Market trades: `GET /markets/{marketId}/trades/`
- API authentication header: `X-Api-Key`
- Market list response uses `items` and supports `limit`
- Market data may expose `yesPrice/noPrice` or `primaryYesPrice/primaryNoPrice`
- Trade rows may expose `side`, or only `yesAmount/noAmount`

The MVP handles both price shapes and both trade-direction shapes.

## Checks run

### Static TypeScript audit

Because the execution environment could not download the npm dependency tree, a local declaration shim was used only during audit so TypeScript could validate the project's own strict-mode types and imports. Result after fixes: no internal TypeScript errors detected.

This is not a substitute for a real Next.js build.

### Logic tests

Run with Node 22 built-in TypeScript stripping:

```bash
npm run test:logic
```

Verified:

- direct YES price parsing;
- primary YES price fallback;
- primary NO price inversion;
- conviction ordering;
- YES-flow inference without explicit `side`;
- NO-flow inference without explicit `side`;
- explicit-side flow weighting.

Result in the audit environment: **PASS**.

## Remaining release gate

A network-enabled environment still needs to run:

```bash
npm install
npm run test:logic
npm run build
```

Then run the app with a real Panta API key and verify at least:

1. market list returns live items;
2. a market with primary prices does not display 50/50 incorrectly;
3. market trade flow loads;
4. server logs do not expose the API key;
5. responsive layout works on mobile and desktop.
