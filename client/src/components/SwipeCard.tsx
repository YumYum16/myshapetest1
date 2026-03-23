// TikTok-style swipe card interface for glasses frames
import { useState, useRef, useEffect } from 'react';
import { Heart, X, ArrowRight, ExternalLink } from 'lucide-react';
import GlassesSVG from './GlassesSVG';
import type { Frame } from '@/lib/frames-data';

interface SwipeCardProps {
  frame: Frame;
  index: number;
  total: number;
  faceShape: string;
  onLike: () => void;
  onSkip: () => void;
  onBuy: (frame: Frame) => void;
  onTryOn: (frame: Frame) => void;
  isLiked: boolean;
}

export default function SwipeCard({
  frame,
  index,
  total,
  faceShape,
  onLike,
  onSkip,
  onBuy,
  onTryOn,
  isLiked,
}: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [swipeAction, setSwipeAction] = useState<'like' | 'skip' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startXRef.current;
    setDragX(delta);

    if (delta > 50) {
      setSwipeAction('like');
    } else if (delta < -50) {
      setSwipeAction('skip');
    } else {
      setSwipeAction(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (swipeAction === 'like') {
      onLike();
    } else if (swipeAction === 'skip') {
      onSkip();
    }
    setDragX(0);
    setSwipeAction(null);
  };

  // Determine if frame is recommended for this face shape
  const isRecommended = frame.compatibleShapes.includes(faceShape as any);

  const getFrameColor = () => {
    if (frame.id.includes('ray-ban')) return '#1a1a1a';
    if (frame.id.includes('tom-ford')) return '#8B6914';
    if (frame.id.includes('persol')) return '#6B3A2A';
    if (frame.id.includes('oakley')) return '#2a2a2a';
    if (frame.id.includes('lindberg')) return '#C0C0C0';
    if (frame.id.includes('celine')) return '#111827';
    return '#1a1a1a';
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full max-w-md mx-auto select-none"
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
        transition: isDragging ? 'none' : 'transform 300ms ease-out',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Progress counter */}
      <div className="text-center mb-6">
        <p
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
        >
          {index + 1} / {total} montures
        </p>
      </div>

      {/* Card container */}
      <div
        className="rounded-3xl p-8 shadow-2xl"
        style={{
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
        }}
      >
        {/* Glasses SVG */}
        <div
          className="flex items-center justify-center mb-8 h-48"
          style={{
            perspective: '800px',
          }}
        >
          <div
            style={{
              transform: 'perspective(800px) rotateX(10deg) rotateY(-15deg)',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))',
            }}
          >
            <GlassesSVG
              shape={frame.shape}
              width={200}
              color={getFrameColor()}
            />
          </div>
        </div>

        {/* Brand & Model */}
        <div className="mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
          >
            {frame.brand}
          </p>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
          >
            {frame.name}
          </h2>
          <p
            className="text-lg font-semibold"
            style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
          >
            {frame.price}
          </p>
        </div>

        {/* Compatibility badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{
            backgroundColor: isRecommended ? 'rgba(13, 110, 79, 0.1)' : 'rgba(156, 163, 175, 0.1)',
            color: isRecommended ? '#0D6E4F' : '#9CA3AF',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {isRecommended ? '✓ Recommandé' : '○ Moins recommandé'} pour {faceShape}
        </div>

        {/* Description */}
        <p
          className="text-sm italic mb-6"
          style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
        >
          "{frame.description}"
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3">
          {/* Skip button */}
          <button
            onClick={onSkip}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: '#F3F4F6',
              color: '#6B7280',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Pas pour moi</span>
          </button>

          {/* Like button */}
          <button
            onClick={onLike}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: isLiked ? '#FEE2E2' : '#F3F4F6',
              color: isLiked ? '#DC2626' : '#6B7280',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">J'aime</span>
          </button>

          {/* Buy button */}
          <button
            onClick={() => onBuy(frame)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: '#0D6E4F',
              color: 'white',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span className="text-sm font-medium">Acheter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Swipe feedback */}
      {swipeAction === 'like' && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 110, 79, 0.1), transparent)',
          }}
        >
          <Heart className="w-16 h-16 text-green-500 fill-green-500 opacity-50" />
        </div>
      )}

      {swipeAction === 'skip' && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), transparent)',
          }}
        >
          <X className="w-16 h-16 text-gray-400 opacity-50" />
        </div>
      )}
    </div>
  );
}
