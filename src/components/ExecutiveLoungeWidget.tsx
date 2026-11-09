import React, { useState } from 'react';
import { LoungeItem } from '../game/types';

interface ExecutiveLoungeWidgetProps {
  loungeItems: LoungeItem[];
  onInspectItem?: (item: LoungeItem) => void;
  onSellItem?: (item: LoungeItem) => void;
  isInShop?: boolean;
}

const RARITY_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  Common: { bg: 'bg-stone-800', text: 'text-stone-300', border: 'border-stone-600' },
  Uncommon: { bg: 'bg-slate-800', text: 'text-cyan-300', border: 'border-cyan-500' },
  Rare: { bg: 'bg-amber-950', text: 'text-amber-300', border: 'border-amber-500' },
  Legendary: { bg: 'bg-gradient-to-r from-amber-700 to-rose-700', text: 'text-amber-100', border: 'border-amber-300' },
};

export const ExecutiveLoungeWidget: React.FC<ExecutiveLoungeWidgetProps> = ({
  loungeItems,
  onInspectItem,
  onSellItem,
  isInShop = false,
}) => {
  const [selectedItem, setSelectedItem] = useState<LoungeItem | null>(null);

  const handleItemClick = (item: LoungeItem) => {
    if (onInspectItem) {
      onInspectItem(item);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <section aria-label="Executive Lounge Stash" className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 bg-stone-950/90 border border-amber-900/60 rounded-xl px-2.5 py-1.5 shadow-md">
        <div className="flex items-center gap-1 text-[10px] font-mono-numbers font-black uppercase tracking-wider text-amber-500 mr-1 shrink-0">
          <span className="text-sm">🥃</span>
          <span className="hidden sm:inline">STASH:</span>
        </div>

        {/* 2 Stash Slots */}
        {[0, 1].map((slotIdx) => {
          const item = loungeItems[slotIdx];

          if (!item) {
            return (
              <div
                key={`empty-slot-${slotIdx}`}
                className="w-20 sm:w-24 h-10 rounded-lg border border-dashed border-stone-800 bg-stone-900/40 flex items-center justify-center text-[9px] font-mono-numbers text-stone-600 select-none"
              >
                {slotIdx === 0 ? 'Empty Pour' : 'Empty Leaf'}
              </div>
            );
          }

          const badge = RARITY_BADGES[item.rarity] || RARITY_BADGES.Common;
          const isWhisky = item.itemType === 'WHISKY';

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="group relative flex items-center gap-1.5 bg-stone-900/95 hover:bg-stone-850 border border-stone-700 hover:border-amber-500 rounded-lg px-2 py-1 cursor-pointer transition-all hover:scale-103 shadow-sm select-none"
              title={`${item.name} (${item.rarity}) - Click to inspect`}
            >
              {/* Icon / Emblem */}
              <div className="relative text-base shrink-0">
                {isWhisky ? '🥃' : '💨'}
                {/* Lit Ember / Glow */}
                <span
                  className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                    isWhisky ? 'bg-amber-400 animate-pulse' : 'bg-rose-500 animate-ping'
                  }`}
                />
              </div>

              {/* Title & Rarity Tag */}
              <div className="flex flex-col leading-tight max-w-[85px] sm:max-w-[110px] overflow-hidden">
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-200 truncate group-hover:text-amber-400">
                  {item.name}
                </span>
                <span
                  className={`text-[8px] font-mono-numbers font-black px-1 rounded uppercase tracking-wider inline-block w-fit border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {item.rarity}
                </span>
              </div>

              {/* Optional Sell Button in Shop */}
              {isInShop && onSellItem && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSellItem(item);
                  }}
                  className="ml-1 text-[8px] font-mono-numbers font-black px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 transition-colors"
                  title="Sell back to the backroom"
                >
                  ${Math.max(1, Math.floor(item.cost / 2))}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Item Modal if clicked without custom onInspectItem */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative bg-stone-900 border-2 border-amber-600 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{selectedItem.itemType === 'WHISKY' ? '🥃' : '💨'}</span>
              <span
                className={`text-[10px] font-mono-numbers font-black px-2 py-0.5 rounded-full border ${
                  RARITY_BADGES[selectedItem.rarity].bg
                } ${RARITY_BADGES[selectedItem.rarity].text} ${RARITY_BADGES[selectedItem.rarity].border}`}
              >
                {selectedItem.rarity.toUpperCase()}
              </span>
            </div>

            <h3 className="font-cinzel text-lg font-bold text-amber-300 leading-snug">
              {selectedItem.name}
            </h3>
            <div className="text-xs text-stone-400 font-mono-numbers mt-0.5">
              {selectedItem.origin}
            </div>

            <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 my-3 text-xs text-amber-200">
              {selectedItem.description}
            </div>

            <p className="text-xs italic text-stone-400 border-l-2 border-amber-600 pl-3 my-2">
              {selectedItem.flavorQuote}
            </p>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="w-full mt-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold border border-stone-600 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
