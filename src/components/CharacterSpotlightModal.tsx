import React, { useState } from 'react';
import { CrewMember } from '../game/types';
import { CharacterAvatar } from './CharacterAvatar';
import { sounds } from '../game/soundEffects';

interface CharacterSpotlightModalProps {
  member: CrewMember | null;
  onClose: () => void;
  onMoveLeft?: (member: CrewMember) => void;
  onMoveRight?: (member: CrewMember) => void;
  onSell?: (member: CrewMember) => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  allowSell?: boolean;
}

const RARITY_COLORS: Record<string, string> = {
  Common: 'border-stone-500 text-stone-300 bg-stone-900',
  Uncommon: 'border-emerald-500 text-emerald-400 bg-emerald-950',
  Rare: 'border-sky-500 text-sky-400 bg-sky-950',
  Legendary: 'border-amber-400 text-amber-300 bg-amber-950 shadow-amber-500/30',
};

export const CharacterSpotlightModal: React.FC<CharacterSpotlightModalProps> = ({
  member,
  onClose,
  onMoveLeft,
  onMoveRight,
  onSell,
  canMoveLeft = false,
  canMoveRight = false,
  allowSell = false,
}) => {
  if (!member) return null;

  // Random quote picker
  const [quoteIndex, setQuoteIndex] = useState<number>(() => {
    const list = member.quotes && member.quotes.length > 0 ? member.quotes : [member.quote];
    return Math.floor(Math.random() * list.length);
  });

  const quotesList = member.quotes && member.quotes.length > 0 ? member.quotes : [member.quote];
  const activeQuote = quotesList[quoteIndex] || member.quote;

  const handleRollAnotherQuote = () => {
    sounds.playCardSelect();
    setQuoteIndex((prev) => {
      if (quotesList.length <= 1) return 0;
      let next = Math.floor(Math.random() * quotesList.length);
      while (next === prev) {
        next = Math.floor(Math.random() * quotesList.length);
      }
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-900 border-4 border-amber-600/90 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-stone-100 flex flex-col items-center text-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close card spotlight"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer text-lg"
        >
          ✕
        </button>

        {/* Top Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-mono-numbers font-bold uppercase tracking-widest text-amber-500 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
            {member.mobRank}
          </span>
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
              RARITY_COLORS[member.rarity] || 'border-stone-600'
            }`}
          >
            {member.rarity}
          </span>
        </div>

        {/* Big Avatar */}
        <div className="my-2 shadow-2xl">
          <CharacterAvatar member={member} size="xl" className="border-4 border-amber-500 shadow-2xl" />
        </div>

        {/* Name & Moniker */}
        <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-400 mt-3 tracking-wide">
          {member.name}
        </h2>
        <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
          "{member.moniker}"
        </div>

        {/* Power Description Card */}
        <div className="w-full bg-stone-950 border-2 border-stone-800 rounded-2xl p-4 my-2 text-left overflow-hidden">
          <div className="text-[10px] font-mono-numbers font-bold uppercase tracking-wider text-amber-500 mb-1">
            CREW ABILITY & SYNERGY
          </div>
          <div className="text-sm font-semibold text-stone-200 leading-snug break-words">
            {member.description}
          </div>
          {member.counter !== undefined && member.counter > 0 && (
            <div className="text-xs font-mono-numbers text-amber-400 font-bold mt-2">
              Scaled Bonus: +{member.counter} Mult
            </div>
          )}
        </div>

        {/* Randomized Show Quote Bubble */}
        <div className="w-full bg-stone-950/70 border border-amber-900/40 rounded-2xl p-4 my-2 relative text-left overflow-hidden">
          <div className="flex items-center justify-end mb-2">
            <button
              type="button"
              onClick={handleRollAnotherQuote}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer flex items-center gap-1"
            >
              <span>Another Quote</span>
              <span>🗣️</span>
            </button>
          </div>
          <blockquote className="text-xs sm:text-sm text-stone-200 italic leading-relaxed break-words font-medium">
            "{activeQuote}"
          </blockquote>
        </div>

        {/* Action Buttons: Reorder or Sell */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
          {onMoveLeft && (
            <button
              type="button"
              disabled={!canMoveLeft}
              onClick={() => onMoveLeft(member)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                canMoveLeft
                  ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-600'
                  : 'bg-stone-950 text-stone-700 border-stone-900 cursor-not-allowed'
              }`}
            >
              ← Move Left
            </button>
          )}

          {onMoveRight && (
            <button
              type="button"
              disabled={!canMoveRight}
              onClick={() => onMoveRight(member)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                canMoveRight
                  ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-600'
                  : 'bg-stone-950 text-stone-700 border-stone-900 cursor-not-allowed'
              }`}
            >
              Move Right →
            </button>
          )}

          {allowSell && onSell && (
            <button
              type="button"
              onClick={() => onSell(member)}
              className="px-4 py-2 bg-red-950 hover:bg-red-800 text-red-200 rounded-xl text-xs font-bold border border-red-500 cursor-pointer transition-colors uppercase tracking-wider"
              title="Whack / Sever Ties: Costs $2 cleanup fee"
            >
              Whack (-$2 fee)
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            Back to Table
          </button>
        </div>
      </div>
    </div>
  );
};
