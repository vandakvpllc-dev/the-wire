"use client";

import { useState } from "react";
import { Shell } from "./Shell";
import { Phone } from "./Phone";
import { Arrow } from "./Icons";
import { parsePrice } from "@/lib/money";
import type { Answers } from "@/lib/types";

const FIELDS = [
  { key: "firstName", label: "FIRST NAME", type: "text", placeholder: "Denise", auto: "given-name" },
  { key: "email", label: "EMAIL", type: "email", placeholder: "you@yourbusiness.com", auto: "email" },
  { key: "mobile", label: "MOBILE — SO IT CAN REACH YOU", type: "tel", placeholder: "(214) 555-0148", auto: "tel" },
] as const;

export function Form({ onSubmit }: { onSubmit: (a: Answers) => void }) {
  const [v, setV] = useState({
    firstName: "",
    email: "",
    mobile: "",
    sells: "",
    price: "",
  });
  const [touched, setTouched] = useState(false);

  const price = parsePrice(v.price);
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim());
  const ready =
    v.firstName.trim().length > 0 && emailOk && v.sells.trim().length > 0 && price !== null;

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!ready || price === null) return;
    onSubmit({
      firstName: v.firstName.trim(),
      email: v.email.trim(),
      mobile: v.mobile.trim(),
      sells: v.sells.trim(),
      price,
    });
  };

  return (
    <Shell step={1} label="THIRTY SECONDS">
      <div className="formSplit" style={{ paddingTop: "clamp(28px, 4vw, 44px)" }}>
        <form className="stack" style={{ gap: 30 }} onSubmit={submit} noValidate>
          <div className="stack" style={{ gap: 10 }}>
            <h1 className="h1">
              Five boxes. Then watch
              <br />
              your own business run itself.
            </h1>
            <p className="lede">
              You&rsquo;ve been working for the AI. This is what it looks like when it
              works for you. Fill this in and the next four screens are built out of your
              answers — what you sell, your price, your phone. No card, nothing to install,
              nothing to cancel later.
            </p>
          </div>

          <div className="stack" style={{ gap: 15 }}>
            <div className="formGrid">
              {FIELDS.slice(0, 2).map((f) => (
                <div className="field" key={f.key}>
                  <label htmlFor={f.key}>{f.label}</label>
                  <input
                    id={f.key}
                    name={f.key}
                    type={f.type}
                    autoComplete={f.auto}
                    placeholder={f.placeholder}
                    value={v[f.key]}
                    onChange={set(f.key)}
                  />
                  {touched && f.key === "email" && v.email && !emailOk && (
                    <span className="err">That address looks incomplete.</span>
                  )}
                </div>
              ))}
            </div>

            <div className="formGrid">
              <div className="field">
                <label htmlFor="mobile">{FIELDS[2].label}</label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  placeholder={FIELDS[2].placeholder}
                  value={v.mobile}
                  onChange={set("mobile")}
                />
              </div>

              <div className="field moneyField">
                <label htmlFor="price">WHAT DO YOU CHARGE FOR IT?</label>
                <div className="withSign">
                  <span aria-hidden="true">$</span>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    inputMode="numeric"
                    placeholder="250"
                    value={v.price}
                    onChange={set("price")}
                  />
                </div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="sells">WHAT DO YOU SELL?</label>
              <input
                id="sells"
                name="sells"
                type="text"
                placeholder="A coaching call, a custom cake, a website audit…"
                value={v.sells}
                onChange={set("sells")}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <button className="go" type="submit" disabled={!ready}>
              <span>Build my system</span>
              <Arrow color="#fff" />
            </button>
            <span style={{ fontSize: 12.5, color: "var(--fainter)", lineHeight: 1.5 }}>
              Takes about 90 seconds.
              <br />
              Nothing is charged and nothing is sold to you.
            </span>
          </div>
        </form>

        <div className="stack phoneCol" style={{ gap: 18 }}>
          <span className="eyebrow">IN ABOUT NINETY SECONDS, THIS IS YOUR PHONE</span>
          <div style={{ display: "flex", justifyContent: "center", opacity: 0.92 }}>
            <Phone
              price={price ?? 250}
              customerName="Maria Ruiz"
              purchase={v.sells.trim().toLowerCase() || "the thing you sell"}
              actNow={{
                text: "receipt and welcome note sent from your own address",
                kind: "mail",
              }}
              actSecond={{
                text: "added to your customer list with everything they bought",
                kind: "list",
              }}
              followUp="The next offer sends itself in three days."
              paid
              didNow
              didSecond
              queued={false}
              footer={
                <>
                  <span
                    className="mono pulse"
                    style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--money)" }}
                  >
                    ● NOT A MOCKUP
                  </span>
                  <span style={{ fontSize: 11, color: "var(--fainter)" }}>
                    Your real phone. Your real number.
                  </span>
                </>
              }
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}
