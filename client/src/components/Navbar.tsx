// MyShape — Navbar Component
// Design: Tech-Luxe Émeraude | Playfair Display + DM Sans
// Transparent → opaque au scroll, CTA émeraude

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Eye } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/#how-it-works', label: 'Comment ça marche' },
    { href: '/morphologies', label: 'Morphologies' },
    { href: '/lunettes', label: 'Lunettes' },
    { href: '/a-propos', label: 'À propos' },
  ];

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return location === '/';
    return location === href;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'border-b'
            : 'bg-transparent'
        }`}
        style={scrolled || menuOpen ? {
          backgroundColor: 'rgba(248, 248, 246, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottomColor: 'rgba(0, 0, 0, 0.06)',
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0D6E4F' }}>
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
              >
                MyShape
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    isActive(link.href)
                      ? 'text-[#0D6E4F]'
                      : 'text-[#1C2B26]/70 hover:text-[#1C2B26]'
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 transition-all duration-300 ${
                      isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{ backgroundColor: '#0D6E4F' }}
                  />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/essayer"
                className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                <Eye className="w-4 h-4" />
                Essayer gratuitement
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: '#1C2B26' }}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#E8F5F0] text-[#0D6E4F]'
                    : 'text-[#1C2B26]/70 hover:bg-gray-50 hover:text-[#1C2B26]'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link
                href="/essayer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                <Eye className="w-4 h-4" />
                Essayer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
