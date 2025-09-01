import Head from "next/head";
import React from "react";

export default function ChatAI() {
  return (
    <>
      <Head>
        <title>NeuroLjus · AI Lab</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Empathic AI · Vision + care chat demo" />
      </Head>

      <main style={{
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "radial-gradient(1200px 600px at 50% -200px, #2e3958 0%, #151a2c 60%, #0f1324 100%)"
      }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 600, color: "white", margin: 0 }}>
          NeuroLjus · AI Lab
        </h1>

        <p style={{ color: "#cdd6f4", opacity: 0.8, marginTop: 8, marginBottom: 16 }}>
          Vision + empathetic care chat (on-device signals)
        </p>

        <div style={{
          width: "100%",
          maxWidth: "1100px",
          aspectRatio: "16/9",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,.35)",
          border: "1px solid rgba(255,255,255,.12)",
          background: "rgba(8,10,20,.6)",
        }}>
          {/* Usamos ruta relativa para que funcione local y en producción */}
          <iframe
            src="/labs/nl-vision"
            title="NeuroLjus – Vision & Care Chat"
            style={{ width: "100%", height: "100%", border: "0" }}
            allow="camera *; microphone *; clipboard-read; clipboard-write"
          />
        </div>

        <p style={{ color: "#9aa3bc", fontSize: 14, marginTop: 14 }}>
          Si el navegador pide permisos de cámara/micrófono, por favor acéptalos.
        </p>
      </main>
    </>
  );
}
