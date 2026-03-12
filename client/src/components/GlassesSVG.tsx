// MyShape — GlassesSVG Component
// Silhouettes SVG inline pour chaque style de monture
// Design: lignes fines, couleur paramétrable

interface GlassesSVGProps {
  shape: 'round' | 'rectangular' | 'cat-eye' | 'aviator' | 'clubmaster' | 'square' | 'oval';
  color?: string;
  width?: number;
}

export default function GlassesSVG({ shape, color = '#1a1a1a', width = 160 }: GlassesSVGProps) {
  const height = width * 0.45;
  const strokeWidth = width * 0.012;

  const svgProps = {
    width,
    height,
    viewBox: '0 0 160 72',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  };

  switch (shape) {
    case 'round':
      return (
        <svg {...svgProps}>
          {/* Left lens - round */}
          <circle cx="45" cy="36" r="26" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Right lens - round */}
          <circle cx="115" cy="36" r="26" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Bridge */}
          <path d="M71 34 Q80 30 89 34" stroke={color} strokeWidth={strokeWidth} fill="none" />
          {/* Left temple */}
          <path d="M19 28 L4 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Right temple */}
          <path d="M141 28 L156 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Left hinge */}
          <circle cx="19" cy="28" r="2" fill={color} />
          {/* Right hinge */}
          <circle cx="141" cy="28" r="2" fill={color} />
        </svg>
      );

    case 'rectangular':
      return (
        <svg {...svgProps}>
          {/* Left lens - rectangular */}
          <rect x="14" y="18" width="58" height="36" rx="5" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Right lens - rectangular */}
          <rect x="88" y="18" width="58" height="36" rx="5" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Bridge */}
          <path d="M72 34 Q80 30 88 34" stroke={color} strokeWidth={strokeWidth} fill="none" />
          {/* Left temple */}
          <path d="M14 28 L2 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Right temple */}
          <path d="M146 28 L158 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case 'cat-eye':
      return (
        <svg {...svgProps}>
          {/* Left lens - cat-eye */}
          <path d="M14 42 Q14 20 40 16 Q58 14 72 28 Q72 48 50 52 Q28 54 14 42Z" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Right lens - cat-eye */}
          <path d="M88 28 Q102 14 120 16 Q146 20 146 42 Q132 54 110 52 Q88 48 88 28Z" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Bridge */}
          <path d="M72 30 Q80 26 88 30" stroke={color} strokeWidth={strokeWidth} fill="none" />
          {/* Left temple */}
          <path d="M14 42 L2 46" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Right temple */}
          <path d="M146 42 L158 46" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Top accent */}
          <path d="M40 16 L44 10" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" opacity="0.5" />
          <path d="M120 16 L116 10" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" opacity="0.5" />
        </svg>
      );

    case 'aviator':
      return (
        <svg {...svgProps}>
          {/* Left lens - aviator (teardrop) */}
          <path d="M18 24 Q18 16 36 14 Q54 12 58 28 Q60 46 40 54 Q20 56 16 40 Q14 32 18 24Z" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Right lens - aviator */}
          <path d="M102 24 Q106 16 124 14 Q142 12 144 28 Q146 40 140 48 Q120 58 102 50 Q98 42 102 24Z" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Bridge - double bar */}
          <path d="M58 22 Q80 18 102 22" stroke={color} strokeWidth={strokeWidth} fill="none" />
          <path d="M60 28 Q80 24 100 28" stroke={color} strokeWidth={strokeWidth * 0.7} fill="none" opacity="0.6" />
          {/* Left temple */}
          <path d="M18 24 L3 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Right temple */}
          <path d="M142 24 L157 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case 'clubmaster':
      return (
        <svg {...svgProps}>
          {/* Left lens - clubmaster (top thick, bottom thin) */}
          <path d="M14 20 L72 20 L72 44 Q72 54 50 54 Q28 54 14 44 Z" stroke={color} strokeWidth={strokeWidth * 0.6} fill={color + '06'} />
          {/* Top bar left - thick */}
          <path d="M14 20 Q14 14 43 14 Q72 14 72 20" stroke={color} strokeWidth={strokeWidth * 2.5} fill="none" strokeLinecap="round" />
          {/* Right lens */}
          <path d="M88 20 L146 20 L146 44 Q146 54 117 54 Q88 54 88 44 Z" stroke={color} strokeWidth={strokeWidth * 0.6} fill={color + '06'} />
          {/* Top bar right - thick */}
          <path d="M88 20 Q88 14 117 14 Q146 14 146 20" stroke={color} strokeWidth={strokeWidth * 2.5} fill="none" strokeLinecap="round" />
          {/* Bridge */}
          <path d="M72 22 Q80 18 88 22" stroke={color} strokeWidth={strokeWidth} fill="none" />
          {/* Left temple */}
          <path d="M14 22 L2 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Right temple */}
          <path d="M146 22 L158 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case 'square':
      return (
        <svg {...svgProps}>
          {/* Left lens - square */}
          <rect x="14" y="16" width="58" height="40" rx="3" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Right lens - square */}
          <rect x="88" y="16" width="58" height="40" rx="3" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Bridge */}
          <path d="M72 32 Q80 28 88 32" stroke={color} strokeWidth={strokeWidth} fill="none" />
          {/* Left temple */}
          <path d="M14 26 L2 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Right temple */}
          <path d="M146 26 L158 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Corner details */}
          <circle cx="14" cy="16" r="2" fill={color} opacity="0.4" />
          <circle cx="72" cy="16" r="2" fill={color} opacity="0.4" />
          <circle cx="88" cy="16" r="2" fill={color} opacity="0.4" />
          <circle cx="146" cy="16" r="2" fill={color} opacity="0.4" />
        </svg>
      );

    case 'oval':
    default:
      return (
        <svg {...svgProps}>
          {/* Left lens - oval */}
          <ellipse cx="43" cy="36" rx="29" ry="22" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Right lens - oval */}
          <ellipse cx="117" cy="36" rx="29" ry="22" stroke={color} strokeWidth={strokeWidth} fill={color + '08'} />
          {/* Bridge */}
          <path d="M72 32 Q80 28 88 32" stroke={color} strokeWidth={strokeWidth} fill="none" />
          {/* Left temple */}
          <path d="M14 26 L2 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Right temple */}
          <path d="M146 26 L158 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
  }
}
