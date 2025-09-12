// src/app/api/signals/route.ts
// Conductor de señales compartidas (GET lee, POST actualiza)

let SIGNALS_STATE = {
  ruidoAlto: false,
  hambre: false,
  sobrecargaSensorial: false,
  necesitaDescanso: false,
  updatedAt: Date.now(),
};

export async function GET() {
  return new Response(JSON.stringify(SIGNALS_STATE), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    SIGNALS_STATE = { ...SIGNALS_STATE, ...body, updatedAt: Date.now() };
    return new Response(JSON.stringify(SIGNALS_STATE), {
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "invalid" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}
