import type { PartId } from "./types";

/**
 * The teaching. Five parts, in order, in plain words.
 *
 * This is the one thing a viewer should still be able to recite a week later,
 * so the wording here is the wording everywhere — screens, logs, emails.
 */
export interface Part {
  id: PartId;
  label: string;
  /** what it means, for someone who has never heard the word "webhook" */
  plain: (a: { price: string; sells: string }) => string;
  /** the actual tool doing it, lowercase, unglamorous on purpose */
  tool: string;
}

export const PARTS: Part[] = [
  {
    id: "trigger",
    label: "TRIGGER",
    plain: ({ price }) =>
      `Something real happens. Somebody pays your ${price} link. Nobody presses a button — not you, not anyone.`,
    tool: "your payment link",
  },
  {
    id: "capture",
    label: "CAPTURE",
    plain: () =>
      "She gets written down somewhere that remembers her. This is the part almost nobody has.",
    tool: "a plain spreadsheet",
  },
  {
    id: "decide",
    label: "DECIDE",
    plain: ({ price }) =>
      `The AI reads her and judges. Paid or just curious? New or returning? Worth ${price} or worth ten times that?`,
    tool: "the ai — this part only",
  },
  {
    id: "act",
    label: "ACT",
    plain: () =>
      "It does the next thing without asking. Receipt, welcome, calendar hold, and a follow-up parked for Wednesday.",
    tool: "email · calendar",
  },
  {
    id: "notify",
    label: "NOTIFY",
    plain: () =>
      "Your phone buzzes with the only sentence that matters. Not a task to do — a result to read.",
    tool: "your phone",
  },
];

export const PART_INDEX: Record<PartId, number> = Object.fromEntries(
  PARTS.map((p, i) => [p.id, i]),
) as Record<PartId, number>;
