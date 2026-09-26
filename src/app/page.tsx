"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type MouseEvent, type KeyboardEvent } from "react";
import type { Market, Trade } from "@/lib/types";
import {
  conviction,
  decisionText,
  flowBias,
  probability,
  signalLabel,
  volume
} from "@/lib/scoring";

type ApiResponse = {
  source?: string;
  items?: Market[];
};

function pct(p: number) {
  return `${Math.round(p * 100)}%`;
}

function money(v: number) {
  return new Intl.NumberFormat("en-US", {
    notation: v >= 100_000 ? "compact" : "standard",
    maximumFractionDigits: 0
  }).format(v);
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [source, setSource] = useState("loading");
  const [selectedId, setSelectedId] = useState<string>("");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(70);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("dp-watchlist") || "[]");
      if (Array.isArray(stored)) setWatchlist(stored);
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/markets")
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        if (cancelled) return;
        const next = Array.isArray(data.items) ? data.items : [];
        setMarkets(next);
        setSource(data.source || "unknown");
        if (next.length) setSelectedId(next[0].marketId);
      })
      .catch(() => setSource("error"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setTrades([]);
    fetch(`/api/markets/${encodeURIComponent(selectedId)}/trades`)
      .then((r) => r.json())
      .then((data) => setTrades(Array.isArray(data.items) ? data.items : []))
      .catch(() => setTrades([]));
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return markets
      .filter((m) => {
        if (!q) return true;
        return [m.title, m.category, m.description, m.region]
          .filter(Boolean)
          .some((x) => String(x).toLowerCase().includes(q));
      })
      .sort((a, b) => conviction(b) - conviction(a));
  }, [markets, query]);

  const selected =
    markets.find((m) => m.marketId === selectedId) || filtered[0] || markets[0];

  const watchMarkets = markets.filter((m) => watchlist.includes(m.marketId));
  const triggered = watchMarkets.filter(
    (m) => probability(m) * 100 >= threshold || probability(m) * 100 <= 100 - threshold
  );

  function toggleWatch(id: string) {
    const next = watchlist.includes(id)
      ? watchlist.filter((x) => x !== id)
      : [...watchlist, id];
    setWatchlist(next);
    localStorage.setItem("dp-watchlist", JSON.stringify(next));
  }

  const flow = flowBias(trades);

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <div className="logo">DP</div>
          <div>
            <strong>DecisionPulse</strong>
            <span>Prediction markets → decision signals</span>
          </div>
        </div>
        <div className="source">
          <span className={`dot ${source === "panta-live" ? "live" : ""}`} />
          {source === "panta-live" ? "Panta live" : source === "loading" ? "Loading" : "Demo fallback"}
        </div>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow">POWERED BY PANTA</div>
          <h1>Stop watching odds.<br />Start using them.</h1>
          <p>
            DecisionPulse turns prediction-market probabilities into a compact
            intelligence layer: conviction scores, decision triggers, flow bias
            and scenario guidance.
          </p>
        </div>
        <div className="heroCard">
          <span>Decision trigger</span>
          <strong>{threshold}%</strong>
          <input
            aria-label="Decision threshold"
            type="range"
            min="55"
            max="90"
            value={threshold}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setThreshold(Number(e.target.value))}
          />
          <small>
            Alert when YES ≥ {threshold}% or NO ≥ {threshold}%.
          </small>
        </div>
      </section>

      <section className="stats">
        <div><span>Markets scanned</span><strong>{markets.length}</strong></div>
        <div><span>Watchlist</span><strong>{watchlist.length}</strong></div>
        <div><span>Triggers active</span><strong>{triggered.length}</strong></div>
        <div>
          <span>Highest conviction</span>
          <strong>{markets.length ? `${Math.max(...markets.map(conviction))}%` : "—"}</strong>
        </div>
      </section>

      <div className="workspace">
        <section className="marketPanel">
          <div className="panelHeader">
            <div>
              <span className="kicker">MARKET RADAR</span>
              <h2>Signals ranked by conviction</h2>
            </div>
            <input
              className="search"
              placeholder="Search markets..."
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="empty">Loading market intelligence…</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No matching markets.</div>
          ) : (
            <div className="marketList">
              {filtered.map((market) => {
                const p = probability(market);
                const c = conviction(market);
                const active = selected?.marketId === market.marketId;
                const watched = watchlist.includes(market.marketId);
                return (
                  <div
                    key={market.marketId}
                    className={`marketRow ${active ? "active" : ""}`}
                    onClick={() => setSelectedId(market.marketId)}
                    onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(market.marketId);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="probRing" style={{ ["--p" as string]: `${p * 100}%` }}>
                      <span>{pct(p)}</span>
                    </div>
                    <div className="marketCopy">
                      <div className="meta">
                        <span>{market.category || "Market"}</span>
                        <span>{signalLabel(market)}</span>
                      </div>
                      <strong>{market.title}</strong>
                      <small>${money(volume(market))} volume · conviction {c}%</small>
                    </div>
                    <button
                      type="button"
                      className={`watch ${watched ? "on" : ""}`}
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        toggleWatch(market.marketId);
                      }}
                      aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      {watched ? "★" : "☆"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="detailPanel">
          {!selected ? (
            <div className="empty">Select a market.</div>
          ) : (
            <>
              <div className="detailTop">
                <span className="pill">{selected.category || "Market"}</span>
                <button
                  className="watchBtn"
                  onClick={() => toggleWatch(selected.marketId)}
                >
                  {watchlist.includes(selected.marketId) ? "★ Watching" : "☆ Watch"}
                </button>
              </div>

              <h2>{selected.title}</h2>
              <p className="desc">
                {selected.description || "Live Panta prediction market."}
              </p>

              <div className="probabilityBox">
                <div>
                  <span>YES probability</span>
                  <strong>{pct(probability(selected))}</strong>
                </div>
                <div className="bar">
                  <span style={{ width: `${probability(selected) * 100}%` }} />
                </div>
                <div className="split">
                  <span>NO {pct(1 - probability(selected))}</span>
                  <span>Volume ${money(volume(selected))}</span>
                </div>
              </div>

              <div className="signalGrid">
                <div>
                  <span>Conviction</span>
                  <strong>{conviction(selected)}%</strong>
                </div>
                <div>
                  <span>Recent flow</span>
                  <strong>{flow.label}</strong>
                </div>
              </div>

              <div className="decisionCard">
                <span className="kicker">DECISION LAYER</span>
                <h3>{signalLabel(selected)}</h3>
                <p>{decisionText(selected)}</p>
                <div className="triggerLine">
                  <span>Current trigger</span>
                  <strong>
                    {probability(selected) * 100 >= threshold
                      ? "YES triggered"
                      : probability(selected) * 100 <= 100 - threshold
                        ? "NO triggered"
                        : "Monitoring"}
                  </strong>
                </div>
              </div>

              <div className="scenarios">
                <div>
                  <span>IF YES strengthens</span>
                  <p>Prepare the YES scenario, verify the catalyst, then act only when your threshold is crossed.</p>
                </div>
                <div>
                  <span>IF signal reverses</span>
                  <p>Cancel the trigger, re-check source evidence and switch to a two-sided monitoring posture.</p>
                </div>
              </div>

              <footer>
                Powered by <strong>Panta</strong> · DecisionPulse never gives financial advice.
              </footer>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
