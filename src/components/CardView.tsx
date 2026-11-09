import React from 'react';
import { Card } from '../game/types';
import { TraditionalCourtArt } from './TraditionalCourtArt';
import { PhotoRealisticCardPips } from './PhotoRealisticCardPips';

interface CardViewProps {
  card: Card;
  isSelected: boolean;
  onToggleSelect: (card: Card) => void;
  isFacedown?: boolean;
  isDebuffed?: boolean;
  isScoringHighlight?: boolean;
  isDrawing?: boolean;
  drawDelay?: number;
  isMucking?: boolean;
  isCenterScoring?: boolean;
  wobbleStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  burstText?: string | null;
  burstColor?: 'chips' | 'mult' | 'cash';
}

const SUIT_SYMBOLS: Record<string, string> = {
  CLUBS: '♣',
  DIAMONDS: '♦',
  HEARTS: '♥',
  SPADES: '♠',
};

const SUIT_COLORS: Record<string, string> = {
  CLUBS: 'text-stone-900',
  DIAMONDS: 'text-rose-600',
  HEARTS: 'text-rose-600',
  SPADES: 'text-stone-900',
};

export const CardView: React.FC<CardViewProps> = ({
  card,
  isSelected,
  onToggleSelect,
  isFacedown = false,
  isDebuffed = false,
  isScoringHighlight = false,
  isDrawing = false,
  drawDelay = 0,
  isMucking = false,
  isCenterScoring = false,
  wobbleStyle,
  style,
  burstText,
  burstColor = 'chips',
}) => {
  const rankDisplay = getRankDisplay(card.rank);
  const suitSymbol = SUIT_SYMBOLS[card.suit];
  const suitColor = SUIT_COLORS[card.suit];
  const isCourtCard = [11, 12, 13].includes(card.rank); // Jack, Queen, King

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect(card);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleSelect(card);
    }
  };

  const combinedStyle: React.CSSProperties = {
    ...(isDrawing || isMucking ? undefined : wobbleStyle),
    ...style,
    ...(isDrawing && drawDelay ? { animationDelay: `${drawDelay}ms` } : {}),
  };

  const animClasses = [
    isMucking ? 'animate-card-muck z-50' : '',
    isDrawing ? 'animate-card-draw' : '',
    isCenterScoring ? 'animate-scoring-levitate' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (isFacedown) {
    return (
      <div className={`relative shrink-0 ${animClasses}`} style={combinedStyle}>
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-label="Facedown card"
          className={`relative w-22 h-34 sm:w-26 sm:h-40 rounded-xl overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-amber-900/80 transition-shadow duration-150 card-shadow flex items-center justify-center cursor-pointer select-none ${
            isSelected ? 'ring-4 ring-amber-400 z-30 shadow-xl shadow-amber-500/40' : 'hover:scale-102 z-10'
          }`}
        >
          <div className="w-[86%] h-[90%] rounded-lg border border-amber-600/40 bg-stone-950/90 flex flex-col items-center justify-center p-2 text-stone-500 shadow-inner">
            <span className="text-xl sm:text-2xl text-amber-500/80">♠</span>
            <span className="text-[9px] uppercase font-bold tracking-widest mt-1 text-amber-600 font-cinzel">
              The Vig
            </span>
          </div>
        </button>
      </div>
    );
  }

  const isConcrete = card.enhancement === 'CONCRETE';
  const isLaundered = card.enhancement === 'LAUNDERED';

  return (
    <div className={`relative shrink-0 ${animClasses}`} style={combinedStyle}>
      {/* Floating Score Burst Particle: upward drifting pop-up text */}
      {burstText && (
        <div
          aria-hidden="true"
          className={`absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-50 animate-burst-float font-mono-numbers font-black text-xs sm:text-sm px-2.5 py-0.5 rounded-full shadow-2xl whitespace-nowrap border ${
            burstColor === 'mult'
              ? 'bg-rose-950 text-rose-300 border-rose-400 shadow-rose-500/50'
              : burstColor === 'cash'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-400 shadow-emerald-500/50'
              : 'bg-sky-950 text-sky-300 border-sky-400 shadow-sky-500/50'
          }`}
        >
          {burstText}
        </div>
      )}

      {/* Card Button: strict overflow-hidden guarantees no numbers or suits hang outside card borders */}
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`${rankDisplay} of ${card.suit}${isConcrete ? ' concrete' : ''}${isLaundered ? ' laundered' : ''}`}
        aria-pressed={isSelected}
        className={`relative w-22 h-34 sm:w-26 sm:h-40 rounded-xl overflow-hidden transition-shadow duration-150 cursor-pointer select-none text-left block ${
          isConcrete
            ? 'bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 text-stone-950 border-2 border-stone-600 shadow-md'
            : 'bg-[#faf8f5] text-stone-900 border border-stone-300 shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.15)]'
        } ${
          isScoringHighlight
            ? 'animate-card-scoring-pulse ring-4 ring-emerald-400 z-50 shadow-2xl shadow-emerald-500/80'
            : isCenterScoring
            ? 'ring-2 ring-amber-400 shadow-xl shadow-amber-500/40 z-30'
            : isSelected
            ? 'ring-4 ring-amber-400 shadow-2xl shadow-amber-500/50 z-30'
            : 'hover:scale-102 z-10'
        } ${isDebuffed ? 'opacity-40 grayscale' : ''}`}
      >
        {/* Photo-Realistic Casino Card Inset Border */}
        <div
          className={`absolute inset-1 sm:inset-1.5 rounded-lg border pointer-events-none z-10 ${
            isCourtCard ? 'border-amber-700/25' : 'border-stone-900/15'
          }`}
        />

        {/* Top-Left Corner: Authentic Casino Rank & Suit Index Left */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col items-center w-4 sm:w-5 leading-none z-20 pointer-events-none select-none">
          <span
            className={`font-serif font-black text-sm sm:text-base tracking-tight leading-none ${
              isConcrete ? 'text-stone-900' : suitColor
            }`}
          >
            {isConcrete ? '■' : rankDisplay}
          </span>
          <span
            className={`text-xs sm:text-sm font-black leading-none mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] ${
              isConcrete ? 'text-stone-700' : suitColor
            }`}
          >
            {isConcrete ? 'C' : suitSymbol}
          </span>
        </div>

        {/* Top-Right Corner: Elegant Gold Chip Value Pip */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20 pointer-events-none select-none">
          <div className="bg-stone-950/90 border border-amber-500/60 text-amber-300 text-[9px] sm:text-[10px] font-mono-numbers font-black px-1 sm:px-1.5 py-0.5 rounded-full shadow-sm leading-none flex items-center justify-center">
            {isConcrete ? '+50' : `+${card.baseChips}`}
          </div>
        </div>

        {/* Center Artwork: High-Fidelity Court Art or Realistic Pip Matrix */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 p-2 sm:p-2.5">
          {isConcrete ? (
            <div className="text-[10px] sm:text-xs font-mono-numbers font-black bg-stone-700 text-stone-100 px-2.5 py-1 rounded uppercase shadow-sm tracking-wider">
              Cement
            </div>
          ) : isCourtCard ? (
            <div className="w-[66%] h-[74%] rounded border border-amber-900/40 bg-[#fdfcfa] shadow-[inset_0_0_6px_rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center p-0.5">
              <TraditionalCourtArt rank={card.rank} suit={card.suit} />
            </div>
          ) : (
            <div className="w-[60%] h-[70%] flex items-center justify-center">
              <PhotoRealisticCardPips rank={card.rank} suit={card.suit} />
            </div>
          )}

          {isLaundered && (
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-mono-numbers font-black text-emerald-950 bg-emerald-300 border border-emerald-500 px-1.5 py-0.2 rounded shadow-sm z-30 whitespace-nowrap">
              +$3 Cash
            </span>
          )}
        </div>

        {/* Bottom-Right Corner: Symmetrical Inverted Corner Rank & Suit */}
        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 flex flex-col items-center w-4 sm:w-5 leading-none rotate-180 z-20 pointer-events-none select-none">
          <span
            className={`font-serif font-black text-sm sm:text-base tracking-tight leading-none ${
              isConcrete ? 'text-stone-900' : suitColor
            }`}
          >
            {isConcrete ? '■' : rankDisplay}
          </span>
          <span
            className={`text-xs sm:text-sm font-black leading-none mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] ${
              isConcrete ? 'text-stone-700' : suitColor
            }`}
          >
            {isConcrete ? 'C' : suitSymbol}
          </span>
        </div>

        {/* Shattered Glass Bullet Hole Debuff Overlay */}
        {isDebuffed && (
          <div
            className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden"
            aria-label="Card debuffed by Boss Blind"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] filter contrast-125"
            >
              <defs>
                <radialGradient id={`crater-${card.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#050505" />
                  <stop offset="45%" stopColor="#1a1a1a" />
                  <stop offset="75%" stopColor="#3d3d3d" />
                  <stop offset="100%" stopColor="#141414" />
                </radialGradient>
                <radialGradient id={`burn-${card.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(15,15,15,0.88)" />
                  <stop offset="60%" stopColor="rgba(40,40,40,0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Gunpowder Scorch Halo */}
              <circle cx="50" cy="50" r="38" fill={`url(#burn-${card.id})`} />

              {/* Spiderweb Glass Fracture Lines */}
              <path
                d="M50 50 L12 8 M50 50 L88 14 M50 50 L94 65 M50 50 L75 92 M50 50 L26 90 M50 50 L6 58 M50 50 L32 18 M50 50 L68 85 M50 50 L85 40 M50 50 L18 78"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="opacity-95"
              />
              <path
                d="M50 50 L11 7 M50 50 L89 13 M50 50 L95 64 M50 50 L76 93 M50 50 L25 91 M50 50 L5 59"
                stroke="#000000"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="opacity-80"
              />

              {/* Concentric Stress Fracture Rings */}
              <path
                d="M32 38 Q48 24 66 36 Q78 52 64 68 Q46 80 34 64 Q22 48 32 38 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeDasharray="4 2"
                className="opacity-85"
              />
              <path
                d="M22 28 Q50 12 78 26 Q92 52 74 78 Q48 94 24 74 Q8 48 22 28 Z"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.2"
                strokeDasharray="6 3"
              />

              {/* Chipped Glass Shards */}
              <polygon points="48,34 56,38 52,44 44,40" fill="rgba(255,255,255,0.4)" stroke="#fff" strokeWidth="0.6" />
              <polygon points="58,48 68,52 62,60 54,54" fill="rgba(255,255,255,0.35)" stroke="#fff" strokeWidth="0.6" />
              <polygon points="36,54 44,62 38,68 32,58" fill="rgba(255,255,255,0.35)" stroke="#fff" strokeWidth="0.6" />

              {/* Deep Penetration Core Crater */}
              <circle cx="50" cy="50" r="14" fill={`url(#crater-${card.id})`} stroke="#111" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="8" fill="#000000" />
              <path d="M42 46 A8 8 0 0 1 54 42" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* DEBUFFED Stamp */}
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-center">
              <span className="bg-red-950/95 border border-red-500 text-red-200 text-[8px] font-mono font-black px-1.5 py-0.5 rounded shadow-lg uppercase tracking-wider scale-95">
                DEBUFFED
              </span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

function getRankDisplay(rank: number): string {
  if (rank <= 10) return String(rank);
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  if (rank === 14) return 'A';
  return '?';
}
