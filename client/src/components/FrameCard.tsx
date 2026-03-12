// MyShape — FrameCard Component
// Design: Tech-Luxe Émeraude | Card premium avec hover effect

import { useState } from 'react';
import { Link } from 'wouter';
import { ExternalLink, Eye, Tag, Star } from 'lucide-react';
import type { Frame } from '@/lib/frames-data';
import GlassesSVG from './GlassesSVG';

interface FrameCardProps {
  frame: Frame;
  onTryOn?: (frameId: string) => void;
  showTryOn?: boolean;
  compact?: boolean;
}

const affiliateColors: Record<string, string> = {
  'Optical Center': '#1a56db',
  'Sensee': '#7e3af2',
  'EasyVerres': '#057a55',
};

export default function FrameCard({ frame, onTryOn, showTryOn = true, compact = false }: FrameCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`card-hover bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
        compact ? 'p-3' : 'p-0'
      }`}
      style={{ borderColor: hovered ? '#0D6E4F' : '#E5E7EB' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Frame illustration */}
      <div
        className={`relative flex items-center justify-center ${compact ? 'h-24' : 'h-40'}`}
        style={{ backgroundColor: '#F7F9F8' }}
      >
        <div className={`transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
          <GlassesSVG
            shape={frame.shape}
            color={frame.id.includes('ray-ban') ? '#1a1a1a' :
                   frame.id.includes('tom-ford') ? '#8B6914' :
                   frame.id.includes('persol') ? '#6B3A2A' :
                   frame.id.includes('oakley') ? '#2a2a2a' :
                   frame.id.includes('lindberg') ? '#9CA3AF' :
                   frame.id.includes('garrett') ? '#6B7280' :
                   frame.id.includes('warby') ? '#1e3a5f' :
                   frame.id.includes('celine') ? '#111827' :
                   frame.id.includes('mykita') ? '#374151' :
                   frame.id.includes('oliver') ? '#92400E' :
                   frame.id.includes('prada') ? '#7C2D12' :
                   '#6B4226'}
            width={compact ? 120 : 180}
          />
        </div>

        {/* Compatibility badge */}
        {!compact && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {frame.compatibleShapes.slice(0, 2).map((shape) => (
              <span
                key={shape}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: '#E8F5F0',
                  color: '#0D6E4F',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {shape}
              </span>
            ))}
          </div>
        )}

        {/* Style badge */}
        {!compact && (
          <div className="absolute top-3 right-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full capitalize"
              style={{
                backgroundColor: 'rgba(15, 26, 23, 0.08)',
                color: '#1C2B26',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {frame.style}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={compact ? 'mt-2' : 'p-4'}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={`font-medium leading-tight ${compact ? 'text-xs' : 'text-sm'}`}
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              {frame.brand}
            </p>
            <h3
              className={`font-semibold leading-tight mt-0.5 ${compact ? 'text-sm' : 'text-base'}`}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              {frame.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p
              className={`font-bold ${compact ? 'text-sm' : 'text-lg'}`}
              style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
            >
              {frame.currency}{frame.price}
            </p>
          </div>
        </div>

        {!compact && (
          <>
            <p
              className="text-xs mt-2 leading-relaxed line-clamp-2"
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              {frame.description}
            </p>

            <div className="flex items-center gap-1.5 mt-2">
              <Tag className="w-3 h-3" style={{ color: '#9CA3AF' }} />
              <span className="text-xs" style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
                {frame.material} · {frame.color}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {showTryOn && (
                <button
                  onClick={() => onTryOn?.(frame.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: '#E8F5F0',
                    color: '#0D6E4F',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Essayer
                </button>
              )}
              <a
                href={frame.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: affiliateColors[frame.affiliate] || '#0D6E4F',
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {frame.affiliate}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
