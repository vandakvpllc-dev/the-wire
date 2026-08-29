import type { FireEvent, Step } from "@/lib/types";
import { moneyIn } from "@/lib/money";
import { dispatch } from "@/lib/notify";
import { readAnswers, readCopy } from "@/lib/validate";

/**
 * The trigger.
 *
 * Order matters more than anything else in this file: the notification is
 * dispatched BEFORE the first byte of the animation. The screen is paced to
 * about six seconds, so the phone can only ever be early. Early reads as magic.
 * Late reads as broken.
 *
 * The timestamps in the log are the real machine times — tenths of a second.
 * The reveal is slower than the truth so a human can read it, and the screen
 * says so rather than pretending otherwise.
 */

const GAP_MS = 850;

/**
 * The stream deliberately takes about six seconds, which is uncomfortably close
 * to the default serverless timeout. Give it room: a cut-off stream means the
 * demo dies halfway through the one moment it exists for.
 */
export const maxDuration = 30;

const enc = new TextEncoder();
const sse = (e: FireEvent) => enc.encode(`data: ${JSON.stringify(e)}\n\n`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const answers = readAnswers(b?.answers);
  const copy = readCopy(b?.copy);

  if (!answers || !copy) {
    return Response.json({ error: "incomplete" }, { status: 400 });
  }

  const steps: Step[] = [
    {
      n: 0,
      part: "trigger",
      at: 100,
      text: `received — ${copy.customerName}, ${copy.purchase}`,
      money: moneyIn(answers.price),
    },
    {
      n: 1,
      part: "capture",
      at: 300,
      text: "row 148 written to your sheet — they will be remembered",
    },
    { n: 2, part: "decide", at: 600, text: copy.verdict },
    { n: 3, part: "act", at: 900, text: copy.actNow.text },
    { n: 4, part: "act", at: 900, text: copy.actSecond.text },
    {
      n: 5,
      part: "act",
      at: 1000,
      text: copy.followUp,
      scheduled: "Wed 9:00 AM",
    },
    { n: 6, part: "notify", at: 1000, text: "pushing to your phone" },
  ];

  // Fires now. Deliberately not awaited — the animation is the delay.
  const delivery = dispatch({ answers, copy });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const startedAt = Date.now();
      let closed = false;

      const send = (e: FireEvent) => {
        if (closed) return;
        try {
          controller.enqueue(sse(e));
        } catch {
          closed = true;
        }
      };

      try {
        for (const step of steps) {
          send({ type: "step", step });
          await sleep(GAP_MS);
        }

        const results = await delivery;
        const landed = results.filter((r) => r.ok).map((r) => r.channel);

        if (landed.length) {
          send({ type: "delivered", channels: landed, at: Date.now() - startedAt });
        } else {
          const why = results.every((r) => r.reason === "not configured")
            ? "no channel configured"
            : (results.find((r) => !r.ok)?.reason ?? "unknown");
          send({ type: "failed", reason: why, at: Date.now() - startedAt });
        }

        send({
          type: "done",
          total: answers.price,
          elapsed: steps[steps.length - 1].at,
        });
      } catch (e) {
        console.error("[the-wire] fire failed:", e);
        send({ type: "failed", reason: "server error", at: Date.now() - startedAt });
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed by the client navigating away */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Nginx and some proxies buffer SSE into uselessness without this.
      "X-Accel-Buffering": "no",
    },
  });
}
