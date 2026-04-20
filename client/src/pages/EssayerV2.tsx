import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMediaPipeFaceDetection, FaceMetrics, MorphologyResult } from '@/hooks/useMediaPipeFaceDetection';
import { Button } from '@/components/ui/button';
import { AlertCircle, Camera, Loader2, Check, X } from 'lucide-react';

const GLASSES_DATA = [
  {
    id: 'rayban-clubmaster',
    name: 'Ray-Ban Clubmaster',
    brand: 'Ray-Ban',
    price: '€145',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="35" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="150" cy="50" r="35" fill="none" stroke="black" stroke-width="3"/>
      <line x1="85" y1="50" x2="115" y2="50" stroke="black" stroke-width="3"/>
      <path d="M 30 60 Q 50 75 70 60" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 130 60 Q 150 75 170 60" stroke="black" stroke-width="2" fill="none"/>
    </svg>`,
  },
  {
    id: 'persol-649',
    name: 'Persol PO0649',
    brand: 'Persol',
    price: '€195',
    image: 'https://images.unsplash.com/photo-1559368915-cd4628902d4a?w=400',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="32" ry="38" fill="none" stroke="black" stroke-width="3"/>
      <ellipse cx="150" cy="50" rx="32" ry="38" fill="none" stroke="black" stroke-width="3"/>
      <line x1="82" y1="50" x2="118" y2="50" stroke="black" stroke-width="3"/>
      <path d="M 30 70 Q 50 80 70 70" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 130 70 Q 150 80 170 70" stroke="black" stroke-width="2" fill="none"/>
    </svg>`,
  },
  {
    id: 'warby-parker',
    name: 'Warby Parker',
    brand: 'Warby Parker',
    price: '€95',
    image: 'https://images.unsplash.com/photo-1508296695146-367ee2ab8e0b?w=400',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="40" rx="5" fill="none" stroke="black" stroke-width="3"/>
      <rect x="120" y="30" width="60" height="40" rx="5" fill="none" stroke="black" stroke-width="3"/>
      <line x1="80" y1="50" x2="120" y2="50" stroke="black" stroke-width="3"/>
      <path d="M 30 70 Q 50 80 70 70" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 130 70 Q 150 80 170 70" stroke="black" stroke-width="2" fill="none"/>
    </svg>`,
  },
];

type Step = 'camera' | 'analysis' | 'glasses-detection' | 'try-on';

export default function EssayerV2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState<Step>('camera');
  const [morphology, setMorphology] = useState<MorphologyResult | null>(null);
  const [currentGlassIndex, setCurrentGlassIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasGlasses, setHasGlasses] = useState(false);
  const [confirmGlasses, setConfirmGlasses] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const { metrics, landmarks, isDetecting, error, detectMorphology } =
    useMediaPipeFaceDetection(videoRef as React.RefObject<HTMLVideoElement>);

  // Initialize camera with improved error handling
  useEffect(() => {
    const initCamera = async () => {
      try {
        setCameraError(null);
        
        // Try with ideal constraints first
        let stream: MediaStream | null = null;
        
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });
        } catch (constraintError) {
          console.warn('Ideal constraints failed, trying basic camera');
          // Fallback: try without specific constraints
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
          });
        }

        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((err) => {
              console.error('Failed to play video:', err);
              setCameraError('Impossible de lancer la vidéo');
            });
            setCameraActive(true);
          };
        }
      } catch (err: any) {
        console.error('Camera error:', err);
        
        // Provide user-friendly error messages
        if (err.name === 'NotAllowedError') {
          setCameraError('Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres du navigateur.');
        } else if (err.name === 'NotFoundError') {
          setCameraError('Aucune caméra trouvée sur cet appareil.');
        } else if (err.name === 'NotReadableError') {
          setCameraError('La caméra est déjà utilisée par une autre application.');
        } else {
          setCameraError('Erreur lors de l\'accès à la caméra: ' + err.message);
        }
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Draw face landmarks and guide circle
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !landmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw guide circle
    ctx.strokeStyle = '#0D6E4F';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 150, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw landmarks
    landmarks.forEach((lm: any, index: number) => {
      const x = lm.x * width;
      const y = lm.y * height;

      // Draw key landmarks
      if ([33, 263, 152, 10, 234, 454].includes(index)) {
        ctx.fillStyle = '#0D6E4F';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw face outline (connecting key points)
    const keyPoints = [10, 234, 152, 454].map((idx) => landmarks[idx]);
    if (keyPoints.length === 4) {
      ctx.strokeStyle = '#0D6E4F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(keyPoints[0].x * width, keyPoints[0].y * height);
      ctx.lineTo(keyPoints[1].x * width, keyPoints[1].y * height);
      ctx.lineTo(keyPoints[2].x * width, keyPoints[2].y * height);
      ctx.lineTo(keyPoints[3].x * width, keyPoints[3].y * height);
      ctx.closePath();
      ctx.stroke();
    }
  }, [landmarks]);

  const handleAnalyze = () => {
    if (!metrics) return;

    const result = detectMorphology(metrics);
    setMorphology(result);

    // Check if user has glasses
    if (metrics.hasGlasses && metrics.glassesConfidence > 0.6) {
      setHasGlasses(true);
      setStep('glasses-detection');
    } else {
      setStep('try-on');
    }
  };

  const handleConfirmGlasses = (hasGlassesAnswer: boolean) => {
    setHasGlasses(hasGlassesAnswer);
    setConfirmGlasses(true);
    setStep('try-on');
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setFavorites([...favorites, GLASSES_DATA[currentGlassIndex].id]);
    }

    // Move to next glasses
    if (currentGlassIndex < GLASSES_DATA.length - 1) {
      setCurrentGlassIndex(currentGlassIndex + 1);
    } else {
      setCurrentGlassIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0F1A17] pt-20">
      {/* Step 1: Camera & Analysis */}
      {step === 'camera' && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-4xl font-serif font-bold text-[#0D6E4F] dark:text-[#7FD8BE] mb-2">
                Essayage Virtuel
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Positionnez votre visage dans le cercle et cliquez sur "Analyser"
              </p>
            </div>

            {/* Camera Container */}
            <div className="relative bg-[#F0F0EE] dark:bg-[#1A2622] rounded-2xl overflow-hidden aspect-video">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Initialisation de la caméra...</p>
                  </div>
                </div>
              )}

              {/* Status Overlay */}
              {cameraActive && (
                <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  {isDetecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyse en cours...</span>
                    </>
                  ) : metrics ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Visage détecté</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>En attente...</span>
                    </>
                  )}
                </div>
              )}

              {/* Glasses Detection */}
              {metrics?.hasGlasses && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg">
                  👓 Lunettes détectées
                </div>
              )}
            </div>

            {/* Error Messages */}
            {cameraError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300">{cameraError}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Metrics Display */}
            {metrics && (
              <div className="bg-white dark:bg-[#1A2622] rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Ratio visage:</span> {metrics.aspectRatio.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Définition mâchoire:</span>{' '}
                  {(metrics.jawlineDefinition * 100).toFixed(0)}%
                </p>
                <p>
                  <span className="font-semibold">Pommettes:</span>{' '}
                  {(metrics.cheekboneProminence * 100).toFixed(0)}%
                </p>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!metrics || isDetecting || !cameraActive}
              className="w-full bg-[#0D6E4F] hover:bg-[#0a5540] text-white h-12 text-lg"
            >
              {isDetecting ? 'Analyse en cours...' : 'Analyser mon visage'}
            </Button>
          </motion.div>
        </div>
      )}

      {/* Step 2: Glasses Detection Confirmation */}
      {step === 'glasses-detection' && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#0D6E4F] dark:text-[#7FD8BE] mb-2">
                Lunettes détectées
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Nous avons détecté que vous portez des lunettes. Voulez-vous les enlever virtuellement
                pour essayer les nouvelles ?
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => handleConfirmGlasses(true)}
                className="flex-1 bg-[#0D6E4F] hover:bg-[#0a5540] text-white h-12"
              >
                Oui, enlever les lunettes
              </Button>
              <Button
                onClick={() => handleConfirmGlasses(false)}
                variant="outline"
                className="flex-1 h-12"
              >
                Non, garder les lunettes
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Step 3: Try-On */}
      {step === 'try-on' && morphology && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Morphology Result */}
            <div className="bg-gradient-to-r from-[#0D6E4F]/10 to-[#7FD8BE]/10 dark:from-[#0D6E4F]/20 dark:to-[#7FD8BE]/20 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Votre morphologie faciale</p>
              <h2 className="text-3xl font-serif font-bold text-[#0D6E4F] dark:text-[#7FD8BE] capitalize">
                {morphology.type}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{morphology.explanation}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Confiance: {(morphology.confidence * 100).toFixed(0)}%
              </p>
            </div>

            {/* Glasses Try-On */}
            <div className="bg-white dark:bg-[#1A2622] rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-serif font-bold">Essayage virtuel</h3>

              {/* Camera with Glasses Overlay */}
              <div className="relative bg-[#F0F0EE] dark:bg-[#0F1A17] rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                {/* Glasses Overlay SVG */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-32 h-16"
                    dangerouslySetInnerHTML={{
                      __html: GLASSES_DATA[currentGlassIndex].svg,
                    }}
                  />
                </div>
              </div>

              {/* Glasses Info */}
              <div className="space-y-2">
                <h4 className="font-semibold">{GLASSES_DATA[currentGlassIndex].name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {GLASSES_DATA[currentGlassIndex].brand}
                </p>
                <p className="text-lg font-bold text-[#0D6E4F] dark:text-[#7FD8BE]">
                  {GLASSES_DATA[currentGlassIndex].price}
                </p>
              </div>

              {/* Swipe Controls */}
              <div className="flex gap-4">
                <Button
                  onClick={() => handleSwipe('left')}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  <X className="w-4 h-4 mr-2" />
                  J'aime pas
                </Button>
                <Button
                  onClick={() => handleSwipe('right')}
                  className="flex-1 bg-[#0D6E4F] hover:bg-[#0a5540] text-white h-12"
                >
                  <Check className="w-4 h-4 mr-2" />
                  J'aime
                </Button>
              </div>

              {/* Progress */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {currentGlassIndex + 1} / {GLASSES_DATA.length}
              </p>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  ✓ {favorites.length} lunette(s) ajoutée(s) aux favoris
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
