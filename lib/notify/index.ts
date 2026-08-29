import { sendEmail, sendSms, type ChannelResult, type Payload } from "./channels";

export type { Payload, ChannelResult };
export { buzzLine } from "./channels";

/**
 * Fire every configured channel at once and report which ones landed.
 *
 * Called BEFORE the on-screen animation starts, never after: the screen is
 * paced to about seven seconds, so the phone can only ever be early. Early
 * reads as magic. Late reads as broken.
 */
export async function dispatch(p: Payload): Promise<ChannelResult[]> {
  const results = await Promise.all([sendSms(p), sendEmail(p)]);

  for (const r of results) {
    if (!r.ok && r.reason !== "not configured") {
      console.error(`[the-wire] ${r.channel} failed: ${r.reason}`);
    }
  }

  return results;
}

/** True when at least one channel is wired up — the page adapts its promise. */
export function configuredChannels(): Array<"sms" | "email"> {
  const out: Array<"sms" | "email"> = [];
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) {
    out.push("sms");
  }
  if (process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
    out.push("email");
  }
  return out;
}
