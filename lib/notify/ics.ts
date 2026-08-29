/**
 * A calendar invite as a file attachment.
 *
 * Deliberately not the Google Calendar API: that needs write-access OAuth, and
 * Google's consent screen is the single scariest thing we could put in front of
 * a non-technical person. An .ics attachment costs zero permissions and every
 * phone offers to add it with one tap.
 */

interface InviteInput {
  organizerName: string;
  organizerEmail: string;
  customerName: string;
  purchase: string;
  /** when the imaginary appointment sits */
  start: Date;
  minutes: number;
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Fold long lines at 75 octets, per RFC 5545 — some clients drop the event otherwise. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest) parts.push(" " + rest);
  return parts.join("\r\n");
}

const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

export function buildInvite(input: InviteInput): string {
  const end = new Date(input.start.getTime() + input.minutes * 60_000);
  const uid = `${crypto.randomUUID()}@the-wire`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Wire//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(input.start)}`,
    `DTEND:${stamp(end)}`,
    fold(`SUMMARY:${esc(`${input.customerName} — ${input.purchase}`)}`),
    fold(
      `DESCRIPTION:${esc(
        `${input.customerName} paid and booked this herself. Nobody typed it in.\n\nThis is what a wired system does with a payment: it captures the customer, decides how to treat her, acts, and tells you afterwards.`,
      )}`,
    ),
    fold(`ORGANIZER;CN=${esc(input.organizerName)}:mailto:${input.organizerEmail}`),
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

/** Thursday of this week at 2:15pm local-ish, or next Thursday if that has passed. */
export function nextThursday(from = new Date()): Date {
  const d = new Date(from);
  d.setHours(14, 15, 0, 0);
  const delta = (4 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + delta);
  return d;
}
