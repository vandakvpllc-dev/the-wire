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
    <div className={`stepRow${live ? " isLive" : isAi ? " isAi" : ""}`}>
      <span className="stepWho">{who}</span>
      <span className="stepText">{text}</span>
    </div>
  );
}

export function Proof({ a, onRestart }: { a: Answers; onRestart: () => void }) {
  const price = money(a.price);

  return (
    <Shell step={5} label="THE DIFFERENCE">
      <div className="stack" style={{ gap: "clamp(24px, 3vw, 34px)" }}>
        <div className="stack" style={{ gap: 16, maxWidth: 830 }}>
          <h1 className="h1">
            Same {price}. <em className="italic">Two worlds.</em>
          </h1>
          <p className="lede">
            Both of these use AI. Only one of them is a system. The difference was never
            the AI — it&rsquo;s whether anything is wired to it on either side.
          </p>
        </div>

        <div className="two">
          <div className="cardDead worldDead">
            <div className="stack" style={{ gap: 8 }}>
              <span className="eyebrow">AI AUTOMATION — WHAT YOU HAVE NOW</span>
              <span
                className="h3"
                style={{ color: "var(--faint)", fontFamily: "var(--serif)" }}
              >
                You, working for the AI
              </span>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {DEAD.map(([who, text]) => (
                <Row key={text} who={who} text={text} live={false} />
              ))}
            </div>
            <div className="stack" style={{ gap: 14, marginTop: "auto" }}>
              <div className="rule" />
              <div className="stats">
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--faint)" }}>
                    14
                  </span>
                  <span className="statLabel">CLICKS</span>
                </div>
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--faint)" }}>
                    4m 20s
                  </span>
                  <span className="statLabel">OF YOUR LIFE</span>
                </div>
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--fainter)" }}>
                    none
                  </span>
                  <span className="statLabel">WHILE ASLEEP</span>
                </div>
              </div>
              <span style={{ fontSize: 12.5, color: "var(--faint)", lineHeight: 1.55 }}>
                Every payment. Every time. Forever. And the {price} that lands at 11pm sits
                there until you wake up — if the customer waits that long.
              </span>
            </div>
          </div>

          <div className="cardMoney worldLive">
            <div className="stack" style={{ gap: 8 }}>
              <span className="eyebrow" style={{ color: "var(--money)" }}>
                AN AI SYSTEM — WHAT YOU JUST WATCHED
              </span>
              <span className="h3">The AI, working for you</span>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {LIVE.map(([who, text]) => (
                <Row key={text} who={who} text={text} live />
              ))}
            </div>
            <div className="stack" style={{ gap: 14, marginTop: "auto" }}>
              <div className="ruleMoney" />
              <div className="stats">
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--money)" }}>
                    0
                  </span>
                  <span className="statLabel" style={{ color: "var(--money)" }}>
                    CLICKS
                  </span>
                </div>
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--money)" }}>
                    0.9s
                  </span>
                  <span className="statLabel" style={{ color: "var(--money)" }}>
                    OF YOUR LIFE
                  </span>
                </div>
                <div className="stat">
                  <span className="statNum" style={{ color: "var(--money)" }}>
                    all of it
                  </span>
                  <span className="statLabel" style={{ color: "var(--money)" }}>
                    WHILE ASLEEP
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
                Wired once. Runs for every payment after that — at 3am, on Christmas, while
                you&rsquo;re sitting in someone&rsquo;s living room.
              </span>
            </div>
          </div>
        </div>

        {/* the money row — the argument in nine words */}
        <div className="card ledger">
          <div className="stack" style={{ gap: 8 }}>
            <span className="eyebrow">AND THE PART THAT MATTERS</span>
            <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}>
              What happens to the money
            </span>
          </div>

          <div className="ledgerCell">
            <span className="ledgerNum">{price}</span>
            <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>
              Today. Both worlds collect it. This is the part everyone celebrates.
            </span>
          </div>

          <div className="ledgerCell">
            <span className="ledgerNum dead">$0</span>
            <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>
              Wednesday, with a smart pen. Nobody followed up, because nobody remembered.
            </span>
          </div>

          <div className="ledgerCell money">
            <span className="ledgerNum win">{moneyIn(a.price)}</span>
            <span style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.45 }}>
              Wednesday, with a system. It asked for the next one by itself, while you
              slept.
            </span>
          </div>
        </div>

        <div className="closer" style={{ marginTop: "auto", paddingTop: 12 }}>
          <h2 className="h2" style={{ maxWidth: 820 }}>
            You&rsquo;ve been working for it.
            <br />
            <em className="italic">Make it work for you</em> — that&rsquo;s what
            it&rsquo;s for.
          </h2>
          <div className="stack" style={{ gap: 12, alignItems: "flex-end" }}>
            <button className="go" onClick={onRestart}>
              <span>Wire my business for real</span>
              <Arrow />
            </button>
            <span
              className="mono"
              style={{ fontSize: 9.5, color: "var(--fainter)", letterSpacing: "0.16em" }}
            >
              {a.firstName.toUpperCase()} — WE ALREADY HAVE YOUR NUMBER
            </span>
          </div>
        </div>
      </div>
    </Shell>
  );
}
