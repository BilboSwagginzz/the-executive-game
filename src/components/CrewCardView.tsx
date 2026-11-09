import React from 'react';
import { CrewMember } from '../game/types';
import { CharacterAvatar } from './CharacterAvatar';

interface CrewCardViewProps {
  member: CrewMember;
  index: number;
  isTriggering?: boolean;
  onCardClick?: (member: CrewMember) => void;
  onSell?: (member: CrewMember) => void;
  allowSell?: boolean;
  isDisabled?: boolean;
}

const RARITY_COLORS: Record<string, string> = {
  Common: 'border-stone-500 text-stone-300',
  Uncommon: 'border-emerald-500 text-emerald-400',
  Rare: 'border-sky-500 text-sky-400',
  Legendary: 'border-amber-400 text-amber-300 shadow-amber-500/20',
};

export const CrewCardView: React.FC<CrewCardViewProps> = ({
  member,
  index,
  isTriggering = false,
  onCardClick,
  onSell,
  allowSell = false,
  isDisabled = false,
}) => {
  const rarityBorder = RARITY_COLORS[member.rarity] || 'border-stone-500';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCardClick?.(member);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick?.(member);
        }
      }}
      aria-label={`${member.name}, ${member.mobRank}, ${member.moniker}. Click to view details and quotes.`}
      className={`relative w-26 sm:w-28 h-42 sm:h-48 rounded-xl bg-stone-900 border-2 ${rarityBorder} p-1.5 flex flex-col justify-between transition-all duration-200 card-shadow select-none group cursor-pointer overflow-hidden ${
        isTriggering ? 'scale-110 ring-4 ring-amber-400 -translate-y-2 z-30 bg-stone-800' : 'hover:-translate-y-1.5 hover:ring-2 hover:ring-amber-500/50'
      } ${isDisabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}
    >
      {/* Top Header: Mob Rank & Rarity */}
      <div className="flex items-center justify-between text-[10px] leading-tight w-full px-0.5">
        <span className="font-semibold text-stone-400 truncate max-w-[65px] font-mono-numbers">
          {member.mobRank}
        </span>
        <span className={`text-[9px] uppercase font-bold tracking-wider ${RARITY_COLORS[member.rarity]}`}>
          {member.rarity[0]}
        </span>
      </div>

      {/* Portrait / Visual using CharacterAvatar */}
      <div className="relative w-full h-20 sm:h-24 rounded-lg bg-stone-950 overflow-hidden border border-stone-800 flex items-center justify-center my-0.5 shrink-0">
        <CharacterAvatar member={member} size="md" className="w-full h-full rounded-none border-none" />

        {isTriggering && (
          <div className="absolute inset-0 bg-amber-500/30 animate-pulse pointer-events-none" />
        )}

        {isDisabled && (
          <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center text-[10px] text-red-200 font-bold uppercase tracking-wider text-center p-1">
            WIRED / DISABLED
          </div>
        )}

        {/* Hover info hint */}
        <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-bold text-amber-300 uppercase tracking-widest pointer-events-none">
          Click Info
        </div>
      </div>

      {/* Name */}
      <div className="text-center font-bold text-[11px] sm:text-xs text-stone-100 truncate leading-tight w-full px-0.5">
        {member.name}
      </div>

      {/* Brief Effect or Counter */}
      <div className="text-[9px] text-stone-300 text-center leading-snug line-clamp-2 px-0.5 w-full overflow-hidden break-words">
        {member.counter !== undefined && member.counter > 0 ? (
          <span className="text-amber-400 font-bold font-mono-numbers">+{member.counter} Mult</span>
        ) : (
          member.description
        )}
      </div>

      {/* Whack / Sever Ties Overlay */}
      {allowSell && onSell && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSell(member);
          }}
          aria-label={`Whack ${member.name} (-$2 cleanup fee)`}
          title="Whack / Sever Ties: Costs $2 cleanup fee to clear slot"
          className="absolute -top-2 -right-2 bg-red-950 hover:bg-red-800 text-red-200 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] cursor-pointer transition-transform hover:scale-110 whitespace-nowrap uppercase tracking-wider"
        >
          Whack (-$2)
        </button>
      )}
    </div>
  );
};
