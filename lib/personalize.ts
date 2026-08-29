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
 */

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
      "What the AI concluded about this customer, as one clipped log line under 12 words. No pronouns like 'I'.",
    ),
  followUp: z
    .string()
    .describe(
      "The specific follow-up offer the system will send three days later. One sentence, under 20 words, concrete to this business.",
    ),
});

const SYSTEM = `You write the copy for a live demo that shows small business owners what a wired AI system does with a payment.

The reader is not technical. They are a real operator — a realtor, a coach, a placement advisor, a house cleaner. Write the way their smartest customer would talk. Plain words, specific nouns, no marketing voice, no exclamation marks, no em-dashes, no words like "seamless", "leverage", "unlock" or "journey".

You are given what they sell and what they charge. Everything you write must sound like it came out of that exact business, not a generic one.`;

function prompt(a: Answers): string {
  return `They sell: ${a.sells}
They charge: ${money(a.price)}

Invent the single customer who just paid them, and the follow-up the system will send three days later. The follow-up must be a real next step someone who bought this would plausibly want — not a satisfaction survey, not "just checking in".`;
}

/** Good enough to ship on its own. Used whenever the model is slow or absent. */
export function fallback(a: Answers): Personalized {
  return {
    customerName: "Maria Ruiz",
    purchase: a.sells.trim().toLowerCase().replace(/\.$/, ""),
    verdict: "new client, paid in full, no history — treat as high value",
    followUp: `Ask how it went and offer the next ${money(a.price)} session.`,
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
