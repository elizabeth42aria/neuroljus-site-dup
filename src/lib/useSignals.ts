// src/lib/useSignals.ts
"use client";
import { useEffect, useRef, useState } from "react";

export type SharedSignals = {
  ruidoAlto: boolean;
  hambre: boolean;
  sobrecargaSensorial: boolean;
  necesitaDescanso: boolean;
  updatedAt: number;
};

export function useSignals(pollMs = 2000) {
  const [shared, setShared] = useState<SharedSignals | null>(null);
  const timer = useRef<any>(null);

  useEffect(() => {
    let active = true;
    const tick = async () => {
      try {
        const r = await fetch("/api/signals", { cache: "no-store" });
        if (!r.ok) return;
        const data = await r.json();
        if (active) setShared(data);
      } catch {}
      timer.current = setTimeout(tick, pollMs);
    };
    tick();
    return () => {
      active = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [pollMs]);

  return shared;
}
