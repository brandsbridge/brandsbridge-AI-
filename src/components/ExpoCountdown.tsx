import { useState, useEffect } from 'react';

interface ExpoCountdownProps {
  targetDate: string;
  onExpire?: () => void;
}

const ExpoCountdown = ({ targetDate, onExpire }: ExpoCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpire?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (isExpired) {
    return (
      <div className="text-center">
        <div className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-semibold">
          EXPO IS LIVE NOW!
        </div>
      </div>
    );
  }

  const timeBlocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ];

  return (
    <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
      {timeBlocks.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center"
        >
          <div
            className="relative"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid #D4AF37',
              borderRadius: '12px',
              padding: '12px 16px',
              minWidth: '70px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(212,175,55,0.15)'
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#D4AF37',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1
              }}
            >
              {String(item.value).padStart(2, '0')}
            </div>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#94A3B8',
              marginTop: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpoCountdown;
