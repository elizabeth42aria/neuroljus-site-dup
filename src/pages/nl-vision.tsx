export default function NLVision() {
    return (
      <main style={{ minHeight: "100vh", padding: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>
          NeuroLjus · NL-VISION Demo
        </h1>
        <div style={{ width: "100%", maxWidth: "900px", aspectRatio: "16/9", marginTop: "16px" }}>
          <iframe
            src="/labs/nl-vision/index.html"
            style={{ width: "100%", height: "100%", border: "1px solid #ccc", borderRadius: "12px" }}
            title="NL-VISION"
          />
        </div>
      </main>
    );
  }
    