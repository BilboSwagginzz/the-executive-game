import React, { useState } from 'react';
import { CrewMember, Favor, FrontBusiness, HandLevel, LoungeItem, PokerHandType } from '../game/types';
import { ALL_CREW_MEMBERS, ALL_FAVORS, ALL_FRONT_BUSINESSES, shuffleDeck } from '../game/deckData';
import { getRandomLoungeShopOfferings } from '../game/loungeData';
import { CrewCardView } from './CrewCardView';
import { PhotoRealisticChip } from './PhotoRealisticChip';
import { sounds } from '../game/soundEffects';

interface BackroomShopProps {
  cash: number;
  crew: CrewMember[];
  maxCrew: number;
  consumables: Favor[];
  maxConsumables: number;
  loungeItems: LoungeItem[];
  maxLoungeItems: number;
  handLevels: Record<PokerHandType, HandLevel>;
  onBuyCrew: (crew: CrewMember) => void;
  onSellCrew: (crew: CrewMember) => void;
  onBuyBusiness: (business: FrontBusiness) => void;
  onBuyFavor: (favor: Favor) => void;
  onUseFavor: (favor: Favor) => void;
  onBuyLoungeItem: (item: LoungeItem) => void;
  onSellLoungeItem: (item: LoungeItem) => void;
  onNextRound: () => void;
  onRerollShop: (cost: number) => void;
  onInspectCrew?: (member: CrewMember) => void;
}

const RARITY_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  Common: { bg: 'bg-stone-800', text: 'text-stone-300', border: 'border-stone-600' },
  Uncommon: { bg: 'bg-slate-800', text: 'text-cyan-300', border: 'border-cyan-500' },
  Rare: { bg: 'bg-amber-950', text: 'text-amber-300', border: 'border-amber-500' },
  Legendary: { bg: 'bg-gradient-to-r from-amber-700 to-rose-700', text: 'text-amber-100', border: 'border-amber-300' },
};

