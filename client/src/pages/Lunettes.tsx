// MyShape — Page Catalogue Lunettes (/lunettes)
// Design: Tech-Luxe Émeraude | Grille de montures avec filtres et liens affiliés

import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Filter, SlidersHorizontal, ExternalLink, Eye, X, Camera, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassesSVG from '@/components/GlassesSVG';
import { frames } from '@/lib/frames-data';
import type { FaceShape, FrameStyle } from '@/lib/frames-data';

const FACE_SHAPES: FaceShape[] = ['Ovale', 'Carré', 'Rond', 'Triangulaire', 'Diamant'];
const STYLES: FrameStyle[] = ['classique', 'tendance', 'sport'];

const affiliateColors: Record<string, string> = {
  'Optical Center': '#1a56db',
  'Sensee': '#7e3af2',
  'EasyVerres': '#057a55',
};

const frameColors: Record<string, string> = {
  'ray-ban-clubmaster': '#1a1a1a',
  'tom-ford-ft5304': '#8B6914',
  'persol-po3007v': '#6B3A2A',
  'oakley-holbrook': '#2a2a2a',
  'lindberg-air-titanium': '#9CA3AF',
  'garrett-leight': '#6B7280',
  'warby-parker-beckett': '#1e3a5f',
  'celine-cl50008i': '#111827',
  'mykita-mylon': '#374151',
  'oliver-peoples-ov5183': '#92400E',
  'prada-pr17wv': '#7C2D12',
  'moscot-lemtosh': '#6B4226',
};

