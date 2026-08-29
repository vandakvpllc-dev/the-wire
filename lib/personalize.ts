import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Answers, Personalized } from "./types";
import { money } from "./money";

/**
 * The demo must never wait on this.
 *
 * It runs the moment they submit the form, while they are still reading the
 * diagnosis and the anatomy — roughly forty seconds of runway — and the result
 * is held on the client until they pull the trigger. If the model is slow or
 * unreachable, `fallback()` is already good enough to ship, so the magic moment
 * is never gambled on a network round-trip.
 *
 * The whole point of generating this is that the demo has to fit anyone with
 * something to sell. A baker does not book appointments; a consultant does not
 * ship boxes. So the two actions are written for THEIR business rather than
 * assumed.
 */

const ActSchema = z.object({
  text: z
    .string()
    .describe("One clipped log line, lowercase, under 12 words. No pronouns like 'I'."),
  kind: z
    .enum(["mail", "calendar", "box", "list"])
    .describe(
      "mail = something was sent. calendar = something was scheduled or held. box = something physical or a digital file was dispatched or unlocked. list = a record was updated.",
    ),
});

const CopySchema = z.object({
  customerName: z
    .string()
    .describe("A plausible full name for their customer. Ordinary, not exotic."),
  purchase: z
    .string()
    .describe(
      "What the customer bought, in the seller's own words, lowercase, no quotes, under 8 words.",
    ),
  verdict: z
    .string()
    .describe(
      "What the AI concluded about this customer, as one clipped log line under 12 words.",
    ),
  actNow: ActSchema.describe(
    "The first thing the system does FOR THE CUSTOMER, immediately. Whatever this business would actually owe someone the second they paid.",
  ),
  actSecond: ActSchema.describe(
    "The second thing, done for the OWNER — their records, their schedule, their stock. Must be a different kind from actNow.",
  ),
  followUp: z
    .string()
    .describe(
      "The follow-up the system sends three days later. One sentence, under 20 words, concrete to this business, and aimed at a second sale.",
    ),
});

const SYSTEM = `You write the copy for a live demo that shows business owners what a wired AI system does the moment somebody pays them.

The reader is not technical, and they could be selling anything: coaching, cakes, cleaning, houses, courses, jewellery, bookkeeping, dog training, software. Never assume they take appointments, never assume they ship anything, never assume they have staff. Read what they actually sell and write only what would genuinely happen in that business.

Write the way their smartest customer would talk. Plain words, specific nouns, no marketing voice, no exclamation marks, no em-dashes, no words like "seamless", "leverage", "unlock" or "journey". Refer to the customer by name or as "them" — never guess their gender.`;

function prompt(a: Answers): string {
  return `They sell: ${a.sells}
They charge: ${money(a.price)}

Invent the single customer who just paid them. Then write the two things a real system would do in the first second, and the follow-up it would send three days later.

The follow-up must be a plausible next step for someone who just bought this — not a satisfaction survey, not "just checking in".`;
}

/** Good enough to ship on its own, and true for any business on earth. */
export function fallback(a: Answers): Personalized {
  return {
    customerName: "Maria Ruiz",
    purchase: a.sells.trim().toLowerCase().replace(/\.$/, ""),
    verdict: "new customer, paid in full, no history — treat as high value",
    actNow: {
      text: "receipt and welcome note sent from your own address",
      kind: "mail",
    },
    actSecond: {
      text: "added to your customer list with everything they bought",
      kind: "list",
    },
    followUp: `Ask how it went and offer them the next thing you sell.`,
    live: false,
  };
}

export async function personalize(a: Answers): Promise<Personalized> {
  if (!process.env.ANTHROPIC_API_KEY) return fallback(a);

  try {
    const client = new Anthropic();

    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: SYSTEM,
      // Short, mechanical generation on a stopwatch — depth buys nothing here,
      // and every saved second is runway we don't have to hide.
      output_config: { effort: "low", format: zodOutputFormat(CopySchema) },
      messages: [{ role: "user", content: prompt(a) }],
    });

    const out = response.parsed_output;
    if (!out) return fallback(a);

    return { ...out, live: true };
  } catch (e) {
    console.error("[the-wire] personalize failed, using fallback:", e);
    return fallback(a);
  }
}
