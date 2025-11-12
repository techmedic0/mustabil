import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();

      if (difference <= 0) {
        if (onExpire) onExpire();
        return { hours: 0, minutes: 0, seconds: 0, total: 0 };
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 36);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds, total: difference };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  const isUrgent = timeLeft.total <= 3600000;
  const isVeryUrgent = timeLeft.total <= 1800000;

  return (
    <div className={`relative rounded-2xl p-6 bg-gradient-to-br ${
      isVeryUrgent
        ? 'from-red-500 via-orange-500 to-red-600'
        : isUrgent
        ? 'from-orange-500 via-yellow-500 to-orange-600'
        : 'from-blue-500 via-cyan-500 to-blue-600'
    } shadow-2xl overflow-hidden`}>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-2xl animate-blob" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-2xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-2xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className={`w-6 h-6 text-white ${isVeryUrgent ? 'animate-pulse' : ''}`} />
          <h3 className="text-white font-bold text-xl">
            {isVeryUrgent ? 'Hurry! Time Almost Up!' : isUrgent ? 'Running Out of Time!' : 'Reservation Expires In'}
          </h3>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 ${
              isVeryUrgent ? 'animate-pulse' : ''
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
              <span className="text-4xl sm:text-5xl font-black text-white relative z-10 tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
            </div>
            <span className="text-white/80 font-semibold text-sm mt-2 uppercase tracking-wider">Hours</span>
          </div>

          <div className={`text-white text-4xl font-black ${isVeryUrgent ? 'animate-pulse' : 'animate-bounce-slow'}`}>
            :
          </div>

          <div className="flex flex-col items-center">
            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 ${
              isVeryUrgent ? 'animate-pulse' : ''
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
              <span className="text-4xl sm:text-5xl font-black text-white relative z-10 tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
            </div>
            <span className="text-white/80 font-semibold text-sm mt-2 uppercase tracking-wider">Minutes</span>
          </div>

          <div className={`text-white text-4xl font-black ${isVeryUrgent ? 'animate-pulse' : 'animate-bounce-slow'}`}>
            :
          </div>

          <div className="flex flex-col items-center">
            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 ${
              isVeryUrgent ? 'animate-pulse' : ''
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
              <span className="text-4xl sm:text-5xl font-black text-white relative z-10 tabular-nums animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <span className="text-white/80 font-semibold text-sm mt-2 uppercase tracking-wider">Seconds</span>
          </div>
        </div>

        {isVeryUrgent && (
          <div className="mt-4 text-center">
            <p className="text-white font-bold text-lg animate-pulse">
              ⚠️ Complete your pickup soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
