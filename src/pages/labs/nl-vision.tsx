/**
 * NL-VISION PROTECTED FILE
 * This file is part of the stable, polished NL-VISION demo (CareChat + LiveVitals + Holistic).
 * Do not modify unless you *intentionally* update the demo.
 * If you need to change it, include the commit message token: [ALLOW-NLVISION-EDIT]
 * Frozen baseline tag: v1.0-nlvision-stable
 */

import Head from "next/head";
import Script from "next/script";
import { useRef, useEffect, useState, useCallback } from "react";
import CareChat from "../../components/CareChat";

// MediaPipe global types
declare global {
  interface Window {
    Holistic: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}

// Types
type MetricSample = {
  t: number;
  hands: number;
  near: number;
  mouth: number;
  blinks: number;
};

type HolisticResults = {
  faceLandmarks?: any[];
  leftHandLandmarks?: any[];
  rightHandLandmarks?: any[];
};

export default function NLVisionPage() {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holisticRef = useRef<any>(null);

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Metrics state
  const [handsActivity, setHandsActivity] = useState(0);
  const [nearFacePercent, setNearFacePercent] = useState(0);
  const [mouthOpenPercent, setMouthOpenPercent] = useState(0);
  const [blinksPerMin, setBlinksPerMin] = useState(0);

  // UI controls
  const [showPreview, setShowPreview] = useState(false);
  const [lowStimulus, setLowStimulus] = useState(false);
  const [monochrome, setMonochrome] = useState(false);
  const [lowLight, setLowLight] = useState(false);

  // History
  const [samples, setSamples] = useState<MetricSample[]>([]);
  const blinkTimesRef = useRef<number[]>([]);
  const lastEarRef = useRef<number>(1);

  // Helpers
  const nearFacePercentHelper = useCallback((faceLandmarks: any[], W: number, H: number): number => {
    if (!faceLandmarks?.length) return 0;

    let minX = 1, minY = 1, maxX = 0, maxY = 0;
    for (const p of faceLandmarks) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }

    const boxW = (maxX - minX) * W;
    const boxH = (maxY - minY) * H;
    const area = Math.max(0, boxW * boxH);

    const AREA_FAR = W * H * 0.05;
    const AREA_NEAR = W * H * 0.35;

    const t = Math.max(0, Math.min(1, (area - AREA_FAR) / Math.max(1, AREA_NEAR - AREA_FAR)));
    return Math.round(t * 100);
  }, []);

  const mouthOpenPercentHelper = useCallback((faceLandmarks: any[]): number => {
    if (!faceLandmarks?.length) return 0;

    // Landmarks for mouth: 13 (upper lip), 14 (lower lip), 61 (left corner), 291 (right corner)
    const upperLip = faceLandmarks[13];
    const lowerLip = faceLandmarks[14];
    const leftCorner = faceLandmarks[61];
    const rightCorner = faceLandmarks[291];

    if (!upperLip || !lowerLip || !leftCorner || !rightCorner) return 0;

    const verticalDistance = Math.abs(upperLip.y - lowerLip.y);
    const mouthWidth = Math.abs(leftCorner.x - rightCorner.x);
    
    if (mouthWidth === 0) return 0;
    
    const ratio = verticalDistance / mouthWidth;
    return Math.min(100, Math.round(ratio * 100));
  }, []);

  const detectBlink = useCallback((faceLandmarks: any[]): boolean => {
    if (!faceLandmarks?.length) return false;

    // Calculate Eye Aspect Ratio (EAR)
    const leftEye = [
      faceLandmarks[159], faceLandmarks[145], // upper, lower
      faceLandmarks[33], faceLandmarks[133]   // left, right
    ];
    const rightEye = [
      faceLandmarks[386], faceLandmarks[374], // upper, lower
      faceLandmarks[362], faceLandmarks[263]  // left, right
    ];

    const calculateEAR = (eye: any[]) => {
      if (!eye.every(p => p)) return 1;
      
      const A = Math.hypot(eye[0].x - eye[1].x, eye[0].y - eye[1].y);
      const B = Math.hypot(eye[2].x - eye[3].x, eye[2].y - eye[3].y);
      return A / (B || 1e-6);
    };

    const leftEAR = calculateEAR(leftEye);
    const rightEAR = calculateEAR(rightEye);
    const ear = (leftEAR + rightEAR) / 2;

    const threshold = 0.24;
    const now = Date.now();
    
    // Detect blink: EAR drops below threshold
    if (lastEarRef.current >= threshold && ear < threshold && now - (blinkTimesRef.current[blinkTimesRef.current.length - 1] || 0) > 250) {
      blinkTimesRef.current.push(now);
      // Keep only blinks from last minute
      blinkTimesRef.current = blinkTimesRef.current.filter(time => now - time < 60000);
    }
    
    lastEarRef.current = ear;
    return false;
  }, []);

  // Initialize MediaPipe
  const initializeHolistic = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Wait for MediaPipe to load
      const waitForMediaPipe = () => new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('MediaPipe failed to load')), 10000);
        
        const check = () => {
          if (window.Holistic && window.drawConnectors && window.drawLandmarks) {
            clearTimeout(timeout);
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });

      await waitForMediaPipe();

      // Initialize Holistic
      holisticRef.current = new window.Holistic({
        locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${f}`
      });

      holisticRef.current.setOptions({
        selfieMode: true,
        modelComplexity: 1,
        smoothLandmarks: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      holisticRef.current.onResults(onResults);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize MediaPipe');
      setIsLoading(false);
    }
  }, []);

  // Process results
  const onResults = useCallback((results: HolisticResults) => {
    if (!canvasRef.current || !videoRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply filters based on toggles
    ctx.save();
    if (monochrome) ctx.filter = 'grayscale(100%)';
    if (lowLight) ctx.filter = `${ctx.filter} brightness(70%)`;
    if (lowStimulus) ctx.globalAlpha = 0.7;

    // Draw video background if preview is enabled
    if (showPreview) {
      ctx.drawImage(videoRef.current!, 0, 0, width, height);
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.78)';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();

    // Draw landmarks
    const faceLandmarks = results.faceLandmarks || [];
    const leftHandLandmarks = results.leftHandLandmarks || [];
    const rightHandLandmarks = results.rightHandLandmarks || [];

    const lineWidth = lowStimulus ? 2 : 3;
    const dotRadius = lowStimulus ? 1.2 : 1.6;
    const faceColor = monochrome ? '#d9d0f5' : (lowStimulus ? '#c7b7f6' : '#A685F7');
    const handColor = monochrome ? '#cfd5dc' : (lowStimulus ? '#9bdff0' : '#7CE3F7');
    const handPointColor = monochrome ? '#e3e7ee' : (lowStimulus ? '#88dcb0' : '#5EE6A4');

    // Draw face landmarks
    if (faceLandmarks.length && window.drawLandmarks) {
      window.drawLandmarks(ctx, faceLandmarks, { color: faceColor, radius: dotRadius });
    }

    // Draw hand landmarks
    if (leftHandLandmarks.length && window.drawConnectors && window.HAND_CONNECTIONS) {
      window.drawConnectors(ctx, leftHandLandmarks, window.HAND_CONNECTIONS, { color: handColor, lineWidth });
      window.drawLandmarks(ctx, leftHandLandmarks, { color: handPointColor, radius: dotRadius });
    }

    if (rightHandLandmarks.length && window.drawConnectors && window.HAND_CONNECTIONS) {
      window.drawConnectors(ctx, rightHandLandmarks, window.HAND_CONNECTIONS, { color: handColor, lineWidth });
      window.drawLandmarks(ctx, rightHandLandmarks, { color: handPointColor, radius: dotRadius });
    }

    // Update metrics
    const hands = (leftHandLandmarks.length > 0 || rightHandLandmarks.length > 0) ? 1 : 0;
    const near = nearFacePercentHelper(faceLandmarks, width, height);
    const mouth = mouthOpenPercentHelper(faceLandmarks);
    
    detectBlink(faceLandmarks);
    const blinks = blinkTimesRef.current.length;

    setHandsActivity(hands);
    setNearFacePercent(near);
    setMouthOpenPercent(mouth);
    setBlinksPerMin(blinks);

    // Add to samples
    const sample: MetricSample = {
      t: Date.now(),
      hands,
      near,
      mouth,
      blinks
    };

    setSamples(prev => [...prev.slice(-100), sample]); // Keep last 100 samples
  }, [showPreview, lowStimulus, monochrome, lowLight, nearFacePercentHelper, mouthOpenPercentHelper, detectBlink]);

  // Start camera and processing
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Set canvas size
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth || 1280;
          canvasRef.current.height = videoRef.current.videoHeight || 720;
        }
      }

      setHasPermission(true);
      setIsRunning(true);

      // Start processing loop
      const processFrame = async () => {
        if (!isRunning || !holisticRef.current || !videoRef.current) return;
        
        if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          await holisticRef.current.send({ image: videoRef.current });
        }
        
        requestAnimationFrame(processFrame);
      };
      
      processFrame();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Permission dismissed');
        setHasPermission(false);
      } else {
        setError(err.message || 'Failed to start camera');
      }
    }
  }, [isRunning]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsRunning(false);
  }, []);

  // Export CSV
  const exportCSV = useCallback(() => {
    if (samples.length === 0) return;

    const headers = ['timestamp', 'hands_activity', 'near_face_percent', 'mouth_open_percent', 'blinks_per_min'];
    const csvContent = [
      headers.join(','),
      ...samples.map(s => [
        new Date(s.t).toISOString(),
        s.hands,
        s.near,
        s.mouth,
        s.blinks
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nl-vision-metrics-${new Date().toISOString().slice(0, 19)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [samples]);

  // Calculate state for CareChat
  const getStateLabel = useCallback(() => {
    if (handsActivity < 0.2 && mouthOpenPercent < 10 && blinksPerMin >= 8 && blinksPerMin <= 25) {
      return 'Calm';
    } else if (handsActivity > 0.5 || mouthOpenPercent > 30 || blinksPerMin > 30) {
      return 'Active';
    } else {
      return 'Neutral';
    }
  }, [handsActivity, mouthOpenPercent, blinksPerMin]);

  // Initialize on mount
  useEffect(() => {
    initializeHolistic();
  }, [initializeHolistic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <>
      <Head>
        <title>NL-VISION · Holistic</title>
        <meta name="description" content="Interactive MediaPipe Holistic demo with real-time metrics and CareChat integration" />
      </Head>

      {/* MediaPipe Scripts */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js"
        strategy="afterInteractive"
      />

      <div className="page">
        <div className="container">
          {/* Header */}
          <header className="header">
            <h1 className="title">NL-VISION · Holistic</h1>
            <p className="subtitle">Interactive AI · Face + Hands · Real-time metrics</p>
          </header>

          {/* Main Demo Area */}
          <div className="demo-container">
            {/* Video/Canvas Area */}
            <div className="video-section">
              <div className="video-container">
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  style={{ display: 'none' }}
                />
                <canvas
                  ref={canvasRef}
                  className="canvas"
                />
                
                {/* Error Badge */}
                {error && (
                  <div className="error-badge">
                    Error: {error}
                  </div>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading MediaPipe...</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="controls">
                <div className="control-group">
                  <button
                    onClick={isRunning ? stopCamera : startCamera}
                    disabled={!hasPermission && hasPermission !== null}
                    className="control-btn primary"
                  >
                    {isRunning ? 'Stop' : 'Start'} Camera
                  </button>
                  <button
                    onClick={exportCSV}
                    disabled={samples.length === 0}
                    className="control-btn secondary"
                  >
                    Export CSV
                  </button>
                </div>

                <div className="control-group">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={showPreview}
                      onChange={(e) => setShowPreview(e.target.checked)}
                    />
                    <span>Show preview</span>
                  </label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={lowStimulus}
                      onChange={(e) => setLowStimulus(e.target.checked)}
                    />
                    <span>Low-stimulus</span>
                  </label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={monochrome}
                      onChange={(e) => setMonochrome(e.target.checked)}
                    />
                    <span>Monochrome</span>
                  </label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={lowLight}
                      onChange={(e) => setLowLight(e.target.checked)}
                    />
                    <span>Low-light</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Metrics Panel */}
            <div className="metrics-panel">
              <h3 className="metrics-title">Live Metrics</h3>
              
              <div className="metric-card">
                <div className="metric-label">Hands Activity</div>
                <div className="metric-value">{handsActivity}</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Near Face %</div>
                <div className="metric-value">{nearFacePercent}%</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Mouth Open %</div>
                <div className="metric-value">{mouthOpenPercent}%</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Blinks/min</div>
                <div className="metric-value">{blinksPerMin}</div>
              </div>

              <div className="metric-info">
                <p>State: <strong>{getStateLabel()}</strong></p>
                <p>Samples: {samples.length}</p>
              </div>
            </div>
          </div>

          {/* CareChat Integration */}
          <div className="carechat-section">
            <CareChat />
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .page {
          min-height: 100dvh;
          color: #fff;
          background:
            radial-gradient(1200px 700px at 20% 10%, rgba(94,230,164,0.18), transparent 60%),
            radial-gradient(900px 600px at 80% 20%, rgba(124,227,247,0.18), transparent 60%),
            radial-gradient(1200px 900px at 50% 120%, rgba(166,133,247,0.18), transparent 60%),
            #1E1F3B;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .header {
          text-align: center;
          margin-bottom: 32px;
        }

        .title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px;
          background: linear-gradient(135deg, #5EE6A4, #7CE3F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 16px;
          color: #cbd5e1;
          margin: 0;
        }

        .demo-container {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
          margin-bottom: 32px;
        }

        .video-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .video-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .error-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid #5EE6A4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .control-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .control-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .control-btn.primary {
          background: linear-gradient(135deg, #5EE6A4, #7CE3F7);
          color: #0b1220;
        }

        .control-btn.primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(94, 230, 164, 0.3);
        }

        .control-btn.secondary {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .control-btn.secondary:hover:not(:disabled) {
          background: rgba(255,255,255,0.15);
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #cbd5e1;
          font-size: 14px;
          cursor: pointer;
        }

        .toggle input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #5EE6A4;
        }

        .metrics-panel {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 20px;
          height: fit-content;
        }

        .metrics-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px;
          color: #5EE6A4;
        }

        .metric-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .metric-label {
          font-size: 12px;
          color: #cbd5e1;
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 700;
          color: #5EE6A4;
        }

        .metric-info {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
          font-size: 12px;
          color: #cbd5e1;
        }

        .carechat-section {
          margin-top: 32px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .demo-container {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .video-container {
            max-width: 100%;
          }

          .control-group {
            flex-direction: column;
          }

          .control-btn {
            width: 100%;
          }

          .title {
            font-size: 24px;
          }

          .container {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}
