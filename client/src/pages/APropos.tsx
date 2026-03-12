// MyShape — Page À propos (/a-propos)
// Design: Tech-Luxe Émeraude | Technologie, confidentialité, RGPD

import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ChevronUp, Shield, Cpu, Eye, Lock, Camera, Globe, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left transition-colors hover:opacity-70"
      >
        <span
          className="text-sm font-semibold"
          style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
        >
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 shrink-0" style={{ color: '#0D6E4F' }} />
        ) : (
          <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#6B7280' }} />
        )}
      </button>
      {open && (
        <div
          className="pb-4 text-sm leading-relaxed"
          style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function APropos() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-16" style={{ background: 'linear-gradient(to bottom, #0F1A17, #1a2e28)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#4ade80', fontFamily: "'DM Sans', sans-serif" }}
          >
            À propos de MyShape
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#E8F5F0' }}
          >
            Technologie & Confidentialité
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'rgba(232, 245, 240, 0.7)', fontFamily: "'DM Sans', sans-serif" }}
          >
            MyShape utilise l'intelligence artificielle de pointe pour vous aider à trouver les lunettes parfaites, dans le respect total de votre vie privée.
          </p>
        </div>
      </div>

      {/* Technology section */}
      <section id="technologie" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Notre technologie
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
              >
                MediaPipe Face Mesh : 468 points de précision
              </h2>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}
              >
                MyShape utilise <strong>MediaPipe Face Mesh</strong>, une technologie d'IA développée par Google, pour analyser votre morphologie faciale en temps réel. Le modèle détecte 468 points de repère sur votre visage avec une précision millimétrique.
              </p>
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}
              >
                À partir de ces points, notre algorithme calcule les proportions clés de votre visage : largeur des pommettes, largeur de la mâchoire, largeur du front, et hauteur totale. Ces mesures permettent de classifier votre morphologie parmi les 5 types principaux.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cpu, label: '468 landmarks', desc: 'Points de repère détectés' },
                  { icon: Eye, label: 'Temps réel', desc: 'Analyse à 30 fps' },
                  { icon: Shield, label: '100% local', desc: 'Aucune donnée envoyée' },
                  { icon: Globe, label: 'Multi-device', desc: 'Mobile & desktop' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: '#F0EDE8' }}
                  >
                    <item.icon className="w-5 h-5 mb-2" style={{ color: '#0D6E4F' }} />
                    <p
                      className="text-sm font-bold"
                      style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429713797/XHqiHCtKYoHGBxHprzKY3y/face-scan-demo-mxiTfQZjFbTy8eyLPiLqGm.webp"
                  alt="Démonstration MediaPipe Face Mesh"
                  className="w-full h-auto"
                />
              </div>
              <div
                className="mt-4 p-4 rounded-xl"
                style={{ backgroundColor: '#E8F5F0' }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Visualisation des landmarks MediaPipe
                </p>
                <p
                  className="text-xs"
                  style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Les points verts représentent les 468 landmarks détectés sur votre visage. Les lignes de mesure (en pointillés) indiquent les dimensions calculées pour la classification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How classification works */}
      <section className="py-20" style={{ backgroundColor: '#F0EDE8' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Comment fonctionne la classification ?
            </h2>
            <p
              className="text-base max-w-2xl mx-auto"
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              Notre algorithme calcule 4 mesures clés à partir des landmarks MediaPipe, puis applique des règles de classification pour déterminer votre morphologie.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { step: '01', label: 'Largeur pommettes', desc: 'Distance entre les landmarks 234 et 454 (cheekbones)' },
              { step: '02', label: 'Largeur mâchoire', desc: 'Distance entre les landmarks 172 et 397 (jaw)' },
              { step: '03', label: 'Largeur front', desc: 'Distance entre les landmarks 103 et 332 (forehead)' },
              { step: '04', label: 'Hauteur visage', desc: 'Distance entre les landmarks 10 et 152 (top → chin)' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-5">
                <div
                  className="text-3xl font-bold mb-3 opacity-10"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#0D6E4F' }}
                >
                  {item.step}
                </div>
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color: '#1C2B26', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.label}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8">
            <h3
              className="text-lg font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Règles de classification
            </h3>
            <div className="space-y-4">
              {[
                { shape: 'Ovale', rule: 'Ratio hauteur/largeur ≈ 1.5, mâchoire < pommettes', color: '#0D6E4F' },
                { shape: 'Carré', rule: 'Ratio hauteur/largeur ≈ 1, mâchoire ≈ front ≈ pommettes', color: '#1d4ed8' },
                { shape: 'Rond', rule: 'Ratio hauteur/largeur ≈ 1, mâchoire douce, pommettes larges', color: '#7c3aed' },
                { shape: 'Triangulaire', rule: 'Mâchoire > front (ratio mâchoire/front > 1.1)', color: '#b45309' },
                { shape: 'Diamant', rule: 'Front étroit + mâchoire étroite, pommettes très larges', color: '#be185d' },
              ].map((item) => (
                <div key={item.shape} className="flex items-start gap-4">
                  <div
                    className="w-20 shrink-0 text-xs font-bold px-2 py-1 rounded-full text-center"
                    style={{ backgroundColor: item.color + '15', color: item.color, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.shape}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section id="confidentialite" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#E8F5F0' }}
            >
              <Lock className="w-8 h-8" style={{ color: '#0D6E4F' }} />
            </div>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Votre vie privée, notre priorité
            </h2>
            <p
              className="text-base max-w-2xl mx-auto"
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              MyShape a été conçu dès le départ avec la confidentialité comme principe fondamental, pas comme une fonctionnalité ajoutée après coup.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Shield,
                title: 'Traitement 100% local',
                desc: 'Toute l\'analyse IA se fait directement sur votre appareil. Votre flux vidéo ne quitte jamais votre navigateur.',
              },
              {
                icon: Eye,
                title: 'Aucune image stockée',
                desc: 'Nous ne capturons, ne stockons ni ne transmettons aucune image de votre visage. Jamais.',
              },
              {
                icon: CheckCircle,
                title: 'RGPD compliant',
                desc: 'Nous respectons le Règlement Général sur la Protection des Données. Vos droits sont garantis.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: '#F0EDE8' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#E8F5F0' }}
                >
                  <item.icon className="w-6 h-6" style={{ color: '#0D6E4F' }} />
                </div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* RGPD Accordion */}
          <div
            id="rgpd"
            className="bg-white rounded-2xl p-8"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Politique de confidentialité
            </h3>
            <div className="space-y-0">
              <AccordionItem title="Quelles données collectons-nous ?">
                <p>
                  MyShape ne collecte aucune donnée biométrique. L'analyse de votre visage se fait entièrement en local, dans votre navigateur, sans transmission vers nos serveurs.
                </p>
                <p className="mt-2">
                  Les seules données que nous pouvons collecter, avec votre consentement explicite, sont :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Votre adresse email (si vous choisissez de recevoir vos recommandations)</li>
                  <li>Votre morphologie détectée (associée à votre email, si consentement)</li>
                  <li>Des données d'utilisation anonymisées (pages visitées, temps passé)</li>
                </ul>
              </AccordionItem>

              <AccordionItem title="Comment utilisons-nous vos données ?">
                <p>
                  Votre email est utilisé uniquement pour vous envoyer vos recommandations personnalisées. Nous ne vendons jamais vos données à des tiers.
                </p>
                <p className="mt-2">
                  Les données d'utilisation anonymisées nous permettent d'améliorer notre service. Elles ne contiennent aucune information permettant de vous identifier.
                </p>
              </AccordionItem>

              <AccordionItem title="Vos droits RGPD">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification</strong> : corriger vos données</li>
                  <li><strong>Droit à l'effacement</strong> : supprimer vos données</li>
                  <li><strong>Droit à la portabilité</strong> : exporter vos données</li>
                  <li><strong>Droit d'opposition</strong> : vous opposer au traitement</li>
                </ul>
                <p className="mt-2">
                  Pour exercer ces droits, contactez-nous à : <a href="mailto:rgpd@myshape.fr" style={{ color: '#0D6E4F' }}>rgpd@myshape.fr</a>
                </p>
              </AccordionItem>

              <AccordionItem title="Cookies et traceurs">
                <p>
                  MyShape utilise des cookies essentiels au fonctionnement du site (session, préférences). Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.
                </p>
                <p className="mt-2">
                  Nous utilisons une solution d'analytics respectueuse de la vie privée (Umami Analytics) qui ne dépose aucun cookie et ne collecte pas d'adresses IP.
                </p>
              </AccordionItem>

              <AccordionItem title="Liens affiliés et partenaires">
                <p>
                  MyShape est financé par des liens affiliés vers nos partenaires opticiens (Optical Center, Sensee, EasyVerres). Lorsque vous cliquez sur un lien affilié et effectuez un achat, nous percevons une commission.
                </p>
                <p className="mt-2">
                  Ces liens sont clairement identifiés sur notre site. Cela ne change pas le prix que vous payez.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-20" style={{ backgroundColor: '#F0EDE8' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
            >
              Le projet MyShape
            </h2>
            <p
              className="text-base max-w-2xl mx-auto"
              style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
            >
              MyShape est né d'un constat simple : trouver des lunettes en ligne est difficile sans savoir quelles montures conviennent à sa morphologie. Nous avons créé l'outil que nous aurions voulu avoir.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: '🎯',
                title: 'Notre mission',
                desc: 'Démocratiser l\'accès aux conseils d\'optique personnalisés, habituellement réservés aux visites en magasin.',
              },
              {
                emoji: '🔬',
                title: 'Notre approche',
                desc: 'Combiner l\'IA de pointe (MediaPipe) avec une expertise en optique pour des recommandations précises et pertinentes.',
              },
              {
                emoji: '🌱',
                title: 'Notre engagement',
                desc: 'Rester gratuit, transparent et respectueux de la vie privée. Toujours.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: '#0F1A17' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#E8F5F0' }}
          >
            Prêt à essayer ?
          </h2>
          <p
            className="text-base mb-8"
            style={{ color: 'rgba(232, 245, 240, 0.65)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Découvrez votre morphologie et les lunettes qui vous correspondent en moins d'une minute.
          </p>
          <Link
            href="/essayer"
            className="btn-shimmer inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:scale-105"
            style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
          >
            <Camera className="w-5 h-5" />
            Analyser mon visage
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
