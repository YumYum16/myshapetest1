// MyShape — Page Guide des Morphologies (/morphologies)
// Design: Tech-Luxe Émeraude | Page SEO avec guide complet des 5 morphologies

import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Camera, ChevronDown, ChevronUp, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaceShapeCard from '@/components/FaceShapeCard';
import type { FaceShape } from '@/lib/frames-data';
import { getFaceShapeInfo } from '@/lib/face-classification';

const FACE_SHAPES: FaceShape[] = ['Ovale', 'Carré', 'Rond', 'Triangulaire', 'Diamant'];

const celebrities: Record<FaceShape, string[]> = {
  'Ovale': ['Beyoncé', 'George Clooney', 'Jessica Alba', 'Ryan Gosling'],
  'Carré': ['Angelina Jolie', 'Brad Pitt', 'Olivia Wilde', 'Henry Cavill'],
  'Rond': ['Selena Gomez', 'Leonardo DiCaprio', 'Chrissy Teigen', 'Jack Black'],
  'Triangulaire': ['Jennifer Aniston', 'Reese Witherspoon', 'Kelly Clarkson'],
  'Diamant': ['Scarlett Johansson', 'Johnny Depp', 'Megan Fox', 'Robert Pattinson'],
};

const shapeColors: Record<FaceShape, string> = {
  'Ovale': '#0D6E4F',
  'Carré': '#1d4ed8',
  'Rond': '#7c3aed',
  'Triangulaire': '#b45309',
  'Diamant': '#be185d',
};

const frameDetails: Record<FaceShape, { recommended: { name: string; why: string }[]; avoid: { name: string; why: string }[] }> = {
  'Ovale': {
    recommended: [
      { name: 'Montures rectangulaires', why: 'Ajoutent de la structure et équilibrent les courbes naturelles' },
      { name: 'Montures carrées', why: 'Créent un contraste élégant avec la douceur du visage ovale' },
      { name: 'Montures cat-eye', why: 'Accentuent les pommettes et apportent du caractère' },
      { name: 'Aviateurs', why: 'Classiques intemporels qui s\'adaptent parfaitement à cette morphologie' },
    ],
    avoid: [
      { name: 'Montures trop petites', why: 'Déséquilibrent les proportions naturellement harmonieuses' },
      { name: 'Montures trop grandes', why: 'Peuvent écraser les traits délicats du visage ovale' },
    ],
  },
  'Carré': {
    recommended: [
      { name: 'Montures rondes', why: 'Adoucissent la mâchoire anguleuse et créent un contraste harmonieux' },
      { name: 'Montures ovales', why: 'Équilibrent les angles forts du visage carré' },
      { name: 'Montures cat-eye', why: 'Attirent le regard vers le haut, affinant visuellement le visage' },
      { name: 'Montures semi-cerclées', why: 'Légèreté visuelle qui contrebalance la structure forte' },
    ],
    avoid: [
      { name: 'Montures carrées', why: 'Accentuent encore plus les angles déjà prononcés' },
      { name: 'Montures rectangulaires', why: 'Renforcent l\'aspect anguleux du visage carré' },
      { name: 'Montures très petites', why: 'Semblent disproportionnées sur un visage large' },
    ],
  },
  'Rond': {
    recommended: [
      { name: 'Montures rectangulaires', why: 'Allongent visuellement le visage et ajoutent de la définition' },
      { name: 'Montures carrées', why: 'Créent des angles qui contrastent avec les courbes du visage' },
      { name: 'Montures géométriques', why: 'Apportent de la structure et de la personnalité' },
      { name: 'Montures à pont haut', why: 'Allongent le visage et le font paraître plus fin' },
    ],
    avoid: [
      { name: 'Montures rondes', why: 'Accentuent la rondeur du visage, sans contraste' },
      { name: 'Montures petites', why: 'Disparaissent sur un visage large et arrondi' },
      { name: 'Montures sans angles', why: 'Manquent de structure pour équilibrer les courbes' },
    ],
  },
  'Triangulaire': {
    recommended: [
      { name: 'Montures cat-eye', why: 'Élargissent visuellement le front pour équilibrer la mâchoire forte' },
      { name: 'Montures semi-cerclées', why: 'Attirent l\'attention vers le haut du visage' },
      { name: 'Montures plus larges en haut', why: 'Compensent la largeur de la mâchoire' },
      { name: 'Montures aviateur', why: 'Le design en larme équilibre les proportions' },
    ],
    avoid: [
      { name: 'Montures plus larges en bas', why: 'Accentuent encore la largeur de la mâchoire' },
      { name: 'Montures très petites', why: 'Déséquilibrent les proportions déjà asymétriques' },
    ],
  },
  'Diamant': {
    recommended: [
      { name: 'Montures cat-eye', why: 'Accentuent les yeux et équilibrent les pommettes larges' },
      { name: 'Montures ovales', why: 'Douceur des courbes qui s\'harmonise avec les pommettes' },
      { name: 'Montures rimless', why: 'Légèreté qui ne concurrence pas les pommettes proéminentes' },
      { name: 'Montures sans cerclage', why: 'Discrétion qui laisse briller les traits naturels' },
    ],
    avoid: [
      { name: 'Montures trop étroites', why: 'Accentuent la largeur des pommettes par contraste' },
      { name: 'Montures très larges', why: 'Concurrencent les pommettes et alourdissent le visage' },
    ],
  },
};

