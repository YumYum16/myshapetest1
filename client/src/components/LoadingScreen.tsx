import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Check if loading screen has been shown in this session
    const hasShownLoading = sessionStorage.getItem('myshape-loading-shown');
    
    if (!hasShownLoading) {
      setIsVisible(true);
      sessionStorage.setItem('myshape-loading-shown', 'true');
      
      // Auto-hide after 1.5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const bgColor = theme === 'dark' ? '#0F0F0F' : '#F8F8F6';
  const textColor = theme === 'dark' ? '#F0F0EE' : '#1A1A1A';

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-400"
      style={{
        backgroundColor: bgColor,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Logo */}
      <div
        className="text-5xl font-bold mb-12 animate-fade-in"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: textColor,
        }}
      >
        MyShape
      </div>

      {/* Glasses SVG with sweep animation */}
      <div className="mb-8 w-16 h-16 relative">
        <svg
          viewBox="0 0 64 32"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left lens background */}
          <circle cx="16" cy="16" r="10" fill="none" stroke={textColor} strokeWidth="1.5" opacity="0.3" />
          {/* Right lens background */}
          <circle cx="48" cy="16" r="10" fill="none" stroke={textColor} strokeWidth="1.5" opacity="0.3" />
          {/* Bridge */}
          <line x1="26" y1="16" x2="38" y2="16" stroke={textColor} strokeWidth="1.5" opacity="0.3" />

          {/* Animated left lens fill */}
          <defs>
            <linearGradient id="leftLensFill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={textColor} stopOpacity="0" />
              <stop offset="100%" stopColor={textColor} stopOpacity="1" />
            </linearGradient>
            <linearGradient id="rightLensFill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={textColor} stopOpacity="0" />
              <stop offset="100%" stopColor={textColor} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Left lens fill animation */}
          <circle
            cx="16"
            cy="16"
            r="10"
            fill="none"
            stroke="url(#leftLensFill)"
            strokeWidth="2"
            style={{
              strokeDasharray: '62.8',
              strokeDashoffset: '62.8',
              animation: 'sweep-left 0.4s ease-out 0.2s forwards',
            }}
          />

          {/* Right lens fill animation */}
          <circle
            cx="48"
            cy="16"
            r="10"
            fill="none"
            stroke="url(#rightLensFill)"
            strokeWidth="2"
            style={{
              strokeDasharray: '62.8',
              strokeDashoffset: '62.8',
              animation: 'sweep-right 0.4s ease-out 0.6s forwards',
            }}
          />
        </svg>

        <style>{`
          @keyframes sweep-left {
            from {
              stroke-dashoffset: 62.8;
            }
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes sweep-right {
            from {
              stroke-dashoffset: 62.8;
            }
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes progress-fill {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>

      {/* Progress bar */}
      <div
        className="w-32 h-0.5 rounded-full overflow-hidden"
        style={{ backgroundColor: theme === 'dark' ? '#2C2C2C' : '#E0E0DC' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            backgroundColor: textColor,
            animation: 'progress-fill 1.2s ease-out forwards',
          }}
        />
      </div>
    </div>
  );
}
