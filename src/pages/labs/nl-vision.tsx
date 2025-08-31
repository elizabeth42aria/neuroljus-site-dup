/* ---------- PAGE (scripts loading + Holistic component) ---------- */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import LiveVitals from '../../components/LiveVitals';
import CareChat   from '../../components/CareChat';
import Script     from 'next/script';

export default function NLVisionHolisticPage() {
  return (
    <>
      {/* MediaPipe Holistic from CDN */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js"
        strategy="afterInteractive"
      />

      {/* Cámara + Holistic */}
      <NLVisionHolistic />

      {/* Paneles */}
      <div style={{ marginTop: 16 }}>
        <LiveVitals />
      </div>
      <div style={{ marginTop: 16 }}>
        <CareChat />
      </div>
    </>
  );
}

/* ====================== Vision (camera + holistic) ====================== */
function NLVisionHolistic() {
  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const [err, setErr] = useState<string>('');

  const start = useCallback(async () => {
    const w = window as any;

    if (!navigator.mediaDevices?.getUserMedia) {
      setErr('Camera not available in this browser.');
      return;
    }

    // Espera a que cargue Holistic
    const waitForHolistic = () =>
      new Promise<void>((resolve, reject) => {
        const t0 = Date.now();
        (function poll() {
          const ok = (w as any).Holistic && (w as any).drawConnectors;
          if (ok) return resolve();
          if (Date.now() - t0 > 8000) return reject(new Error('Holistic not loaded'));
          setTimeout(poll, 200);
        })();
      });

    await waitForHolistic();

    const holistic = new (w as any).Holistic({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${f}`,
    });
    holistic.setOptions({
      selfieMode: true,
      modelComplexity: 1,
      smoothLandmarks: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false,
    });
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    await videoRef.current.play();

    const onFrame = async () => {
      if (!videoRef.current) return;
      await holistic.send({ image: videoRef.current });
      requestAnimationFrame(onFrame);
    };
    onFrame();
  }, []);

  useEffect(() => {
    start().catch(e => setErr(String(e)));
  }, [start]);

  return (
    <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
      {err && <div style={{ color: '#b91c1c', marginBottom: 8 }}>{err}</div>}
      <video
        ref={videoRef}
        width={960}
        height={540}
        style={{ borderRadius: 12 }}
        muted
        playsInline
      />
    </div>
  );
}