import { useEffect, useRef, useState, useCallback } from 'react';

export interface FaceMetrics {
  faceWidth: number;
  faceHeight: number;
  jawWidth: number;
  cheekboneWidth: number;
  foreheadWidth: number;
  aspectRatio: number;
  jawlineDefinition: number;
  cheekboneProminence: number;
  faceLength: number;
  hasGlasses: boolean;
  glassesConfidence: number;
  confidence: number;
}

export interface FaceDetectionResult {
  metrics: FaceMetrics | null;
  isDetecting: boolean;
  error: string | null;
}

export interface MorphologyResult {
  type: 'oval' | 'round' | 'square' | 'heart' | 'oblong';
  confidence: number;
  explanation: string;
}

/**
 * Simplified face detection using canvas pixel analysis
 * This is a fallback when MediaPipe models are unavailable
 */
export const useSimpleFaceDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [result, setResult] = useState<FaceDetectionResult>({
    metrics: null,
    isDetecting: false,
    error: null,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);

  const detectFaceRegion = useCallback((imageData: ImageData): FaceMetrics | null => {
    const { data, width, height } = imageData;
    
    // Convert to grayscale and find face region (darker areas)
    const grayscale = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      grayscale[i / 4] = (r + g + b) / 3;
    }

    // Find face boundaries using edge detection
    let minX = width, maxX = 0, minY = height, maxY = 0;
    let facePixelCount = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const gray = grayscale[idx];
        
        // Skin tone detection (simplified)
        // Typical skin tones have R > G > B and moderate brightness
        const r = data[idx * 4];
        const g = data[idx * 4 + 1];
        const b = data[idx * 4 + 2];
        
        if (r > 95 && g > 40 && b > 20 && 
            r > g && g > b && 
            Math.abs(r - g) > 15 &&
            gray > 50 && gray < 200) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          facePixelCount++;
        }
      }
    }

    // If no face detected
    if (facePixelCount < 1000) {
      return null;
    }

    const faceWidth = maxX - minX;
    const faceHeight = maxY - minY;
    const centerX = minX + faceWidth / 2;
    const centerY = minY + faceHeight / 2;

    // Estimate facial features based on proportions
    const foreheadWidth = faceWidth * 0.8;
    const cheekboneWidth = faceWidth * 0.9;
    const jawWidth = faceWidth * 0.6;

    // Calculate jawline definition (how much narrower jaw is than cheekbones)
    const jawlineDefinition = Math.max(0, (cheekboneWidth - jawWidth) / cheekboneWidth);

    // Calculate cheekbone prominence
    const cheekboneProminence = Math.min(1, cheekboneWidth / faceWidth);

    // Detect glasses (dark areas around eyes)
    let glassesConfidence = 0;
    const eyeRegionTop = centerY - faceHeight * 0.2;
    const eyeRegionBottom = centerY;
    const eyeRegionLeft = centerX - faceWidth * 0.35;
    const eyeRegionRight = centerX + faceWidth * 0.35;

    let darkPixelsInEyes = 0;
    let totalEyePixels = 0;

    for (let y = Math.floor(eyeRegionTop); y < Math.floor(eyeRegionBottom); y++) {
      for (let x = Math.floor(eyeRegionLeft); x < Math.floor(eyeRegionRight); x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const idx = y * width + x;
          const gray = grayscale[idx];
          if (gray < 100) darkPixelsInEyes++;
          totalEyePixels++;
        }
      }
    }

    glassesConfidence = totalEyePixels > 0 ? darkPixelsInEyes / totalEyePixels : 0;
    const hasGlasses = glassesConfidence > 0.4;

    return {
      faceWidth,
      faceHeight,
      jawWidth,
      cheekboneWidth,
      foreheadWidth,
      aspectRatio: faceWidth / faceHeight,
      jawlineDefinition,
      cheekboneProminence,
      faceLength: faceHeight,
      hasGlasses,
      glassesConfidence,
      confidence: Math.min(0.7, facePixelCount / 50000), // Normalize confidence
    };
  }, []);

  const detect = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    const now = Date.now();
    if (now - lastDetectionTimeRef.current < 200) {
      // Throttle to ~5 FPS for performance
      animationFrameRef.current = requestAnimationFrame(detect);
      return;
    }
    lastDetectionTimeRef.current = now;

    try {
      setResult((prev) => ({ ...prev, isDetecting: true, error: null }));

      // Create canvas if needed
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const metrics = detectFaceRegion(imageData);

      if (metrics) {
        setResult({
          metrics,
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
  }, [detectFaceRegion]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(detect);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [detect]);

  const detectMorphology = useCallback((metrics: FaceMetrics): MorphologyResult => {
    const { aspectRatio, jawlineDefinition, cheekboneProminence, faceLength } = metrics;

    // Oval: balanced proportions
    if (aspectRatio > 0.65 && aspectRatio < 0.85 && jawlineDefinition < 0.35) {
      return {
        type: 'oval',
        confidence: Math.min(0.9, 0.7 + Math.abs(0.75 - aspectRatio) * 0.2),
        explanation: 'Visage ovale : proportions équilibrées et harmonieuses',
      };
    }

    // Round: soft features
    if (aspectRatio > 0.75 && aspectRatio < 1.0 && jawlineDefinition < 0.3) {
      return {
        type: 'round',
        confidence: Math.min(0.9, 0.7 + (1 - Math.abs(aspectRatio - 0.85)) * 0.2),
        explanation: 'Visage rond : traits doux, joues pleines et arrondies',
      };
    }

    // Square: strong jawline
    if (aspectRatio > 0.85 && aspectRatio < 1.15 && jawlineDefinition > 0.4) {
      return {
        type: 'square',
        confidence: Math.min(0.9, 0.7 + jawlineDefinition * 0.2),
        explanation: 'Visage carré : mâchoire marquée, traits anguleux et définis',
      };
    }

    // Heart: prominent cheekbones
    if (aspectRatio > 0.65 && aspectRatio < 0.95 && cheekboneProminence > 0.55) {
      return {
        type: 'heart',
        confidence: Math.min(0.9, 0.7 + (cheekboneProminence - 0.55) * 0.3),
        explanation: 'Visage cœur : pommettes saillantes, front large, menton fin',
      };
    }

    // Oblong: elongated face
    if (aspectRatio > 1.0 && faceLength > 160) {
      return {
        type: 'oblong',
        confidence: Math.min(0.9, 0.7 + Math.min(0.2, (aspectRatio - 1.0) * 0.3)),
        explanation: 'Visage oblong : allongé et fin, front et menton proéminents',
      };
    }

    // Default to oval
    return {
      type: 'oval',
      confidence: 0.55,
      explanation: 'Visage ovale (meilleure correspondance)',
    };
  }, []);

  return {
    ...result,
    detectMorphology,
  };
};