export default function Lunettes() {
  const [selectedShape, setSelectedShape] = useState<FaceShape | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<FrameStyle | null>(null);
  const [priceMax, setPriceMax] = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [, navigate] = useLocation();

  const filteredFrames = useMemo(() => {
    return frames.filter((frame) => {
      if (selectedShape && !frame.compatibleShapes.includes(selectedShape)) return false;
      if (selectedStyle && frame.style !== selectedStyle) return false;
      if (frame.price > priceMax) return false;
      return true;
    });
  }, [selectedShape, selectedStyle, priceMax]);

  const clearFilters = () => {
    setSelectedShape(null);
    setSelectedStyle(null);
    setPriceMax(500);
  };

  const hasFilters = selectedShape || selectedStyle || priceMax < 500;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-12" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-2"
                style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Catalogue
              </p>
              <h1
                className="text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
              >
                Nos montures
              </h1>
              <p
                className="text-base mt-2"
                style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
              >
                {filteredFrames.length} monture{filteredFrames.length > 1 ? 's' : ''} disponible{filteredFrames.length > 1 ? 's' : ''}
              </p>
            </div>
            <Link
              href="/essayer"
              className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
            >
              <Camera className="w-4 h-4" />
              Analyser ma morphologie
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex gap-8">
          {/* Filters sidebar - desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Filtres
                </h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs transition-colors hover:opacity-70"
                    style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Effacer
                  </button>
                )}
              </div>

              {/* Morphologie filter */}
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Morphologie
                </h3>
                <div className="space-y-1.5">
                  {FACE_SHAPES.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(selectedShape === shape ? null : shape)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                        selectedShape === shape ? 'font-semibold' : ''
                      }`}
                      style={{
                        backgroundColor: selectedShape === shape ? '#E8F5F0' : 'transparent',
                        color: selectedShape === shape ? '#0D6E4F' : '#4B5563',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style filter */}
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Style
                </h3>
                <div className="space-y-1.5">
                  {STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all duration-150 ${
                        selectedStyle === style ? 'font-semibold' : ''
                      }`}
                      style={{
                        backgroundColor: selectedStyle === style ? '#E8F5F0' : 'transparent',
                        color: selectedStyle === style ? '#0D6E4F' : '#4B5563',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Prix maximum
                </h3>
                <div className="px-1">
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={25}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-[#0D6E4F]"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>€50</span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      €{priceMax}
                    </span>
                    <span className="text-xs" style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>€500</span>
                  </div>
                </div>
              </div>

              {/* Affiliate partners */}
              <div className="pt-4 border-t border-gray-100">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Disponible chez
                </h3>
                <div className="space-y-2">
                  {['Optical Center', 'Sensee', 'EasyVerres'].map((partner) => (
                    <div
                      key={partner}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: affiliateColors[partner] }}
                      />
                      {partner}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
                style={{
                  borderColor: hasFilters ? '#0D6E4F' : '#E5E7EB',
                  color: hasFilters ? '#0D6E4F' : '#4B5563',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
                {hasFilters && (
                  <span
                    className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                    style={{ backgroundColor: '#0D6E4F' }}
                  >
                    {[selectedShape, selectedStyle, priceMax < 500].filter(Boolean).length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile filter panel */}
              {showFilters && (
                <div className="mt-3 p-4 rounded-xl border border-gray-100 bg-white space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>Morphologie</p>
                    <div className="flex flex-wrap gap-2">
                      {FACE_SHAPES.map((shape) => (
                        <button
                          key={shape}
                          onClick={() => setSelectedShape(selectedShape === shape ? null : shape)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                          style={{
                            backgroundColor: selectedShape === shape ? '#0D6E4F' : '#F3F4F6',
                            color: selectedShape === shape ? 'white' : '#4B5563',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>Style</p>
                    <div className="flex flex-wrap gap-2">
                      {STYLES.map((style) => (
                        <button
                          key={style}
                          onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
                          style={{
                            backgroundColor: selectedStyle === style ? '#0D6E4F' : '#F3F4F6',
                            color: selectedStyle === style ? 'white' : '#4B5563',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-xs" style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}>
                      Effacer les filtres
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedShape && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {selectedShape}
                    <button onClick={() => setSelectedShape(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedStyle && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize"
                    style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {selectedStyle}
                    <button onClick={() => setSelectedStyle(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {priceMax < 500 && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Max €{priceMax}
                    <button onClick={() => setPriceMax(500)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Frames grid */}
            {filteredFrames.length === 0 ? (
              <div className="text-center py-20">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#F3F4F6' }}
                >
                  <Filter className="w-8 h-8" style={{ color: '#9CA3AF' }} />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                >
                  Aucune monture trouvée
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Essayez d'élargir vos critères de recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold"
                  style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFrames.map((frame) => (
                  <div
                    key={frame.id}
                    className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100"
                  >
                    {/* Frame image */}
                    <div
                      className="relative h-44 flex items-center justify-center"
                      style={{ backgroundColor: '#F7F9F8' }}
                    >
                      <GlassesSVG
                        shape={frame.shape}
                        color={frameColors[frame.id] || '#374151'}
                        width={180}
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {frame.compatibleShapes.slice(0, 2).map((shape) => (
                          <span
                            key={shape}
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {shape}
                          </span>
                        ))}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full capitalize"
                          style={{ backgroundColor: 'rgba(15, 26, 23, 0.08)', color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {frame.style}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p
                            className="text-xs font-medium"
                            style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {frame.brand}
                          </p>
                          <h3
                            className="text-base font-bold leading-tight"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                          >
                            {frame.name}
                          </h3>
                        </div>
                        <p
                          className="text-lg font-bold shrink-0"
                          style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {frame.currency}{frame.price}
                        </p>
                      </div>

                      <p
                        className="text-xs leading-relaxed mb-4 line-clamp-2"
                        style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {frame.description}
                      </p>

                      <p
                        className="text-xs mb-4"
                        style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {frame.material} · {frame.color}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href="/essayer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90"
                          style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Essayer en live
                        </Link>
                        <a
                          href={frame.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:bg-[#1A1A1A] hover:text-white"
                          style={{
                            backgroundColor: 'transparent',
                            color: '#1A1A1A',
                            border: '1px solid #1A1A1A',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {frame.affiliate}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
