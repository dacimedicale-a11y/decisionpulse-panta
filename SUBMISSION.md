# DecisionPulse — Submission Pack

## One-line pitch

DecisionPulse turns Panta prediction markets into an actionable intelligence dashboard: conviction scores, decision thresholds, market-flow bias, watchlists, and scenario triggers.

## Problem

Prediction markets aggregate useful crowd information, but most products still present that information as a trading destination. Users who care about a catalyst — traders, founders, analysts, journalists, communities — often need a faster answer: **when has market consensus changed enough that I should prepare a different scenario?**

## Solution

DecisionPulse uses Panta as the prediction-market infrastructure and adds a decision layer on top:

1. Browse live Panta markets.
2. Normalize YES/NO probability and volume.
3. Rank markets by a transparent conviction score.
4. Add markets to a personal watchlist.
5. Set a decision threshold, e.g. YES >= 70% or NO >= 70%.
6. Inspect recent trade-flow bias.
7. Read an explicit scenario action: prepare, monitor, or reassess.

The product does not require the user to place a trade. Panta market data itself becomes a new intelligence primitive.

## Panta API integration

Current MVP uses:

- `GET /markets/?limit=50` — market discovery, prices, phases, categories and volume.
- `GET /markets/{marketId}/trades/?limit=50` — recent market flow.

The API key is read only on the server by Next.js route handlers. It is never sent to the browser.

The architecture is deliberately expandable to Panta's positions, create-market, buy and claim flows, but the hackathon MVP stays read-only so the core use case is clear.

## Why Panta is essential

Without Panta, DecisionPulse has no real-time market consensus, price, volume or trade-flow layer. Panta is not a logo integration: its markets are the data substrate the product transforms into decision signals.

## Judging-criteria mapping

### Panta API Integration
Meaningful use of market discovery, market prices, volume and trade-flow data. Server-side API-key isolation.

### Technical Execution
Next.js + TypeScript, server proxy routes, demo-safe fallback, transparent scoring, responsive UI, local watchlist persistence, reusable scoring functions.

### Product & UX
One screen answers four questions quickly: what changed, how strong is the signal, is my threshold crossed, and what scenario should I prepare?

### Originality
The product treats prediction markets as an **intelligence feed**, not only as a place to trade.

### Impact Potential
The same layer can be embedded into trading terminals, newsroom dashboards, founder risk monitors, community tools, research workflows and AI agents.

### Traction plan
Before judging:

- put the live deployment in front of 5–10 users;
- collect one-line feedback;
- record watchlist usage / threshold selections anonymously;
- add 2–3 screenshots of real Panta markets;
- include early feedback in the final submission.

## 90-second demo script

**0–10 sec — Problem**
"Prediction markets contain useful information, but a list of odds does not tell an operator when that information should change a decision."

**10–25 sec — Market Radar**
Open DecisionPulse. Show live Panta markets ranked by conviction. Point out probability, volume and category.

**25–40 sec — Decision threshold**
Move the global threshold from 70% to 75%. Show how watched markets move between Monitoring and YES/NO triggered states.

**40–55 sec — Market detail**
Open one market. Show YES probability, conviction, volume and recent flow. Explain that trade flow comes from Panta's market-trades endpoint.

**55–70 sec — Scenario layer**
Show the Decision Layer card: signal label, trigger state and the two scenario responses.

**70–82 sec — Why Panta**
"Panta supplies the prediction-market infrastructure and live data. DecisionPulse turns that raw market information into a reusable decision layer."

**82–90 sec — Future**
Briefly mention alerting, probability velocity, embeds and optional Panta execution hand-off.

## Submission description (short)

DecisionPulse is a decision-intelligence dashboard powered by Panta. It converts prediction-market probabilities, volume and recent trade flow into conviction scores, configurable triggers and scenario guidance. Users can monitor catalysts without having to trade, making Panta market data useful inside research, trading, founder, media and community workflows.

## Submission checklist

- [x] Product concept
- [x] Next.js / TypeScript MVP
- [x] Server-side Panta integration routes
- [x] Responsive dashboard UI
- [x] Demo fallback
- [x] Watchlist + decision thresholds
- [x] Logic checks
- [ ] Create free Panta account/API key
- [ ] Run full `npm install && npm run build` on network-enabled machine
- [ ] Deploy public URL
- [ ] Verify live Panta data
- [ ] Record 60–90 second demo
- [ ] Collect initial user feedback
- [ ] Submit to official Crypto World's Fair
- [ ] Submit same project to Panta Sidetrack on Superteam Earn
