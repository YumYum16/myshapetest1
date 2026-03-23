import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface FrameBadgesProps {
  frameId: string;
  frameName: string;
}

const BESTSELLERS = ['Ray-Ban Clubmaster', 'Persol PO3007V', 'Warby Parker Beckett'];
const LIMITED_OFFERS = ['Tom Ford FT5304', 'Lindberg Air Titanium'];

export default function FrameBadges({ frameId, frameName }: FrameBadgesProps) {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState<string>('');

  const isBestseller = BESTSELLERS.includes(frameName);
  const hasLimitedOffer = LIMITED_OFFERS.includes(frameName);

  useEffect(() => {
    if (!hasLimitedOffer) return;

    const updateCountdown = () => {
      const now = new Date();
      const storedEndTime = localStorage.getItem(`offer-end-${frameId}`);
      let endTime: Date;

      if (storedEndTime) {
        endTime = new Date(storedEndTime);
        // Reset if past the end time
        if (now > endTime) {
          endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          localStorage.setItem(`offer-end-${frameId}`, endTime.toISOString());
        }
      } else {
        endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        localStorage.setItem(`offer-end-${frameId}`, endTime.toISOString());
      }

      const diff = endTime.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [frameId, hasLimitedOffer]);

  return (
    <div className="space-y-2">
      {isBestseller && (
        <div
          className="inline-block px-2 py-1 rounded-full text-xs font-bold tracking-widest"
          style={{
            backgroundColor: theme === 'dark' ? '#F0F0EE' : '#1A1A1A',
            color: theme === 'dark' ? '#0F0F0F' : '#F8F8F6',
          }}
        >
          BEST-SELLER
        </div>
      )}

      {hasLimitedOffer && timeLeft && (
        <div
          className="text-xs font-semibold"
          style={{
            color: theme === 'dark' ? '#E74C3C' : '#C0392B',
          }}
        >
          🔥 Offre limitée — expire dans {timeLeft}
        </div>
      )}
    </div>
  );
}
