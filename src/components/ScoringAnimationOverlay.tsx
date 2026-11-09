import React, { useEffect, useState } from 'react';
import { ScoreStep } from '../game/types';
import { sounds } from '../game/soundEffects';
import { CashRain } from './CashRain';

interface ScoringAnimationOverlayProps {
  steps: ScoreStep[];
  onComplete: () => void;
  onStepChange?: (step: ScoreStep | null) => void;
}

export const ScoringAnimationOverlay: React.FC<ScoringAnimationOverlayProps> = ({
  steps,
  onComplete,
  onStepChange,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];

  useEffect(() => {
    if (steps.length === 0) {
      onComplete();
      return;
    }

    onStepChange?.(steps[currentStepIndex]);

    // Play appropriate sound effect
    const step = steps[currentStepIndex];
    if (step) {
      if (step.type === 'CARD') {
        sounds.playCardScorePulse(1 + currentStepIndex * 0.12);
      } else if (step.type === 'CREW') {
        sounds.playMultTrigger();
      } else if (step.type === 'LOUNGE') {
        sounds.playCashChime();
      } else if (step.type === 'FINAL') {
        sounds.playCashChime();
      } else {
        sounds.playChipCount(1);
      }
    }

    // Exact staggered delays:
    // Stagger score calculation: 200ms delay between evaluating each card so they trigger sequences sequentially
    const delay =
      step?.type === 'CARD'
        ? 200
        : step?.type === 'FINAL'
        ? 900
        : step?.type === 'CREW'
        ? 450
        : step?.type === 'LOUNGE'
        ? 400
        : 280;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        // Complete
        setTimeout(() => {
          onComplete();
        }, 350);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps, onComplete, onStepChange]);

  const handleSkip = () => {
    sounds.playCashChime();
    onComplete();
  };

  if (!currentStep) return null;

  const currentTotal = currentStep.currentChips * currentStep.currentMult;
  const isMassiveCombo = currentTotal >= 10000;

  return (
    <>
      {/* Physical $100 Bill Particle Burst for Massive Combos (>10,000) */}
      <CashRain active={isMassiveCombo} />

      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-start pt-6 sm:pt-10 px-4">
        {/* Light subtle backdrop that doesn't hide cards */}
        <div
          className="absolute inset-0 bg-stone-950/30 backdrop-blur-[1px] pointer-events-auto"
          onClick={handleSkip}
        />

        {/* Sleek Floating Live Score Counter (positioned high so cards below stay fully visible) */}
        <div
          className={`relative z-10 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-md w-full text-center pointer-events-auto backdrop-blur-md transition-all duration-200 border-2 ${
            isMassiveCombo
              ? 'bg-amber-950/95 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.8)] animate-combo-rumble'
              : 'bg-stone-900/95 border-amber-500/90'
          }`}
        >
          {/* Massive Combo Gold Banner */}
          {isMassiveCombo && (
            <div className="mb-2 py-1 px-3 rounded-lg bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 text-stone-950 font-black text-xs uppercase tracking-widest font-cinzel shadow-lg flex items-center justify-center gap-2">
              <span>★</span>
              <span>MASSIVE JACKPOT COMBO: OVER $10,000!</span>
              <span>★</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
            <span className="truncate max-w-[280px]">{currentStep.sourceName}</span>
            <span className="text-[10px] text-stone-400 font-mono-numbers">
              {currentStepIndex + 1}/{steps.length}
            </span>
          </div>

          {/* Live Calculation: Chips × Mult with Massive Combo Gold Vibration */}
          <div
            className={`flex items-center justify-center gap-3 my-2.5 ${
              isMassiveCombo ? 'animate-combo-rumble' : ''
            }`}
          >
            <div
              className={`px-3.5 py-2 rounded-xl font-mono-numbers font-black text-2xl sm:text-3xl min-w-[105px] border-2 transition-all ${
                isMassiveCombo
                  ? 'bg-yellow-950/95 border-yellow-400 text-yellow-300 neon-gold neon-gold-box'
                  : 'bg-slate-950/95 border-sky-400 text-sky-300 neon-chips-box neon-chips'
              }`}
            >
              {currentStep.currentChips.toLocaleString()}
              <span
                className={`block text-[9px] font-sans font-bold uppercase tracking-wider ${
                  isMassiveCombo ? 'text-yellow-400' : 'text-sky-400'
                }`}
              >
                Chips
              </span>
            </div>

            <span
              className={`text-2xl font-black select-none ${
                isMassiveCombo ? 'text-yellow-300 neon-gold' : 'text-neutral-400'
              }`}
            >
              ×
            </span>

            <div
              className={`px-3.5 py-2 rounded-xl font-mono-numbers font-black text-2xl sm:text-3xl min-w-[105px] border-2 transition-all ${
                isMassiveCombo
                  ? 'bg-yellow-950/95 border-yellow-400 text-yellow-300 neon-gold neon-gold-box'
                  : 'bg-pink-950/95 border-rose-500 text-rose-300 neon-mult-box neon-mult'
              }`}
            >
              {currentStep.currentMult.toLocaleString()}
              <span
                className={`block text-[9px] font-sans font-bold uppercase tracking-wider ${
                  isMassiveCombo ? 'text-yellow-400' : 'text-rose-400'
                }`}
              >
                Mult
              </span>
            </div>
          </div>

          {/* Step Flavor Message */}
          <div className="text-xs sm:text-sm font-semibold text-stone-200 bg-stone-950/90 rounded-lg p-2 my-1.5 border border-stone-800 truncate">
            {currentStep.message}
          </div>

          {/* Total Envelope Preview */}
          <div className="text-xs text-stone-300 font-mono-numbers flex items-center justify-between px-1">
            <span className="font-semibold text-stone-400 uppercase tracking-wide">
              The Boss&apos;s Cut Total:
            </span>
            <span
              className={`font-black text-lg ${
                isMassiveCombo ? 'text-yellow-300 neon-gold text-xl' : 'text-emerald-400 neon-cash'
              }`}
            >
              ${currentTotal.toLocaleString()}
            </span>
          </div>

          {/* Fast-forward Skip */}
          <button
            type="button"
            onClick={handleSkip}
            className="mt-2.5 px-3 py-1 text-[11px] font-bold text-stone-400 hover:text-stone-100 bg-stone-800/80 hover:bg-stone-700 rounded-lg border border-stone-600 transition-colors cursor-pointer"
          >
            Fast Forward (Skip)
          </button>
        </div>
      </div>
    </>
  );
};
