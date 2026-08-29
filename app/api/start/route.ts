import { personalize } from "@/lib/personalize";
import { recordLead } from "@/lib/leads";
import { readAnswers } from "@/lib/validate";
import { configuredChannels } from "@/lib/notify";

/**
 * Called the instant they submit the five boxes.
 *
 * Two jobs: bank the lead, and start writing their copy while they read the
 * next two screens. By the time they reach the trigger this has long since
 * resolved, so the moment that matters never waits on a model.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const answers = readAnswers((body as Record<string, unknown>)?.answers);
  if (!answers) {
    return Response.json({ error: "incomplete" }, { status: 400 });
  }

  const source = String((body as Record<string, unknown>)?.source ?? "").slice(0, 60);

  const [copy] = await Promise.all([
    personalize(answers),
    recordLead({ ...answers, at: new Date().toISOString(), source: source || undefined }),
  ]);

  return Response.json({ copy, channels: configuredChannels() });
}
