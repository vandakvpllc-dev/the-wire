"use client";

import { useEffect, useRef, useState } from "react";
import { Shell } from "./Shell";
import { Rail } from "./Rail";
import { Phone } from "./Phone";
import { Arrow, Clock } from "./Icons";
import { moneyIn } from "@/lib/money";
import type { Answers, FireEvent, PartId, Personalized, Step } from "@/lib/types";

const fmt = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

export function Live({
  a,
  copy,
  onNext,
}: {
  a: Answers;
  copy: Personalized;
  onNext: () => void;
}) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [done, setDone] = useState(false);
  const [delivery, setDelivery] = useState<
    { ok: true; channels: string[] } | { ok: false; reason: string } | null
  >(null);
  const [onPhone, setOnPhone] = useState(false);
  const started = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    setOnPhone(window.matchMedia("(max-width: 720px), (pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    // React double-invokes effects in dev. The trigger must fire exactly once,
    // and — critically — the first invocation's cleanup must NOT kill it, or
    // the one moment this whole demo exists for silently never happens. So the
    // request is never aborted; only the state updates are gated. The stream
    // closes itself after about six seconds either way.
    alive.current = true;
    if (started.current) {
      return () => {
        alive.current = false;
      };
    }
    started.current = true;

    (async () => {
      try {
        const res = await fetch("/api/fire", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: a, copy }),
        });

        if (!res.ok || !res.body) throw new Error(`fire ${res.status}`);

        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";

        for (;;) {
          const { done: end, value } = await reader.read();
          if (end) break;
          if (!alive.current) continue;
          buf += dec.decode(value, { stream: true });

          const frames = buf.split("\n\n");
          buf = frames.pop() ?? "";

          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data:")) continue;

            let e: FireEvent;
            try {
              e = JSON.parse(line.slice(5).trim());
            } catch {
              continue;
            }

            if (e.type === "step") {
              setSteps((prev) =>
                prev.some((s) => s.n === e.step.n) ? prev : [...prev, e.step],
              );
            } else if (e.type === "delivered") {
              setDelivery({ ok: true, channels: e.channels });
            } else if (e.type === "failed") {
              setDelivery({ ok: false, reason: e.reason });
            } else if (e.type === "done") {
              setDone(true);
            }
          }
        }
      } catch (err) {
        console.error("[the-wire] stream failed", err);
        if (alive.current) {
          setDelivery({ ok: false, reason: "connection lost" });
          setDone(true);
        }
      }
    })();

    return () => {
      alive.current = false;
    };
  }, [a, copy]);

  const reached = new Set<PartId>(steps.map((s) => s.part));
  const current = steps.length ? steps[steps.length - 1].part : null;
  const finished = new Set<PartId>([...reached].filter((p) => p !== current || done));
  const elapsed = steps.length ? steps[steps.length - 1].at : 0;

  const has = (n: number) => steps.some((s) => s.n === n);

  return (
    <Shell step={4} label="YOU PULL THE TRIGGER" live={!done}>
      <div className="stack" style={{ gap: "clamp(20px, 2.6vw, 26px)", paddingTop: 30 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 36,
            flexWrap: "wrap",
          }}
        >
          <div className="stack" style={{ gap: 8, maxWidth: 690 }}>
            <h1 className="h1">You just paid yourself {moneyIn(a.price).slice(1)}.</h1>
            <p className="lede">
              That was a test payment, so no card was charged. Everything after it is
              completely real.{" "}
              {onPhone
                ? "Watch this screen — then swipe down. It is already waiting in your notifications."
                : "Watch the left side, then look down at your hand."}
            </p>
          </div>

          <div className="stats">
            <div className="stat">
              <span className="statNum">{fmt(elapsed)}</span>
              <span className="statLabel">ELAPSED</span>
            </div>
            <div className="stat">
              <span className="statNum">0</span>
              <span className="statLabel">CLICKS BY YOU</span>
            </div>
            <div
              className="stat"
              style={{ borderLeft: "2px solid var(--money)", paddingLeft: 18 }}
            >
              <span className="statNum" style={{ color: "var(--money)", fontWeight: 500 }}>
                {moneyIn(a.price)}
              </span>
              <span className="statLabel" style={{ color: "var(--money)" }}>
                COLLECTED
              </span>
            </div>
          </div>
        </div>

        <Rail
          done={finished}
          now={done ? null : current}
          subs={[
            finished.has("trigger") ? "done · 0.1s" : null,
            finished.has("capture") ? "done · 0.3s" : null,
            finished.has("decide") ? "done · 0.6s" : null,
            reached.has("act") ? (finished.has("act") ? "done · 1.0s" : "running") : null,
            reached.has("notify") ? "your phone" : "next · your phone",
          ]}
        />

        <div className="liveSplit">
          <div className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 20px",
                borderBottom: "1px solid var(--line-soft)",
                flexWrap: "wrap",
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 10.5, letterSpacing: "0.16em", color: "var(--muted)" }}
              >
                WHAT IT IS DOING, RIGHT NOW
              </span>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--fainter)" }}>
                nothing hidden
              </span>
            </div>

            <div
              className="stack"
              style={{ gap: 12, padding: "20px 20px", minHeight: 250 }}
            >
              {steps.map((s) => (
                <div className="logRow rise" key={s.n}>
                  <span className="logTime">+{(s.at / 1000).toFixed(1)}s</span>
                  <span className="logPart">{s.part.toUpperCase()}</span>
                  <span className="logText">
                    {s.money && (
                      <b style={{ color: "var(--money)", fontWeight: 500 }}>{s.money} </b>
                    )}
                    {s.text}
                    {s.scheduled && (
                      <span style={{ color: "var(--fainter)" }}> — {s.scheduled}</span>
                    )}
                    {s.part === "notify" && !done && (
                      <span className="caret" style={{ color: "var(--money)" }}>
                        ▍
                      </span>
                    )}
                  </span>
                </div>
              ))}

              {steps.length === 0 && (
                <span
                  className="mono pulse"
                  style={{ fontSize: 12.5, color: "var(--fainter)" }}
                >
                  waiting for the payment…
                </span>
              )}
            </div>

            <div
              style={{
                marginTop: "auto",
                borderTop: "1px solid var(--line-soft)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: "#FCFBF9",
              }}
            >
              <span style={{ paddingTop: 2 }}>
                <Clock />
              </span>
              <span style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>
                Those timestamps are the real machine times — the whole thing took under a
                second. It is replayed slowly here so you can read it. One of those steps
                is parked for <b>Wednesday morning</b>, and it will happen whether or not
                you ever open this page again.
              </span>
            </div>
          </div>

          <div className="phoneCol">
            <Phone
              price={a.price}
              customerName={copy.customerName}
              purchase={copy.purchase}
              actNow={copy.actNow}
              actSecond={copy.actSecond}
              followUp={copy.followUp}
              paid={has(0)}
              didNow={has(3)}
              didSecond={has(4)}
              queued={has(5)}
              footer={
                delivery?.ok ? (
                  <>
                    <span
                      className="mono"
                      style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--money)" }}
                    >
                      ● SENT TO YOUR {delivery.channels.includes("sms") ? "PHONE" : "INBOX"}
                    </span>
                    <span style={{ fontSize: 10.5, color: "var(--fainter)" }}>
                      {delivery.channels.includes("sms") ? a.mobile || a.email : a.email}
                    </span>
                  </>
                ) : delivery && !delivery.ok ? (
                  <span style={{ fontSize: 10.5, color: "var(--fainter)" }}>
                    This is what landed on screen. The send didn&rsquo;t go out
                    {delivery.reason === "no channel configured" ? " — no channel is wired up yet." : "."}
                  </span>
                ) : (
                  <span
                    className="mono pulse"
                    style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--money)" }}
                  >
                    ● SENDING…
                  </span>
                )
              }
            />
          </div>
        </div>

        {done && (
          <div
            className="rise"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            <p className="lede" style={{ maxWidth: 640 }}>
              {delivery?.ok
                ? "That is what it feels like. Now here is what it is worth."
                : "That is the sequence. Now here is what it is worth."}
            </p>
            <button className="go" onClick={onNext}>
              <span>What that&rsquo;s worth</span>
              <Arrow color="#fff" />
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}
