import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface FaceMetrics {
  faceWidth: number;
  faceHeight: number;
  jawWidth: number;
  cheekboneWidth: number;
  foreheadWidth: number;
  aspectRatio: number; // width/height
  jawlineDefinition: number; // 0-1
  cheekboneProminence: number; // 0-1
  faceLength: number;
  hasGlasses: boolean;
  glassesConfidence: number;
}

export interface FaceDetectionResult {
  metrics: FaceMetrics | null;
  landmarks: Array<{ x: number; y: number; z: number }> | null;
  isDetecting: boolean;
  error: string | null;
}

export interface MorphologyResult {
  type: 'oval' | 'round' | 'square' | 'heart' | 'oblong';
  confidence: number;
  explanation: string;
}

let faceLandmarker: FaceLandmarker | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

const initializeFaceLandmarker = async () => {
  if (faceLandmarker) return;
  if (isInitializing) return initPromise;

  isInitializing = true;
  initPromise = (async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm'
      );
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/image_segmenter/face_landmarker_v2_with_blendshapes/float16/1/face_landmarker_v2_with_blendshapes.task',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      });
    } catch (error) {
      console.error('Failed to initialize FaceLandmarker:', error);
      throw error;
    }
  })();

  await initPromise;
  isInitializing = false;
};

