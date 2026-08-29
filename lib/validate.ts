import type { Answers, Personalized } from "./types";
import { parsePrice } from "./money";

const clip = (s: unknown, max: number) => String(s ?? "").trim().slice(0, max);

/** Loose on purpose — this is a demo, not a checkout. We only reject unusable. */
export function readAnswers(raw: unknown): Answers | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const firstName = clip(r.firstName, 40);
  const email = clip(r.email, 120);
  const mobile = clip(r.mobile, 30);
  const sells = clip(r.sells, 120);
  const price = parsePrice(String(r.price ?? ""));

  if (!firstName || !sells || price === null) return null;
  if (!email.includes("@") || email.startsWith("@") || email.endsWith("@")) return null;

  return { firstName, email, mobile, sells, price };
}

export function readCopy(raw: unknown): Personalized | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const customerName = clip(r.customerName, 60);
  const purchase = clip(r.purchase, 120);
  const verdict = clip(r.verdict, 160);
  const followUp = clip(r.followUp, 200);

  if (!customerName || !purchase || !verdict || !followUp) return null;

  return { customerName, purchase, verdict, followUp, live: Boolean(r.live) };
}
