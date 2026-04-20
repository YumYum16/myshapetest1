// MyShape — Landing Page (/)
// Design: Tech-Luxe Émeraude | Playfair Display + DM Sans
// Sections: Hero, How it works, Stats, Face shapes, Testimonials, Final CTA

import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Eye, Shield, Camera, Cpu, Glasses, Star, ChevronRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaceShapeCard from '@/components/FaceShapeCard';
import { useParallax } from '@/hooks/useParallax';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { FaceShape } from '@/lib/frames-data';



const FACE_SHAPES: FaceShape[] = ['Ovale', 'Carré', 'Rond', 'Triangulaire', 'Diamant'];

const testimonials = [
  {
    name: 'Sophie M.',
    avatar: 'SM',
    role: 'Acheteuse en ligne',
    quote: 'Enfin un outil qui m\'a aidée à comprendre pourquoi certaines montures me vont et d\'autres non. J\'ai commandé mes premières lunettes en ligne avec confiance !',
    rating: 5,
    shape: 'Ovale',
  },
  {
    name: 'Thomas R.',
    avatar: 'TR',
    role: 'Cadre parisien',
    quote: 'L\'analyse est bluffante de précision. En 30 secondes, j\'avais mes recommandations. J\'ai acheté les Ray-Ban Clubmaster et c\'est parfait.',
    rating: 5,
    shape: 'Carré',
  },
  {
    name: 'Léa D.',
    avatar: 'LD',
    role: 'Étudiante en design',
    quote: 'Super application ! J\'adore que rien ne soit stocké. L\'essayage AR est vraiment utile pour visualiser avant d\'acheter.',
    rating: 5,
    shape: 'Diamant',
  },
];

