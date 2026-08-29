"use client";

import { Shell } from "./Shell";
import { Arrow } from "./Icons";
import { money, moneyIn } from "@/lib/money";
import type { Answers } from "@/lib/types";

const DEAD = [
  ["YOU", "spot the payment — if you happen to look"],
  ["YOU", "open ChatGPT and explain the whole thing again"],
  ["AI", "writes a lovely reply. Its job ends here."],
  ["YOU", "copy it, paste it, fix the tone, send it"],
  ["YOU", "write them down somewhere, then try to remember Wednesday"],
] as const;

const LIVE = [
  ["IT", "catches the payment the second it lands"],
  ["IT", "writes them down where they'll be remembered"],
  ["AI", "reads them and decides how they should be treated"],
  ["IT", "delivers, records, and parks Wednesday's next offer"],
  ["IT", "buzzes your phone to say it's already handled"],
] as const;

function Row({ who, text, live }: { who: string; text: string; live: boolean }) {
  const isAi = who === "AI";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: live
          ? "1px solid var(--money-line)"
          : isAi
            ? "1px solid var(--line-hard)"
            : "1px dashed var(--dashed)",
        background: live ? "var(--money-wash-2)" : isAi ? "#F7F4F0" : undefined,
        borderRadius: 3,
        padding: "11px 14px",
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 10.5,
          width: 30,
          flexShrink: 0,
          color: live ? "var(--money)" : isAi ? "var(--muted)" : "var(--fainter)",
        }}
      >
        {who}
      </span>
      <span style={{ fontSize: 12.5, color: live || isAi ? "var(--ink-2)" : "var(--muted)" }}>
        {text}
      </span>
    </div>
  );
}

export function Proof({ a, onRestart }: { a: Answers; onRestart: () => void }) {
  const price = money(a.price);

  return (
    <Shell step={5} label="THE DIFFERENCE">
      <div className="stack" style={{ gap: "clamp(20px, 2.6vw, 26px)", paddingTop: 30 }}>
        <div className="stack" style={{ gap: 8, maxWidth: 830 }}>
          <h1 className="h1">Same {price}. Two worlds.</h1>
          <p className="lede">
            Both of these use AI. Only one of them is a system. The difference was never
            the AI — it&rsquo;s whether anything is wired to it on either side.
          </p>
        </div>

        <div className="two">
          <div
            className="card"
            style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div className="stack" style={{ gap: 4 }}>
              <span className="eyebrow">AI AUTOMATION — WHAT YOU HAVE NOW</span>
              <span style={{ fontSize: 22, fontWeight: 600, color: "var(--muted)" }}>
                You, working for the AI
              </span>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {DEAD.map(([who, text]) => (
                <Row key={text} who={who} text={text} live={false} />
              ))}
            </div>
            <div className="stack" style={{ gap: 12, marginTop: "auto" }}>
              <div style={{ height: 1, background: "var(--line-soft)" }} />
              <div className="stats">
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--muted)" }}>
                    14
                  </span>
                  <span className="statLabel">CLICKS</span>
                </div>
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--muted)" }}>
                    4m 20s
                  </span>
                  <span className="statLabel">OF YOUR LIFE</span>
                </div>
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--loss)" }}>
                    none
                  </span>
                  <span className="statLabel">WHILE ASLEEP</span>
                </div>
              </div>
              <span style={{ fontSize: 12.5, color: "var(--faint)", lineHeight: 1.5 }}>
                Every payment. Every time. Forever. And the {price} that lands at 11pm sits
                there until you wake up — if the customer waits that long.
              </span>
            </div>
          </div>

          <div
            className="cardMoney"
            style={{ padding: "23px 25px", display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div className="stack" style={{ gap: 4 }}>
              <span className="eyebrow" style={{ color: "var(--money)" }}>
                AN AI SYSTEM — WHAT YOU JUST WATCHED
              </span>
              <span style={{ fontSize: 22, fontWeight: 600 }}>
                The AI, working for you
              </span>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {LIVE.map(([who, text]) => (
                <Row key={text} who={who} text={text} live />
              ))}
            </div>
            <div className="stack" style={{ gap: 12, marginTop: "auto" }}>
              <div style={{ height: 1, background: "var(--line-soft)" }} />
              <div className="stats">
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--money)" }}>
                    0
                  </span>
                  <span className="statLabel">CLICKS</span>
                </div>
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--money)" }}>
                    0.9s
                  </span>
                  <span className="statLabel">OF YOUR LIFE</span>
                </div>
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--money)" }}>
                    all of it
                  </span>
                  <span className="statLabel">WHILE ASLEEP</span>
                </div>
              </div>
              <span style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
                Wired once. Runs for every payment after that — at 3am, on Christmas, while
                you&rsquo;re sitting in someone&rsquo;s living room.
              </span>
            </div>
          </div>
        </div>

        {/* the money row — the argument in nine words */}
        <div
          className="card"
          style={{
            padding: "22px 26px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(216px, 1fr))",
            gap: 22,
            alignItems: "center",
          }}
        >
          <div className="stack" style={{ gap: 4 }}>
            <span className="eyebrow">AND THE PART THAT MATTERS</span>
            <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>
              What happens to the money
            </span>
          </div>

          <div
            className="stack"
            style={{ gap: 5, borderLeft: "1px solid var(--line-soft)", paddingLeft: 22 }}
          >
            <span className="mono" style={{ fontSize: 26, lineHeight: 1 }}>
              {price}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
              Today. Both worlds collect it. This is the part everyone celebrates.
            </span>
          </div>

          <div
            className="stack"
            style={{ gap: 5, borderLeft: "1px solid var(--line-soft)", paddingLeft: 22 }}
          >
            <span className="mono" style={{ fontSize: 26, lineHeight: 1, color: "var(--loss)" }}>
              $0
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
              Wednesday, with a smart pen. Nobody followed up, because nobody remembered.
            </span>
          </div>

          <div
            className="stack"
            style={{ gap: 5, borderLeft: "2px solid var(--money)", paddingLeft: 22 }}
          >
            <span
              className="mono"
              style={{ fontSize: 26, lineHeight: 1, color: "var(--money)", fontWeight: 500 }}
            >
              {moneyIn(a.price)}
            </span>
            <span style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.4 }}>
              Wednesday, with a system. It asked for the next one by itself, while you
              slept.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 36,
            flexWrap: "wrap",
          }}
        >
          <h2 className="h2" style={{ maxWidth: 820 }}>
            You&rsquo;ve been working for it.
            <br />
            Make it work for you — that&rsquo;s what it&rsquo;s for.
          </h2>
          <div className="stack" style={{ gap: 9, alignItems: "flex-end" }}>
            <button className="go" onClick={onRestart}>
              <span>Wire my business for real</span>
              <Arrow color="#fff" />
            </button>
            <span
              className="mono"
              style={{ fontSize: 10, color: "var(--fainter)", letterSpacing: "0.04em" }}
            >
              {a.firstName.toUpperCase()} — WE ALREADY HAVE YOUR NUMBER
            </span>
          </div>
        </div>
      </div>
    </Shell>
  );
}
