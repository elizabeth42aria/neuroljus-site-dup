import Head from 'next/head';

export default function NLVisionHolisticPage() {
  return (
    <>
      <Head>
        <title>NL-VISION · Holistic Demo</title>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(1200px 700px at 20% 10%, rgba(94,230,164,0.18), transparent 60%), radial-gradient(900px 600px at 80% 20%, rgba(124,227,247,0.18), transparent 60%), radial-gradient(1200px 900px at 50% 120%, rgba(166,133,247,0.18), transparent 60%), #1E1F3B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 18,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
        color: '#fff'
      }}>
        <h1 style={{ fontSize: 26, margin: '8px 0 0' }}>NL-VISION · Holistic</h1>
        <p style={{ fontSize: 14, opacity: 0.9, margin: '6px 0 12px' }}>
          Empathic AI · Face + Hands + Pose · On-device metrics
        </p>
        
        <div style={{
          width: 'min(92vw, 960px)',
          aspectRatio: '16 / 9',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}>
          <iframe
            src="/labs/nl-vision/index.html"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            title="NL-VISION Holistic Demo"
          />
        </div>
      </div>
    </>
  );
}