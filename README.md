# DecisionPulse — Panta API Sidetrack MVP

DecisionPulse turns prediction-market probabilities into **decision signals**.

Instead of treating a prediction market as a destination where a user must trade, the product uses Panta as an intelligence layer for founders, traders, analysts, journalists and operators.

## Why this is different

Most prediction-market interfaces answer:

> "What is the market probability?"

DecisionPulse answers:

> "When should this probability change what I prepare or monitor?"

It adds:

- probability + volume normalization
- transparent conviction score
- configurable decision thresholds
- watchlist persisted in the browser
- YES / NO scenario guidance
- recent trade-flow bias when available
- a clean market radar ranked by conviction
- server-side Panta API proxy so API keys are never exposed to the browser
- graceful demo fallback for public demos without secrets

## Panta integration

The official Panta API playground documents:

- `GET /markets/`
- `GET /markets/{id}/trades/`
- positions, create-market, primary-buy, claim and trade-report flows

This MVP intentionally starts **read-only**. It demonstrates a new product surface built on top of Panta data without requiring users to risk capital.

Attribution is visible in-product: **Powered by Panta**.

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set:

```bash
PANTA_API_KEY=pk_test_...
PANTA_API_BASE_URL=https://live-api.panta.market/api/v1
```

If `PANTA_API_KEY` is absent, the app automatically uses demo data so the UX can still be reviewed.

## Deploy

Vercel:

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Add `PANTA_API_KEY` as a server-side environment variable.
4. Deploy.

## Hackathon positioning

### Problem
Prediction markets contain useful crowd information, but consuming dozens of markets manually is noisy and time-consuming.

### Solution
DecisionPulse ranks markets by conviction, turns probabilities into threshold-based triggers, and surfaces scenario actions in one screen.

### Users
- crypto traders monitoring event risk
- founders tracking regulatory / market catalysts
- analysts and researchers
- journalists monitoring changing consensus
- communities building dashboards around live events

### Next steps
- probability history + velocity
- alerts (email / Telegram)
- custom decision playbooks
- embed widgets for third-party dashboards
- Panta execution hand-off for users who explicitly want to trade
- AI-generated evidence summaries that remain separate from market probability

## Scoring transparency

The current conviction score is intentionally simple and auditable:

- 75%: distance from 50/50 probability
- 25%: logarithmic volume confidence boost

It is **not** a financial recommendation or prediction model.

## Submission checklist

- [ ] Public GitHub repo
- [ ] Live Vercel deployment
- [ ] Free Panta API account/key configured
- [ ] Main Colosseum Crypto World's Fair submission
- [ ] Panta API sidetrack submission on Superteam Earn
- [ ] 60–90 sec product demo
- [ ] README screenshots
- [ ] 3–5 real users / feedback quotes if possible

## License

Hackathon prototype. Add your preferred open-source license before public submission.
