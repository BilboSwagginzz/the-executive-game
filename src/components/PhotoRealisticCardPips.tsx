import React from 'react';
import { CardRank, Suit } from '../game/types';

interface PhotoRealisticCardPipsProps {
  rank: CardRank;
  suit: Suit;
  className?: string;
}

const SUIT_ICONS: Record<Suit, { char: string; color: string; secondaryColor: string }> = {
  HEARTS: { char: '♥', color: '#dc2626', secondaryColor: '#991b1b' },
  DIAMONDS: { char: '♦', color: '#e11d48', secondaryColor: '#9f1239' },
  SPADES: { char: '♠', color: '#1c1917', secondaryColor: '#44403c' },
  CLUBS: { char: '♣', color: '#1c1917', secondaryColor: '#44403c' },
};

export const PhotoRealisticCardPips: React.FC<PhotoRealisticCardPipsProps> = ({ rank, suit, className = '' }) => {
  const icon = SUIT_ICONS[suit];
  const char = icon.char;
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
  const fillColor = isRed ? '#dc2626' : '#1c1917';

  // Master Ace: Elaborate Engraved Centerpiece
  if (rank === 14) {
    return (
      <div className={`relative flex flex-col items-center justify-center w-full h-full ${className}`}>
        {suit === 'SPADES' ? (
          // Iconic Engraved Master Ace of Spades
          <div className="relative flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 120" className="w-13 h-16 sm:w-16 sm:h-19 drop-shadow-sm">
              <defs>
                <radialGradient id="spadeGlow" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#44403c" />
                  <stop offset="60%" stopColor="#1c1917" />
                  <stop offset="100%" stopColor="#0c0a09" />
                </radialGradient>
              </defs>
              {/* Ornate Filigree Wreath Around Ace */}
              <circle cx="50" cy="52" r="42" fill="none" stroke="#d97706" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
              <circle cx="50" cy="52" r="45" fill="none" stroke="#78716c" strokeWidth="0.4" opacity="0.5" />
              {/* Master Spade Body */}
              <path
                d="M50 14 C47 22 24 48 24 64 C24 76 34 84 45 80 C48 79 49 76 50 74 C51 76 52 79 55 80 C66 84 76 76 76 64 C76 48 53 22 50 14 Z"
                fill="url(#spadeGlow)"
                stroke="#0a0a0a"
                strokeWidth="1.5"
              />
              {/* Spade Pedestal Base */}
              <path
                d="M45 76 L42 96 L58 96 L55 76 Z"
                fill="url(#spadeGlow)"
                stroke="#0a0a0a"
                strokeWidth="1.5"
              />
              {/* Intricate Inner Baroque Line Engraving */}
              <path
                d="M50 24 C48 30 30 50 30 63 C30 72 38 77 46 73"
                fill="none"
                stroke="#f5f5f4"
                strokeWidth="0.9"
                opacity="0.8"
              />
              <path
                d="M50 32 C49 36 36 52 36 62"
                fill="none"
                stroke="#d97706"
                strokeWidth="0.7"
                opacity="0.9"
              />
              {/* Ribbon Label */}
              <text x="50" y="106" textAnchor="middle" fill="#78350f" fontSize="7" fontWeight="900" fontFamily="'Cinzel', serif" letterSpacing="1.5">
                EXECUTIVE
              </text>
            </svg>
          </div>
        ) : (
          // Engraved Red/Black Master Ace
          <div className="relative flex flex-col items-center justify-center">
            <span
              className="text-4xl sm:text-5xl font-black drop-shadow-sm select-none leading-none"
              style={{ color: fillColor }}
            >
              {char}
            </span>
            <span className="text-[7px] sm:text-[8px] font-cinzel font-black tracking-widest text-amber-800 uppercase mt-0.5">
              A C E
            </span>
          </div>
        )}
      </div>
    );
  }

  // Real Casino Playing Card Pip Matrices for 2 - 10
  // Standard 2x4 grid coordinates: (col 1 or 2, row 1 to 5)
  const renderPip = (key: string, inverted = false) => (
    <span
      key={key}
      className={`text-xs sm:text-sm font-black select-none leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)] ${
        inverted ? 'rotate-180' : ''
      }`}
      style={{ color: fillColor }}
    >
      {char}
    </span>
  );

  return (
    <div className={`relative w-full h-full max-w-[50px] max-h-[76px] sm:max-w-[62px] sm:max-h-[92px] flex flex-col justify-between py-0.5 px-1 ${className}`}>
      {rank === 2 && (
        <div className="flex flex-col items-center justify-between h-full">
          {renderPip('2-top')}
          {renderPip('2-bot', true)}
        </div>
      )}

      {rank === 3 && (
        <div className="flex flex-col items-center justify-between h-full">
          {renderPip('3-top')}
          {renderPip('3-mid')}
          {renderPip('3-bot', true)}
        </div>
      )}

      {rank === 4 && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between">{renderPip('4-tl')}{renderPip('4-tr')}</div>
          <div className="flex justify-between">{renderPip('4-bl', true)}{renderPip('4-br', true)}</div>
        </div>
      )}

      {rank === 5 && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between">{renderPip('5-tl')}{renderPip('5-tr')}</div>
          <div className="flex justify-center">{renderPip('5-mid')}</div>
          <div className="flex justify-between">{renderPip('5-bl', true)}{renderPip('5-br', true)}</div>
        </div>
      )}

      {rank === 6 && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between">{renderPip('6-tl')}{renderPip('6-tr')}</div>
          <div className="flex justify-between">{renderPip('6-ml')}{renderPip('6-mr')}</div>
          <div className="flex justify-between">{renderPip('6-bl', true)}{renderPip('6-br', true)}</div>
        </div>
      )}

      {rank === 7 && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between">{renderPip('7-tl')}{renderPip('7-tr')}</div>
          <div className="flex justify-center -my-1">{renderPip('7-mid-top')}</div>
          <div className="flex justify-between">{renderPip('7-ml')}{renderPip('7-mr')}</div>
          <div className="flex justify-between">{renderPip('7-bl', true)}{renderPip('7-br', true)}</div>
        </div>
      )}

      {rank === 8 && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between">{renderPip('8-tl')}{renderPip('8-tr')}</div>
          <div className="flex justify-center -my-1">{renderPip('8-mid-top')}</div>
          <div className="flex justify-between">{renderPip('8-ml')}{renderPip('8-mr')}</div>
          <div className="flex justify-center -my-1">{renderPip('8-mid-bot', true)}</div>
          <div className="flex justify-between">{renderPip('8-bl', true)}{renderPip('8-br', true)}</div>
        </div>
      )}

      {rank === 9 && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between">{renderPip('9-tl')}{renderPip('9-tr')}</div>
          <div className="flex justify-between">{renderPip('9-ml')}{renderPip('9-mr')}</div>
          <div className="flex justify-center -my-1">{renderPip('9-center')}</div>
          <div className="flex justify-between">{renderPip('9-ml2', true)}{renderPip('9-mr2', true)}</div>
          <div className="flex justify-between">{renderPip('9-bl', true)}{renderPip('9-br', true)}</div>
        </div>
      )}

      {rank === 10 && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between">{renderPip('10-tl')}{renderPip('10-tr')}</div>
          <div className="flex justify-center -my-1">{renderPip('10-mt')}</div>
          <div className="flex justify-between">{renderPip('10-ml')}{renderPip('10-mr')}</div>
          <div className="flex justify-center -my-1">{renderPip('10-mb', true)}</div>
          <div className="flex justify-between">{renderPip('10-bl', true)}{renderPip('10-br', true)}</div>
        </div>
      )}
    </div>
  );
};