export const useMediaPipeFaceDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [result, setResult] = useState<FaceDetectionResult>({
    metrics: null,
    landmarks: null,
    isDetecting: false,
    error: null,
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);

  const calculateFaceMetrics = useCallback((landmarks: any[]): FaceMetrics => {
    // Key landmark indices for face measurements
    const jawLeft = landmarks[234]; // Left jaw
    const jawRight = landmarks[454]; // Right jaw
    const cheekLeft = landmarks[234]; // Left cheek
    const cheekRight = landmarks[454]; // Right cheek
    const foreheadTop = landmarks[10]; // Top of head
    const chin = landmarks[152]; // Chin
    const noseLeft = landmarks[129]; // Left side of nose
    const noseRight = landmarks[358]; // Right side of nose
    const eyeLeft = landmarks[33]; // Left eye outer
    const eyeRight = landmarks[263]; // Right eye outer

    // Calculate distances
    const faceWidth = Math.hypot(
      jawRight.x - jawLeft.x,
      jawRight.y - jawLeft.y
    );
    const faceHeight = Math.hypot(
      chin.y - foreheadTop.y,
      chin.x - foreheadTop.x
    );
    const jawWidth = Math.hypot(
      jawRight.x - jawLeft.x,
      jawRight.y - jawLeft.y
    );
    const cheekboneWidth = Math.hypot(
      cheekRight.x - cheekLeft.x,
      cheekRight.y - cheekLeft.y
    );
    const foreheadWidth = Math.hypot(
      noseRight.x - noseLeft.x,
      noseRight.y - noseLeft.y
    );
    const faceLength = Math.hypot(
      chin.y - foreheadTop.y,
      chin.x - foreheadTop.x
    );

    // Calculate jawline definition (distance from jaw to chin)
    const jawlineDefinition = Math.min(
      1,
      Math.abs(chin.y - (jawLeft.y + jawRight.y) / 2) / faceHeight
    );

    // Calculate cheekbone prominence
    const cheekboneProminence = Math.min(1, cheekboneWidth / faceWidth);

    // Detect glasses (landmarks around eyes and nose bridge)
    const noseTop = landmarks[168];
    const noseBottom = landmarks[1];
    const eyeLeftInner = landmarks[133];
    const eyeRightInner = landmarks[362];

    // Check for dark areas around eyes (potential glasses)
    const glassesConfidence = detectGlasses(landmarks);
    const hasGlasses = glassesConfidence > 0.6;

    return {
      faceWidth,
      faceHeight,
      jawWidth,
      cheekboneWidth,
      foreheadWidth,
      aspectRatio: faceWidth / faceHeight,
      jawlineDefinition,
      cheekboneProminence,
      faceLength,
      hasGlasses,
      glassesConfidence,
    };
  }, []);

  const detectGlasses = (landmarks: any[]): number => {
    // Landmarks around eyes and nose bridge
    const eyeLeftOuter = landmarks[33];
    const eyeLeftInner = landmarks[133];
    const eyeRightOuter = landmarks[362];
    const eyeRightInner = landmarks[263];
    const noseBridge = landmarks[168];

    // Check if there are landmarks indicating glasses frames
    // This is a heuristic - in production, you'd use ML
    const bridgeToLeftEye = Math.hypot(
      eyeLeftInner.x - noseBridge.x,
      eyeLeftInner.y - noseBridge.y
    );
    const bridgeToRightEye = Math.hypot(
      eyeRightInner.x - noseBridge.x,
      eyeRightInner.y - noseBridge.y
    );

    // If bridge is too far from eyes, likely glasses
    const avgDistance = (bridgeToLeftEye + bridgeToRightEye) / 2;
    const confidence = Math.min(1, Math.max(0, (avgDistance - 20) / 30));

    return confidence;
  };

  const detectMorphology = useCallback((metrics: FaceMetrics): MorphologyResult => {
    const { aspectRatio, jawlineDefinition, cheekboneProminence, faceHeight } = metrics;

    // Oval: aspect ratio ~0.7-0.8, balanced features
    if (aspectRatio > 0.65 && aspectRatio < 0.85 && jawlineDefinition < 0.3) {
      return {
        type: 'oval',
        confidence: Math.min(0.95, 0.7 + cheekboneProminence * 0.2),
        explanation: 'Visage ovale : équilibré et harmonieux',
      };
    }

    // Round: aspect ratio ~0.8-0.95, soft jawline
    if (aspectRatio > 0.75 && aspectRatio < 1.0 && jawlineDefinition < 0.25) {
      return {
        type: 'round',
        confidence: Math.min(0.95, 0.75 + (1 - cheekboneProminence) * 0.15),
        explanation: 'Visage rond : traits doux et arrondis',
      };
    }

    // Square: aspect ratio ~0.9-1.1, strong jawline
    if (aspectRatio > 0.85 && aspectRatio < 1.15 && jawlineDefinition > 0.35) {
      return {
        type: 'square',
        confidence: Math.min(0.95, 0.75 + jawlineDefinition * 0.15),
        explanation: 'Visage carré : mâchoire marquée et anguleuse',
      };
    }

    // Heart: aspect ratio ~0.7-0.85, prominent cheekbones, narrow chin
    if (aspectRatio > 0.65 && aspectRatio < 0.9 && cheekboneProminence > 0.55) {
      return {
        type: 'heart',
        confidence: Math.min(0.95, 0.75 + cheekboneProminence * 0.15),
        explanation: 'Visage cœur : pommettes saillantes, menton fin',
      };
    }

    // Oblong: high aspect ratio, long face
    if (aspectRatio > 1.0 && faceHeight > 150) {
      return {
        type: 'oblong',
        confidence: Math.min(0.95, 0.75 + (aspectRatio - 1.0) * 0.3),
        explanation: 'Visage oblong : allongé et fin',
      };
    }

    // Default to oval if no clear match
    return {
      type: 'oval',
      confidence: 0.5,
      explanation: 'Visage ovale (détection par défaut)',
    };
  }, []);

  const detect = useCallback(async () => {
    if (!videoRef.current || !faceLandmarker) return;

    const now = Date.now();
    if (now - lastDetectionTimeRef.current < 100) {
      // Throttle to ~10 FPS for performance
      animationFrameRef.current = requestAnimationFrame(detect);
      return;
    }
    lastDetectionTimeRef.current = now;

    try {
      setResult((prev) => ({ ...prev, isDetecting: true, error: null }));

      const results = faceLandmarker.detectForVideo(videoRef.current, now);

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0].map((lm: any) => ({
          x: lm.x,
          y: lm.y,
          z: lm.z,
        }));

        const metrics = calculateFaceMetrics(landmarks);

        setResult({
          metrics,
          landmarks,
          isDetecting: false,
          error: null,
        });
      } else {
        setResult((prev) => ({
          ...prev,
          isDetecting: false,
          error: 'Aucun visage détecté. Assurez-vous que votre visage est bien visible.',
        }));
      }
    } catch (error) {
      console.error('Detection error:', error);
      setResult((prev) => ({
        ...prev,
        isDetecting: false,
        error: 'Erreur lors de la détection. Veuillez réessayer.',
      }));
    }

    animationFrameRef.current = requestAnimationFrame(detect);
  }, [calculateFaceMetrics]);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeFaceLandmarker();
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          animationFrameRef.current = requestAnimationFrame(detect);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setResult((prev) => ({
          ...prev,
          error: 'Impossible de charger le modèle de détection faciale.',
        }));
      }
    };

    init();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [detect]);

  return {
    ...result,
    detectMorphology,
  };
};
