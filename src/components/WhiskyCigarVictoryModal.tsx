import React, { useEffect } from 'react';
import { BossBlind, CrewMember } from '../game/types';
import { CIGAR_WHISKY_VICTORY } from '../game/deckData';
import { CharacterAvatar } from './CharacterAvatar';
import { sounds } from '../game/soundEffects';

interface WhiskyCigarVictoryModalProps {
  isBoss: boolean;
  season: number;
  boss?: BossBlind | null;
  crew: CrewMember[];
  basePayout: number;
  leftoverHandsBonus: number;
  interestEarned: number;
  totalPayout: number;
  onContinue: () => void;
}

export const WhiskyCigarVictoryModal: React.FC<WhiskyCigarVictoryModalProps> = ({
  isBoss,
  season,
  boss,
  crew,
  basePayout,
  leftoverHandsBonus,
  interestEarned,
  totalPayout,
  onContinue,
}) => {
  useEffect(() => {
    sounds.playVictoryFanfare();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/92 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-stone-900 border-4 border-amber-600/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col text-stone-100 ring-2 ring-amber-500/30">
        {/* Atmospheric Header: Cigar, Lowball Whisky & Stacks of Cash */}
        <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-stone-950">
          <img
            src={CIGAR_WHISKY_VICTORY}
            alt="Cuban cigar with rising smoke and crystal lowball glass of scotch whisky"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />

          {/* Animated Curling Smoke Tendrils SVG Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              className="w-full h-full opacity-60"
              viewBox="0 0 500 300"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="smokeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="60%" stopColor="rgba(200,200,200,0.3)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <g className="animate-pulse duration-1000">
                <path
                  d="M230 180 Q225 140 235 110 T220 50 Q215 20 225 0"
                  fill="none"
                  stroke="url(#smokeGrad)"
                  strokeWidth="3"
                  className="blur-xs"
                />
                <path
                  d="M235 180 Q245 130 230 90 T240 30"
                  fill="none"
                  stroke="url(#smokeGrad)"
                  strokeWidth="2"
                  className="blur-xs"
                />
              </g>
            </svg>
          </div>

          {/* Floating Season Tag */}
          <div className="absolute top-4 left-4 bg-amber-500 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider px-3 py-1 rounded-lg shadow-lg font-cinzel">
            {isBoss ? `Season ${season} Crisis Settled` : `Sit-Down Cleared · Season ${season}`}
          </div>

          {/* Title Area */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono-numbers font-bold text-amber-400 tracking-widest">
                {isBoss ? `CRISIS OVERCOME: ${boss?.name || 'NEW YORK'}` : 'ENVELOPE SECURED'}
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-stone-100 drop-shadow">
                {isBoss ? 'RESPECT & FAMILY HONOR SECURED' : "THE BOSS'S CUT IS PAID IN FULL"}
              </h2>
            </div>

            <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-mono-numbers font-black text-base sm:text-lg px-3 py-1.5 rounded-xl shadow-lg">
              +${totalPayout} Cash
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-stone-300 text-xs sm:text-sm italic text-center max-w-lg mx-auto">
            {isBoss
              ? '"The crisis has passed. You paid off the debts, held the family together, and the Macallan is poured."'
              : '"Tony opened the envelope, counted every bill, and smiled. Take a breath, light a cigar, and count your cut."'}
          </p>

          {/* Financial Payout Ledger */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono-numbers">
            <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Base Tribute</span>
              <span className="text-amber-300 font-bold text-base sm:text-lg">+${basePayout}</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Leftover Hands</span>
              <span className="text-sky-300 font-bold text-base sm:text-lg">+${leftoverHandsBonus}</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Bankroll Interest</span>
              <span className="text-emerald-300 font-bold text-base sm:text-lg">+${interestEarned}</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Total Envelope</span>
              <span className="text-emerald-400 font-black text-base sm:text-lg">+${totalPayout}</span>
            </div>
          </div>

          {/* Active Soldiers Toasting */}
          <div>
            <div className="text-[10px] font-mono-numbers font-bold uppercase tracking-wider text-stone-400 mb-2 text-center">
              Active Crew at the Table ({crew.length}):
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-h-24 overflow-y-auto py-1">
              {crew.map((member) => (
                <div
                  key={member.id}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 flex items-center gap-2 max-w-[170px]"
                >
                  <CharacterAvatar member={member} size="sm" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-amber-300 truncate">{member.name}</div>
                    <div className="text-[9px] text-stone-400 font-mono-numbers">{member.mobRank}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                sounds.playCashChime();
                onContinue();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm sm:text-base rounded-2xl border-2 border-amber-200 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 whitespace-nowrap font-cinzel"
            >
              Collect ${totalPayout} & Hit Satriale's Shakedown &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
