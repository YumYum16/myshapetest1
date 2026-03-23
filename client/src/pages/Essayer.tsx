// Design: Tech-Luxe Émeraude | Vision LLM + Swipe Interface
// Fonctionnalités: analyse LLM, interface swipe TikTok, favoris, essayage AR

import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Camera, Upload, Heart, RefreshCw, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SwipeCard from '@/components/SwipeCard';
import GlassesSVG from '@/components/GlassesSVG';
import { frames, framesByShape } from '@/lib/frames-data';
import {
  analyzeFaceWithLLM,
  getFullClassification,
  type FaceShape,
  type ClassificationResult,
} from '@/lib/llm-face-analysis';
import type { Frame } from '@/lib/frames-data';

type AppState = 'idle' | 'uploading' | 'analyzing' | 'swiping' | 'results' | 'error';

export default function Essayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [appState, setAppState] = useState<AppState>('idle');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [likedFrames, setLikedFrames] = useState<Set<string>>(new Set());
  const [remainingFrames, setRemainingFrames] = useState<Frame[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Load liked frames from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('myshape_liked_frames');
    if (saved) {
      setLikedFrames(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save liked frames to localStorage
  useEffect(() => {
    localStorage.setItem('myshape_liked_frames', JSON.stringify(Array.from(likedFrames)));
  }, [likedFrames]);

  const startCamera = async () => {
    try {
      setShowCamera(true);
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
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setErrorMessage('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setAppState('error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    try {
      setAppState('uploading');
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0);
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9);
      });

      await analyzePhoto(blob);
    } catch (err) {
      console.error('Capture error:', err);
      setErrorMessage('Erreur lors de la capture. Veuillez réessayer.');
      setAppState('error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAppState('uploading');
      await analyzePhoto(file);
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMessage('Erreur lors du traitement de la photo. Veuillez réessayer.');
      setAppState('error');
    }
  };

  const analyzePhoto = async (blob: Blob) => {
    try {
      setAppState('analyzing');

      // Create a blob URL for local analysis (no backend upload needed)
      const url = URL.createObjectURL(blob);

      // Analyze with LLM
      const analysis = await analyzeFaceWithLLM(url);
      const fullResult = getFullClassification(analysis);

      setResult(fullResult);

      // Get recommended frames
      const recommended = framesByShape(fullResult.shape);
      const sorted = [
        ...recommended.filter((f) => f.compatibleShapes.includes(fullResult.shape)),
        ...frames.filter(
          (f) =>
            !recommended.includes(f) &&
            !f.compatibleShapes.includes(fullResult.shape)
        ),
      ];

      setRemainingFrames(sorted);
      setCurrentCardIndex(0);
      setAppState('swiping');
      stopCamera();
      
      // Clean up blob URL
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage('Erreur lors de l\'analyse. Veuillez réessayer.');
      setAppState('error');
    }
  };

  const handleLike = () => {
    const frame = remainingFrames[currentCardIndex];
    setLikedFrames((prev) => new Set(Array.from(prev).concat([frame.id])));
    handleSkip();
  };

  const handleSkip = () => {
    if (currentCardIndex < remainingFrames.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setAppState('results');
    }
  };

  const handleBuy = (frame: Frame) => {
    window.open(frame.affiliateUrl, '_blank');
  };

  const handleTryOn = (frame: Frame) => {
    // TODO: Implement AR try-on
    console.log('Try on:', frame.name);
  };

  const resetAnalysis = () => {
    setAppState('idle');
    setResult(null);
    setCurrentCardIndex(0);
    setRemainingFrames([]);
    setErrorMessage('');
  };

  const currentFrame = remainingFrames[currentCardIndex];
  const likedFramesList = remainingFrames.filter((f) => likedFrames.has(f.id));
  const likedFramesArray = Array.from(likedFrames);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Navbar />

      <div className="pt-20 pb-16">
        {/* Privacy banner */}
        <div
          className="w-full py-2.5 px-4 text-center text-xs font-medium"
          style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
        >
          🔒 Votre photo est analysée par IA et immédiatement supprimée. Aucune donnée conservée.
        </div>

        <div className="container mx-auto px-4">
          {/* IDLE STATE */}
          {appState === 'idle' && (
            <div className="max-w-2xl mx-auto py-16">
              <div className="text-center mb-12">
                <h1
                  className="text-5xl md:text-6xl font-light mb-4"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: '#1C2B26',
                    letterSpacing: '-0.03em',
                    lineHeight: '1.0',
                  }}
                >
                  Essayage IA
                </h1>
                <p
                  className="text-lg font-light"
                  style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", maxWidth: '560px', margin: '0 auto' }}
                >
                  Analyse de morphologie faciale en temps réel
                </p>
              </div>

              <div
                className="rounded-3xl p-12 mb-8"
                style={{ backgroundColor: '#F0F0EE' }}
              >
                <div className="space-y-6">
                  {/* Camera button */}
                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all"
                    style={{
                      backgroundColor: '#0D6E4F',
                      color: 'white',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <Camera className="w-5 h-5" />
                    <span className="font-medium">Activer la caméra</span>
                  </button>

                  {/* File upload */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all border-2"
                      style={{
                        borderColor: '#1A1A1A',
                        color: '#1A1A1A',
                        backgroundColor: 'transparent',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <Upload className="w-5 h-5" />
                      <span className="font-medium">📁 Uploader une photo</span>
                    </button>
                  </div>
                </div>
              </div>

              <p
                className="text-center text-xs"
                style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
              >
                Aucune photo stockée · 100% local · Analyse instantanée
              </p>
            </div>
          )}

          {/* CAMERA STATE */}
          {showCamera && cameraActive && (
            <div className="max-w-md mx-auto py-12">
              <div className="relative rounded-2xl overflow-hidden mb-6" style={{ backgroundColor: '#F0F0EE' }}>
                <video
                  ref={videoRef}
                  className="w-full aspect-video object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="flex-1 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: '#0D6E4F',
                    color: 'white',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Capturer
                </button>
                <button
                  onClick={() => {
                    stopCamera();
                    setAppState('idle');
                  }}
                  className="flex-1 py-3 rounded-xl transition-all border-2"
                  style={{
                    borderColor: '#1A1A1A',
                    color: '#1A1A1A',
                    backgroundColor: 'transparent',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* UPLOADING STATE */}
          {appState === 'uploading' && (
            <div className="max-w-md mx-auto py-16 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#E8F5F0' }}>
                <div className="w-6 h-6 border-2 border-transparent border-t-[#0D6E4F] rounded-full animate-spin" />
              </div>
              <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>
                Téléchargement en cours...
              </p>
            </div>
          )}

          {/* ANALYZING STATE */}
          {appState === 'analyzing' && (
            <div className="max-w-md mx-auto py-16 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#E8F5F0' }}>
                <div className="w-6 h-6 border-2 border-transparent border-t-[#0D6E4F] rounded-full animate-spin" />
              </div>
              <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>
                Analyse en cours...
              </p>
            </div>
          )}

          {/* SWIPING STATE */}
          {appState === 'swiping' && currentFrame && result && (
            <div className="max-w-2xl mx-auto py-12">
              {/* Result badge */}
              <div className="text-center mb-12">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
                  style={{ backgroundColor: 'rgba(13, 110, 79, 0.1)', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                >
                  ✓ Morphologie : {result.shape} ({result.confidence}%)
                </div>
                <p
                  className="text-sm"
                  style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {result.analysis_details}
                </p>
              </div>

              {/* Swipe card */}
              <SwipeCard
                frame={currentFrame}
                index={currentCardIndex}
                total={remainingFrames.length}
                faceShape={result.shape}
                onLike={handleLike}
                onSkip={handleSkip}
                onBuy={handleBuy}
                onTryOn={handleTryOn}
                isLiked={likedFrames.has(currentFrame.id)}
              />
            </div>
          )}

          {/* RESULTS STATE */}
          {appState === 'results' && result && (
            <div className="max-w-2xl mx-auto py-12">
              <div className="text-center mb-12">
                <h2
                  className="text-4xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                >
                  Vos coups de cœur
                </h2>
                <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>
                  {likedFramesList.length} monture{likedFramesList.length !== 1 ? 's' : ''} sauvegardée{likedFramesList.length !== 1 ? 's' : ''}
                </p>
              </div>

              {likedFramesList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {likedFramesList.map((frame) => (
                    <div
                      key={frame.id}
                      className="rounded-2xl p-6"
                      style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p style={{ color: '#9CA3AF', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
                            {frame.brand}
                          </p>
                          <h3
                            className="text-lg font-bold"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                          >
                            {frame.name}
                          </h3>
                        </div>
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      </div>

                      <p
                        className="text-lg font-bold mb-4"
                        style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {frame.price} {frame.currency}
                      </p>

                      <button
                        onClick={() => handleBuy(frame)}
                        className="w-full py-2 rounded-lg transition-all"
                        style={{
                          backgroundColor: '#0D6E4F',
                          color: 'white',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Acheter →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl p-12 text-center mb-12"
                  style={{ backgroundColor: '#F0F0EE' }}
                >
                  <p style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
                    Aucun coup de cœur pour l'instant.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/lunettes">
                  <button
                    className="w-full py-3 rounded-lg transition-all"
                    style={{
                      backgroundColor: '#0D6E4F',
                      color: 'white',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Voir toutes les montures
                  </button>
                </Link>

                <button
                  onClick={resetAnalysis}
                  className="w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: 'white',
                    color: '#1A1A1A',
                    border: '1px solid #1A1A1A',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Réanalyser mon visage
                </button>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {appState === 'error' && (
            <div className="max-w-md mx-auto py-12">
              <div
                className="rounded-2xl p-6 mb-6"
                style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}
              >
                <p
                  className="text-sm"
                  style={{ color: '#991B1B', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {errorMessage}
                </p>
              </div>

              <button
                onClick={resetAnalysis}
                className="w-full py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: '#0D6E4F',
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
