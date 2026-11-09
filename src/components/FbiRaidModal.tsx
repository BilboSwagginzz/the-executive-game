import React, { useEffect } from 'react';
import { FbiRaidData } from '../game/types';

interface FbiRaidModalProps {
  data: FbiRaidData;
  onDismiss: () => void;
}

export const FbiRaidModal: React.FC<FbiRaidModalProps> = ({ data, onDismiss }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
      data-testid="fbi-raid-modal"
    >
      <div className="relative w-full max-w-lg bg-neutral-950 border-4 border-red-600 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.7)] animate-siren-strobe text-white">
        {/* Federal Stamp Watermark */}
        <div className="absolute top-3 right-4 rotate-12 border-2 border-red-500/40 text-red-500/40 px-2 py-0.5 text-xs font-mono font-black uppercase tracking-widest pointer-events-none">
          SUBPOENA #NJ-RICO-401
        </div>

        {/* Flashing Siren Badge Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse">
            🚨
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest text-red-400 font-bold uppercase">
              FEDERAL BUREAU OF INVESTIGATION
            </div>
            <h2 className="text-xl sm:text-2xl font-cinzel font-black tracking-wide text-white drop-shadow">
              FEDERAL BACKROOM RAID!
            </h2>
            <div className="text-xs text-neutral-400 font-mono">NEWARK FIELD OFFICE • ORGANIZED CRIME DIVISION</div>
          </div>
        </div>

        {/* Incident Narrative */}
        <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-4 mb-5 text-sm text-neutral-200 leading-relaxed">
          <p className="font-semibold text-red-300 mb-1">
            &quot;FBI! DON&apos;T MOVE! EVERYBODY PUT THEIR HANDS ON THE FELT!&quot;
          </p>
          <p className="text-xs text-neutral-300 mt-1.5">
            Agent Harris and the Newark Task Force just kicked the backroom door off its hinges with a signed federal warrant. Your excessive high-stakes illegal volume tripped wiretap surveillance.
          </p>
        </div>

        {/* Seizure Breakdown */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>SEIZURE ORDER:</span>
            <span className="font-mono text-neutral-300">RICO TITLE 18 U.S.C. § 1963</span>
          </div>

          <div className="flex items-center justify-between py-2 border-y border-neutral-800/80 my-2">
            <span className="text-sm font-medium text-neutral-300">Unregistered Cash Seized:</span>
            <span className="text-2xl font-mono font-black text-red-400 neon-boss-cut">
              -${data.confiscatedCash}
            </span>
          </div>

          <div className="text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Heat Meter Status:</span>
            <span className="text-emerald-400 font-mono font-bold">Reset to 25% (Agents processing logs)</span>
          </div>
        </div>

        {/* Advice / Rule reminder */}
        <div className="text-xs text-neutral-400 mb-6 bg-neutral-900/40 rounded-lg p-2.5 border border-neutral-800/50">
          💡 <span className="text-neutral-300 font-medium">Tip:</span> Use the <span className="text-amber-400 font-bold">&quot;LAY LOW [L]&quot;</span> action or launder your deck to cool federal heat before the wiretap catches you again.
        </div>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          data-testid="fbi-raid-dismiss-button"
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-cinzel font-black tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-[0.98] border border-red-400"
        >
          BRIBE DEPUTY &amp; SCATTER EVIDENCE [Enter]
        </button>
      </div>
    </div>
  );
};
