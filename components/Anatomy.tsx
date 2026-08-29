"use client";

import { Shell } from "./Shell";
import { Rail } from "./Rail";
import { Arrow, Bell, Bolt, Brain, Database, Send } from "./Icons";
import { PARTS } from "@/lib/anatomy";
import { money, moneyIn } from "@/lib/money";
import type { Answers, PartId } from "@/lib/types";

const ICONS = [Bolt, Database, Brain, Send, Bell];
const ALL = new Set<PartId>(PARTS.map((p) => p.id));

export function Anatomy({ a, onNext }: { a: Answers; onNext: () => void }) {
  const price = money(a.price);

  return (
    <Shell step={3} label="HOW IT ACTUALLY WORKS">
      <div className="stack" style={{ gap: "clamp(26px, 3.2vw, 40px)" }}>
        <div className="closer">
          <div className="stack" style={{ gap: 16, maxWidth: 720 }}>
            <h1 className="h1">
              Every system is <em className="italic">five</em> parts.
            </h1>
            <p className="lede">
              Not five hundred. Five. Once you can name them, you can look at any business
              — yours, your sister&rsquo;s, your competitor&rsquo;s — and put your finger
              on the exact part that&rsquo;s missing.
            </p>
          </div>
          <div className="wiringNote">
            <span className="eyebrow" style={{ color: "var(--money)" }}>
              WIRING FOR YOU NOW
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>
              Your {price} link → your phone
            </span>
            <span
              className="mono"
              style={{ fontSize: 11, color: "var(--money)", letterSpacing: "0.02em" }}
            >
              connected · 6.2 seconds
            </span>
          </div>
        </div>

        <Rail done={ALL} />

        <div className="five">
          {PARTS.map((p, i) => {
            const Icon = ICONS[i];
            const last = i === PARTS.length - 1;
            return (
              <div
                key={p.id}
                className={`partCard ${last ? "cardMoney" : "card"}`}
              >
                <div className="partTop">
                  <span className="partNum">0{i + 1}</span>
                  <span className="partIcon">
                    <Icon color={last ? "var(--money-bright)" : "var(--faint)"} />
                  </span>
                </div>
                <span className="partName">{p.label}</span>
                <span className="partText">{p.plain({ price, sells: a.sells })}</span>
                <div className={last ? "ruleMoney" : "rule"} />
                {last ? (
                  <span
                    className="mono"
                    style={{
                      fontSize: 17,
                      color: "var(--money)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      textShadow: "0 0 22px rgba(52,209,124,.45)",
                    }}
                  >
                    {moneyIn(a.price)}
                  </span>
                ) : (
                  <span className="partTool">{p.tool}</span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="cardSunk revealGrid"
          style={{ padding: "clamp(24px, 3vw, 40px) clamp(22px, 3vw, 40px)" }}
        >
          <div className="stack" style={{ gap: 14 }}>
            <h2 className="h2">
              ChatGPT is part three.
              <br />
              You&rsquo;re the <em className="italic">other four.</em>
            </h2>
            <p className="lede" style={{ fontSize: 15 }}>
              That&rsquo;s the entire misunderstanding. It&rsquo;s brilliant at deciding,
              and it owns none of the wires on either side — so you fetch and carry for it,
              forever, for free, at eleven o&rsquo;clock at night. That is working for the
              AI. It&rsquo;s meant to be the other way round.
            </p>
          </div>

          <div className="fiveTight">
            {PARTS.map((p, i) => {
              const isAi = i === 2;
              return (
                <div className={isAi ? "slot ai" : "slot"} key={p.id}>
                  <span className="slotName">{p.label}</span>
                  <span className="slotWho">{isAi ? "the AI" : "you"}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="closer"
          style={{ alignItems: "center", marginTop: "auto", paddingTop: 8 }}
        >
          <p className="lede" style={{ maxWidth: 620 }}>
            Enough theory. Buy something from yourself and watch all five parts run.
          </p>
          <button className="go" onClick={onNext}>
            <span>Pull the trigger</span>
            <Arrow />
          </button>
        </div>
      </div>
    </Shell>
  );
}
