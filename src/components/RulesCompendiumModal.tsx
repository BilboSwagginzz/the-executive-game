import React from 'react';
import { DEFAULT_HAND_SCORES } from '../game/pokerEvaluator';
import { ALL_CREW_MEMBERS } from '../game/deckData';

interface RulesCompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesCompendiumModal: React.FC<RulesCompendiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-amber-600/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 p-4">
          <div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
              The Executive Game: Mob Rules & Compendium
            </h2>
            <p className="text-xs text-stone-400">
              Run the unsanctioned motel backroom game, kick up to Tony Soprano, manage FBI heat, and survive 6 Seasons.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer text-lg"
            aria-label="Close rules"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: Core Loop */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
            <h3 className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-2">
              1. The Boss&apos;s Cut (Core Scoring Loop)
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed">
              Every round you must kick up <strong className="text-amber-400">The Boss&apos;s Cut</strong> before running out of Hands.
              Scores are calculated like Balatro:
            </p>
            <div className="bg-stone-900 border border-stone-800 rounded-lg p-2.5 my-2 text-center font-mono-numbers text-xs">
              <span className="text-sky-400 font-bold">Total Chips</span> × <span className="text-rose-400 font-bold">Total Mult</span> = <span className="text-emerald-400 font-bold">The Boss&apos;s Cut Envelope Score</span>
            </div>
            <p className="text-stone-400 text-xs">
              Chips come from poker racket rank + Front Businesses. Mult comes from hand base level + active Mob Crew.
            </p>
          </div>

          {/* Section 1B: FBI Wiretap & Heat System */}
          <div className="bg-stone-950 border border-red-900/60 rounded-xl p-4">
            <h3 className="font-bold text-red-400 text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🚨</span> 1B. FBI Wiretap &amp; Heat Meter (0–100%)
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed">
              The Newark FBI Organized Crime Task Force is monitoring your illegal motel backroom game:
            </p>
            <ul className="text-xs text-neutral-300 space-y-1 mt-2 list-disc list-inside">
              <li><strong className="text-red-400">Heat Increases:</strong> Massive hands (Straight/Royal Flush +10%, 4-of-a-Kind +8%, Full House/Flush +4%), violent soldiers (+2%), concrete cards (+5%).</li>
              <li><strong className="text-emerald-400">Heat Cools:</strong> Laundered cards (-8%), skipping shop rerolls (-5%), or using the <strong className="text-amber-400">&quot;LAY LOW [L]&quot;</strong> action button (-25% Heat, fresh draw, 0 cash).</li>
              <li><strong className="text-red-500">100% Heat (FBI Raid):</strong> Federal agents breach the door under RICO, seizing 50% of your bankroll (min $10) and resetting Heat to 25%.</li>
              <li><strong className="text-rose-400">Whack / Sever Ties:</strong> Whacking a crew member to clear a slot returns $0 and costs a $2 cleanup fee.</li>
            </ul>
          </div>

          {/* Section 2: Poker Hands Hierarchy */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
            <h3 className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-2">
              2. Poker Rackets & Base Values
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(DEFAULT_HAND_SCORES).map(([handKey, handInfo]) => (
                <div key={handKey} className="bg-stone-900 p-2 rounded border border-stone-800">
                  <span className="font-semibold text-stone-200 block truncate">{handInfo.name}</span>
                  <span className="text-[11px] font-mono-numbers text-stone-400">
                    <span className="text-sky-400">+{handInfo.chips}</span> × <span className="text-rose-400">+{handInfo.mult}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: The Mob Crew (All 35 Characters) */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-amber-300 text-sm uppercase tracking-wider">
                3. The Mob Crew ({ALL_CREW_MEMBERS.length} Show Characters)
              </h3>
              <span className="text-[10px] text-stone-400 font-mono-numbers">
                Recruit up to 5 · Order matters
              </span>
            </div>
            <p className="text-stone-300 text-xs leading-relaxed mb-3">
              Soldiers and associates provide game-breaking chip, mult, cash, and protection synergies. Click any crew card in-game for authentic show quotes!
            </p>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {ALL_CREW_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="text-xs bg-stone-900/80 p-2 rounded-xl border border-stone-800 flex items-center gap-3"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-9 h-9 rounded-lg object-cover border border-amber-600/60 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-amber-300 truncate">{member.name}</strong>
                      <span className="text-[10px] text-stone-400 font-mono-numbers">({member.moniker})</span>
                    </div>
                    <span className="text-stone-300 text-[11px] line-clamp-2">{member.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Randomized Boss Crises */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
            <h3 className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-2">
              4. Randomized Boss Crises (12 Major Family Threats)
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed">
              Every 3rd blind is a randomized Boss Crisis drawn from 12 iconic threats (Pine Barrens, FBI Wiretap, War with New York, Russian Commando ambush, Executive Game Raid, Davey Scatino Bust-Out, and more). Season 1 boss is randomized every run! Use Bribes or deep crew synergy to survive.
            </p>
          </div>

          {/* Section 5: The Executive Lounge (Whiskies & Cigars) */}
          <div className="bg-stone-950 border border-amber-900/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-amber-300 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <span>🥃</span> 5. The Executive Lounge (Whiskies & Cigars)
              </h3>
              <span className="text-[10px] text-amber-500 font-mono-numbers">2 Stash Slots</span>
            </div>
            <p className="text-stone-300 text-xs leading-relaxed mb-2">
              Collect real-life iconic spirits and cigars in Satriale's backroom across 4 rarity tiers (Common, Uncommon, Rare, Legendary).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                <span className="font-bold text-amber-400 block">🥃 Legendary Whiskies</span>
                <span className="text-stone-300 text-[11px] block mt-0.5">
                  Macallan 25 Sherry Oak (×1.35 Final Mult), Pappy Van Winkle 15 ($10 Interest Cap & +30 Mult), Lagavulin 16 (+6 Mult per Spade).
                </span>
              </div>
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                <span className="font-bold text-amber-400 block">💨 Legendary Cigars</span>
                <span className="text-stone-300 text-[11px] block mt-0.5">
                  Cohiba Behike 52 (+1 Hand Size draw 9 cards, +20 Mult), Arturo Fuente Opus X (+40 Chips), Montecristo No. 2 (+25 Mult on Flushes & Straights).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-800 p-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Got It, Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};
