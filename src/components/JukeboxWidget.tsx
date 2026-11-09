import React, { useState, useEffect } from 'react';
import { JUKEBOX_TRACKS, sounds } from '../game/soundEffects';
import { JukeboxTrackId } from '../game/types';

interface JukeboxWidgetProps {
  className?: string;
}

export const JukeboxWidget: React.FC<JukeboxWidgetProps> = ({ className = '' }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeTrack = JUKEBOX_TRACKS[currentTrackIndex];

  useEffect(() => {
    sounds.setJukeboxVolume(volume);
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      sounds.stopJukebox();
      setIsPlaying(false);
    } else {
      sounds.playJukeboxTrack(activeTrack.id);
      setIsPlaying(true);
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    if (isPlaying) {
      sounds.playJukeboxTrack(JUKEBOX_TRACKS[index].id);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % JUKEBOX_TRACKS.length;
    selectTrack(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + JUKEBOX_TRACKS.length) % JUKEBOX_TRACKS.length;
    selectTrack(prevIdx);
  };

  return (
    <div
      className={`relative z-30 transition-all duration-300 font-mono-numbers ${className}`}
      data-testid="tabletop-jukebox"
    >
      {/* Compact Mini Strip */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-600/50 rounded-lg px-2.5 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        {/* Diner Jukebox Emblem */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          title="Holsten's Tabletop Jukebox"
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-cinzel font-bold tracking-wider transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="hidden sm:inline">JUKEBOX</span>
          <span className="text-[10px] text-amber-500/80">#{currentTrackIndex + 1}</span>
        </button>

        {/* Mini Now Playing Label */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer max-w-[130px] sm:max-w-[170px] truncate text-[11px] text-neutral-300 hover:text-white transition-colors"
          title={`${activeTrack.title} - ${activeTrack.artist}`}
        >
          <span className="text-amber-300 font-semibold">{activeTrack.title}</span>
          <span className="text-neutral-500 text-[10px] ml-1">({activeTrack.genre})</span>
        </div>

        {/* Playing Animated Audio Bars */}
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-3 px-1">
            <span className="w-0.5 h-full bg-pink-500 animate-[bounce_0.6s_ease-in-out_infinite]" />
            <span className="w-0.5 h-2 bg-amber-400 animate-[bounce_0.8s_ease-in-out_infinite_0.2s]" />
            <span className="w-0.5 h-2.5 bg-emerald-400 animate-[bounce_0.5s_ease-in-out_infinite_0.4s]" />
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-neutral-700 mx-1" />
        )}

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          data-testid="jukebox-play-toggle"
          aria-label={isPlaying ? 'Pause Jukebox' : 'Play Jukebox'}
          className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 border border-amber-600/40 text-amber-300 flex items-center justify-center text-xs transition-transform active:scale-95 shadow-sm"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Expand / Minimize toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Expand Jukebox Track Selector"
          className="text-neutral-400 hover:text-amber-300 text-xs px-1"
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Expanded Tabletop Selector Menu (Holsten's Chrome Mini-Jukebox style) */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-neutral-950/95 border-2 border-amber-600/70 rounded-xl p-3 shadow-[0_12px_36px_rgba(0,0,0,0.9),0_0_15px_rgba(217,119,6,0.3)] backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-800/40 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 font-cinzel text-xs font-black tracking-widest uppercase">
                Holsten&apos;s Tabletop Seeburg
              </span>
            </div>
            <span className="text-[10px] text-amber-500/60 font-mono tracking-tight">25¢ / SELECTION</span>
          </div>

          {/* Current track description */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-2.5 mb-3 text-left">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-amber-300 tracking-wide">{activeTrack.title}</span>
              <span className="text-[10px] text-amber-600 font-mono">{activeTrack.year}</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">{activeTrack.artist}</div>
            <div className="text-[10px] text-neutral-500 italic mt-1 border-t border-neutral-800/80 pt-1">
              &quot;{activeTrack.vibe}&quot;
            </div>
          </div>

          {/* 4 Tracks Selection Buttons */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {JUKEBOX_TRACKS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => selectTrack(idx)}
                className={`text-left p-1.5 rounded border text-[11px] transition-all ${
                  idx === currentTrackIndex
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.3)] font-semibold'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-600 font-mono">0{idx + 1}</span>
                  {idx === currentTrackIndex && isPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                  )}
                </div>
                <div className="truncate font-medium">{t.title}</div>
                <div className="text-[9px] text-neutral-500 truncate">{t.genre}</div>
              </button>
            ))}
          </div>

          {/* Controls: Prev, Play, Next & Volume */}
          <div className="flex items-center justify-between pt-2 border-t border-amber-900/30 gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Previous Track"
                className="w-7 h-7 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs flex items-center justify-center transition-colors"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-7 h-7 rounded bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center transition-all shadow-[0_0_10px_rgba(245,158,11,0.5)] active:scale-95"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Track"
                className="w-7 h-7 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs flex items-center justify-center transition-colors"
              >
                ⏭
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="text-[10px]">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                aria-label="Jukebox Volume"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