export default function Home() {
  useScrollReveal();
  const [activeStep, setActiveStep] = useState(0);
  const parallaxBg = useParallax(0.2);
  const parallaxHeadline = useParallax(0.9);
  const parallaxGlasses = useParallax(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background image with parallax */}
        <div className="absolute inset-0 z-0" ref={parallaxBg}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429713797/XHqiHCtKYoHGBxHprzKY3y/hero-bg-Ft7XEU59qGjWAvJSPZK7ou.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(250,250,248,0.97) 55%, rgba(250,250,248,0.5) 80%, rgba(250,250,248,0.1) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(250,250,248,1) 100%)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32" ref={parallaxHeadline}>
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-in-up"
              style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D6E4F] animate-pulse" />
              IA de morphologie faciale · 100% gratuit
            </div>

            {/* Main headline */}
            <h1
              className="font-light mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26', lineHeight: 1.0, fontSize: 'clamp(44px, 8vw, 80px)', letterSpacing: '-0.03em' }}
            >
              Trouvez les lunettes
              <span style={{ color: '#0D6E4F' }}> faites</span> pour votre visage
            </h1>

            {/* Subheadline */}
            <p
              className="leading-relaxed mb-8 animate-fade-in-up delay-200"
              style={{ color: '#6B6B6B', fontFamily: "'DM Sans', sans-serif", maxWidth: '560px', fontSize: '18px', fontWeight: 300, lineHeight: 1.6 }}
            >
              Notre IA analyse votre morphologie faciale en temps réel et vous recommande les montures parfaites. Essayage en réalité augmentée, directement depuis votre caméra.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up delay-300">
              <Link
                href="/essayer-v2"
                className="btn-shimmer inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
                style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                <Camera className="w-5 h-5" />
                Analyser mon visage →
              </Link>
              <Link
                href="/morphologies"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Découvrir les morphologies
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust badge */}
            <div
              className="flex items-center gap-2 mt-6 animate-fade-in-up delay-400"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Shield className="w-4 h-4" style={{ color: '#0D6E4F' }} />
              <span className="text-xs" style={{ color: '#6B7280' }}>
                Aucune photo stockée · 100% local · Gratuit
              </span>
            </div>
          </div>
        </div>

        {/* Floating demo card */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block animate-float z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-4 w-64" style={{ border: '1px solid #E5E7EB' }}>
            <div className="relative rounded-xl overflow-hidden mb-3" style={{ height: '160px', backgroundColor: '#0F1A17' }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429713797/XHqiHCtKYoHGBxHprzKY3y/face-scan-demo-mxiTfQZjFbTy8eyLPiLqGm.webp"
                alt="Démonstration analyse IA"
                className="w-full h-full object-cover opacity-90"
              />
              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full border-2 opacity-60"
                    style={{ borderColor: '#0D6E4F' }}
                  />
                  <div
                    className="absolute inset-2 rounded-full border opacity-40"
                    style={{ borderColor: '#0D6E4F' }}
                  />
                </div>
              </div>
              {/* Privacy badge */}
              <div
                className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                style={{ backgroundColor: 'rgba(13, 110, 79, 0.9)', color: 'white', fontFamily: "'DM Sans', sans-serif" }}
              >
                <Shield className="w-3 h-3" />
                Traitement local uniquement
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}>
                  Morphologie détectée
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: '#E8F5F0', color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Ovale ✓
                </span>
              </div>
              <p className="text-xs" style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
                6 montures recommandées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 lg:py-32" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate>
            <div className="inline-flex flex-col items-center mb-4">
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Comment ça marche
              </p>
              <div style={{ width: '48px', height: '1px', backgroundColor: '#E0E0DC' }} />
            </div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26', fontSize: 'clamp(32px, 6vw, 52px)' }}
            >
              Trois étapes, une minute
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                icon: Camera,
                title: 'Activez la caméra',
                description: 'Autorisez l\'accès à votre caméra. Aucune image n\'est envoyée — tout est traité localement sur votre appareil.',
                color: '#0D6E4F',
              },
              {
                step: '02',
                icon: Cpu,
                title: 'L\'IA analyse votre morphologie',
                description: 'Notre IA MediaPipe détecte 468 points de repère sur votre visage et calcule votre morphologie en temps réel.',
                color: '#1d4ed8',
              },
              {
                step: '03',
                icon: Glasses,
                title: 'Essayez les montures en live',
                description: 'Visualisez les montures recommandées directement sur votre visage grâce à la réalité augmentée.',
                color: '#7c3aed',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative ${index === activeStep ? 'scale-105' : ''} transition-transform duration-500`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Step number background */}
                <div
                  className="absolute -top-4 -left-2 text-8xl font-bold select-none pointer-events-none"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: item.color,
                    opacity: 0.06,
                    lineHeight: 1,
                  }}
                >
                  {item.step}
                </div>

                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 h-full">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: item.color + '12' }}
                  >
                    <item.icon className="w-7 h-7" style={{ color: item.color }} />
                  </div>

                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.description}
                  </p>

                  {/* Step indicator */}
                  <div
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: item.color + '15', color: item.color, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.step}
                  </div>
                </div>

                {/* Arrow connector */}
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 z-10 items-center justify-center">
                    <ArrowRight className="w-5 h-5" style={{ color: '#D1D5DB' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12" data-animate>
            <Link
              href="/essayer-v2"
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
            >
              <Camera className="w-4 h-4" />
              Commencer l'analyse
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16" style={{ backgroundColor: '#0F1A17' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '12 000+', label: 'Analyses réalisées', icon: '📊' },
              { value: '4.8/5', label: 'Satisfaction utilisateurs', icon: '⭐' },
              { value: '50+', label: 'Montures disponibles', icon: '👓' },
            ].map((stat, index) => (
              <div key={index} className="reveal" data-animate>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div
                  className="text-4xl lg:text-5xl font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#E8F5F0' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm"
                  style={{ color: 'rgba(232, 245, 240, 0.6)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FACE SHAPES ===== */}
      <section className="py-24 lg:py-32" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
            >
              Les 5 morphologies
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Quelle est votre morphologie ?
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              Chaque visage est unique. Notre IA identifie votre morphologie parmi 5 types et vous recommande les montures les plus flatteuses.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {FACE_SHAPES.map((shape, index) => (
              <div key={shape} className="reveal" data-animate style={{ transitionDelay: `${index * 0.08}s` }}>
                <FaceShapeCard shape={shape} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12" data-animate>
            <Link
              href="/morphologies"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
            >
              Guide complet des morphologies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GLASSES COLLECTION PREVIEW ===== */}
      <section className="py-24" style={{ backgroundColor: '#F0EDE8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal" data-animate>
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Notre sélection
              </p>
              <h2
                className="text-4xl lg:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
              >
                Des marques premium, sélectionnées pour vous
              </h2>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
              >
                Ray-Ban, Tom Ford, Persol, Lindberg... Nous avons sélectionné les meilleures montures pour chaque morphologie, disponibles chez nos partenaires opticiens.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '12 marques premium sélectionnées',
                  'Prix de €95 à €420',
                  'Disponibles chez Optical Center, Sensee, EasyVerres',
                  'Essayage AR avant achat',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#E8F5F0' }}
                    >
                      <Check className="w-3 h-3" style={{ color: '#0D6E4F' }} />
                    </div>
                    <span className="text-sm" style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/lunettes"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Voir le catalogue complet
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="reveal" data-animate>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429713797/XHqiHCtKYoHGBxHprzKY3y/glasses-collection-8Q8PhXkZCf73Gts8yUBC3k.webp"
                  alt="Collection de lunettes premium"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 lg:py-32" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
            >
              Témoignages
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Ils ont trouvé leurs lunettes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="reveal bg-white rounded-2xl p-6 border border-gray-100 card-hover"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#F59E0B' }} />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-sm leading-relaxed mb-6 italic"
                  style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}
                >
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
                      {t.role} · Morphologie {t.shape}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24" style={{ backgroundColor: '#0F1A17' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="reveal" data-animate>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ backgroundColor: 'rgba(13, 110, 79, 0.3)', color: '#4ade80', fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Analyse gratuite · Aucune inscription
            </div>

            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#E8F5F0' }}
            >
              Prêt à trouver vos lunettes idéales ?
            </h2>
            <p
              className="text-lg mb-10 max-w-xl mx-auto"
              style={{ color: 'rgba(232, 245, 240, 0.65)', fontFamily: "'DM Sans', sans-serif" }}
            >
              Rejoignez 12 000 utilisateurs qui ont découvert les montures parfaites pour leur morphologie. En moins d'une minute.
            </p>

            <Link
              href="/essayer-v2"
              className="btn-shimmer inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-2xl hover:scale-105"
              style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
            >
              <Camera className="w-5 h-5" />
              Analyser mon visage maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p
              className="mt-4 text-xs"
              style={{ color: 'rgba(232, 245, 240, 0.4)', fontFamily: "'DM Sans', sans-serif" }}
            >
              Aucune photo stockée · Traitement 100% local · RGPD compliant
            </p>
          </div>
        </div>
      </section>

      {/* ===== STICKY MOBILE CTA ===== */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 p-4 lg:hidden"
        style={{ background: 'linear-gradient(to top, rgba(250,250,248,1) 70%, transparent)' }}
      >
        <Link
          href="/essayer-v2"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
        >
          <Camera className="w-4 h-4" />
          Essayer mes lunettes →
        </Link>
      </div>

      <Footer />
    </div>
  );
}
