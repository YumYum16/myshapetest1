// MyShape — FaceShapeCard Component
// Cartes de morphologie avec SVG illustration et recommandations

import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import type { FaceShape } from '@/lib/frames-data';

interface FaceShapeCardProps {
  shape: FaceShape;
  description?: string;
  compact?: boolean;
}

// SVG illustrations de morphologie — ligne fine, accent émeraude
function FaceShapeSVG({ shape, size = 80 }: { shape: FaceShape; size?: number }) {
  const strokeColor = '#0D6E4F';
  const strokeW = 1.5;

  switch (shape) {
    case 'Ovale':
      return (
        <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="48" rx="30" ry="42" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="40" cy="48" r="2" fill={strokeColor} opacity="0.4" />
          {/* Proportions reference */}
          <line x1="10" y1="48" x2="70" y2="48" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
          <line x1="40" y1="6" x2="40" y2="90" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        </svg>
      );
    case 'Carré':
      return (
        <svg width={size} height={size * 1.1} viewBox="0 0 80 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 20 Q15 8 40 8 Q65 8 65 20 L65 68 Q65 80 40 80 Q15 80 15 68 Z" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="40" cy="44" r="2" fill={strokeColor} opacity="0.4" />
          <line x1="15" y1="44" x2="65" y2="44" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
          <line x1="40" y1="8" x2="40" y2="80" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        </svg>
      );
    case 'Rond':
      return (
        <svg width={size} height={size * 1.05} viewBox="0 0 80 84" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="42" rx="32" ry="36" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="40" cy="42" r="2" fill={strokeColor} opacity="0.4" />
          <line x1="8" y1="42" x2="72" y2="42" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
          <line x1="40" y1="6" x2="40" y2="78" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        </svg>
      );
    case 'Triangulaire':
      return (
        <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 8 Q40 6 52 8 L68 72 Q62 88 40 90 Q18 88 12 72 Z" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="40" cy="48" r="2" fill={strokeColor} opacity="0.4" />
          <line x1="28" y1="8" x2="52" y2="8" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
          <line x1="12" y1="72" x2="68" y2="72" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        </svg>
      );
    case 'Diamant':
      return (
        <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 6 Q54 16 66 32 Q70 42 66 52 Q54 72 40 90 Q26 72 14 52 Q10 42 14 32 Q26 16 40 6Z" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="40" cy="48" r="2" fill={strokeColor} opacity="0.4" />
          <line x1="14" y1="42" x2="66" y2="42" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
          <line x1="40" y1="6" x2="40" y2="90" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        </svg>
      );
  }
}

const shapeInfo: Record<FaceShape, { tagline: string; frames: string[]; color: string }> = {
  'Ovale': {
    tagline: 'La plus polyvalente',
    frames: ['Rectangulaire', 'Carré', 'Cat-eye', 'Aviateur'],
    color: '#0D6E4F',
  },
  'Carré': {
    tagline: 'Mâchoire forte & anguleuse',
    frames: ['Rond', 'Ovale', 'Cat-eye', 'Semi-cerclé'],
    color: '#1d4ed8',
  },
  'Rond': {
    tagline: 'Courbes douces & harmonieuses',
    frames: ['Rectangulaire', 'Carré', 'Géométrique'],
    color: '#7c3aed',
  },
  'Triangulaire': {
    tagline: 'Mâchoire plus large que le front',
    frames: ['Cat-eye', 'Aviateur', 'Semi-cerclé'],
    color: '#b45309',
  },
  'Diamant': {
    tagline: 'Pommettes larges & proéminentes',
    frames: ['Cat-eye', 'Ovale', 'Rimless'],
    color: '#be185d',
  },
};

export default function FaceShapeCard({ shape, description, compact = false }: FaceShapeCardProps) {
  const info = shapeInfo[shape];

  if (compact) {
    return (
      <div className="card-hover bg-white rounded-xl p-4 border border-gray-100 text-center">
        <div className="flex justify-center mb-3">
          <FaceShapeSVG shape={shape} size={56} />
        </div>
        <h3
          className="font-semibold text-sm"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
        >
          {shape}
        </h3>
        <p className="text-xs mt-1" style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>
          {info.tagline}
        </p>
      </div>
    );
  }

  return (
    <div className="card-hover bg-white rounded-2xl p-6 border border-gray-100 flex flex-col">
      {/* SVG illustration */}
      <div className="flex justify-center mb-4">
        <FaceShapeSVG shape={shape} size={72} />
      </div>

      {/* Shape name */}
      <h3
        className="text-xl font-bold text-center mb-1"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
      >
        {shape}
      </h3>

      <p
        className="text-xs text-center mb-3 font-medium"
        style={{ color: info.color, fontFamily: "'DM Sans', sans-serif" }}
      >
        {info.tagline}
      </p>

      {description && (
        <p
          className="text-sm text-center mb-4 leading-relaxed"
          style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
        >
          {description}
        </p>
      )}

      {/* Recommended frames */}
      <div className="mt-auto">
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
        >
          Montures recommandées
        </p>
        <div className="flex flex-wrap gap-1.5">
          {info.frames.map((frame) => (
            <span
              key={frame}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: '#E8F5F0',
                color: '#0D6E4F',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {frame}
            </span>
          ))}
        </div>
      </div>

      <Link
        href="/essayer"
        className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
        style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
      >
        Analyser ma morphologie
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
