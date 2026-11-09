import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BossBlind, CrewMember } from '../game/types';
import { BADA_BING_CELEBRATION } from '../game/deckData';
import { CharacterAvatar } from './CharacterAvatar';
import { sounds } from '../game/soundEffects';

interface BadaBingCelebrationModalProps {
  season: number;
  boss: BossBlind;
  crew: CrewMember[];
  bonusCash: number;
  onContinue: () => void;
}

export const BadaBingCelebrationModal: React.FC<BadaBingCelebrationModalProps> = ({
  season,
  boss,
  crew,
  bonusCash,
  onContinue,
}) => {
  useEffect(() => {
    sounds.playVictoryFanfare();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-stone-900 border-4 border-amber-500 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col text-stone-100">
        {/* Hero Graphic: Bada Bing Celebration */}
        <div className="relative w-full h-56 sm:h-72 overflow-hidden bg-stone-950">
          <img
            src={BADA_BING_CELEBRATION}
            alt="The Sopranos crew celebrating victory inside the Bada Bing"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />

          {/* Season Cleared Floating Ribbon */}
          <div className="absolute top-4 left-4 bg-amber-500 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider px-3 py-1 rounded-lg shadow-lg">
            Season {season} Crisis Overcome!
          </div>

          {/* Defeated Boss Callout */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-xs uppercase font-mono-numbers font-bold text-amber-400">
                CRISIS SURVIVED: {boss.name}
              </div>
              <h2 className="font-cinzel text-xl sm:text-3xl font-black text-stone-100 drop-shadow">
                CELEBRATING AT THE BADA BING!
              </h2>
            </div>

            <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-mono-numbers font-black text-sm sm:text-base px-3 py-1.5 rounded-xl shadow-lg">
              +${bonusCash} Tribute Envelope
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-stone-300 text-xs sm:text-sm italic text-center max-w-xl mx-auto">
            "You paid the tribute, put down the threat, and kept the family intact. The champagne is flowing and Tony is pouring the Macallan."
          </p>

          {/* Current Crew Lineup Toasting */}
          <div>
            <div className="text-[10px] font-mono-numbers font-bold uppercase tracking-wider text-stone-400 mb-2 text-center">
              Active Crew at the VIP Table ({crew.length}):
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {crew.map((member) => (
                <div
                  key={member.id}
                  className="bg-stone-950 border border-stone-800 rounded-xl p-2 flex items-center gap-2 max-w-[200px]"
                >
                  <CharacterAvatar member={member} size="sm" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-amber-300 truncate">{member.name}</div>
                    <div className="text-[9px] text-stone-400 truncate italic">
                      "{member.quote.slice(0, 35)}..."
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue CTA */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                sounds.playCashChime();
                onContinue();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm sm:text-base rounded-2xl border-2 border-amber-200 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Collect Envelope & Visit Satriale's Shakedown &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
