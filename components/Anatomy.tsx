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
      <div className="stack" style={{ gap: "clamp(22px, 2.8vw, 30px)", paddingTop: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <div className="stack" style={{ gap: 9, maxWidth: 720 }}>
            <h1 className="h1">Every system is five parts.</h1>
            <p className="lede">
              Not five hundred. Five. Once you can name them, you can look at any business
              — yours, your sister&rsquo;s, your competitor&rsquo;s — and put your finger
              on the exact part that&rsquo;s missing.
            </p>
          </div>
          <div
            className="stack"
            style={{
              gap: 7,
              borderLeft: "2px solid var(--money)",
              paddingLeft: 20,
              minWidth: 260,
            }}
          >
            <span className="eyebrow">WIRING FOR YOU NOW</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4 }}>
              Your {price} link → your phone
            </span>
            <span className="mono" style={{ fontSize: 11, color: "var(--money)" }}>
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
                className={last ? "cardMoney" : "card"}
                style={{
                  padding: last ? "21px 19px 19px" : "22px 20px 20px",
                  background: last ? "var(--money-wash)" : undefined,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span className="mono" style={{ fontSize: 11, color: "var(--money)" }}>
                    0{i + 1}
                  </span>
                  <Icon />
                </div>
                <span
                  className="mono"
                  style={{ fontSize: 12.5, letterSpacing: "0.16em" }}
                >
                  {p.label}
                </span>
                <span
                  style={{
                    fontSize: 13.5,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                    flexGrow: 1,
                  }}
                >
                  {p.plain({ price, sells: a.sells })}
                </span>
                <div
                  style={{
                    height: 1,
                    background: last ? "var(--money-line)" : "var(--line-soft)",
                  }}
                />
                {last ? (
                  <span
                    className="mono"
                    style={{ fontSize: 15, color: "var(--money)", fontWeight: 500 }}
                  >
                    {moneyIn(a.price)}
                  </span>
                ) : (
                  <span
                    className="mono"
                    style={{ fontSize: 10.5, color: "var(--fainter)" }}
                  >
                    {p.tool}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="card"
          style={{
            padding: "26px 28px",
            display: "grid",
            gridTemplateColumns: "minmax(280px, 468px) minmax(0, 1fr)",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div className="stack" style={{ gap: 7 }}>
            <h2 className="h2">ChatGPT is part three.</h2>
            <p className="lede" style={{ fontSize: 13.5 }}>
              That&rsquo;s the entire misunderstanding. It&rsquo;s brilliant at deciding,
              and it owns none of the wires on either side. So you hand-carry parts 1, 2, 4
              and 5 yourself — forever, for free, at eleven o&rsquo;clock at night.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {PARTS.map((p, i) => {
              const isAi = i === 2;
              return (
                <div
                  key={p.id}
                  style={{
                    border: isAi ? "1.5px solid var(--money)" : "1px dashed var(--dashed)",
                    background: isAi ? "var(--money-wash)" : undefined,
                    borderRadius: 3,
                    padding: "14px 6px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    textAlign: "center",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      color: isAi ? "var(--money)" : "var(--fainter)",
                    }}
                  >
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isAi ? "var(--ink)" : "var(--faint)",
                    }}
                  >
                    {isAi ? "the AI" : "you"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          <p className="lede" style={{ maxWidth: 620 }}>
            Enough theory. Buy something from yourself and watch all five parts run.
          </p>
          <button className="go" onClick={onNext}>
            <span>Pull the trigger</span>
            <Arrow color="#fff" />
          </button>
        </div>
      </div>
    </Shell>
  );
}
