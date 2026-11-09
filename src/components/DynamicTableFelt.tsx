import React, { useMemo } from 'react';

interface DynamicTableFeltProps {
  screen: 'title' | 'playing' | 'shop' | 'gameover' | 'victory';
  bossRule?: string | null;
  isBossNeutralized?: boolean;
  fbiHeat: number;
  isFbiRaidActive?: boolean;
}

/**
 * Dynamic Environmental Table Lighting System
 * Reacts dynamically to game state:
 * - Normal Play: Warm, dim overhead 1990s brass banker's spotlight with soft radial falloff into smoky room shadows.
 * - Shop / Bada Bing: Pulsing neon pink & violet perimeter light spill from club signage.
 * - Pine Barrens Boss: Cold frosted icy-blue table hue with drifting snow particles.
 * - FBI Raid / Wiretap Boss / >85% Heat: Harsh, slow-sweeping federal police red & blue sirens sweeping across the dark felt.
 */
export const DynamicTableFelt: React.FC<DynamicTableFeltProps> = ({
  screen,
  bossRule,
  isBossNeutralized = false,
  fbiHeat,
  isFbiRaidActive = false,
}) => {
  const isPineBarrens =
    screen === 'playing' && bossRule === 'PINE_BARRENS' && !isBossNeutralized;

  const isFbiEmergency =
    isFbiRaidActive ||
    (screen === 'playing' && bossRule === 'FBI_WIRETAP' && !isBossNeutralized) ||
    (screen === 'playing' && fbiHeat >= 85);

  const isShop = screen === 'shop';

  // Deterministic snowflakes for Pine Barrens
  const snowflakes = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.7 + 2) % 100}%`,
      delay: `${((i * 0.45) % 4).toFixed(1)}s`,
      duration: `${(3.8 + (i % 4) * 0.8).toFixed(1)}s`,
      size: `${(i % 3) * 2 + 2}px`,
      opacity: (0.35 + (i % 5) * 0.12).toFixed(2),
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700 select-none"
      data-testid="dynamic-table-felt"
      aria-hidden="true"
    >
      {/* Base Felt Texture with State-Based Color Tint */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isPineBarrens
            ? 'bg-[#07131e] bg-[radial-gradient(#102c42_15%,transparent_16%),radial-gradient(#05111b_15%,transparent_16%)]'
            : isFbiEmergency
            ? 'bg-[#080d0a] bg-[radial-gradient(#121f18_15%,transparent_16%),radial-gradient(#040705_15%,transparent_16%)]'
            : isShop
            ? 'bg-[#120f1c] bg-[radial-gradient(#26193d_15%,transparent_16%),radial-gradient(#0c0914_15%,transparent_16%)]'
            : 'bg-[#0a2013] bg-[radial-gradient(#133822_15%,transparent_16%),radial-gradient(#06170d_15%,transparent_16%)]'
        }`}
        style={{ backgroundSize: '12px 12px', backgroundPosition: '0 0, 6px 6px' }}
      />

      {/* 1. NORMAL PLAY: Warm Dim Overhead Banker's Spotlight */}
      {!isPineBarrens && !isFbiEmergency && !isShop && (
        <div className="absolute inset-0">
          {/* Overhead warm cone spotlight illuminating center felt */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(217,178,110,0.14)_0%,rgba(16,60,36,0.5)_40%,rgba(3,15,8,0.92)_85%)] transition-opacity duration-700" />
          {/* Subtle mahogany rail shadow vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
        </div>
      )}

      {/* 2. SHOP / BADA BING: Pulsing Neon Pink & Violet Edge Spill */}
      {isShop && (
        <div className="absolute inset-0 transition-opacity duration-700">
          {/* Neon Magenta edge spill from top */}
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-pink-600/25 via-pink-900/10 to-transparent animate-pulse duration-1000" />
          {/* Violet velvet under-glow from bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-purple-700/25 via-purple-950/15 to-transparent animate-pulse duration-700" />
          {/* Ambient Bada Bing neon sign wash */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(236,72,153,0.15)_0%,rgba(147,51,234,0.1)_50%,transparent_85%)]" />
        </div>
      )}

      {/* 3. PINE BARRENS BOSS: Cold Frosted Slate-Blue Felt & Drifting Snow Particles */}
      {isPineBarrens && (
        <div className="absolute inset-0 transition-opacity duration-700">
          {/* Deep freezing winter vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(147,197,253,0.12)_0%,rgba(30,58,95,0.45)_50%,rgba(2,8,15,0.95)_90%)]" />
          {/* Frosted rim borders */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(56,189,248,0.2)]" />

          {/* Drifting Pine Barrens Snowflakes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {snowflakes.map((flake) => (
              <span
                key={flake.id}
                className="absolute rounded-full bg-cyan-100 animate-snow-drift pointer-events-none blur-[0.5px]"
                style={{
                  left: flake.left,
                  top: '-15px',
                  width: flake.size,
                  height: flake.size,
                  opacity: flake.opacity,
                  animationDelay: flake.delay,
                  animationDuration: flake.duration,
                }}
              />
            ))}
          </div>

          {/* Pine Barrens Sub-Zero Status Indicator Banner */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sky-950/80 border border-sky-400/50 text-[10px] text-sky-300 font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            ❄️ SUB-ZERO BLIZZARD • SOUTH JERSEY PINE BARRENS ❄️
          </div>
        </div>
      )}

      {/* 4. FBI EMERGENCY / WIRETAP BOSS / >85% HEAT: Harsh Red & Blue Sweeping Siren Lights */}
      {isFbiEmergency && (
        <div className="absolute inset-0 transition-opacity duration-700">
          {/* Twin sweeping emergency siren beams across dark felt */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Federal Red Searchlight Beam */}
            <div
              className="absolute -top-1/4 -left-1/4 w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.32)_0%,transparent_50%)] animate-siren-searchlight mix-blend-screen"
            />
            {/* Federal Blue Searchlight Beam (offset) */}
            <div
              className="absolute -top-1/4 -left-1/4 w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.32)_0%,transparent_50%)] animate-siren-searchlight mix-blend-screen"
              style={{ animationDelay: '-3s' }}
            />
          </div>

          {/* Harsh Strobe Alert Rim */}
          <div className="absolute inset-0 border-4 border-red-600/40 animate-siren-strobe pointer-events-none" />

          {/* Top Surveillance Status Banner */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-950/85 border border-red-500 text-[10px] text-red-200 font-mono font-black tracking-widest uppercase shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse">
            🚨 ACTIVE FEDERAL WIRETAP INTERCEPT • RICO TASK FORCE 🚨
          </div>
        </div>
      )}
    </div>
  );
};
