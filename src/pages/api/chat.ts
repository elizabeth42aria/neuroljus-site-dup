// src/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { messages, metrics, notes } = (req.body ?? {}) as {
      messages: { role: "user" | "assistant"; content: string }[];
      metrics?: any;
      notes?: string;
    };

    const system =
      "You are NeuroLjus Care Chat: autism-aware, empathetic, non-diagnostic. " +
      "Be concrete and gentle. Offer low-risk next steps. Use uncertainty language. " +
      "If severe/persistent pain or risk is suspected, advise contacting healthcare.";

    const context =
      `Recent metrics: ${JSON.stringify(metrics ?? {}, null, 0)}\n` +
      `Caregiver notes: ${JSON.stringify(notes ?? "", null, 0)}`;

    // If no key, return a safe heuristic response so UI still works
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      const m = metrics || {};
      const hints: string[] = [];
      if ((m.handNearPct ?? 0) > 0.45) hints.push("hands often near face (possible discomfort/self-soothing)");
      if ((m.blinksPerMin ?? 0) > 25) hints.push("elevated blinks (possible stress, dryness, or fatigue)");
      if ((m.mouthOpenAvg ?? 0) > 0.35) hints.push("mouth-open tendency (possible breath need, speech attempt, or tension)");
      const line = hints.length ? `Signals noted: ${hints.join("; ")}.` : "Signals look relatively calm right now.";
      return res.status(200).json({
        role: "assistant",
        content:
          `${line}\n\nSuggested next steps:\n` +
          `• Gently lower stimulation (lights/sounds), offer water, check basic needs.\n` +
          `• Scan for common pain sources (ear, teeth, abdominal, skin irritation, clothing tags).\n` +
          `• Use short choices (“yes/no”, “this/that”).\n` +
          `• If severe or persistent, contact healthcare.`,
      });
    }

    // OpenAI path
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `${context}\n\nDialogue:\n${(messages || []).map(m=>`${m.role.toUpperCase()}: ${m.content}`).join("\n")}` },
        ],
      }),
    });
    const j = await r.json();
    const content = j?.choices?.[0]?.message?.content || "Sorry—no reply available right now.";
    res.status(200).json({ role: "assistant", content });
  } catch {
    res.status(500).json({ role: "assistant", content: "Chat temporarily unavailable." });
  }
}