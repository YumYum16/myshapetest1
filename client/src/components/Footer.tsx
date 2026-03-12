// MyShape — Footer Component
// Design: Tech-Luxe Émeraude | Fond sombre émeraude, liens clairs

import { Link } from 'wouter';
import { Eye, Shield, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#0F1A17', color: '#E8F5F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0D6E4F' }}>
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#E8F5F0' }}
              >
                MyShape
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#E8F5F0/70', fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}>
              Trouvez les lunettes parfaites pour votre morphologie grâce à l'IA. Analyse locale, aucune photo stockée.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#0D6E4F' }}>
              <Shield className="w-3.5 h-3.5" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>100% local · RGPD compliant</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#E8F5F0', fontFamily: "'DM Sans', sans-serif", opacity: 0.5 }}
            >
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/essayer', label: 'Essayer en live' },
                { href: '/morphologies', label: 'Guide morphologies' },
                { href: '/lunettes', label: 'Catalogue lunettes' },
                { href: '/a-propos', label: 'À propos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(232, 245, 240, 0.65)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partenaires */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#E8F5F0', fontFamily: "'DM Sans', sans-serif", opacity: 0.5 }}
            >
              Partenaires opticiens
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Optical Center', href: 'https://www.opticalcenter.fr' },
                { label: 'Sensee', href: 'https://www.sensee.fr' },
                { label: 'EasyVerres', href: 'https://www.easyverres.com' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1.5 transition-colors hover:text-white"
                    style={{ color: 'rgba(232, 245, 240, 0.65)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & RGPD */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#E8F5F0', fontFamily: "'DM Sans', sans-serif", opacity: 0.5 }}
            >
              Informations
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/a-propos', label: 'Notre technologie' },
                { href: '/a-propos#confidentialite', label: 'Confidentialité' },
                { href: '/a-propos#rgpd', label: 'Politique RGPD' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(232, 245, 240, 0.65)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a
                href="mailto:contact@myshape.fr"
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: 'rgba(232, 245, 240, 0.65)', fontFamily: "'DM Sans', sans-serif" }}
              >
                <Mail className="w-4 h-4" />
                contact@myshape.fr
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(232, 245, 240, 0.1)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(232, 245, 240, 0.4)', fontFamily: "'DM Sans', sans-serif" }}
          >
            © {currentYear} MyShape. Tous droits réservés. Les liens vers les opticiens sont des liens affiliés.
          </p>
          <p
            className="text-xs"
            style={{ color: 'rgba(232, 245, 240, 0.4)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Aucune donnée personnelle collectée sans consentement · Traitement 100% local
          </p>
        </div>
      </div>
    </footer>
  );
}
