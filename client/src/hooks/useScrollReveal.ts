import { useEffect } from 'react';

/**
 * Bidirectional scroll animation hook (Apple.com style)
 * Elements animate IN on entry, animate OUT on exit
 * Respects prefers-reduced-motion
 */
export function useScrollReveal() {
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element enters viewport → animate IN
            entry.target.classList.add('animate-in');
            entry.target.classList.remove('animate-out');
          } else {
            // Element exits viewport
            const rect = entry.boundingClientRect;
            if (rect.top < 0) {
              // Element exited above viewport → animate OUT upward
              entry.target.classList.add('animate-out');
              entry.target.classList.remove('animate-in');
            } else {
              // Element exited below viewport → reset to initial state
              entry.target.classList.remove('animate-in', 'animate-out');
            }
          }
        });
      },
      { threshold: [0, 0.15] }
    );

    // Observe all elements with data-animate attribute
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}
