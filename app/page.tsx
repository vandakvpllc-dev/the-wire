"use client";

import { useCallback, useRef, useState } from "react";
import { Form } from "@/components/Form";
import { Diagnosis } from "@/components/Diagnosis";
import { Anatomy } from "@/components/Anatomy";
import { Live } from "@/components/Live";
import { Proof } from "@/components/Proof";
import { fallback } from "@/lib/personalize";
import type { Answers, Personalized } from "@/lib/types";

type Stage = "form" | "diagnosis" | "anatomy" | "live" | "proof";

export default function Page() {
  const [stage, setStage] = useState<Stage>("form");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [copy, setCopy] = useState<Personalized | null>(null);

  /**
   * Their copy is written while they read the diagnosis and the anatomy —
   * roughly forty seconds of runway — so the trigger never waits on a model.
   */
  const pending = useRef<Promise<Personalized> | null>(null);

  const start = useCallback((a: Answers) => {
    setAnswers(a);
    setStage("diagnosis");

    pending.current = (async () => {
      try {
        const res = await fetch("/api/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: a,
            source: new URLSearchParams(window.location.search).get("from") ?? "",
          }),
        });
        if (!res.ok) throw new Error(`start ${res.status}`);
        const data = (await res.json()) as { copy: Personalized };
        return data.copy;
      } catch (e) {
        console.error("[the-wire] start failed, using fallback", e);
        return fallback(a);
      }
    })();

    pending.current.then(setCopy);
  }, []);

  const toLive = useCallback(async () => {
    if (!answers) return;
    // Practically always already resolved; this is the seatbelt.
    const c = copy ?? (await (pending.current ?? Promise.resolve(fallback(answers))));
    setCopy(c);
    setStage("live");
  }, [answers, copy]);

  const restart = useCallback(() => {
    setAnswers(null);
    setCopy(null);
    pending.current = null;
    setStage("form");
  }, []);

  if (stage === "form" || !answers) return <Form onSubmit={start} />;

  if (stage === "diagnosis") {
    return <Diagnosis a={answers} onNext={() => setStage("anatomy")} />;
  }

  if (stage === "anatomy") return <Anatomy a={answers} onNext={toLive} />;

  if (stage === "live" && copy) {
    return <Live a={answers} copy={copy} onNext={() => setStage("proof")} />;
  }

  return <Proof a={answers} onRestart={restart} />;
}
