# The Wire

A five-screen demo that shows a business owner the difference between **AI automation**
and **an AI system** — by running one on their own business while they watch, and putting
a green **+$450.00** on their phone at the end of it.

## What a visitor experiences

1. **Five boxes.** Name, email, mobile, what they sell, what they charge. Thirty seconds.
   The price box is the one that turns everything after it green.
2. **What you have now.** Their assets drawn as disconnected parts, every wire hanging
   loose. *You are the wire.*
3. **How it actually works.** The five parts every AI system has — **TRIGGER → CAPTURE →
   DECIDE → ACT → NOTIFY** — then the reveal: ChatGPT is part three, and only part three.
4. **They pull the trigger.** A test payment for their own price. The pulse travels the
   rail, the log prints every step with real timestamps, and their phone buzzes.
5. **The difference.** Same money, two worlds. Closes on: *$250 today either way. $0 on
   Wednesday with a smart pen — **+$250** on Wednesday with a system.*

## The one rule this codebase is built around

**The notification is sent before the animation starts.** `app/api/fire/route.ts`
dispatches to the phone and does *not* await it, then paces the screen at ~850ms a step
for about six seconds. The phone can only ever be early. **Early reads as magic. Late
reads as broken.**

Two things follow from that:

- The AI copy is generated at `/api/start`, while they read screens 2 and 3 — about forty
  seconds of runway — and cached on the client. The trigger never waits on a model, and
  `lib/personalize.ts` has a hand-written fallback that ships fine on its own.
- The timestamps in the log are the true machine times (tenths of a second). The reveal is
  slower than the truth so a human can read it, and the screen says so rather than
  pretending otherwise.

## Running it

```bash
npm install
cp .env.example .env.local   # every line is optional
npm run dev                  # http://localhost:3000
```

With no environment variables at all the demo runs end to end and states plainly on screen
that the send didn't go out. Nothing fails silently.

## What's in the folder

```
app/page.tsx              the five screens, and the state machine between them
app/api/start/route.ts    banks the lead, starts writing their copy
app/api/fire/route.ts     the trigger — sends first, then streams the five parts
components/Rail.tsx       the five stations. always five across, at every width
components/Live.tsx       the money screen: log, phone, and the stream reader
components/Phone.tsx      no fake status bar — the real one renders on top
lib/anatomy.ts            the five parts, in order. this is the teaching
lib/money.ts              their price, formatted, everywhere
lib/notify/               sms, email, and the .ics invite
lib/leads.ts              everyone who ran it — this is the list
```

## What it costs to run

| | |
|---|---|
| Hosting | **$0** — Vercel's free tier carries this |
| Email buzz | **$0** — free tier covers thousands |
| AI personalisation | **~2¢** per *hundred* runs |
| A real text message | **~1¢ each** — optional, and the only real cost |

## Why nobody gets charged

The payment is a **test payment** — a real link and a real flow with no card behind it.
The notification that follows is completely real; the charge is the only thing that isn't.
That's what lets this go to a thousand strangers without one of them spending a cent.

## No OAuth, on purpose

An earlier design signed people in with Google so it could write to their calendar.
That puts Google's "this app wants to manage your calendar" consent screen directly in
front of the payoff — the worst possible place for a wall. The demo only ever sends *to*
them, so it needs no permissions at all, and the calendar invite rides along as a one-tap
`.ics` attachment. OAuth belongs in the paid product, when they're wiring their real
business.

## It has to fit anyone

A baker doesn't book appointments. A consultant doesn't ship boxes. So nothing in the
demo assumes what kind of business it's looking at: the two things the system *does* are
written per business by `lib/personalize.ts` and carry a `kind` (`mail`, `calendar`,
`box`, `list`) that picks the icon on the phone. The calendar invite is only attached
when that business actually schedules something. The fallback copy — what runs with no
API key — is true of every business on earth.

Verified end to end as a $450 consultancy and an $85 cake business.

## Known gaps

- Verified at phone width in a desktop browser, not on real hardware. The alternate beat
  on mobile ("swipe down, it's already waiting" instead of "look down at your hand") is
  written and detected but unconfirmed on a real device.
- No channel is wired up yet, so the notification currently only lands on screen. That's
  three keys in `.env.local` away.
