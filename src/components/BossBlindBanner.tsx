import React from 'react';
import { BossBlind } from '../game/types';

interface BossBlindBannerProps {
  boss: BossBlind;
  isNeutralized?: boolean;
}

export const BossBlindBanner: React.FC<BossBlindBannerProps> = ({ boss, isNeutralized = false }) => {
  return (
    <div
      className={`w-full max-w-4xl mx-auto mb-3 px-4 py-2.5 rounded-xl border-2 flex flex-wrap items-center justify-between gap-3 shadow-lg select-none transition-all ${
        isNeutralized
          ? 'bg-stone-900/80 border-emerald-500/50 text-stone-400'
          : 'bg-gradient-to-r from-red-950/90 via-stone-950 to-red-950/90 border-red-500/80 text-stone-100 shadow-red-950/40 animate-pulse'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-black text-sm sm:text-base text-red-400">
              BOSS CRISIS: {boss.name}
            </span>
            <span className="text-[10px] uppercase font-mono-numbers font-bold bg-red-900/60 text-red-200 px-2 py-0.5 rounded border border-red-600/50">
              Season {boss.season}
            </span>
            {isNeutralized && (
              <span className="text-[10px] uppercase font-bold bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500">
                Bribed / Neutralized
              </span>
            )}
          </div>
          <p className="text-xs text-stone-300 italic">{boss.subtitle}</p>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs font-bold text-amber-300">{boss.description}</div>
      </div>
    </div>
  );
};
