// src/app/api/ai/route.ts
import { NextResponse } from "next/server";

const MODEL = process.env.MODEL || "gpt-4o-mini";

export async function POST(req: Request) {
  try {
    const {
      messages,
      lang = "sv",
      signals,
      memory,
      temperature = 0.4,
      allowInitiative = true,
    } = await req.json();

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const system = buildSystemPrompt({ lang, signals, memory, allowInitiative });

    const payload = {
      model: MODEL,
      temperature: Math.max(0, Math.min(1, temperature)),
      messages: [
        { role: "system", content: system },
        ...(Array.isArray(messages) ? messages.slice(-12) : []),
      ],
    } as const;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json({ error: `Upstream error: ${err}` }, { status: 502 });
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unknown" }, { status: 500 });
  }
}

function buildSystemPrompt({
  lang,
  signals,
  memory,
  allowInitiative,
}: {
  lang: "sv" | "es" | "en";
  signals?: any;
  memory?: any;
  allowInitiative?: boolean;
}) {
  const langs: Record<string, string> = {
    sv: "Svara på enkel, lugn svenska. Korta meningar, små nästa steg.",
    es: "Responde en español claro y sereno. Frases cortas, pasos pequeños.",
    en: "Respond in clear, calm English. Short sentences, small next steps.",
  };

  const signalHints: string[] = [];
  if (signals?.sobrecargaSensorial) signalHints.push("sensorisk överbelastning / sobrecarga sensorial");
  if (signals?.ruidoAlto) signalHints.push("bullrig miljö / entorno ruidoso");
  if (signals?.hambre) signalHints.push("hunger / hambre");
  if (signals?.necesitaDescanso) signalHints.push("behov av vila / necesidad de descanso");

  const memoryHints = memory ? JSON.stringify(memory).slice(0, 800) : "{}";

  return `You are Neuroljus, an empathic assistant co-designed with autistic individuals and caregivers.
Principles:
- Person-first, N-of-1 baseline. Do not assume universal emotions; ask before concluding.
- Privacy-first; avoid collecting unnecessary data. Be explicit about uncertainty.
- Co-regulation style: offer calm, short, actionable next steps.
- If user seems overloaded, lower cognitive load (bullet points, fewer options).
Language:
${langs[lang]}
Signals (context): ${signalHints.join(", ") || "none"}
Personal memory (optional): ${memoryHints}
Initiative: ${allowInitiative ? "You may gently propose options proactively when useful." : "Only answer when asked; avoid unsolicited suggestions."}
Output rules:
- Keep answers concise.
- Ask at most 1 gentle clarifying question when uncertainty is high.
- Prefer concrete 5–20 minute actions.`;
}
