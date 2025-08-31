export default function NLVisionBeta() {
    return (
      <main style={{ minHeight: "100vh", padding: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>
          NeuroLjus · NL-VISION Beta
        </h1>
        <div style={{ width: "100%", maxWidth: "900px", aspectRatio: "16/9", marginTop: "16px" }}>
          <iframe
            src="/labs/nl-vision-beta/index.html"
            style={{ width: "100%", height: "100%", border: "1px solid #ccc", borderRadius: "12px" }}
            title="NL-VISION Beta"
          />
        </div>
      </main>
    );
  }
  