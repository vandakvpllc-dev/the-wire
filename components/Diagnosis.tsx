"use client";

import { Shell } from "./Shell";
import { Arrow, CalendarIcon, CardIcon, ChatIcon, GlobeIcon, Person, Warn } from "./Icons";
import { money } from "@/lib/money";
import type { Answers } from "@/lib/types";

/** A port with nothing plugged into it. The whole diagnosis in one glyph. */
function DeadPort() {
  return (
    <svg width="46" height="12" viewBox="0 0 46 12" fill="none" aria-hidden="true">
      <path
        d="M0 6h34"
        stroke="var(--dashed)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="6" r="3.5" fill="var(--paper)" stroke="var(--dashed)" strokeWidth="1.5" />
    </svg>
  );
}

function Asset({
  icon,
  kind,
  title,
  under,
  loss,
  badge,
}: {
  icon: React.ReactNode;
  kind: string;
  title: string;
  under: string;
  loss?: boolean;
  badge?: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: "16px 17px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        borderColor: loss ? "var(--loss-line)" : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <span
          className="mono"
          style={{ fontSize: 9.5, letterSpacing: "0.14em", color: "var(--fainter)" }}
        >
          {kind}
        </span>
        {badge && (
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--money)", marginLeft: "auto" }}
          >
            {badge}
          </span>
        )}
        <span style={{ marginLeft: badge ? 8 : "auto" }}>
          <DeadPort />
        </span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
      <span style={{ fontSize: 12, color: loss ? "var(--loss)" : "var(--faint)" }}>{under}</span>
    </div>
  );
}

export function Diagnosis({ a, onNext }: { a: Answers; onNext: () => void }) {
  const price = money(a.price);

  return (
    <Shell step={2} label="WHAT YOU HAVE NOW">
      <div className="stack" style={{ gap: "clamp(24px, 3vw, 34px)", paddingTop: 30 }}>
        <div className="stack" style={{ gap: 14 }}>
          <span className="eyebrow">
            {a.firstName.toUpperCase()}, HERE&rsquo;S WHAT YOU ALREADY OWN
          </span>

          <div className="assetGrid">
            <Asset
              icon={<CardIcon />}
              kind="PAYMENT LINK"
              title="Money arrives"
              under="Then absolutely nothing."
              badge={`+${price}`}
              loss
            />
            <Asset
              icon={<CalendarIcon />}
              kind="SIGN-UP FORM"
              title="Someone signs up"
              under="It tells no one. Not even you."
            />
            <Asset
              icon={<GlobeIcon />}
              kind="WEBSITE"
              title="People visit"
              under="Nothing ever leaves it."
            />
            <Asset
              icon={<ChatIcon />}
              kind="YOUR DMS"
              title="They ask"
              under="You answer. At 11pm. Yourself."
            />

            <div
              className="card spanTwo"
              style={{
                padding: "17px 19px",
                display: "flex",
                flexDirection: "column",
                gap: 7,
                border: "1.5px solid var(--ink)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Person />
                <span
                  className="mono"
                  style={{ fontSize: 9.5, letterSpacing: "0.14em" }}
                >
                  THE ONLY WIRE IN THIS PICTURE
                </span>
              </div>
              <span style={{ fontSize: 21, fontWeight: 600 }}>{a.firstName}</span>
              <span style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
                Copying, pasting and remembering, by hand, every single time — and only
                while awake.
              </span>
            </div>

            <div
              className="spanTwo"
              style={{
                background: "var(--sunk)",
                border: "1px dashed var(--dashed)",
                borderRadius: 4,
                padding: "16px 17px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 9.5, letterSpacing: "0.14em", color: "var(--fainter)" }}
              >
                YOUR PHONE
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--faint)" }}>
                Silent
              </span>
              <span style={{ fontSize: 12, color: "var(--fainter)" }}>
                Nothing here can reach it.
              </span>
            </div>
          </div>
        </div>

        <div className="two" style={{ alignItems: "stretch" }}>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
            <div className="stat">
              <span className="statNum">5</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>things you own</span>
            </div>
            <div className="stat">
              <span className="statNum" style={{ color: "var(--loss)" }}>
                0
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                wires between them
              </span>
            </div>
          </div>

          <div
            style={{
              background: "var(--loss-wash)",
              border: "1px solid var(--loss-line)",
              borderRadius: 4,
              padding: "18px 19px",
              display: "flex",
              flexDirection: "column",
              gap: 9,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Warn />
              <span
                className="mono"
                style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--loss)" }}
              >
                WHERE THE MONEY GOES
              </span>
            </div>
            <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
              A <b>{price}</b> payment landing in your account is the <b>beginning</b> of a
              relationship worth several times that. Right now it&rsquo;s the end of one —
              because the moment the money arrives, nothing else happens.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 32,
            flexWrap: "wrap",
            marginTop: "auto",
          }}
        >
          <div className="stack" style={{ gap: 7, maxWidth: 800 }}>
            <h2 className="h1">Right now, you work for it.</h2>
            <p className="lede">
              You don&rsquo;t have a system. You have things that each work alone, and a
              person carrying messages between them by hand. That person is you.
              You&rsquo;re the wire — and the wire is the part that gets tired, forgets,
              and sleeps.
            </p>
          </div>
          <button className="go" onClick={onNext}>
            <span>Show me the wire</span>
            <Arrow color="#fff" />
          </button>
        </div>
      </div>
    </Shell>
  );
}
