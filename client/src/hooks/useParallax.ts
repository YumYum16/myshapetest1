import { useEffect, useRef } from 'react';

export function useParallax(speed: number = 0.5) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  useEffect(() => {
    if (isMobile || !elementRef.current) return;

    const handleScroll = () => {
      if (!elementRef.current) return;
      const scrollY = window.scrollY;
      const offset = scrollY * speed;
      elementRef.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, isMobile]);

  return elementRef;
}
