const WHOLE = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const CENTS = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/** $250 — for headlines and body copy */
export const money = (n: number) => WHOLE.format(n);

/** $250.00 — for the notification, where it has to read like a bank */
export const moneyExact = (n: number) => CENTS.format(n);

/** +$250.00 — the hero string. The whole product, in eight characters. */
export const moneyIn = (n: number) => `+${CENTS.format(n)}`;

/** Clamp whatever they typed into something we can put on screen. */
export function parsePrice(raw: string): number | null {
  const n = Number(String(raw).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(Math.round(n), 1_000_000);
}