function ShapeSection({ shape }: { shape: FaceShape }) {
  const [expanded, setExpanded] = useState(false);
  const info = getFaceShapeInfo(shape);
  const details = frameDetails[shape];
  const color = shapeColors[shape];

  return (
    <section
      id={shape.toLowerCase()}
      className="py-16 lg:py-20 border-b border-gray-100 last:border-0"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left: Shape card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FaceShapeCard shape={shape} />
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-1 h-12 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div>
                <h2
                  className="text-3xl lg:text-4xl font-bold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                >
                  Visage {shape}
                </h2>
                <p
                  className="text-sm font-medium mt-1"
                  style={{ color, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {shape === 'Ovale' ? 'La morphologie universelle' :
                   shape === 'Carré' ? 'Mâchoire forte et anguleuse' :
                   shape === 'Rond' ? 'Courbes douces et harmonieuses' :
                   shape === 'Triangulaire' ? 'Mâchoire plus large que le front' :
                   'Pommettes larges et proéminentes'}
                </p>
              </div>
            </div>

            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}
            >
              {info.description}
            </p>

            {/* Recommended frames */}
            <div className="mb-6">
              <h3
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: color + '20', color }}
                >
                  ✓
                </span>
                Montures recommandées
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {details.recommended.map((item) => (
                  <div
                    key={item.name}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: '#F7F9F8', border: `1px solid ${color}20` }}
                  >
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Frames to avoid - collapsible */}
            <div className="mb-6">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-sm font-semibold mb-3 transition-colors hover:opacity-70"
                style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Montures à éviter ({details.avoid.length})
              </button>
              {expanded && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {details.avoid.map((item) => (
                    <div
                      key={item.name}
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
                    >
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        ✗ {item.name}
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {item.why}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Celebrity examples */}
            <div className="mb-8">
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}
              >
                Célébrités avec cette morphologie
              </h3>
              <div className="flex flex-wrap gap-2">
                {celebrities[shape].map((celeb) => (
                  <div
                    key={celeb}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <Star className="w-3 h-3" style={{ color: '#F59E0B' }} />
                    {celeb}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/essayer"
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: color, fontFamily: "'DM Sans', sans-serif" }}
            >
              <Camera className="w-4 h-4" />
              Analyser ma morphologie →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Morphologies() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Navbar />

      {/* Header */}
      <div
        className="pt-24 pb-16"
        style={{ background: 'linear-gradient(to bottom, #0F1A17, #1a2e28)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#4ade80', fontFamily: "'DM Sans', sans-serif" }}
          >
            Guide complet
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#E8F5F0' }}
          >
            Les 5 morphologies de visage
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto mb-8"
            style={{ color: 'rgba(232, 245, 240, 0.7)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Découvrez quelle morphologie vous correspond et quelles montures de lunettes sublimeront vos traits naturels.
          </p>
          <Link
            href="/essayer"
            className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:scale-105"
            style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
          >
            <Camera className="w-4 h-4" />
            Analyser ma morphologie avec l'IA
          </Link>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {FACE_SHAPES.map((shape) => (
              <a
                key={shape}
                href={`#${shape.toLowerCase()}`}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: shapeColors[shape] + '15',
                  color: shapeColors[shape],
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {shape}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Shape sections */}
      {FACE_SHAPES.map((shape) => (
        <ShapeSection key={shape} shape={shape} />
      ))}

      {/* Final CTA */}
      <section className="py-20" style={{ backgroundColor: '#0F1A17' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#E8F5F0' }}
          >
            Pas encore sûr de votre morphologie ?
          </h2>
          <p
            className="text-base mb-8"
            style={{ color: 'rgba(232, 245, 240, 0.65)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Notre IA analyse votre visage en temps réel et détermine votre morphologie avec précision. Gratuit, sans inscription, en moins d'une minute.
          </p>
          <Link
            href="/essayer"
            className="btn-shimmer inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:scale-105"
            style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
          >
            <Camera className="w-5 h-5" />
            Analyser mon visage maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
