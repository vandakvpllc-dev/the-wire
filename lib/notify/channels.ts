import type { Answers, Personalized } from "../types";
import { moneyIn } from "../money";
import { buildInvite, nextThursday } from "./ics";

export interface Payload {
  answers: Answers;
  copy: Personalized;
}

export interface ChannelResult {
  channel: "sms" | "email";
  ok: boolean;
  /** why it didn't send — shown to nobody, logged for us */
  reason?: string;
}

/**
 * The one line that has to land. Kept under 160 characters so a text is a
 * single segment, and front-loaded with the money because that is the only
 * part read from a lock screen.
 */
export function buzzLine({ answers, copy }: Payload): string {
  return `${moneyIn(answers.price)} — ${copy.customerName} just paid you for ${copy.purchase}. ${cap(copy.actNow.text)}, ${copy.actSecond.text}, follow-up parked for Wednesday. You did none of it.`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------------------------------------------------------------ sms */

/**
 * The only channel that reliably buzzes every phone with no permission prompt,
 * no app install and no home-screen trick. Costs about a penny. Worth it: the
 * buzz is the product.
 */
export async function sendSms(p: Payload): Promise<ChannelResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!sid || !token || !from) {
    return { channel: "sms", ok: false, reason: "not configured" };
  }

  const to = normalizeUsMobile(p.answers.mobile);
  if (!to) return { channel: "sms", ok: false, reason: "unusable number" };

  const body = new URLSearchParams({ To: to, From: from, Body: buzzLine(p) });

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );
    if (!res.ok) {
      return { channel: "sms", ok: false, reason: `twilio ${res.status}` };
    }
    return { channel: "sms", ok: true };
  } catch (e) {
    return { channel: "sms", ok: false, reason: String(e) };
  }
}

/** US mobiles only for now — anything else we simply don't text. */
export function normalizeUsMobile(raw: string): string | null {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

/* ---------------------------------------------------------------- email */

/**
 * The free half. Slower and less certain than a text, but it carries the
 * calendar invite as an attachment and it is the durable proof they still have
 * tomorrow morning.
 */
export async function sendEmail(p: Payload): Promise<ChannelResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!key || !from) {
    return { channel: "email", ok: false, reason: "not configured" };
  }

  const { answers, copy } = p;

  // Only attach an invite when this business actually schedules something.
  // A baker does not need a calendar file, and sending one looks careless.
  const scheduled = copy.actNow.kind === "calendar" || copy.actSecond.kind === "calendar";
  const invite = scheduled
    ? buildInvite({
        organizerName: answers.firstName,
        organizerEmail: answers.email,
        customerName: copy.customerName,
        purchase: copy.purchase,
        start: nextThursday(),
        minutes: 60,
      })
    : null;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [answers.email],
        subject: `${moneyIn(answers.price)} — ${copy.customerName} paid you`,
        text: receiptText(p),
        html: receiptHtml(p),
        attachments: invite
          ? [{ filename: "appointment.ics", content: Buffer.from(invite).toString("base64") }]
          : undefined,
      }),
    });
    if (!res.ok) {
      return { channel: "email", ok: false, reason: `resend ${res.status}` };
    }
    return { channel: "email", ok: true };
  } catch (e) {
    return { channel: "email", ok: false, reason: String(e) };
  }
}

function receiptText({ answers, copy }: Payload): string {
  return [
    `${moneyIn(answers.price)}`,
    "",
    `${copy.customerName} just paid you for ${copy.purchase}.`,
    "",
    "Here is everything that happened in the nine tenths of a second after that,",
    "without you touching anything:",
    "",
    "  TRIGGER   the payment landed",
    "  CAPTURE   they were written down where they'll be remembered",
    `  DECIDE    ${copy.verdict}`,
    `  ACT       ${copy.actNow.text}`,
    `  ACT       ${copy.actSecond.text}`,
    "  NOTIFY    your phone buzzed",
    "",
    `Wednesday's follow-up is already written: ${copy.followUp}`,
    "It will send itself whether or not you ever open this again.",
    "",
    "That is the whole difference. Not a faster task — a business that keeps",
    "earning while you sleep.",
    "",
    "— The Wire",
  ].join("\n");
}

function receiptHtml({ answers, copy }: Payload): string {
  const row = (label: string, text: string) => `
    <tr>
      <td style="padding:7px 14px 7px 0;font:500 12px/1.4 ui-monospace,Menlo,monospace;color:#0B7A3E;letter-spacing:.06em;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:7px 0;font:400 14px/1.5 -apple-system,Helvetica,sans-serif;color:#37342E">${text}</td>
    </tr>`;

  return `<div style="background:#FBF9F6;padding:32px 20px">
  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E7E2DA;border-radius:6px;padding:32px">
    <div style="font:500 34px/1 ui-monospace,Menlo,monospace;color:#0B7A3E">${moneyIn(answers.price)}</div>
    <div style="font:400 16px/1.5 -apple-system,Helvetica,sans-serif;color:#37342E;margin-top:10px">
      ${escapeHtml(copy.customerName)} just paid you for ${escapeHtml(copy.purchase)}.
    </div>
    <div style="height:1px;background:#EFEBE4;margin:24px 0"></div>
    <div style="font:400 13px/1.5 -apple-system,Helvetica,sans-serif;color:#6B655D;margin-bottom:12px">
      Everything that happened in the nine tenths of a second after that, without you touching anything:
    </div>
    <table cellpadding="0" cellspacing="0" style="width:100%">
      ${row("TRIGGER", "The payment landed.")}
      ${row("CAPTURE", "They were written down where they&rsquo;ll be remembered.")}
      ${row("DECIDE", escapeHtml(copy.verdict))}
      ${row("ACT", escapeHtml(cap(copy.actNow.text)) + ".")}
      ${row("ACT", escapeHtml(cap(copy.actSecond.text)) + ".")}
      ${row("NOTIFY", "Your phone buzzed.")}
    </table>
    <div style="height:1px;background:#EFEBE4;margin:24px 0"></div>
    <div style="font:400 14px/1.55 -apple-system,Helvetica,sans-serif;color:#37342E">
      Wednesday&rsquo;s follow-up is already written: <em>${escapeHtml(copy.followUp)}</em><br>
      It will send itself whether or not you ever open this again.
    </div>
    <div style="font:400 13px/1.55 -apple-system,Helvetica,sans-serif;color:#8C857C;margin-top:20px">
      That is the whole difference. Not a faster task &mdash; a business that keeps earning while you sleep.
    </div>
  </div>
</div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
