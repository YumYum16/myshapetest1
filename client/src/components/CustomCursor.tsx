import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // SVG glasses cursor (30×12px)
  const glassesSVG = `
    <svg width="30" height="12" viewBox="0 0 30 12" xmlns="http://www.w3.org/2000/svg">
      <!-- Left lens -->
      <circle cx="5" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
      <!-- Right lens -->
      <circle cx="25" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
      <!-- Bridge -->
      <line x1="9" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1"/>
    </svg>
  `;

  // Create data URL for cursor
  const cursorUrl = `data:image/svg+xml;base64,${btoa(glassesSVG)}`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Apply custom cursor to clickable elements
    const clickableElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
    
    clickableElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mousedown', handleMouseDown);
      el.addEventListener('mouseup', handleMouseUp);
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clickableElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('mousedown', handleMouseDown);
        el.removeEventListener('mouseup', handleMouseUp);
      });
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Only show on desktop (not mobile/touch)
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  if (isMobile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '30px',
        height: '12px',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.2 : 1}) rotate(${isClicking ? 10 : 0}deg)`,
        transition: 'transform 0.2s ease-out',
        color: isHovering ? '#0D6E4F' : '#1A1A1A',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
      }}
      dangerouslySetInnerHTML={{ __html: glassesSVG }}
    />
  );
}
