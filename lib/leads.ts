import type { Answers } from "./types";

/**
 * The whole point of the demo, commercially.
 *
 * Nobody reaches the green screen without answering all five questions, so a
 * completed run is a lead who has already watched the system work on their own
 * business — with their price attached, which tells you who can afford you
 * before you ever pick up the phone.
 *
 * Set LEADS_WEBHOOK_URL to a Google Apps Script web-app URL that appends a row
 * to a sheet. Anything else that accepts a JSON POST works too.
 */

export interface Lead extends Answers {
  at: string;
  /** where they came from, if the link carried a ?from= */
  source?: string;
  /** did the notification actually land */
  channels?: string[];
}

export async function recordLead(lead: Lead): Promise<void> {
  const url = process.env.LEADS_WEBHOOK_URL;

  // Always log — Vercel keeps these, so a missing webhook never loses a lead.
  console.log("[the-wire] lead", JSON.stringify(lead));

  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  } catch (e) {
    // Never let the lead write break the demo — the person is mid-experience.
    console.error("[the-wire] lead webhook failed:", e);
  }
}
