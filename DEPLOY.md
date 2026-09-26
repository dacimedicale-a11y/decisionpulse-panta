# Deploy DecisionPulse

## Fast path: GitHub → Vercel

1. Create a new **public** GitHub repository named `decisionpulse-panta`.
2. Push this project to the repository's `main` branch.
3. In Vercel, choose **Add New → Project** and import `decisionpulse-panta`.
4. Framework preset should be detected as **Next.js**.
5. Add these environment variables:

```text
PANTA_API_BASE_URL=https://live-api.panta.market/api/v1
PANTA_API_KEY=<your Panta test API key>
```

6. Deploy.
7. Open `/api/markets` on the deployment and confirm `"source":"panta-live"`.
8. Open the homepage and confirm the top-right status says **Panta live**.

## Release gates

Before submitting:

```bash
npm install --no-audit --no-fund
npm run preflight
npm run test:logic
npm run build
```

Expected:

```text
DecisionPulse preflight: PASS
DecisionPulse logic checks: PASS
```

The build must exit with code 0.

## No API key yet?

The app deliberately falls back to demo data. That is useful for UI review, but **do not submit the project as a live Panta integration until `/api/markets` reports `panta-live`.**

## Static preview

`demo/standalone.html` is a zero-dependency visual preview. It is not the hackathon production deployment and does not call Panta.
