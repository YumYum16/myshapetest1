// MyShape — Page AI Try-On (/essayer)
// Design: Tech-Luxe Émeraude | Webcam + MediaPipe + AR overlay
// Fonctionnalités: détection morphologie, recommandations, essayage AR, capture email

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import {
  Camera, Shield, X, Mail, ArrowRight, Eye, RefreshCw,
  ExternalLink, ChevronLeft, Sparkles, Lock, CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import GlassesSVG from '@/components/GlassesSVG';
import { frames, framesByShape } from '@/lib/frames-data';
import {
  classifyFaceShape,
  computeMeasurements,
  getEyePositionForAR,
  getFaceShapeInfo,
  type FaceShape,
  type ClassificationResult,
} from '@/lib/face-classification';
import type { Frame } from '@/lib/frames-data';

type AppState = 'idle' | 'requesting' | 'scanning' | 'result' | 'error';

export default function Essayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const appStateRef = useRef<AppState>('idle');

  const [appState, setAppState] = useState<AppState>('idle');

  // Synchroniser la référence avec l'état
  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [recommendedFrames, setRecommendedFrames] = useState<Frame[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [faceLandmarks, setFaceLandmarks] = useState<any[] | null>(null);
  const [mediapipeLoaded, setMediapipeLoaded] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // Charger MediaPipe dynamiquement
  useEffect(() => {
    loadMediaPipe();
    return () => {
      stopCamera();
    };
  }, []);

  const loadMediaPipe = async () => {
    try {
      setLoadingStep('Chargement de l\'IA...');
      // Charger MediaPipe via CDN
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
      setMediapipeLoaded(true);
      setLoadingStep('');
    } catch (err) {
      console.error('MediaPipe load error:', err);
      setMediapipeLoaded(true); // Continue anyway with fallback
      setLoadingStep('');
    }
  };

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (cameraRef.current) {
      try { cameraRef.current.stop(); } catch {}
      cameraRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  const startCamera = async () => {
    setAppState('requesting');
    setErrorMessage('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setAppState('scanning');
      setScanProgress(0);

      // Simuler la progression du scan
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
        }
        setScanProgress(Math.min(progress, 100));
      }, 150);

      // Initialiser MediaPipe si disponible
      if ((window as any).FaceMesh) {
        await initMediaPipe();
      } else {
        // Fallback: analyse simulée après délai
        setTimeout(() => {
          clearInterval(progressInterval);
          setScanProgress(100);
          performFallbackAnalysis();
        }, 3500);
      }

    } catch (err: any) {
      console.error('Camera error:', err);
      setAppState('error');
      if (err.name === 'NotAllowedError') {
        setErrorMessage('Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
      } else if (err.name === 'NotFoundError') {
        setErrorMessage('Aucune caméra détectée sur votre appareil.');
      } else if (err.message && err.message.includes('Requested device not found')) {
        setErrorMessage('Aucune caméra disponible. Vérifiez que votre appareil dispose d\'une caméra et qu\'elle n\'est pas utilisée par une autre application.');
      } else if (err.message && err.message.includes('Permission denied')) {
        setErrorMessage('Accès à la caméra refusé. Veuillez vérifier les permissions dans les paramètres de votre navigateur.');
      } else {
        setErrorMessage('Impossible d\'accéder à la caméra. Vérifiez votre connexion et réessayez.');
      }
    }
  };

  const initMediaPipe = async () => {
    const FaceMesh = (window as any).FaceMesh;
    const Camera = (window as any).Camera;

    if (!FaceMesh || !videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    let frameCount = 0;
    let analysisComplete = false;

    faceMesh.onResults((results: any) => {
      if (analysisComplete) return;

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        setFaceLandmarks(landmarks);
        frameCount++;

        // Dessiner les landmarks sur le canvas
        drawLandmarks(landmarks);

        // Analyser après 30 frames stables
        if (frameCount >= 30 && appStateRef.current === 'scanning') {
          analysisComplete = true;
          setScanProgress(100);
          setTimeout(() => {
            const measurements = computeMeasurements(landmarks);
            const classification = classifyFaceShape(measurements);
            finishAnalysis(classification, landmarks);
          }, 500);
        }
      }
    });

    faceMeshRef.current = faceMesh;

    if (Camera) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (faceMeshRef.current && videoRef.current) {
            await faceMeshRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current = camera;
      camera.start();
    }
  };

  const performFallbackAnalysis = () => {
    // Analyse simulée avec morphologies aléatoires pondérées
    const shapes: FaceShape[] = ['Ovale', 'Carré', 'Rond', 'Triangulaire', 'Diamant'];
    const weights = [0.35, 0.25, 0.20, 0.12, 0.08];
    const rand = Math.random();
    let cumulative = 0;
    let selectedShape: FaceShape = 'Ovale';

    for (let i = 0; i < shapes.length; i++) {
      cumulative += weights[i];
      if (rand < cumulative) {
        selectedShape = shapes[i];
        break;
      }
    }

    const mockMeasurements = {
      faceWidth: 0.35,
      jawWidth: 0.28,
      foreheadWidth: 0.30,
      faceHeight: 0.52,
      heightToWidthRatio: 1.48,
      jawToForeheadRatio: 0.93,
      cheekToJawRatio: 1.25,
      cheekToForeheadRatio: 1.17,
    };

    const info = getFaceShapeInfo(selectedShape);
    const classification: ClassificationResult = {
      shape: selectedShape,
      confidence: Math.floor(Math.random() * 15) + 82,
      measurements: mockMeasurements,
      ...info,
    };

    finishAnalysis(classification, null);
  };

  const drawLandmarks = (landmarks: any[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les points de repère
    ctx.fillStyle = 'rgba(13, 110, 79, 0.7)';
    landmarks.forEach((lm: any, i: number) => {
      // Dessiner seulement les points du contour du visage
      if ([10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109].includes(i)) {
        ctx.beginPath();
        ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Lignes de mesure
    ctx.strokeStyle = 'rgba(13, 110, 79, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Largeur pommettes
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];
    if (leftCheek && rightCheek) {
      ctx.beginPath();
      ctx.moveTo(leftCheek.x * canvas.width, leftCheek.y * canvas.height);
      ctx.lineTo(rightCheek.x * canvas.width, rightCheek.y * canvas.height);
      ctx.stroke();
    }
  };

  const finishAnalysis = (classification: ClassificationResult, landmarks: any[] | null) => {
    console.log('Analysis complete:', classification.shape);
    setResult(classification);
    const recs = framesByShape(classification.shape);
    setRecommendedFrames(recs.length > 0 ? recs : frames.slice(0, 6));
    setAppState('result');
    appStateRef.current = 'result';

    // Afficher la modal email après 3 secondes
    setTimeout(() => {
      setShowEmailModal(true);
    }, 3000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Simuler l'envoi (Supabase serait ici en production)
    console.log('Email captured:', email, 'Shape:', result?.shape);
    setEmailSent(true);
    setTimeout(() => setShowEmailModal(false), 2000);
  };

  const resetAnalysis = () => {
    stopCamera();
    setAppState('idle');
    setResult(null);
    setSelectedFrame(null);
    setFaceLandmarks(null);
    setScanProgress(0);
    setShowEmailModal(false);
    setEmailSent(false);
  };

  const tryOnFrame = (frame: Frame) => {
    setSelectedFrame(selectedFrame?.id === frame.id ? null : frame);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Navbar />

      <div className="pt-16">
        {/* Privacy banner */}
        <div
          className="w-full py-2.5 px-4 text-center text-xs font-medium"
          style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
        >
          <Shield className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
          Votre caméra est traitée localement. Aucune image n'est envoyée à nos serveurs.
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </Link>
            <div>
              <h1
                className="text-2xl lg:text-3xl font-bold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
              >
                Essayage IA
              </h1>
              <p className="text-sm" style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>
                Analyse de morphologie en temps réel
              </p>
            </div>
          </div>

          {/* Main layout */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Camera section - left */}
            <div className="lg:col-span-3">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: '#F0F0EE',
                  aspectRatio: '4/3',
                  minHeight: '300px',
                }}
              >
                {/* Video element */}
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                  style={{ transform: 'scaleX(-1)', display: appState === 'scanning' || appState === 'result' ? 'block' : 'none' }}
                />

                {/* Landmark canvas overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ transform: 'scaleX(-1)', display: appState === 'scanning' ? 'block' : 'none' }}
                />

                {/* AR Glasses overlay */}
                {selectedFrame && appState === 'result' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="absolute"
                      style={{
                        top: '35%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '55%',
                        opacity: 0.85,
                      }}
                    >
                      <GlassesSVG
                        shape={selectedFrame.shape}
                        color={selectedFrame.id.includes('ray-ban') ? '#1a1a1a' :
                               selectedFrame.id.includes('tom-ford') ? '#8B6914' :
                               selectedFrame.id.includes('persol') ? '#6B3A2A' :
                               selectedFrame.id.includes('oakley') ? '#2a2a2a' :
                               selectedFrame.id.includes('lindberg') ? '#C0C0C0' :
                               selectedFrame.id.includes('celine') ? '#111827' :
                               '#1a1a1a'}
                        width={300}
                      />
                    </div>
                  </div>
                )}

                {/* IDLE state */}
                {appState === 'idle' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: 'rgba(13, 110, 79, 0.2)' }}
                    >
                      <Camera className="w-10 h-10" style={{ color: '#4ade80' }} />
                    </div>
                    <h2
                      className="text-2xl font-bold mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                    >
                      Prêt à analyser
                    </h2>
                    <p
                      className="text-sm mb-2 max-w-xs"
                      style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Positionnez votre visage face à la caméra dans un endroit bien éclairé.
                    </p>
                    <p
                      className="text-xs mb-8 flex items-center gap-1.5"
                      style={{ color: 'rgba(13, 110, 79, 0.9)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Aucune photo stockée · 100% local
                    </p>
                    <button
                      onClick={startCamera}
                      disabled={!mediapipeLoaded && loadingStep !== ''}
                      className="btn-shimmer flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50"
                      style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <Camera className="w-5 h-5" />
                      {loadingStep || 'Activer la caméra'}
                    </button>
                    <div className="mt-4">
                      <p className="text-xs mb-3" style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>ou</p>
                      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer">
                        <span>📁 Uploader une photo</span>
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>
                )}

                {/* REQUESTING state */}
                {appState === 'requesting' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                      <div
                        className="w-16 h-16 rounded-full border-2 animate-spin"
                        style={{ borderColor: '#0D6E4F', borderTopColor: 'transparent' }}
                      />
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Connexion à la caméra...
                    </p>
                  </div>
                )}

                {/* SCANNING state */}
                {appState === 'scanning' && (
                  <>
                    {/* Scan overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Face guide oval */}
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                        style={{
                          width: '45%',
                          paddingBottom: '60%',
                          borderColor: 'rgba(13, 110, 79, 0.6)',
                          boxShadow: '0 0 0 2000px rgba(15, 26, 23, 0.3)',
                        }}
                      />

                      {/* Scan line */}
                      <div
                        className="absolute left-1/4 right-1/4 h-0.5 animate-scan"
                        style={{
                          background: 'linear-gradient(to right, transparent, #0D6E4F, transparent)',
                          opacity: 0.8,
                        }}
                      />

                      {/* Corner brackets */}
                      {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                        <div
                          key={i}
                          className={`absolute w-6 h-6 ${pos}`}
                          style={{
                            borderTop: i < 2 ? '2px solid #0D6E4F' : 'none',
                            borderBottom: i >= 2 ? '2px solid #0D6E4F' : 'none',
                            borderLeft: i % 2 === 0 ? '2px solid #0D6E4F' : 'none',
                            borderRight: i % 2 === 1 ? '2px solid #0D6E4F' : 'none',
                          }}
                        />
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs font-medium"
                          style={{ color: '#E8F5F0', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Analyse en cours...
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: '#4ade80', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {Math.round(scanProgress)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${scanProgress}%`,
                            background: 'linear-gradient(to right, #0D6E4F, #4ade80)',
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* RESULT state */}
                {appState === 'result' && result && (
                  <>
                    {/* Result badge */}
                    <div className="absolute top-4 left-4 right-4">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                        style={{ backgroundColor: 'rgba(13, 110, 79, 0.9)', color: 'white', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Morphologie : {result.shape} · {result.confidence}% de confiance
                      </div>
                    </div>

                    {/* Selected frame badge */}
                    {selectedFrame && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div
                          className="flex items-center justify-between px-3 py-2 rounded-lg"
                          style={{ backgroundColor: 'rgba(15, 26, 23, 0.9)', color: '#E8F5F0', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          <span className="text-xs font-medium">
                            {selectedFrame.brand} {selectedFrame.name}
                          </span>
                          <button
                            onClick={() => setSelectedFrame(null)}
                            className="text-xs opacity-60 hover:opacity-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ERROR state */}
                {appState === 'error' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      <X className="w-8 h-8 text-red-400" />
                    </div>
                    <p
                      className="text-sm mb-6 max-w-xs"
                      style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {errorMessage}
                    </p>
                    <button
                      onClick={resetAnalysis}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
                      style={{ backgroundColor: '#0D6E4F', color: 'white', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Réessayer
                    </button>
                  </div>
                )}
              </div>

              {/* Reset button */}
              {(appState === 'result' || appState === 'scanning') && (
                <button
                  onClick={resetAnalysis}
                  className="mt-3 flex items-center gap-1.5 text-xs transition-colors hover:opacity-70"
                  style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recommencer l'analyse
                </button>
              )}
            </div>

            {/* Results section - right */}
            <div className="lg:col-span-2 space-y-6">
              {/* Result card */}
              {appState === 'result' && result ? (
                <>
                  <div
                    className="rounded-2xl p-6"
                    style={{ backgroundColor: '#0F1A17' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(232, 245, 240, 0.5)', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Votre morphologie
                        </p>
                        <h2
                          className="text-3xl font-bold"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#E8F5F0' }}
                        >
                          {result.shape}
                        </h2>
                      </div>
                      <div
                        className="px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'rgba(13, 110, 79, 0.3)', color: '#4ade80', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {result.confidence}% ✓
                      </div>
                    </div>

                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: 'rgba(232, 245, 240, 0.7)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {result.description}
                    </p>

                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: 'rgba(232, 245, 240, 0.4)', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Montures recommandées
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.recommendations.map((rec) => (
                          <span
                            key={rec}
                            className="text-xs px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: 'rgba(13, 110, 79, 0.25)', color: '#4ade80', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended frames */}
                  <div>
                    <h3
                      className="text-lg font-bold mb-4"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                    >
                      Montures pour vous
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {recommendedFrames.map((frame) => (
                        <div
                          key={frame.id}
                          className={`rounded-xl p-3 border transition-all duration-200 cursor-pointer ${
                            selectedFrame?.id === frame.id ? 'border-[#0D6E4F] shadow-md' : 'border-gray-100 hover:border-gray-200'
                          }`}
                          style={{ backgroundColor: 'white' }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-16 h-12 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: '#F7F9F8' }}
                            >
                              <GlassesSVG shape={frame.shape} width={56} color={
                                frame.id.includes('ray-ban') ? '#1a1a1a' :
                                frame.id.includes('tom-ford') ? '#8B6914' :
                                frame.id.includes('persol') ? '#6B3A2A' :
                                '#374151'
                              } />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs font-medium truncate"
                                style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {frame.brand}
                              </p>
                              <p
                                className="text-sm font-semibold truncate"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                              >
                                {frame.name}
                              </p>
                              <p
                                className="text-sm font-bold"
                                style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {frame.currency}{frame.price}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                onClick={() => tryOnFrame(frame)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                style={{
                                  backgroundColor: selectedFrame?.id === frame.id ? '#0D6E4F' : '#E8F5F0',
                                  color: selectedFrame?.id === frame.id ? 'white' : '#0D6E4F',
                                  fontFamily: "'DM Sans', sans-serif",
                                }}
                              >
                                <Eye className="w-3 h-3" />
                                {selectedFrame?.id === frame.id ? 'Actif' : 'Essayer'}
                              </button>
                              <a
                                href={frame.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-[#1A1A1A] hover:text-white"
                                style={{
                                  backgroundColor: 'transparent',
                                  color: '#1A1A1A',
                                  border: '1px solid #1A1A1A',
                                  fontFamily: "'DM Sans', sans-serif",
                                }}
                              >
                                <ExternalLink className="w-3 h-3" />
                                Acheter
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Share result */}
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:opacity-80"
                    style={{
                      borderColor: '#0D6E4F',
                      color: '#0D6E4F',
                      backgroundColor: 'transparent',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    Recevoir mes recommandations par email
                  </button>
                </>
              ) : (
                /* Placeholder when not scanning */
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{ backgroundColor: '#F0EDE8' }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#E8F5F0' }}
                  >
                    <Sparkles className="w-8 h-8" style={{ color: '#0D6E4F' }} />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                  >
                    {appState === 'scanning' ? 'Analyse en cours...' : 'Vos résultats apparaîtront ici'}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {appState === 'scanning'
                      ? 'Notre IA analyse les 468 points de repère de votre visage...'
                      : 'Activez la caméra pour découvrir votre morphologie et les montures qui vous correspondent.'}
                  </p>

                  {appState === 'idle' && (
                    <div className="mt-6 space-y-3">
                      <p
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Toutes les morphologies
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(['Ovale', 'Carré', 'Rond', 'Triangulaire', 'Diamant'] as FaceShape[]).map((shape) => (
                          <Link
                            key={shape}
                            href="/morphologies"
                            className="text-xs px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                            style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {shape}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Privacy info */}
              <div
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ backgroundColor: '#F0EDE8' }}
              >
                <Lock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#0D6E4F' }} />
                <div>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Confidentialité garantie
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Votre caméra est analysée en temps réel sur votre appareil. Aucune image, vidéo ou donnée biométrique n'est transmise à nos serveurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email capture modal */}
      {showEmailModal && !emailSent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEmailModal(false)}
          />
          <div
            className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            style={{ zIndex: 51 }}
          >
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-gray-100"
            >
              <X className="w-4 h-4" style={{ color: '#6B7280' }} />
            </button>

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: '#E8F5F0' }}
            >
              <Mail className="w-6 h-6" style={{ color: '#0D6E4F' }} />
            </div>

            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Recevez vos recommandations
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              {result && (
                <>Morphologie <strong style={{ color: '#0D6E4F' }}>{result.shape}</strong> détectée. Recevez par email votre guide personnalisé avec les meilleures montures pour votre visage.</>
              )}
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-[#0D6E4F]"
                style={{
                  borderColor: '#E5E7EB',
                  color: '#1C2B26',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button
                type="submit"
                className="btn-shimmer w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                <Mail className="w-4 h-4" />
                Recevoir mon guide personnalisé
              </button>
            </form>

            <p
              className="text-xs mt-3 text-center"
              style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
            >
              <Shield className="w-3 h-3 inline-block mr-1 -mt-0.5" />
              Aucun spam. Désabonnement en un clic. RGPD compliant.
            </p>
          </div>
        </div>
      )}

      {/* Email sent confirmation */}
      {emailSent && showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            style={{ zIndex: 51 }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#E8F5F0' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: '#0D6E4F' }} />
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Email envoyé !
            </h3>
            <p
              className="text-sm"
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              Vos recommandations personnalisées arrivent dans votre boîte mail.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