export const BackroomShop: React.FC<BackroomShopProps> = ({
  cash,
  crew,
  maxCrew,
  consumables,
  maxConsumables,
  loungeItems,
  maxLoungeItems,
  handLevels,
  onBuyCrew,
  onSellCrew,
  onBuyBusiness,
  onBuyFavor,
  onBuyLoungeItem,
  onSellLoungeItem,
  onNextRound,
  onRerollShop,
  onInspectCrew,
}) => {
  // Generate random stock on initial mount or reroll
  const [availableCrew, setAvailableCrew] = useState<CrewMember[]>(() => {
    return shuffleDeck(ALL_CREW_MEMBERS.filter((m) => !crew.some((c) => c.id === m.id))).slice(0, 2);
  });

  const [availableBusinesses, setAvailableBusinesses] = useState<FrontBusiness[]>(() => {
    return shuffleDeck(ALL_FRONT_BUSINESSES).slice(0, 2);
  });

  const [availableFavors, setAvailableFavors] = useState<Favor[]>(() => {
    return shuffleDeck(ALL_FAVORS).slice(0, 2);
  });

  const [availableLounge, setAvailableLounge] = useState<LoungeItem[]>(() => {
    return getRandomLoungeShopOfferings(2, loungeItems.map((i) => i.id));
  });

  const [rerollCount, setRerollCount] = useState<number>(0);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  const hasBenny = crew.some((m) => m.passiveType === 'BENNY_MASTERMIND');
  const currentRerollCost = Math.max(1, 5 + rerollCount * 1 - (hasBenny ? 2 : 0));

  const triggerTransaction = (text: string) => {
    setLastTransaction(text);
    setTimeout(() => setLastTransaction(null), 1500);
  };

  const handleReroll = () => {
    if (cash < currentRerollCost) return;
    sounds.playCashChime();
    onRerollShop(currentRerollCost);
    triggerTransaction(`-$${currentRerollCost} (Reroll)`);
    setRerollCount((c) => c + 1);
    setAvailableCrew(shuffleDeck(ALL_CREW_MEMBERS.filter((m) => !crew.some((c) => c.id === m.id))).slice(0, 2));
    setAvailableBusinesses(shuffleDeck(ALL_FRONT_BUSINESSES).slice(0, 2));
    setAvailableFavors(shuffleDeck(ALL_FAVORS).slice(0, 2));
    setAvailableLounge(getRandomLoungeShopOfferings(2, loungeItems.map((i) => i.id)));
  };

  const handleBuyCrew = (member: CrewMember) => {
    if (cash < member.cost || crew.length >= maxCrew) return;
    sounds.playCashChime();
    triggerTransaction(`-$${member.cost}`);
    onBuyCrew(member);
    setAvailableCrew((prev) => prev.filter((m) => m.id !== member.id));
  };

  const handleBuyBusiness = (biz: FrontBusiness) => {
    if (cash < biz.cost) return;
    sounds.playCashChime();
    triggerTransaction(`-$${biz.cost}`);
    onBuyBusiness(biz);
    setAvailableBusinesses((prev) => prev.filter((b) => b.id !== biz.id));
  };

  const handleBuyFavor = (favor: Favor) => {
    if (cash < favor.cost || consumables.length >= maxConsumables) return;
    sounds.playCashChime();
    triggerTransaction(`-$${favor.cost}`);
    onBuyFavor(favor);
    setAvailableFavors((prev) => prev.filter((f) => f.id !== favor.id));
  };

  const handleBuyLounge = (item: LoungeItem) => {
    if (cash < item.cost || loungeItems.length >= maxLoungeItems) return;
    sounds.playCashChime();
    triggerTransaction(`-$${item.cost}`);
    onBuyLoungeItem(item);
    setAvailableLounge((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="fixed inset-0 z-40 bg-stone-950/95 flex flex-col p-4 sm:p-6 overflow-y-auto">
      {/* Top Shop Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4 max-w-7xl w-full mx-auto">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🥩</span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-400">
              Satriale's Backroom Shakedown
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Recruit soldiers, acquire front rackets, stock the executive lounge, and buy favours.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* High Stakes Bankroll & Chip Stacks */}
          <div className="relative bg-stone-900 border-2 border-amber-500/60 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl">
            {/* Visual Photo-Realistic Casino Clay Chips */}
            <div className="flex items-center -space-x-2 drop-shadow-md">
              <PhotoRealisticChip denomination="1K" size="sm" />
              <PhotoRealisticChip denomination="500" size="sm" />
              <PhotoRealisticChip denomination="100" size="sm" />
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-widest block">
                Envelope Bankroll
              </span>
              <span className="text-xl sm:text-2xl font-mono-numbers font-black text-emerald-400">
                ${cash.toLocaleString()}
              </span>
            </div>

            {/* Dynamic floating transaction notification */}
            {lastTransaction && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-mono-numbers font-black px-2 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap">
                {lastTransaction}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onNextRound}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black rounded-xl border border-amber-300 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 text-sm sm:text-base whitespace-nowrap"
          >
            Next Sit-Down &rarr;
          </button>
        </div>
      </div>

      {/* 4-Column Grid: Crew, Businesses, Lounge Stash, Favors */}
      <div className="max-w-7xl w-full mx-auto py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Backroom Protection & Crew (Jokers) */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Backroom Muscle ({crew.length}/{maxCrew})
            </h3>
            <span className="text-xs text-amber-400 font-semibold">Protection Cut</span>
          </div>

          <div className="flex flex-col gap-3 items-center justify-center flex-1 py-1">
            {availableCrew.length === 0 ? (
              <div className="text-xs text-stone-500 text-center py-6">
                All available soldiers locked down or on the street.
              </div>
            ) : (
              availableCrew.map((member) => {
                const canAfford = cash >= member.cost && crew.length < maxCrew;
                return (
                  <div key={member.id} className="flex flex-col items-center w-full">
                    <div className="scale-90 origin-top">
                      <CrewCardView member={member} index={0} onCardClick={onInspectCrew} />
                    </div>
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBuyCrew(member)}
                      className={`mt-1 w-full py-1.5 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border-emerald-500 shadow'
                          : 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      Give Cut &amp; Bring In (${member.cost})
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Front Businesses (Level Up Hands) */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Front Businesses
            </h3>
            <span className="text-xs text-stone-400">Upgrade Hands</span>
          </div>

          <div className="space-y-3 flex-1">
            {availableBusinesses.length === 0 ? (
              <div className="text-xs text-stone-500 text-center py-6">No front rackets available right now.</div>
            ) : (
              availableBusinesses.map((biz) => {
                const currentLevel = handLevels[biz.handType]?.level || 1;
                const canAfford = cash >= biz.cost;
                return (
                  <div
                    key={biz.id}
                    className="bg-stone-950 border border-stone-800 rounded-xl p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-300">{biz.name}</span>
                        <span className="text-[10px] font-mono-numbers text-stone-400">Lvl {currentLevel}</span>
                      </div>
                      <p className="text-[11px] text-stone-300 mt-1 line-clamp-2">{biz.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] font-mono-numbers">
                        <span className="text-sky-400">+{biz.chipsBonus} Chips</span>
                        <span className="text-rose-400">+{biz.multBonus} Mult</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBuyBusiness(biz)}
                      className={`mt-3 py-1.5 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 border-amber-300'
                          : 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      Buy Racket (${biz.cost})
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. The Executive Lounge: Real-Life Whiskies & Cigars */}
        <div className="bg-stone-900/80 border border-amber-900/60 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <span>🥃</span> Lounge Stash ({loungeItems.length}/{maxLoungeItems})
            </h3>
            <span className="text-[10px] uppercase font-bold text-amber-500">Collectibles</span>
          </div>

          <div className="space-y-3 flex-1">
            {availableLounge.length === 0 ? (
              <div className="text-xs text-stone-500 text-center py-6">The bar cart and humidor are dry.</div>
            ) : (
              availableLounge.map((item) => {
                const canAfford = cash >= item.cost && loungeItems.length < maxLoungeItems;
                const badge = RARITY_BADGES[item.rarity] || RARITY_BADGES.Common;
                return (
                  <div
                    key={item.id}
                    className="bg-stone-950 border border-amber-950 rounded-xl p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 truncate max-w-[150px]">
                          <span>{item.itemType === 'WHISKY' ? '🥃' : '💨'}</span>
                          <span className="font-bold text-xs text-stone-100 truncate">{item.name}</span>
                        </div>
                        <span
                          className={`text-[8px] font-mono-numbers font-black px-1.5 py-0.5 rounded border uppercase shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {item.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-200/90 mt-1 line-clamp-2">{item.description}</p>
                      <p className="text-[9px] text-stone-400 italic mt-1 truncate">{item.flavorQuote}</p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBuyLounge(item)}
                      className={`mt-3 py-1.5 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-700 hover:bg-amber-600 text-amber-100 border-amber-400 shadow'
                          : 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      Buy Stash (${item.cost})
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 4. Favors, Bribes & Hits */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Favors ({consumables.length}/{maxConsumables})
            </h3>
            <span className="text-xs text-stone-400">Consumables</span>
          </div>

          <div className="space-y-3 flex-1">
            {availableFavors.length === 0 ? (
              <div className="text-xs text-stone-500 text-center py-6">No favors available right now.</div>
            ) : (
              availableFavors.map((favor) => {
                const canAfford = cash >= favor.cost && consumables.length < maxConsumables;
                return (
                  <div
                    key={favor.id}
                    className="bg-stone-950 border border-stone-800 rounded-xl p-3 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-sky-300 truncate max-w-[150px]">{favor.name}</span>
                        <span className="text-[9px] uppercase font-bold text-stone-400 bg-stone-900 px-1.5 py-0.5 rounded shrink-0">
                          {favor.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300 mt-1 line-clamp-2">{favor.description}</p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBuyFavor(favor)}
                      className={`mt-3 py-1.5 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-sky-800 hover:bg-sky-700 text-sky-100 border-sky-500'
                          : 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      Buy Favor (${favor.cost})
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Reroll & Current Inventory Management */}
      <div className="max-w-7xl w-full mx-auto border-t border-stone-800 pt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={cash < currentRerollCost}
            onClick={handleReroll}
            className={`py-2 px-4 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
              cash >= currentRerollCost
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-600'
                : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
            }`}
          >
            Reroll Backroom Items (${currentRerollCost})
          </button>
          {hasBenny && (
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Benny's Skim Active (-$2)
            </span>
          )}
        </div>

        {/* Existing Inventory Management (Crew & Lounge Items with Sell refunds) */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Active Lounge Stash */}
          {loungeItems.length > 0 && (
            <div className="flex items-center gap-2 border-r border-stone-800 pr-3">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                Lounge Stash:
              </span>
              {loungeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 bg-stone-900 border border-stone-700 px-2 py-1 rounded-lg text-xs"
                >
                  <span>{item.itemType === 'WHISKY' ? '🥃' : '💨'}</span>
                  <span className="text-stone-200 font-semibold">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => onSellLoungeItem(item)}
                    className="ml-1 text-[9px] font-mono-numbers px-1.5 py-0.2 bg-rose-950 text-rose-300 border border-rose-800 rounded hover:bg-rose-900 cursor-pointer"
                    title="Sell item"
                  >
                    Sell +${Math.max(1, Math.floor(item.cost / 2))}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Active Crew Roster */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <div className="flex flex-col shrink-0">
              <span className="text-xs text-stone-300 font-bold uppercase tracking-wider">
                Active Crew:
              </span>
              <span className="text-[9px] text-red-400 font-mono">Whack (-$2 cleanup)</span>
            </div>
            {crew.map((member, idx) => (
              <div key={member.id} className="scale-75 origin-left -mr-4">
                <CrewCardView member={member} index={idx} allowSell onSell={onSellCrew} onCardClick={onInspectCrew} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
