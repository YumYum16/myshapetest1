import React, { useEffect, useRef } from 'react';

interface GlassesAROverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  landmarks: Array<{ x: number; y: number; z: number }> | null;
  glassesPath: string;
  hasGlasses: boolean;
}

export const GlassesAROverlay: React.FC<GlassesAROverlayProps> = ({
  videoRef,
  canvasRef,
  landmarks,
  glassesPath,
  hasGlasses,
}) => {
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !landmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    // Get eye landmarks
    const eyeLeftOuter = landmarks[33];
    const eyeLeftInner = landmarks[133];
    const eyeRightOuter = landmarks[362];
    const eyeRightInner = landmarks[263];
    const noseBridge = landmarks[168];

    // Calculate glasses position and size
    const leftEyeX = (eyeLeftOuter.x + eyeLeftInner.x) / 2 * width;
    const leftEyeY = eyeLeftOuter.y * height;
    const rightEyeX = (eyeRightOuter.x + eyeRightInner.x) / 2 * width;
    const rightEyeY = eyeRightOuter.y * height;

    const eyeDistance = Math.hypot(
      rightEyeX - leftEyeX,
      rightEyeY - leftEyeY
    );

    // Draw glasses frames
    const frameWidth = eyeDistance * 0.6;
    const frameHeight = frameWidth * 0.5;
    const bridgeX = (leftEyeX + rightEyeX) / 2;
    const bridgeY = (leftEyeY + rightEyeY) / 2;

    // Left frame
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(
      leftEyeX,
      leftEyeY,
      frameWidth / 2,
      frameHeight / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Right frame
    ctx.beginPath();
    ctx.ellipse(
      rightEyeX,
      rightEyeY,
      frameWidth / 2,
      frameHeight / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Bridge
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftEyeX + frameWidth / 2, leftEyeY);
    ctx.lineTo(rightEyeX - frameWidth / 2, rightEyeY);
    ctx.stroke();

    // Temples (arms)
    ctx.lineWidth = 2;
    // Left temple
    ctx.beginPath();
    ctx.moveTo(leftEyeX - frameWidth / 2, leftEyeY + frameHeight / 4);
    ctx.quadraticCurveTo(
      leftEyeX - frameWidth,
      leftEyeY + frameHeight / 2,
      leftEyeX - frameWidth * 1.5,
      leftEyeY + frameHeight / 3
    );
    ctx.stroke();

    // Right temple
    ctx.beginPath();
    ctx.moveTo(rightEyeX + frameWidth / 2, rightEyeY + frameHeight / 4);
    ctx.quadraticCurveTo(
      rightEyeX + frameWidth,
      rightEyeY + frameHeight / 2,
      rightEyeX + frameWidth * 1.5,
      rightEyeY + frameHeight / 3
    );
    ctx.stroke();

    // If user has glasses, apply blur effect to hide them
    if (hasGlasses) {
      // Create a mask to blur the existing glasses area
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#FAFAF8';
      ctx.beginPath();
      ctx.ellipse(
        leftEyeX,
        leftEyeY,
        frameWidth / 2 + 10,
        frameHeight / 2 + 10,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(
        rightEyeX,
        rightEyeY,
        frameWidth / 2 + 10,
        frameHeight / 2 + 10,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }, [landmarks, glassesPath, hasGlasses, videoRef, canvasRef]);

  return null; // This component only handles canvas drawing
};
