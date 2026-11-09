import React from 'react';

interface HeatMeterProps {
  heat: number;
  className?: string;
}

/**
 * Diegetic FBI Wiretap Cassette Tape UI Component
 * Replaces generic progress bar with authentic 1990s Newark FBI surveillance recorder:
 * - Smoked acrylic tape chassis with corner screws and typed FBI evidence sticker.
 * - Dual spinning spools that accelerate as Heat rises.
 * - Magnetic tape bridge.
 * - At >80% Heat: pulsing red drop-shadow, urgent LED alert, and throbbing vibration to warn of impending raid.
 */
export const HeatMeter: React.FC<HeatMeterProps> = ({ heat, className = '' }) => {
  const isCritical = heat >= 80;
  const isElevated = heat >= 45;

  // Spin speed: speeds up dynamically from 2.8s at 0% down to 0.22s at 100%
  const spinDuration = Math.max(0.22, 2.8 - (heat / 100) * 2.5).toFixed(2);

  // Left vs right spool tape fullness calculation based on heat (tape spooling across)
  const leftTapeRadius = Math.max(16, 26 - (heat / 100) * 10);
  const rightTapeRadius = Math.min(26, 16 + (heat / 100) * 10);

  return (
    <div
      className={`relative w-full rounded-2xl bg-neutral-950 p-2.5 border transition-all duration-300 font-mono-numbers select-none ${
        isCritical
          ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.85)] animate-pulse'
          : isElevated
          ? 'border-amber-600/80 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
          : 'border-neutral-800 shadow-md'
      } ${className}`}
      data-testid="fbi-heat-meter"
    >
      {/* Top Header: Federal Surveillance Metadata */}
      <div className="flex items-center justify-between text-[10px] leading-tight mb-1.5 px-0.5">
        <span className="flex items-center gap-1 font-bold">
          <span className={isCritical ? 'text-red-400 animate-pulse text-xs' : 'text-neutral-400 text-xs'}>
            {isCritical ? '🚨' : isElevated ? '⚠️' : '🕵️'}
          </span>
          <span className={isCritical ? 'text-red-400 font-black tracking-wider' : 'text-neutral-300'}>
            FBI WIRETAP SPOOL
          </span>
        </span>
        <span
          className={`font-mono font-black text-xs ${
            isCritical
              ? 'text-red-400 neon-boss-cut animate-pulse'
              : isElevated
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}
        >
          {heat}% HEAT
        </span>
      </div>

      {/* The Physical Cassette Tape Housing */}
      <div
        className={`relative w-full h-20 rounded-xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-700/80 p-1.5 shadow-inner flex flex-col justify-between overflow-hidden ${
          isCritical ? 'ring-2 ring-red-500/50' : ''
        }`}
      >
        {/* Corner Screws */}
        <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-neutral-600 border border-neutral-700 shadow-sm" />
        <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-neutral-600 border border-neutral-700 shadow-sm" />
        <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full bg-neutral-600 border border-neutral-700 shadow-sm" />
        <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-neutral-600 border border-neutral-700 shadow-sm" />

        {/* Typed FBI Evidence Label Sticker */}
        <div className="mx-auto w-[92%] bg-[#eae6df] border border-neutral-400/80 rounded px-2 py-0.5 shadow-sm flex items-center justify-between text-[8px] sm:text-[9px] text-neutral-900 font-mono font-bold tracking-tight">
          <span className="truncate max-w-[170px] uppercase">
            EVIDENCE • WIRE #NJ-RICO-401
          </span>
          <span className="text-red-700 font-black">
            {isCritical ? '● REC (FAST)' : heat > 0 ? '● REC' : '■ STBY'}
          </span>
        </div>

        {/* Transparent Acrylic Window with Spooling Magnetic Tape */}
        <div className="relative mx-auto w-[82%] h-10 rounded-md bg-neutral-950/90 border border-neutral-700/60 shadow-inner flex items-center justify-around px-3 overflow-hidden">
          {/* Magnetic Brown Tape Bridge */}
          <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-[#3e2517] opacity-80" />

          {/* Left Spool (Supply Reel) */}
          <div className="relative flex items-center justify-center">
            {/* Magnetic Tape Pack */}
            <div
              className="rounded-full bg-[#2b170c] border border-[#4a2b16] transition-all duration-500 shadow-sm"
              style={{ width: `${leftTapeRadius * 2}px`, height: `${leftTapeRadius * 2}px` }}
            />
            {/* White Toothed Hub */}
            <div
              className="absolute w-5 h-5 rounded-full bg-neutral-200 border border-neutral-400 flex items-center justify-center shadow"
              style={{
                animation: `reel-spin ${spinDuration}s linear infinite`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              {/* Hub Teeth Spokes */}
              <div className="absolute w-full h-0.5 bg-neutral-400 rotate-45 pointer-events-none" />
              <div className="absolute w-full h-0.5 bg-neutral-400 -rotate-45 pointer-events-none" />
            </div>
          </div>

          {/* Center Tape Window Counter Ticks */}
          <div className="flex flex-col items-center justify-center gap-0.5 z-10 opacity-70">
            <span className="w-3 h-0.5 bg-neutral-500" />
            <span className="w-2 h-0.5 bg-neutral-600" />
            <span className="w-4 h-0.5 bg-neutral-500" />
          </div>

          {/* Right Spool (Take-Up Reel) */}
          <div className="relative flex items-center justify-center">
            {/* Magnetic Tape Pack */}
            <div
              className="rounded-full bg-[#2b170c] border border-[#4a2b16] transition-all duration-500 shadow-sm"
              style={{ width: `${rightTapeRadius * 2}px`, height: `${rightTapeRadius * 2}px` }}
            />
            {/* White Toothed Hub */}
            <div
              className="absolute w-5 h-5 rounded-full bg-neutral-200 border border-neutral-400 flex items-center justify-center shadow"
              style={{
                animation: `reel-spin ${spinDuration}s linear infinite`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              <div className="absolute w-full h-0.5 bg-neutral-400 rotate-45 pointer-events-none" />
              <div className="absolute w-full h-0.5 bg-neutral-400 -rotate-45 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bottom Roller Cavity & Tape Head Guides */}
        <div className="flex items-center justify-between px-3 text-[7px] text-neutral-500 font-mono">
          <span>SIDE A</span>
          <span className="text-[6px] tracking-wider text-neutral-400">MICRO-MAGNETIC 60 MIN</span>
          <span>NORMAL BIAS</span>
        </div>
      </div>

      {/* Critical Raid Imminent Warning Bar */}
      {isCritical && (
        <div className="mt-1.5 text-center text-[9px] font-mono font-black text-red-400 animate-pulse tracking-wide uppercase bg-red-950/60 rounded px-1.5 py-0.5 border border-red-600/60">
          ⚠️ WIRETAP CRITICAL: FED RAID IMMINENT (80%+) ⚠️
        </div>
      )}
    </div>
  );
};
