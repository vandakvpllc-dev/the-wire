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
      <circle
        cx="40"
        cy="6"
        r="3.5"
        fill="none"
        stroke="var(--dashed)"
        strokeWidth="1.5"
      />
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
      className="cardDead"
      style={{
        padding: "17px 18px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 7,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        {icon}
        <span className="t-lab">{kind}</span>
        {badge && (
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--money)",
              marginLeft: "auto",
              fontWeight: 500,
            }}
          >
            {badge}
          </span>
        )}
        <span style={{ marginLeft: badge ? 8 : "auto", display: "flex" }}>
          <DeadPort />
        </span>
      </div>
      <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-2)" }}>{title}</span>
      <span style={{ fontSize: 12.5, color: loss ? "var(--loss)" : "var(--faint)" }}>
        {under}
      </span>
    </div>
  );
}

export function Diagnosis({ a, onNext }: { a: Answers; onNext: () => void }) {
  const price = money(a.price);

  return (
    <Shell step={2} label="WHAT YOU HAVE NOW">
      <div className="stack" style={{ gap: "clamp(22px, 2.8vw, 34px)" }}>
        <div className="stack" style={{ gap: 18 }}>
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

            {/* the one solid, lit object on this screen — because it is the
                only thing on it that actually connects anything */}
            <div
              className="card spanTwo"
              style={{
                padding: "18px 20px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                borderColor: "var(--line-hard)",
                boxShadow: "var(--edge-strong), var(--shadow-md)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                <Person />
                <span
                  className="mono"
                  style={{
                    fontSize: 9.5,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    color: "var(--ink-3)",
                  }}
                >
                  THE ONLY WIRE IN THIS PICTURE
                </span>
              </div>
              <span
                className="serif"
                style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.02em" }}
              >
                {a.firstName}
              </span>
              <span className="t-sm">
                Copying, pasting and remembering, by hand, every single time — and only
                while awake.
              </span>
            </div>

            <div
              className="cardDead spanTwo"
              style={{
                padding: "17px 18px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 7,
              }}
            >
              <span className="t-lab" style={{ marginBottom: 4 }}>
                YOUR PHONE
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--faint)" }}>
                Silent
              </span>
              <span style={{ fontSize: 12.5, color: "var(--fainter)" }}>
                Nothing here can reach it.
              </span>
            </div>
          </div>
        </div>

        <div className="two" style={{ alignItems: "stretch" }}>
          <div
            style={{
              display: "flex",
              gap: "clamp(28px, 5vw, 56px)",
              alignItems: "flex-start",
              alignSelf: "center",
            }}
          >
            <div className="stat">
              <span className="statNum xl">5</span>
              <span className="t-sm">things you own</span>
            </div>
            <div className="stat">
              <span className="statNum xl" style={{ color: "var(--fainter)" }}>
                0
              </span>
              <span className="t-sm">wires between them</span>
            </div>
          </div>

          <div className="noteBox">
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Warn />
              <span
                className="mono"
                style={{
                  fontSize: 9.5,
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  color: "var(--loss)",
                }}
              >
                WHERE THE MONEY GOES
              </span>
            </div>
            <span className="t-body">
              A <b style={{ color: "var(--ink)", fontWeight: 600 }}>{price}</b> payment
              landing in your account is the{" "}
              <b style={{ color: "var(--ink)", fontWeight: 600 }}>beginning</b> of a
              relationship worth several times that. Right now it&rsquo;s the end of one —
              because the moment the money arrives, nothing else happens.
            </span>
          </div>
        </div>

        <div className="closer" style={{ marginTop: "auto", paddingTop: 12 }}>
          <div className="stack" style={{ gap: 16, maxWidth: 800 }}>
            <h2 className="h1">
              Right now, <em className="italic">you</em> work for it.
            </h2>
            <p className="lede">
              You don&rsquo;t have a system. You have things that each work alone, and a
              person carrying messages between them by hand. That person is you.
              You&rsquo;re the wire — and the wire is the part that gets tired, forgets,
              and sleeps.
            </p>
          </div>
          <button className="go" onClick={onNext}>
            <span>Show me the wire</span>
            <Arrow />
          </button>
        </div>
      </div>
    </Shell>
  );
}
