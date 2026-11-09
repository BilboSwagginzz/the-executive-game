import React, { useMemo } from 'react';

interface CashRainProps {
  active: boolean;
}

/**
 * Physical $100 Federal Reserve Note Particle Rain
 * Triggered when a hand score exceeds $10,000 (Massive Combo Shake).
 * Spawns authentic, 3D tumbling American banknotes fluttering down the screen.
 */
export const CashRain: React.FC<CashRainProps> = ({ active }) => {
  const bills = useMemo(() => {
    return Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.8 + 2) % 96}%`,
      delay: `${((i * 0.16) % 2.5).toFixed(2)}s`,
      duration: `${(3.2 + (i % 5) * 0.4).toFixed(1)}s`,
      scale: (0.75 + (i % 4) * 0.1).toFixed(2),
      rotation: `${((i * 27) % 60) - 30}deg`,
    }));
  }, []);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[60] overflow-hidden select-none"
      data-testid="cash-rain"
      aria-hidden="true"
    >
      {bills.map((b) => (
        <div
          key={b.id}
          className="absolute top-0 animate-bill-flutter"
          style={{
            left: b.left,
            animationDelay: b.delay,
            animationDuration: b.duration,
            transform: `scale(${b.scale}) rotate(${b.rotation})`,
          }}
        >
          {/* Detailed Graphic Representation of a crisp physical $100 Bill */}
          <div className="w-32 h-16 sm:w-36 sm:h-18 rounded bg-[#d6dfce] border-2 border-[#375238] shadow-[0_10px_25px_rgba(0,0,0,0.65)] p-1 flex flex-col justify-between text-stone-900 font-serif relative overflow-hidden">
            {/* Guilloche Border */}
            <div className="absolute inset-0.5 rounded border border-[#233c24]/50 pointer-events-none" />

            {/* Top Bar: Federal Reserve Note Header */}
            <div className="flex items-center justify-between text-[7px] leading-tight font-mono text-[#233c24] font-bold px-1 z-10">
              <span>FEDERAL RESERVE NOTE</span>
              <span className="text-emerald-800 font-black">100</span>
            </div>

            {/* Center Area: Franklin Portrait Oval & Green Seal */}
            <div className="flex items-center justify-between px-1 z-10 my-auto">
              <div className="text-[10px] font-black text-[#1e341f] font-mono leading-none">
                $100
              </div>

              {/* Center Portrait Oval */}
              <div className="w-9 h-11 rounded-full border border-[#2d492f] bg-[#e1ebd9] flex items-center justify-center shadow-inner overflow-hidden">
                <span className="text-[9px] font-cinzel font-black text-[#223924]">100</span>
              </div>

              {/* Green Treasury Seal */}
              <div className="w-5 h-5 rounded-full border border-emerald-700 bg-emerald-950/20 flex items-center justify-center text-[7px] text-emerald-900 font-black">
                ★
              </div>
            </div>

            {/* Bottom Bar: Hundred Dollars & Serial */}
            <div className="flex items-center justify-between text-[7px] leading-tight font-mono text-[#233c24] font-bold px-1 z-10">
              <span className="text-[6px] tracking-tight">SERIES 1999 • NJ</span>
              <span className="font-black text-emerald-900">ONE HUNDRED DOLLARS</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
