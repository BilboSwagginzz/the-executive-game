import React, { useEffect } from 'react';
import { BACKROOM_BG, TONY_PORTRAIT } from '../game/deckData';
import { GameDifficulty } from '../game/types';
import { sounds } from '../game/soundEffects';
import { PhotoRealisticChip } from './PhotoRealisticChip';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenRules: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
  difficulty: GameDifficulty;
  onSelectDifficulty: (d: GameDifficulty) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenRules,
  isMuted,
  onToggleMute,
  isCrtEnabled,
  onToggleCrt,
  difficulty,
  onSelectDifficulty,
}) => {
  // Listen for Enter or Space to start, per game guidelines
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sounds.playCashChime();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none">
      {/* Background Illustrated Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={BACKROOM_BG}
          alt="Sopranos illegal poker game in backroom"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
      </div>

      {/* Top Utility Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <img
            src={TONY_PORTRAIT}
            alt="Tony Soprano"
            className="w-10 h-10 rounded-full border-2 border-amber-500 shadow-md object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-amber-500 font-mono-numbers">
              North Jersey Syndicate
            </div>
            <div className="text-xs font-semibold text-stone-300">Satriale's Backroom</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleCrt}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              isCrtEnabled
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : 'bg-stone-900/80 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
            aria-label="Toggle CRT 1999 TV scanline effect"
          >
            CRT 1999: {isCrtEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-stone-900/80 border border-stone-700 text-stone-300 hover:text-amber-400 transition-colors cursor-pointer text-xs"
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? '🔇 Audio Off' : '🔊 Audio On'}
          </button>
        </div>
      </header>

      {/* Hero Center Lockup */}
      <div className="relative z-10 max-w-3xl w-full mx-auto text-center my-auto py-6">
        <div className="inline-block px-3 py-1 rounded bg-amber-950/60 border border-amber-600/40 text-[11px] uppercase tracking-widest text-amber-400 font-mono-numbers mb-3 font-bold">
          A Mob Poker Roguelike Deckbuilder
        </div>

        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] tracking-tight">
          THE EXECUTIVE GAME
        </h1>

        <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-xl mx-auto font-medium">
          You are a rising Capo running an unsanctioned Executive Game in a motel backroom. Every week, Tony Soprano and the Five Families demand their cut. Fail to kick up, or let FBI wiretaps catch you, and you end up in the Meadowlands.
        </p>

        {/* High Stakes Poker Table Atmosphere: Banded Money Stacks & Clay Chips */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono-numbers">
          <div className="flex items-center gap-1.5 bg-stone-950/80 border border-amber-600/50 px-3 py-1.5 rounded-xl shadow-lg">
            <span className="text-base">💵</span>
            <span className="text-emerald-400 font-bold">$10,000 Banded Stacks</span>
          </div>

          <div className="flex items-center gap-2 bg-stone-950/80 border border-amber-600/50 px-3 py-1.5 rounded-xl shadow-lg">
            <div className="flex items-center -space-x-1.5 drop-shadow-md">
              <PhotoRealisticChip denomination="1K" size="sm" />
              <PhotoRealisticChip denomination="500" size="sm" />
              <PhotoRealisticChip denomination="100" size="sm" />
            </div>
            <span className="text-amber-300 font-bold">Executive Clay Chips</span>
          </div>
        </div>

        {/* Stakes / Difficulty Selector */}
        <div className="mt-6 max-w-md mx-auto bg-stone-950/90 border-2 border-stone-800 rounded-2xl p-3">
          <div className="text-[10px] uppercase font-mono-numbers font-bold text-amber-500 tracking-widest mb-2">
            SELECT MOB STAKES (DIFFICULTY)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playCardSelect();
                onSelectDifficulty('ASSOCIATE');
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'ASSOCIATE'
                  ? 'bg-amber-900/80 border-amber-400 text-amber-200 shadow'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="font-bold">Associate</div>
              <div className="text-[9px] text-stone-400 font-normal">Standard Boss Cut</div>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playCardSelect();
                onSelectDifficulty('CAPO');
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'CAPO'
                  ? 'bg-amber-900/80 border-amber-400 text-amber-200 shadow'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="font-bold">Capo</div>
              <div className="text-[9px] text-stone-400 font-normal">+50% Cut (Medium)</div>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playCardSelect();
                onSelectDifficulty('NY_BOSS');
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'NY_BOSS'
                  ? 'bg-red-950 border-red-500 text-red-200 shadow'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="font-bold">NY Boss</div>
              <div className="text-[9px] text-stone-400 font-normal">+120% Cut (Brutal)</div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            data-start="true"
            onClick={() => {
              sounds.playCashChime();
              onStartGame();
            }}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-base sm:text-lg rounded-2xl border-2 border-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.4)] cursor-pointer transition-all hover:scale-105 active:scale-95 whitespace-nowrap font-cinzel tracking-wide"
          >
            SIT DOWN &amp; DEAL [Enter] - Run the Backroom Game
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            className="w-full sm:w-auto px-6 py-4 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-amber-300 font-bold text-sm sm:text-base rounded-2xl border border-stone-700 cursor-pointer transition-colors whitespace-nowrap"
          >
            Mob Rules &amp; Compendium
          </button>
        </div>
      </div>

      {/* Bottom Safe Margin Control Hint */}
      <footer className="relative z-10 text-center text-xs text-stone-400 font-mono-numbers">
        Press Space or Enter to Sit Down · Kick up to the Boss to avoid getting whacked · Watch the FBI Wiretap Heat
      </footer>
    </div>
  );
};
