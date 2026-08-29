/** The five answers. This is the entire onboarding, and the entire lead record. */
export interface Answers {
  firstName: string;
  email: string;
  mobile: string;
  sells: string;
  /** whole dollars — the number that turns the whole demo green */
  price: number;
}

/** The five parts every AI system is made of. Order is load-bearing. */
export type PartId = "trigger" | "capture" | "decide" | "act" | "notify";

export interface Step {
  /** monotonic index so the client can dedupe a reconnected stream */
  n: number;
  part: PartId;
  /** ms since the trigger fired, as the server measured it */
  at: number;
  text: string;
  /** renders green and larger — reserved for money actually moving */
  money?: string;
  /** this step is parked for the future, not done now */
  scheduled?: string;
}

export type FireEvent =
  | { type: "step"; step: Step }
  | { type: "delivered"; channels: string[]; at: number }
  | { type: "failed"; reason: string; at: number }
  | { type: "done"; total: number; elapsed: number };

/** Copy generated from their answers, cached before they ever pull the trigger. */
export interface Personalized {
  /** the imaginary customer who pays them */
  customerName: string;
  /** what the customer bought, in their words */
  purchase: string;
  /** what the AI "decided" about this customer */
  verdict: string;
  /** what the system does for the customer immediately */
  actNow: Act;
  /** what it does for the owner's own records or schedule */
  actSecond: Act;
  /** the follow-up the system parks for three days out */
  followUp: string;
  /** true when this came from the model rather than the fallback */
  live: boolean;
}

/**
 * What kind of thing an action produced — this picks the icon on the phone.
 * The demo has to fit a coach, a baker and a web developer equally well, so
 * the actions are written per business rather than assumed to be appointments.
 */
export type ActKind = "mail" | "calendar" | "box" | "list";

export interface Act {
  text: string;
  kind: ActKind;
}

export interface Run {
  id: string;
  answers: Answers;
  createdAt: number;
  /** resolves while they read screens 2 and 3, so the trigger never waits */
  copy: Promise<Personalized>;
  firedAt?: number;
}
