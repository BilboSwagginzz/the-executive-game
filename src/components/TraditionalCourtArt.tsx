import React from 'react';
import { CardRank, Suit } from '../game/types';

interface TraditionalCourtArtProps {
  rank: CardRank;
  suit: Suit;
  className?: string;
}

export const TraditionalCourtArt: React.FC<TraditionalCourtArtProps> = ({ rank, suit, className = '' }) => {
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
  const primaryColor = isRed ? '#dc2626' : '#1c1917';
  const secondaryColor = isRed ? '#991b1b' : '#334155'; // Rich crimson or royal navy
  const robePatternColor = isRed ? '#fef2f2' : '#f8fafc';
  const goldAccent = '#d97706';
  const goldLight = '#fde68a';
  const faceColor = '#fef3c7';
  const suitChar = suit === 'HEARTS' ? '♥' : suit === 'DIAMONDS' ? '♦' : suit === 'SPADES' ? '♠' : '♣';

  if (rank === 13) {
    // KING: Bearded monarch with crown, royal damask robes, imperial broadsword
    return (
      <svg
        viewBox="0 0 100 130"
        className={`w-full h-full select-none ${className}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`goldBorder-${suit}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>

        {/* Vintage Court Outer Frame */}
        <rect x="6" y="6" width="88" height="118" rx="4" fill="#faf8f5" stroke="#1c1917" strokeWidth="1.2" />
        <rect x="8" y="8" width="84" height="114" rx="2" fill="none" stroke={`url(#goldBorder-${suit})`} strokeWidth="0.8" />

        {/* Reversible Center Divider */}
        <line x1="8" y1="65" x2="92" y2="65" stroke="#78716c" strokeWidth="0.8" strokeDasharray="3 2" />

        {/* TOP HALF: King */}
        <g>
          {/* Royal Cape / Robe Backing */}
          <path
            d="M16 63 L22 28 C28 22 72 22 78 28 L84 63 Z"
            fill={secondaryColor}
            stroke="#1c1917"
            strokeWidth="1.2"
          />
          {/* Damask Robe Stripes */}
          <path d="M28 32 L34 63 M66 32 L60 63" stroke={goldAccent} strokeWidth="1.5" />
          <path d="M38 34 L42 63 M56 34 L52 63" stroke={robePatternColor} strokeWidth="1" strokeDasharray="2 2" />

          {/* Ermine Fur Collar */}
          <path
            d="M26 28 Q50 36 74 28 Q68 44 50 44 Q32 44 26 28 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="1.2"
          />
          {/* Fur Black Tails */}
          <circle cx="36" cy="36" r="1.2" fill="#1c1917" />
          <circle cx="50" cy="38" r="1.2" fill="#1c1917" />
          <circle cx="64" cy="36" r="1.2" fill="#1c1917" />

          {/* King Face */}
          <path
            d="M38 18 C38 13 62 13 62 18 L61 31 C61 35 39 35 39 31 Z"
            fill={faceColor}
            stroke="#1c1917"
            strokeWidth="1"
          />
          {/* Facial Features */}
          <path d="M42 21 L47 21 M53 21 L58 21" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="44.5" cy="23" r="0.9" fill="#1c1917" />
          <circle cx="55.5" cy="23" r="0.9" fill="#1c1917" />
          <path d="M50 22 L48 26 L51 26" fill="none" stroke="#1c1917" strokeWidth="0.9" strokeLinecap="round" />
          {/* Regal Mustache & Flowing Beard */}
          <path
            d="M42 27 Q50 29 58 27 Q53 36 48 36 Q43 36 42 27 Z"
            fill="#f5f5f4"
            stroke="#1c1917"
            strokeWidth="1"
          />

          {/* Imperial Crown */}
          <path
            d="M32 15 L32 9 L41 13 L50 6 L59 13 L68 9 L68 15 Z"
            fill={goldAccent}
            stroke="#78350f"
            strokeWidth="1.3"
          />
          <circle cx="41" cy="13" r="1.6" fill={primaryColor} />
          <circle cx="50" cy="10" r="1.9" fill={goldLight} />
          <circle cx="59" cy="13" r="1.6" fill={primaryColor} />

          {/* Imperial Broadsword held vertically */}
          <rect x="76" y="14" width="3.5" height="49" rx="1" fill="#e2e8f0" stroke="#1c1917" strokeWidth="0.8" />
          <path d="M74 14 L82 14 L78 8 Z" fill={goldAccent} stroke="#1c1917" strokeWidth="0.8" />
          {/* King Hand */}
          <circle cx="77" cy="42" r="3.5" fill={faceColor} stroke="#1c1917" strokeWidth="0.9" />

          {/* Authentic Heraldic Suit Shield */}
          <circle cx="23" cy="48" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="1.2" />
          <text x="23" y="52" textAnchor="middle" fontSize="10" fontWeight="900" fill={primaryColor}>
            {suitChar}
          </text>
        </g>

        {/* BOTTOM HALF: Inverted King */}
        <g transform="rotate(180 50 65)">
          <path
            d="M16 63 L22 28 C28 22 72 22 78 28 L84 63 Z"
            fill={secondaryColor}
            stroke="#1c1917"
            strokeWidth="1.2"
          />
          <path d="M28 32 L34 63 M66 32 L60 63" stroke={goldAccent} strokeWidth="1.5" />
          <path d="M38 34 L42 63 M56 34 L52 63" stroke={robePatternColor} strokeWidth="1" strokeDasharray="2 2" />

          <path
            d="M26 28 Q50 36 74 28 Q68 44 50 44 Q32 44 26 28 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="1.2"
          />
          <circle cx="36" cy="36" r="1.2" fill="#1c1917" />
          <circle cx="50" cy="38" r="1.2" fill="#1c1917" />
          <circle cx="64" cy="36" r="1.2" fill="#1c1917" />

          <path
            d="M38 18 C38 13 62 13 62 18 L61 31 C61 35 39 35 39 31 Z"
            fill={faceColor}
            stroke="#1c1917"
            strokeWidth="1"
          />
          <path d="M42 21 L47 21 M53 21 L58 21" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="44.5" cy="23" r="0.9" fill="#1c1917" />
          <circle cx="55.5" cy="23" r="0.9" fill="#1c1917" />
          <path d="M50 22 L48 26 L51 26" fill="none" stroke="#1c1917" strokeWidth="0.9" strokeLinecap="round" />
          <path
            d="M42 27 Q50 29 58 27 Q53 36 48 36 Q43 36 42 27 Z"
            fill="#f5f5f4"
            stroke="#1c1917"
            strokeWidth="1"
          />

          <path
            d="M32 15 L32 9 L41 13 L50 6 L59 13 L68 9 L68 15 Z"
            fill={goldAccent}
            stroke="#78350f"
            strokeWidth="1.3"
          />
          <circle cx="41" cy="13" r="1.6" fill={primaryColor} />
          <circle cx="50" cy="10" r="1.9" fill={goldLight} />
          <circle cx="59" cy="13" r="1.6" fill={primaryColor} />

          <rect x="76" y="14" width="3.5" height="49" rx="1" fill="#e2e8f0" stroke="#1c1917" strokeWidth="0.8" />
          <path d="M74 14 L82 14 L78 8 Z" fill={goldAccent} stroke="#1c1917" strokeWidth="0.8" />
          <circle cx="77" cy="42" r="3.5" fill={faceColor} stroke="#1c1917" strokeWidth="0.9" />

          <circle cx="23" cy="48" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="1.2" />
          <text x="23" y="52" textAnchor="middle" fontSize="10" fontWeight="900" fill={primaryColor}>
            {suitChar}
          </text>
        </g>
      </svg>
    );
  }

  if (rank === 12) {
    // QUEEN: Regal monarch with veil, golden tiara, royal ermine mantle, holding flower/sceptre
    return (
      <svg
        viewBox="0 0 100 130"
        className={`w-full h-full select-none ${className}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`goldBorderQ-${suit}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>

        <rect x="6" y="6" width="88" height="118" rx="4" fill="#faf8f5" stroke="#1c1917" strokeWidth="1.2" />
        <rect x="8" y="8" width="84" height="114" rx="2" fill="none" stroke={`url(#goldBorderQ-${suit})`} strokeWidth="0.8" />
        <line x1="8" y1="65" x2="92" y2="65" stroke="#78716c" strokeWidth="0.8" strokeDasharray="3 2" />

        {/* TOP HALF: Queen */}
        <g>
          {/* Flowing Mantle */}
          <path
            d="M18 63 C20 30 28 20 50 18 C72 20 80 30 82 63 Z"
            fill={secondaryColor}
            stroke="#1c1917"
            strokeWidth="1.2"
          />
          {/* White Drape Veil */}
          <path
            d="M30 22 C30 15 70 15 70 22 L74 63 L68 63 L66 32 C60 38 40 38 34 32 L32 63 L26 63 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="1"
          />

          {/* Queen Face */}
          <path
            d="M40 20 C40 16 60 16 60 20 L59 34 C59 39 41 39 41 34 Z"
            fill={faceColor}
            stroke="#1c1917"
            strokeWidth="1"
          />
          <path d="M37 20 C37 28 41 32 41 32 M63 20 C63 28 59 32 59 32" stroke="#d97706" strokeWidth="1.2" fill="none" />

          {/* Elegant Eyes and Lips */}
          <path d="M43 23 Q46 22 48 23 M52 23 Q54 22 57 23" stroke="#1c1917" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="45.5" cy="24.5" r="0.8" fill="#1c1917" />
          <circle cx="54.5" cy="24.5" r="0.8" fill="#1c1917" />
          <path d="M50 24 L49 28 L51 28" fill="none" stroke="#1c1917" strokeWidth="0.8" />
          <path d="M47 31 Q50 33 53 31" fill="none" stroke={primaryColor} strokeWidth="1.3" strokeLinecap="round" />

          {/* Golden Tiara */}
          <path
            d="M35 16 L39 10 L50 14 L61 10 L65 16 Z"
            fill={goldAccent}
            stroke="#78350f"
            strokeWidth="1.2"
          />
          <circle cx="50" cy="14" r="1.8" fill={primaryColor} />
          <circle cx="39" cy="12" r="1.4" fill={goldLight} />
          <circle cx="61" cy="12" r="1.4" fill={goldLight} />

          {/* Queen Sceptre / Royal Rose */}
          <line x1="74" y1="28" x2="74" y2="63" stroke={goldAccent} strokeWidth="3" />
          <circle cx="74" cy="26" r="4.5" fill={primaryColor} stroke="#1c1917" strokeWidth="1" />
          <circle cx="74" cy="26" r="2" fill={goldLight} />
          <circle cx="74" cy="48" r="3" fill={faceColor} stroke="#1c1917" strokeWidth="0.9" />

          {/* Suit Badge */}
          <circle cx="23" cy="48" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="1.2" />
          <text x="23" y="52" textAnchor="middle" fontSize="10" fontWeight="900" fill={primaryColor}>
            {suitChar}
          </text>
        </g>

        {/* BOTTOM HALF: Inverted Queen */}
        <g transform="rotate(180 50 65)">
          <path
            d="M18 63 C20 30 28 20 50 18 C72 20 80 30 82 63 Z"
            fill={secondaryColor}
            stroke="#1c1917"
            strokeWidth="1.2"
          />
          <path
            d="M30 22 C30 15 70 15 70 22 L74 63 L68 63 L66 32 C60 38 40 38 34 32 L32 63 L26 63 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="1"
          />

          <path
            d="M40 20 C40 16 60 16 60 20 L59 34 C59 39 41 39 41 34 Z"
            fill={faceColor}
            stroke="#1c1917"
            strokeWidth="1"
          />
          <path d="M37 20 C37 28 41 32 41 32 M63 20 C63 28 59 32 59 32" stroke="#d97706" strokeWidth="1.2" fill="none" />

          <path d="M43 23 Q46 22 48 23 M52 23 Q54 22 57 23" stroke="#1c1917" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="45.5" cy="24.5" r="0.8" fill="#1c1917" />
          <circle cx="54.5" cy="24.5" r="0.8" fill="#1c1917" />
          <path d="M50 24 L49 28 L51 28" fill="none" stroke="#1c1917" strokeWidth="0.8" />
          <path d="M47 31 Q50 33 53 31" fill="none" stroke={primaryColor} strokeWidth="1.3" strokeLinecap="round" />

          <path
            d="M35 16 L39 10 L50 14 L61 10 L65 16 Z"
            fill={goldAccent}
            stroke="#78350f"
            strokeWidth="1.2"
          />
          <circle cx="50" cy="14" r="1.8" fill={primaryColor} />
          <circle cx="39" cy="12" r="1.4" fill={goldLight} />
          <circle cx="61" cy="12" r="1.4" fill={goldLight} />

          <line x1="74" y1="28" x2="74" y2="63" stroke={goldAccent} strokeWidth="3" />
          <circle cx="74" cy="26" r="4.5" fill={primaryColor} stroke="#1c1917" strokeWidth="1" />
          <circle cx="74" cy="26" r="2" fill={goldLight} />
          <circle cx="74" cy="48" r="3" fill={faceColor} stroke="#1c1917" strokeWidth="0.9" />

          <circle cx="23" cy="48" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="1.2" />
          <text x="23" y="52" textAnchor="middle" fontSize="10" fontWeight="900" fill={primaryColor}>
            {suitChar}
          </text>
        </g>
      </svg>
    );
  }

  // JACK (rank === 11): Young knave/knight with feathered beret, checkered collar, ceremonial halberd
  return (
    <svg
      viewBox="0 0 100 130"
      className={`w-full h-full select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`goldBorderJ-${suit}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>

      <rect x="6" y="6" width="88" height="118" rx="4" fill="#faf8f5" stroke="#1c1917" strokeWidth="1.2" />
      <rect x="8" y="8" width="84" height="114" rx="2" fill="none" stroke={`url(#goldBorderJ-${suit})`} strokeWidth="0.8" />
      <line x1="8" y1="65" x2="92" y2="65" stroke="#78716c" strokeWidth="0.8" strokeDasharray="3 2" />

      {/* TOP HALF: Jack */}
      <g>
        {/* Tunic / Doublet */}
        <path
          d="M20 63 L26 32 C32 26 68 26 74 32 L80 63 Z"
          fill={secondaryColor}
          stroke="#1c1917"
          strokeWidth="1.2"
        />
        {/* Checkered Royal Collar */}
        <path
          d="M36 30 L50 36 L64 30 L58 44 L50 48 L42 44 Z"
          fill={goldAccent}
          stroke="#1c1917"
          strokeWidth="1.1"
        />

        {/* Jack Face */}
        <path
          d="M38 18 C38 14 62 14 62 18 L61 32 C61 36 39 36 39 32 Z"
          fill={faceColor}
          stroke="#1c1917"
          strokeWidth="1"
        />
        <path d="M42 22 L46 22 M54 22 L58 22" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="44" cy="24" r="0.9" fill="#1c1917" />
        <circle cx="56" cy="24" r="0.9" fill="#1c1917" />
        <path d="M50 23 L48 27 L51 27" fill="none" stroke="#1c1917" strokeWidth="0.8" />
        <path d="M46 31 Q50 33 54 31" stroke="#1c1917" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* Feathered Renaissance Hat */}
        <path
          d="M30 16 C30 10 70 10 70 16 C64 10 36 10 30 16 Z"
          fill={primaryColor}
          stroke="#1c1917"
          strokeWidth="1.1"
        />
        <path
          d="M28 17 Q50 13 72 17 L70 21 Q50 17 30 21 Z"
          fill={goldLight}
          stroke="#1c1917"
          strokeWidth="1"
        />
        {/* Curled White Plume */}
        <path
          d="M68 15 C78 7 84 1 78 1 C72 1 66 7 66 13"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Ceremonial Halberd Spear */}
        <line x1="77" y1="10" x2="77" y2="63" stroke="#64748b" strokeWidth="2.5" />
        <path d="M77 10 L86 15 L77 22 Z" fill="#e2e8f0" stroke="#1c1917" strokeWidth="1" />
        <circle cx="77" cy="45" r="3" fill={faceColor} stroke="#1c1917" strokeWidth="0.9" />

        {/* Suit Badge */}
        <circle cx="23" cy="48" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="1.2" />
        <text x="23" y="52" textAnchor="middle" fontSize="10" fontWeight="900" fill={primaryColor}>
          {suitChar}
        </text>
      </g>

      {/* BOTTOM HALF: Inverted Jack */}
      <g transform="rotate(180 50 65)">
        <path
          d="M20 63 L26 32 C32 26 68 26 74 32 L80 63 Z"
          fill={secondaryColor}
          stroke="#1c1917"
          strokeWidth="1.2"
        />
        <path
          d="M36 30 L50 36 L64 30 L58 44 L50 48 L42 44 Z"
          fill={goldAccent}
          stroke="#1c1917"
          strokeWidth="1.1"
        />

        <path
          d="M38 18 C38 14 62 14 62 18 L61 32 C61 36 39 36 39 32 Z"
          fill={faceColor}
          stroke="#1c1917"
          strokeWidth="1"
        />
        <path d="M42 22 L46 22 M54 22 L58 22" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="44" cy="24" r="0.9" fill="#1c1917" />
        <circle cx="56" cy="24" r="0.9" fill="#1c1917" />
        <path d="M50 23 L48 27 L51 27" fill="none" stroke="#1c1917" strokeWidth="0.8" />
        <path d="M46 31 Q50 33 54 31" stroke="#1c1917" strokeWidth="1" fill="none" strokeLinecap="round" />

        <path
          d="M30 16 C30 10 70 10 70 16 C64 10 36 10 30 16 Z"
          fill={primaryColor}
          stroke="#1c1917"
          strokeWidth="1.1"
        />
        <path
          d="M28 17 Q50 13 72 17 L70 21 Q50 17 30 21 Z"
          fill={goldLight}
          stroke="#1c1917"
          strokeWidth="1"
        />
        <path
          d="M68 15 C78 7 84 1 78 1 C72 1 66 7 66 13"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        <line x1="77" y1="10" x2="77" y2="63" stroke="#64748b" strokeWidth="2.5" />
        <path d="M77 10 L86 15 L77 22 Z" fill="#e2e8f0" stroke="#1c1917" strokeWidth="1" />
        <circle cx="77" cy="45" r="3" fill={faceColor} stroke="#1c1917" strokeWidth="0.9" />

        <circle cx="23" cy="48" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="1.2" />
        <text x="23" y="52" textAnchor="middle" fontSize="10" fontWeight="900" fill={primaryColor}>
          {suitChar}
        </text>
      </g>
    </svg>
  );
};
