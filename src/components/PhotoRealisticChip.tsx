import React from 'react';

export type ChipDenomination = '1K' | '500' | '100' | '25' | '5';

interface PhotoRealisticChipProps {
  denomination: ChipDenomination;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

interface ChipConfig {
  baseColor: string;
  rimGradient: string;
  spotColor: string;
  spotSecondary?: string;
  innerRingColor: string;
  inlayBg: string;
  textColor: string;
  foilBorder: string;
  displayValue: string;
  label: string;
}

const CHIP_CONFIGS: Record<ChipDenomination, ChipConfig> = {
  '1K': {
    baseColor: '#b45309', // Deep Gold Clay
    rimGradient: 'linear-gradient(135deg, #fef08a 0%, #d97706 40%, #78350f 100%)',
    spotColor: '#fafaf9', // Crisp white edge inserts
    spotSecondary: '#1c1917', // Jet black accents
    innerRingColor: '#92400e',
    inlayBg: 'radial-gradient(circle at 35% 35%, #fffbeb 0%, #fef3c7 45%, #fde68a 80%, #d97706 100%)',
    textColor: '#78350f',
    foilBorder: '#f59e0b',
    displayValue: '$1,000',
    label: 'HIGH ROLLER',
  },
  '500': {
    baseColor: '#6b21a8', // Rich Casino Purple Clay
    rimGradient: 'linear-gradient(135deg, #e9d5ff 0%, #9333ea 40%, #581c87 100%)',
    spotColor: '#f472b6', // Pink edge inserts
    spotSecondary: '#ffffff',
    innerRingColor: '#581c87',
    inlayBg: 'radial-gradient(circle at 35% 35%, #faf5ff 0%, #f3e8ff 45%, #e9d5ff 80%, #a855f7 100%)',
    textColor: '#581c87',
    foilBorder: '#c084fc',
    displayValue: '$500',
    label: 'EXECUTIVE',
  },
  '100': {
    baseColor: '#1c1917', // Matte Black Clay
    rimGradient: 'linear-gradient(135deg, #57534e 0%, #292524 45%, #0c0a09 100%)',
    spotColor: '#f59e0b', // Gold edge inserts
    spotSecondary: '#f5f5f4', // Crisp white tabs
    innerRingColor: '#292524',
    inlayBg: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f5f5f4 50%, #e7e5e4 80%, #d6d3d1 100%)',
    textColor: '#0c0a09',
    foilBorder: '#d97706',
    displayValue: '$100',
    label: 'MOBSTER',
  },
  '25': {
    baseColor: '#15803d', // Casino Forest Green
    rimGradient: 'linear-gradient(135deg, #bbf7d0 0%, #16a34a 45%, #14532d 100%)',
    spotColor: '#f59e0b',
    spotSecondary: '#ffffff',
    innerRingColor: '#14532d',
    inlayBg: 'radial-gradient(circle at 35% 35%, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
    textColor: '#14532d',
    foilBorder: '#22c55e',
    displayValue: '$25',
    label: 'SOLDIER',
  },
  '5': {
    baseColor: '#b91c1c', // Casino Crimson Red
    rimGradient: 'linear-gradient(135deg, #fecaca 0%, #dc2626 45%, #7f1d1d 100%)',
    spotColor: '#ffffff',
    spotSecondary: '#f59e0b',
    innerRingColor: '#7f1d1d',
    inlayBg: 'radial-gradient(circle at 35% 35%, #fef2f2 0%, #fee2e2 50%, #fca5a5 100%)',
    textColor: '#7f1d1d',
    foilBorder: '#ef4444',
    displayValue: '$5',
    label: 'ASSOCIATE',
  },
};

const SIZES = {
  sm: 'w-7 h-7 text-[8px]',
  md: 'w-9 h-9 text-[10px]',
  lg: 'w-12 h-12 text-xs',
};

export const PhotoRealisticChip: React.FC<PhotoRealisticChipProps> = ({
  denomination,
  size = 'md',
  className = '',
  title,
}) => {
  const config = CHIP_CONFIGS[denomination] || CHIP_CONFIGS['100'];
  const sizeClasses = SIZES[size] || SIZES.md;

  return (
    <div
      title={title || `${config.displayValue} ${config.label} Casino Chip`}
      className={`relative rounded-full select-none shrink-0 cursor-default ${sizeClasses} ${className}`}
      style={{
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -2px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.6)',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
        <defs>
          {/* Radial Clay Lighting */}
          <radialGradient id={`clayShine-${denomination}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>

          {/* Inlay Metallic Bevel */}
          <linearGradient id={`inlayBevel-${denomination}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor={config.foilBorder} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.7" />
          </linearGradient>

          {/* Pattern for 6-spot authentic casino edge inserts */}
          <g id={`edgeSpot-${denomination}`}>
            <rect x="44" y="0" width="12" height="15" rx="1.5" fill={config.spotColor} />
            {config.spotSecondary && (
              <rect x="47" y="0" width="6" height="15" fill={config.spotSecondary} />
            )}
          </g>
        </defs>

        {/* 1. Base Clay Ring */}
        <circle cx="50" cy="50" r="49" fill={config.baseColor} stroke="#0a0a0a" strokeWidth="1" />

        {/* 2. Authentic Casino Multi-Spot Edge Inserts (Rotated 60deg intervals) */}
        <use href={`#edgeSpot-${denomination}`} transform="rotate(0 50 50)" />
        <use href={`#edgeSpot-${denomination}`} transform="rotate(60 50 50)" />
        <use href={`#edgeSpot-${denomination}`} transform="rotate(120 50 50)" />
        <use href={`#edgeSpot-${denomination}`} transform="rotate(180 50 50)" />
        <use href={`#edgeSpot-${denomination}`} transform="rotate(240 50 50)" />
        <use href={`#edgeSpot-${denomination}`} transform="rotate(300 50 50)" />

        {/* 3. Outer Rim Bevel Overlay with Ambient Light */}
        <circle cx="50" cy="50" r="49" fill={`url(#clayShine-${denomination})`} />

        {/* 4. Molded Inner Ring with Molded Clay Knurling Grooves */}
        <circle
          cx="50"
          cy="50"
          r="37"
          fill="none"
          stroke="#000000"
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />

        {/* Tactile Edge Knurls (authentic hash marks on rim) */}
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="2.5"
          strokeDasharray="1.5 3.5"
        />

        {/* 5. Center Metallic Foil Inlay */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill={`url(#inlayBevel-${denomination})`}
        />
        <circle
          cx="50"
          cy="50"
          r="26.5"
          fill={config.inlayBg}
        />

        {/* Inlay Concentric Gold Rings */}
        <circle
          cx="50"
          cy="50"
          r="24"
          fill="none"
          stroke={config.foilBorder}
          strokeWidth="0.8"
          strokeOpacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="22.5"
          fill="none"
          stroke={config.foilBorder}
          strokeWidth="0.4"
          strokeDasharray="1 1"
          strokeOpacity="0.6"
        />

        {/* Denomination Typography */}
        <text
          x="50"
          y="48"
          textAnchor="middle"
          dominantBaseline="central"
          fill={config.textColor}
          fontSize="15"
          fontWeight="900"
          fontFamily="'Space Mono', monospace, sans-serif"
          letterSpacing="-0.5"
        >
          {config.displayValue}
        </text>

        {/* Sub-label (Casino Stamp) */}
        <text
          x="50"
          y="61"
          textAnchor="middle"
          fill={config.textColor}
          fontSize="5"
          fontWeight="800"
          fontFamily="'Cinzel', serif"
          letterSpacing="0.8"
          opacity="0.85"
        >
          {config.label}
        </text>

        {/* Micro Casino Stars */}
        <text x="35" y="61" textAnchor="middle" fill={config.foilBorder} fontSize="4">★</text>
        <text x="65" y="61" textAnchor="middle" fill={config.foilBorder} fontSize="4">★</text>

        {/* Specular Glint Highlight on glass inlay */}
        <path
          d="M30 35 Q50 25 70 35 A26.5 26.5 0 0 0 30 35 Z"
          fill="#ffffff"
          opacity="0.25"
        />
      </svg>
    </div>
  );
};
