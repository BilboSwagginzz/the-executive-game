import React, { useCallback, useEffect, useState } from 'react';
import {
  BlindType,
  BossBlind,
  Card,
  CrewMember,
  Favor,
  FbiRaidData,
  FrontBusiness,
  GameDifficulty,
  HandEvaluation,
  HandLevel,
  LoungeItem,
  PokerHandType,
  ScoreStep,
} from './game/types';
import { DEFAULT_HAND_SCORES, evaluateHand } from './game/pokerEvaluator';
import { calculateScore, ScoringResult } from './game/scoring';
import {
  ALL_BOSS_BLINDS,
  ALL_CREW_MEMBERS,
  createStandardDeck,
  getRandomBossForSeason,
  getSeasonTargetVig,
  shuffleDeck,
  TONY_PORTRAIT,
} from './game/deckData';
import { ALL_LOUNGE_ITEMS } from './game/loungeData';
import { useCardWobble } from './game/useCardWobble';
import { sounds } from './game/soundEffects';
import { CardView } from './components/CardView';
import { CrewCardView } from './components/CrewCardView';
import { PhotoRealisticChip } from './components/PhotoRealisticChip';
import { ScoringAnimationOverlay } from './components/ScoringAnimationOverlay';
import { BackroomShop } from './components/BackroomShop';
import { BossBlindBanner } from './components/BossBlindBanner';
import { RulesCompendiumModal } from './components/RulesCompendiumModal';
import { TitleScreen } from './components/TitleScreen';
import { CharacterSpotlightModal } from './components/CharacterSpotlightModal';
import { WhiskyCigarVictoryModal } from './components/WhiskyCigarVictoryModal';
import { ExecutiveLoungeWidget } from './components/ExecutiveLoungeWidget';
import { JukeboxWidget } from './components/JukeboxWidget';
import { FbiRaidModal } from './components/FbiRaidModal';
import { CrtScreenShader } from './components/CrtScreenShader';
import { DynamicTableFelt } from './components/DynamicTableFelt';
import { HeatMeter } from './components/HeatMeter';

export type ScreenState = 'title' | 'playing' | 'shop' | 'gameover' | 'victory';

const MAX_HAND_SIZE = 8;
const MAX_SELECTED_CARDS = 5;
const MAX_CREW_SIZE = 5;
const MAX_CONSUMABLES_SIZE = 2;

function initializeDefaultHandLevels(): Record<PokerHandType, HandLevel> {
  const levels = {} as Record<PokerHandType, HandLevel>;
  for (const [key, val] of Object.entries(DEFAULT_HAND_SCORES)) {
    levels[key as PokerHandType] = {
      level: 1,
      chips: val.chips,
      mult: val.mult,
      playedCount: 0,
    };
  }
  return levels;
}

function sortCards(cards: Card[], by: 'rank' | 'suit'): Card[] {
  return [...cards].sort((a, b) => {
    if (by === 'rank') {
      return b.rank - a.rank || a.suit.localeCompare(b.suit);
    }
    return a.suit.localeCompare(b.suit) || b.rank - a.rank;
  });
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('title');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('CAPO');
  const [sortPreference, setSortPreference] = useState<'rank' | 'suit'>('rank');
  const [isCrtEnabled, setIsCrtEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const { getWobbleStyle } = useCardWobble();

  // Modals
  const [spotlightMember, setSpotlightMember] = useState<CrewMember | null>(null);
  const [roundVictoryData, setRoundVictoryData] = useState<{
    isBoss: boolean;
    season: number;
    boss?: BossBlind | null;
    basePayout: number;
    leftoverHandsBonus: number;
    interestEarned: number;
    totalPayout: number;
  } | null>(null);
  const [usedBossIds, setUsedBossIds] = useState<string[]>([]);

  // Run State
  const [season, setSeason] = useState<number>(1);
  const [blindType, setBlindType] = useState<BlindType>('SMALL');
  const [cash, setCash] = useState<number>(10);
  const [birdFeederCash, setBirdFeederCash] = useState<number>(0);
  const [currentVigCollected, setCurrentVigCollected] = useState<number>(0);
  const [handsLeft, setHandsLeft] = useState<number>(4);
  const [discardsLeft, setDiscardsLeft] = useState<number>(3);
  const [maxHands] = useState<number>(4);
  const [maxDiscards] = useState<number>(3);

  // Cards & Decks
  const [drawPile, setDrawPile] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  // Crew (Jokers), Consumables & Executive Lounge Stash
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [consumables, setConsumables] = useState<Favor[]>([]);
  const [loungeItems, setLoungeItems] = useState<LoungeItem[]>(() => [ALL_LOUNGE_ITEMS[0]]);
  const [handLevels, setHandLevels] = useState<Record<PokerHandType, HandLevel>>(initializeDefaultHandLevels);
  const [activeBoss, setActiveBoss] = useState<BossBlind | null>(null);
  const [isBossNeutralized, setIsBossNeutralized] = useState<boolean>(false);
  const [isMattressActive, setIsMattressActive] = useState<boolean>(false);

  // Scoring Animation State
  const [scoringSteps, setScoringSteps] = useState<ScoreStep[] | null>(null);
  const [activeStep, setActiveStep] = useState<ScoreStep | null>(null);
  const [lastScoringResult, setLastScoringResult] = useState<ScoringResult | null>(null);

  // Tactile Card Physics Animation State
  const [muckingCardIds, setMuckingCardIds] = useState<string[]>([]);
  const [drawingCardIds, setDrawingCardIds] = useState<string[]>([]);
  const [isActionLocked, setIsActionLocked] = useState<boolean>(false);

  // End-of-Run Snapshot
  const [finalStats, setFinalStats] = useState<{
    bestHandScore: number;
    totalHandsPlayed: number;
    seasonReached: number;
  }>({
    bestHandScore: 0,
    totalHandsPlayed: 0,
    seasonReached: 1,
  });

  // FBI Heat Meter & Finale State
  const [fbiHeat, setFbiHeat] = useState<number>(10);
  const [fbiRaidData, setFbiRaidData] = useState<FbiRaidData | null>(null);
  const [whackToast, setWhackToast] = useState<string | null>(null);
  const [isCutToBlack, setIsCutToBlack] = useState<boolean>(false);
  const [hasRerolledInShop, setHasRerolledInShop] = useState<boolean>(false);

  const difficultyMultiplier = difficulty === 'ASSOCIATE' ? 1.0 : difficulty === 'CAPO' ? 1.5 : 2.2;

  // Calculate target score
  const targetVig = getSeasonTargetVig(
    season,
    blindType,
    blindType === 'BOSS' ? activeBoss || undefined : undefined,
    difficultyMultiplier
  );

  // Start Run Setup with Balatro Card Dealing Animation
  const startNewRun = useCallback(() => {
    const fullDeck = createStandardDeck();

    // Starting mob crew: Paulie Walnuts (Tony's loyal soldier)
    const startingPaulie = ALL_CREW_MEMBERS.find((m) => m.id === 'paulie') || ALL_CREW_MEMBERS[0];

    const initialDraw = [...fullDeck];
    const initialHand = sortCards(initialDraw.splice(0, MAX_HAND_SIZE), sortPreference);

    setSeason(1);
    setBlindType('SMALL');
    setActiveBoss(null);
    setIsBossNeutralized(false);
    setIsMattressActive(false);
    setCash(difficulty === 'NY_BOSS' ? 5 : difficulty === 'CAPO' ? 8 : 10);
    setBirdFeederCash(0);
    setCurrentVigCollected(0);

    setHandsLeft(4);
    setDiscardsLeft(3);

    setDrawPile(initialDraw);
    setHand(initialHand);
    setDiscardPile([]);
    setSelectedCards([]);
    setMuckingCardIds([]);
    setIsActionLocked(false);

    // Staggered card draw fly-in animation & ASMR dealing sounds
    const initialIds = initialHand.map((c) => c.id);
    setDrawingCardIds(initialIds);
    initialHand.forEach((_, idx) => {
      sounds.playCardDraw(idx);
    });
    setTimeout(() => {
      setDrawingCardIds([]);
    }, initialHand.length * 55 + 450);

    setCrew([startingPaulie]);
    setConsumables([]);
    setLoungeItems([]);
    setHandLevels(initializeDefaultHandLevels());
    setFinalStats({ bestHandScore: 0, totalHandsPlayed: 0, seasonReached: 1 });
    setUsedBossIds([]);
    setRoundVictoryData(null);
    setFbiHeat(10);
    setFbiRaidData(null);
    setIsCutToBlack(false);
    setHasRerolledInShop(false);

    setScreen('playing');
  }, [difficulty, sortPreference]);

  // Check URL query ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startNewRun();
    }
  }, [startNewRun]);

  // Global Keyboard Shortcuts for Game Loop (Enter = Play, D = Discard, Escape = Close Modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        if (spotlightMember) {
          setSpotlightMember(null);
          return;
        }
        if (isRulesOpen) {
          setIsRulesOpen(false);
          return;
        }
      }

      if (screen === 'playing' && !isActionLocked) {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          selectedCards.length > 0 &&
          handsLeft > 0 &&
          !scoringSteps &&
          !spotlightMember &&
          !roundVictoryData
        ) {
          e.preventDefault();
          handlePlayHand();
        } else if (
          (e.key === 'd' || e.key === 'D') &&
          selectedCards.length > 0 &&
          discardsLeft > 0 &&
          !scoringSteps &&
          !spotlightMember
        ) {
          e.preventDefault();
          handleDiscard();
        } else if (
          (e.key === 'l' || e.key === 'L') &&
          handsLeft > 0 &&
          !scoringSteps &&
          !spotlightMember
        ) {
          e.preventDefault();
          handleLayLow();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screen,
    selectedCards,
    handsLeft,
    discardsLeft,
    scoringSteps,
    spotlightMember,
    isRulesOpen,
    roundVictoryData,
    isActionLocked,
  ]);

  // Sync document body state for testability and styling
  useEffect(() => {
    document.body.dataset.state = screen;
  }, [screen]);

  // Card Selection Handler (Up to 5 cards)
  const handleToggleCardSelect = (card: Card) => {
    const isAlreadySelected = selectedCards.some((c) => c.id === card.id);

    if (isAlreadySelected) {
      sounds.playCardDeselect();
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
    } else {
      if (selectedCards.length >= MAX_SELECTED_CARDS) {
        return;
      }
      sounds.playCardSelect();
      setSelectedCards((prev) => [...prev, card]);
    }
  };

  // Card Hand Sorting
  const handleSortHand = (by: 'rank' | 'suit') => {
    sounds.playCardSelect();
    setSortPreference(by);
    setHand((prev) => sortCards(prev, by));
  };

  // Move Crew Member Left / Right (Strategic Reordering for Silvio)
  const handleMoveCrewLeft = (member: CrewMember) => {
    sounds.playCardSelect();
    setCrew((prev) => {
      const idx = prev.findIndex((m) => m.id === member.id);
      if (idx <= 0) return prev;
      const clone = [...prev];
      [clone[idx - 1], clone[idx]] = [clone[idx], clone[idx - 1]];
      return clone;
    });
  };

  const handleMoveCrewRight = (member: CrewMember) => {
    sounds.playCardSelect();
    setCrew((prev) => {
      const idx = prev.findIndex((m) => m.id === member.id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const clone = [...prev];
      [clone[idx], clone[idx + 1]] = [clone[idx + 1], clone[idx]];
      return clone;
    });
  };

  // Play Hand Action: Smoothly levitates selected cards into center scoring lane
  const handlePlayHand = () => {
    if (selectedCards.length === 0 || handsLeft <= 0 || scoringSteps !== null || isActionLocked) {
      return;
    }

    sounds.playCardPlay();
    const evaluation = evaluateHand(selectedCards);
    const result = calculateScore({
      evaluation,
      playedCards: selectedCards,
      heldCards: hand.filter((c) => !selectedCards.some((s) => s.id === c.id)),
      crew,
      loungeItems,
      handLevels,
      activeBoss: isBossNeutralized ? null : activeBoss,
      cash,
      deckCount: drawPile.length,
      handsLeft,
      mattressActive: isMattressActive,
    });

    setLastScoringResult(result);
    setScoringSteps(result.steps);
  };

  // Scoring Animation Completion Handler: Mucks played cards and replenishes hand with Balatro draw
  const handleScoringComplete = () => {
    if (!lastScoringResult) return;

    const earned = lastScoringResult.totalScore;
    const newTotalVig = currentVigCollected + earned;
    const newHandsLeft = handsLeft - 1;
    let newCash = cash + lastScoringResult.earnedCash;

    // Update crew member counters (e.g. Christopher)
    if (lastScoringResult.crewStateUpdates.length > 0) {
      setCrew((prev) =>
        prev.map((member) => {
          const update = lastScoringResult.crewStateUpdates.find((u) => u.id === member.id);
          return update ? { ...member, ...update } : member;
        })
      );
    }

    // Level up played count
    const evalResult = evaluateHand(selectedCards);
    setHandLevels((prev) => {
      const cur = prev[evalResult.handType];
      return {
        ...prev,
        [evalResult.handType]: { ...cur, playedCount: cur.playedCount + 1 },
      };
    });

    // Muck played cards into discard pile with Balatro sweep animation
    setIsActionLocked(true);
    setMuckingCardIds(selectedCards.map((c) => c.id));
    sounds.playDiscardSwish();

    setTimeout(() => {
      // Remove played cards from hand
      const remainingHand = hand.filter((c) => !selectedCards.some((s) => s.id === c.id));
      const newDiscardPile = [...discardPile, ...selectedCards];

      // Replenish hand to effective max hand size (supports Cohiba Behike 52 +1 Hand size)
      let updatedDrawPile = [...drawPile];
      let updatedDiscards = newDiscardPile;

      const maxHandSizeEffective =
        MAX_HAND_SIZE + loungeItems.reduce((acc, i) => acc + (i.effect.handSizeBonus || 0), 0);
      const cardsNeeded = maxHandSizeEffective - remainingHand.length;
      let drawnCards: Card[] = [];

      if (updatedDrawPile.length < cardsNeeded && updatedDiscards.length > 0) {
        // Reshuffle discards
        updatedDrawPile = [...updatedDrawPile, ...shuffleDeck(updatedDiscards)];
        updatedDiscards = [];
      }

      drawnCards = updatedDrawPile.splice(0, cardsNeeded);
      const updatedHand = sortCards([...remainingHand, ...drawnCards], sortPreference);

      setHand(updatedHand);
      setDrawPile(updatedDrawPile);
      setDiscardPile(updatedDiscards);
      setSelectedCards([]);
      setMuckingCardIds([]);
      setCurrentVigCollected(newTotalVig);
      setHandsLeft(newHandsLeft);
      setCash(newCash);
      setIsMattressActive(false);

      // Balatro card draw fly-in animation and ASMR sound
      const newDrawnIds = drawnCards.map((c) => c.id);
      setDrawingCardIds(newDrawnIds);
      drawnCards.forEach((_, idx) => {
        sounds.playCardDraw(idx);
      });

      // Update stats
      setFinalStats((prev) => ({
        ...prev,
        bestHandScore: Math.max(prev.bestHandScore, earned),
        totalHandsPlayed: prev.totalHandsPlayed + 1,
      }));

      // Update FBI Wiretap Heat based on hand legality, crew, and enhancements
      if (lastScoringResult?.heatChange) {
        setFbiHeat((prevHeat) => {
          const nextHeat = Math.max(0, Math.min(100, prevHeat + lastScoringResult.heatChange));
          if (nextHeat >= 100) {
            // Federal Raid Triggered!
            sounds.playFbiSiren();
            sounds.playDoorBreach();
            const seized = Math.max(10, Math.floor(newCash * 0.5));
            const actualSeized = Math.min(seized, newCash);
            newCash = Math.max(0, newCash - actualSeized);
            setCash(newCash);
            setFbiRaidData({
              confiscatedCash: actualSeized,
              reason: 'Excessive high-stakes illegal volume triggered wiretap surveillance.',
            });
            return 25; // Reset to 25% Heat
          }
          return nextHeat;
        });
      }

      setScoringSteps(null);
      setActiveStep(null);
      setLastScoringResult(null);

      setTimeout(() => {
        setDrawingCardIds([]);
        setIsActionLocked(false);
      }, drawnCards.length * 55 + 450);

      // Check Win/Loss conditions
      if (newTotalVig >= targetVig) {
        // Blind Cleared!
        sounds.playVictoryFanfare();

        // Financial Ledger Breakdown (Realistic high-stakes roguelike payout)
        const isDaveyBustout = activeBoss?.rule === 'DAVEY_BUSTOUT';
        const baseReward = isDaveyBustout ? 0 : blindType === 'SMALL' ? 4 : blindType === 'BIG' ? 7 : 15;
        const leftoverBonus = newHandsLeft * 1;
        const hasBenny = crew.some((m) => m.passiveType === 'BENNY_MASTERMIND');
        const interestRate = hasBenny ? 4 : 5;
        const interestCapBonus = loungeItems.reduce((acc, i) => acc + (i.effect.interestCapBonus || 0), 0);
        const maxInterest = (hasBenny ? 6 : 5) + interestCapBonus;
        const interestEarned = Math.min(maxInterest, Math.floor(newCash / interestRate));
        const beansieBonus = crew.some((m) => m.passiveType === 'BEANSIE_PIZZERIA') ? discardsLeft * 2 : 0;
        const ginnyBonus = blindType === 'BOSS' && crew.some((m) => m.passiveType === 'GINNY_SACK_STASH') ? 15 : 0;
        const smallBlindLoungeBonus =
          blindType === 'SMALL'
            ? loungeItems.reduce((acc, i) => acc + (i.effect.cashPerSmallBlind || 0), 0)
            : 0;
        const bossBlindLoungeBonus =
          blindType === 'BOSS'
            ? loungeItems.reduce((acc, i) => {
                if (i.id === 'macallan_25_sherry') return acc + 5;
                if (i.id === 'yamazaki_12') return acc + 4;
                return acc;
              }, 0)
            : 0;
        const roundPayout =
          baseReward +
          leftoverBonus +
          interestEarned +
          beansieBonus +
          ginnyBonus +
          smallBlindLoungeBonus +
          bossBlindLoungeBonus;

        newCash += roundPayout;
        setCash(newCash);

        // Carmela's Bird Feeder Passive (+$4 to reserve if in crew)
        if (crew.some((m) => m.id === 'carmela')) {
          setBirdFeederCash((b) => b + 4);
        }

        setRoundVictoryData({
          isBoss: blindType === 'BOSS',
          season,
          boss: activeBoss,
          basePayout: baseReward,
          leftoverHandsBonus: leftoverBonus + beansieBonus,
          interestEarned,
          totalPayout: roundPayout,
        });
      } else if (newHandsLeft <= 0) {
        // Defeat! Whacked
        sounds.playGunshotDefeat();
        setTimeout(() => {
          setScreen('gameover');
        }, 700);
      }
    }, 320);
  };

  // Discard Action with Balatro Muck & Draw Animation
  const handleDiscard = () => {
    // If Pine Barrens is active and not neutralized, discards are frozen!
    if (activeBoss?.rule === 'PINE_BARRENS' && !isBossNeutralized) {
      sounds.playBossSting();
      return;
    }

    if (selectedCards.length === 0 || discardsLeft <= 0 || isActionLocked || scoringSteps !== null) {
      return;
    }

    setIsActionLocked(true);
    setMuckingCardIds(selectedCards.map((c) => c.id));
    sounds.playDiscardSwish();
    const newDiscardsLeft = discardsLeft - 1;

    setTimeout(() => {
      const remainingHand = hand.filter((c) => !selectedCards.some((s) => s.id === c.id));
      let updatedDrawPile = [...drawPile];
      let updatedDiscards = [...discardPile, ...selectedCards];

      const cardsNeeded = MAX_HAND_SIZE - remainingHand.length;
      if (updatedDrawPile.length < cardsNeeded && updatedDiscards.length > 0) {
        updatedDrawPile = [...updatedDrawPile, ...shuffleDeck(updatedDiscards)];
        updatedDiscards = [];
      }

      const drawnCards = updatedDrawPile.splice(0, cardsNeeded);
      const updatedHand = sortCards([...remainingHand, ...drawnCards], sortPreference);

      setHand(updatedHand);
      setDrawPile(updatedDrawPile);
      setDiscardPile(updatedDiscards);
      setSelectedCards([]);
      setDiscardsLeft(newDiscardsLeft);
      setMuckingCardIds([]);

      // Balatro Draw Animation: fly in from off-screen top-right with staggered delays & ASMR sounds
      const newDrawnIds = drawnCards.map((c) => c.id);
      setDrawingCardIds(newDrawnIds);
      drawnCards.forEach((_, idx) => {
        sounds.playCardDraw(idx);
      });

      setTimeout(() => {
        setDrawingCardIds([]);
        setIsActionLocked(false);
      }, drawnCards.length * 55 + 450);
    }, 320);
  };

  // Lay Low Action: Costs 1 hand, sheds 25% FBI heat, discards hand and draws fresh cards, 0 cash
  const handleLayLow = () => {
    if (handsLeft <= 0 || isActionLocked || scoringSteps !== null) {
      return;
    }

    setIsActionLocked(true);
    const newHandsLeft = handsLeft - 1;
    setHandsLeft(newHandsLeft);
    setFbiHeat((prev) => Math.max(0, prev - 25));

    // Muck all cards currently in hand
    setMuckingCardIds(hand.map((c) => c.id));
    sounds.playDiscardSwish();

    setTimeout(() => {
      let updatedDrawPile = [...drawPile];
      let updatedDiscards = [...discardPile, ...hand];

      const maxHandSizeEffective =
        MAX_HAND_SIZE + loungeItems.reduce((acc, i) => acc + (i.effect.handSizeBonus || 0), 0);
      let drawnCards: Card[] = [];

      if (updatedDrawPile.length < maxHandSizeEffective && updatedDiscards.length > 0) {
        updatedDrawPile = [...updatedDrawPile, ...shuffleDeck(updatedDiscards)];
        updatedDiscards = [];
      }

      drawnCards = updatedDrawPile.splice(0, maxHandSizeEffective);
      const updatedHand = sortCards(drawnCards, sortPreference);

      setHand(updatedHand);
      setDrawPile(updatedDrawPile);
      setDiscardPile(updatedDiscards);
      setSelectedCards([]);
      setMuckingCardIds([]);

      // Staggered draw animation
      const newDrawnIds = drawnCards.map((c) => c.id);
      setDrawingCardIds(newDrawnIds);
      drawnCards.forEach((_, idx) => {
        sounds.playCardDraw(idx);
      });

      setWhackToast('Motel Safehouse: Laid low & cooled FBI Wiretap Heat by -25%');
      setTimeout(() => setWhackToast(null), 2500);

      setTimeout(() => {
        setDrawingCardIds([]);
        setIsActionLocked(false);
      }, drawnCards.length * 55 + 450);

      if (newHandsLeft <= 0 && currentVigCollected < targetVig) {
        sounds.playGunshotDefeat();
        setTimeout(() => {
          setScreen('gameover');
        }, 700);
      }
    }, 320);
  };

  // Advance to Next Blind from Shop
  const handleNextBlindFromShop = () => {
    sounds.playCashChime();
    setCurrentVigCollected(0);

    // Skipping shop rerolls cools FBI heat by 5%
    if (!hasRerolledInShop) {
      setFbiHeat((h) => Math.max(0, h - 5));
    }
    setHasRerolledInShop(false);

    const extraHandsTotal = loungeItems.reduce((acc, i) => acc + (i.effect.extraHands || 0), 0);
    const extraDiscardsTotal = loungeItems.reduce((acc, i) => acc + (i.effect.extraDiscards || 0), 0);
    const effectiveMaxHands = maxHands + extraHandsTotal;
    const effectiveMaxDiscards = maxDiscards + extraDiscardsTotal;
    setHandsLeft(effectiveMaxHands);
    setDiscardsLeft(effectiveMaxDiscards);
    setIsBossNeutralized(false);
    setIsMattressActive(false);

    // Staggered draw animation for current hand entering new round
    const handIds = hand.map((c) => c.id);
    setDrawingCardIds(handIds);
    handIds.forEach((_, idx) => {
      sounds.playCardDraw(idx);
    });
    setTimeout(() => {
      setDrawingCardIds([]);
    }, handIds.length * 55 + 450);

    if (blindType === 'SMALL') {
      setBlindType('BIG');
      setScreen('playing');
    } else if (blindType === 'BIG') {
      // Pick randomized Boss Blind for this season
      const boss = getRandomBossForSeason(season, usedBossIds);
      setUsedBossIds((prev) => [...prev, boss.id]);
      setActiveBoss(boss);
      setBlindType('BOSS');
      sounds.playBossSting();
      setScreen('playing');
    } else {
      // Boss was cleared! Move to next Season
      if (season >= 6) {
        // "Cut to Black" series finale: abruptly cut entire screen to pure pitch black (bg-black)
        // and instantly cut ALL audio with 0 reverb/tail.
        // Hold silent black screen for 4 seconds before slowly fading in final victory stats.
        sounds.cutAllAudioInstantly();
        setIsCutToBlack(true);
        setTimeout(() => {
          setIsCutToBlack(false);
          sounds.resumeAudioAfterFinale();
          sounds.playVictoryFanfare();
          setScreen('victory');
        }, 4000);
      } else {
        const nextSeason = season + 1;
        setSeason(nextSeason);
        setBlindType('SMALL');
        setActiveBoss(null);
        setFinalStats((prev) => ({ ...prev, seasonReached: nextSeason }));
        setScreen('playing');
      }
    }
  };

  // Shop Buying & Whacking Handlers
  const handleBuyCrew = (newMember: CrewMember) => {
    setCash((c) => c - newMember.cost);
    setCrew((prev) => [...prev, newMember]);
  };

  const handleWhackCrew = (member: CrewMember) => {
    // Whacking costs a small cleanup fee (-$2 if cash >= 2) and gives $0
    const cleanupFee = cash >= 2 ? 2 : 0;
    if (cleanupFee > 0) {
      setCash((c) => Math.max(0, c - cleanupFee));
    }
    setCrew((prev) => prev.filter((m) => m.id !== member.id));
    if (spotlightMember?.id === member.id) {
      setSpotlightMember(null);
    }
    sounds.playGunshot();
    const msgs = [
      `"${member.name}" is sleeping with the fishes...`,
      `"${member.name}" took a one-way trip to the Pine Barrens...`,
      `"${member.name}" was sent to Witness Protection in Scottsdale...`,
    ];
    const pickedMsg = msgs[Math.floor(Math.random() * msgs.length)];
    setWhackToast(pickedMsg);
    setTimeout(() => {
      setWhackToast(null);
    }, 2600);
  };

  const handleBuyLoungeItem = (item: LoungeItem) => {
    setCash((c) => c - item.cost);
    setLoungeItems((prev) => [...prev, item]);
  };

  const handleSellLoungeItem = (item: LoungeItem) => {
    const refund = Math.max(1, Math.floor(item.cost / 2));
    setCash((c) => c + refund);
    setLoungeItems((prev) => prev.filter((i) => i.id !== item.id));
    sounds.playCashChime();
  };

  const handleBuyBusiness = (biz: FrontBusiness) => {
    setCash((c) => c - biz.cost);
    setHandLevels((prev) => {
      const cur = prev[biz.handType];
      return {
        ...prev,
        [biz.handType]: {
          ...cur,
          level: cur.level + 1,
          chips: cur.chips + biz.chipsBonus,
          mult: cur.mult + biz.multBonus,
        },
      };
    });
  };

  const handleBuyFavor = (favor: Favor) => {
    setCash((c) => c - favor.cost);
    setConsumables((prev) => [...prev, favor]);
  };

  // Use Consumable Favor
  const handleUseFavor = (favor: Favor) => {
    sounds.playCashChime();

    if (favor.effectType === 'CASH_ENVELOPE') {
      setCash((c) => c + 15);
      setConsumables((prev) => prev.filter((f) => f.id !== favor.id));
    } else if (favor.effectType === 'MATTRESS_MULT') {
      setIsMattressActive(true);
      setConsumables((prev) => prev.filter((f) => f.id !== favor.id));
    } else if (favor.effectType === 'BRIBE_DA') {
      setIsBossNeutralized(true);
      setConsumables((prev) => prev.filter((f) => f.id !== favor.id));
    } else if (favor.effectType === 'WHACK_CARD') {
      if (selectedCards.length === 1) {
        const targetCard = selectedCards[0];
        setHand((prev) => prev.filter((c) => c.id !== targetCard.id));
        setSelectedCards([]);
        setConsumables((prev) => prev.filter((f) => f.id !== favor.id));
      }
    } else if (favor.effectType === 'CONCRETE_CARD') {
      if (selectedCards.length === 1) {
        const targetCard = selectedCards[0];
        setHand((prev) =>
          prev.map((c) => (c.id === targetCard.id ? { ...c, enhancement: 'CONCRETE' } : c))
        );
        setSelectedCards([]);
        setConsumables((prev) => prev.filter((f) => f.id !== favor.id));
      }
    } else if (favor.effectType === 'LAUNDER_CARD') {
      if (selectedCards.length === 1) {
        const targetCard = selectedCards[0];
        setHand((prev) =>
          prev.map((c) => (c.id === targetCard.id ? { ...c, enhancement: 'LAUNDERED' } : c))
        );
        setSelectedCards([]);
        setConsumables((prev) => prev.filter((f) => f.id !== favor.id));
      }
    }
  };

  // Break open Carmela's Bird Feeder
  const handleClaimBirdFeeder = () => {
    if (birdFeederCash <= 0) return;
    sounds.playCashChime();
    setCash((c) => c + birdFeederCash);
    setBirdFeederCash(0);
  };

  // Live Hand Evaluation Preview
  const currentHandPreview = evaluateHand(selectedCards);
  const previewHandLevel = handLevels[currentHandPreview.handType];

  const spotlightIndex = spotlightMember ? crew.findIndex((m) => m.id === spotlightMember.id) : -1;
  const hasMeadow = crew.some((m) => m.passiveType === 'MEADOW_COLUMBIA');

  // Debuffed card check for Boss Blinds (Wiretap face cards, Raid spades/clubs, Riot hearts/diamonds)
  const checkCardDebuffed = useCallback(
    (card: Card) => {
      if (card.isDebuffed) return true;
      if (blindType !== 'BOSS' || !activeBoss || isBossNeutralized || hasMeadow) return false;
      if (activeBoss.rule === 'FBI_WIRETAP' && [11, 12, 13].includes(card.rank)) return true;
      if (activeBoss.rule === 'EXECUTIVE_RAID' && (card.suit === 'SPADES' || card.suit === 'CLUBS')) return true;
      if (activeBoss.rule === 'COLUMBUS_RIOT' && (card.suit === 'HEARTS' || card.suit === 'DIAMONDS')) return true;
      return false;
    },
    [blindType, activeBoss, isBossNeutralized, hasMeadow]
  );

  return (
    <div
      className={`min-h-screen w-full relative bg-felt overflow-x-hidden ${
        isCrtEnabled ? 'crt-overlay crt-vignette' : ''
      }`}
    >
      {/* 1999 HBO Tube TV CRT & VHS Screen Shader */}
      <CrtScreenShader isEnabled={isCrtEnabled} />

      {/* Reactive Environmental Table Lighting (Spotlight, Bing Neon, Pine Barrens Blizzard, FBI Sirens) */}
      <DynamicTableFelt
        screen={screen}
        bossRule={activeBoss?.rule}
        isBossNeutralized={isBossNeutralized}
        fbiHeat={fbiHeat}
        isFbiRaidActive={fbiRaidData !== null}
      />

      {/* 1. TITLE SCREEN */}
      {screen === 'title' && (
        <TitleScreen
          onStartGame={startNewRun}
          onOpenRules={() => setIsRulesOpen(true)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(sounds.toggleMute())}
          isCrtEnabled={isCrtEnabled}
          onToggleCrt={() => setIsCrtEnabled((prev) => !prev)}
          difficulty={difficulty}
          onSelectDifficulty={setDifficulty}
        />
      )}

      {/* 2. PLAYING POKER TABLE */}
      {screen === 'playing' && (
        <main className="relative min-h-screen flex flex-col justify-between p-3 sm:p-5 max-w-7xl mx-auto select-none">
          {/* Top Bar: Crew Jokers & Utilities */}
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-950/60 pb-3">
            {/* Crew Container (Jokers) */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-500 font-mono-numbers shrink-0">
                CREW ({crew.length}/{MAX_CREW_SIZE}):
              </div>
              <div className="flex items-center gap-2">
                {crew.map((member, idx) => (
                  <CrewCardView
                    key={member.id}
                    member={member}
                    index={idx}
                    isTriggering={activeStep?.crewIndex === idx}
                    isDisabled={activeBoss?.rule === 'RAT_IN_CREW' && idx === 0 && !isBossNeutralized}
                    onCardClick={(m) => {
                      sounds.playCardSelect();
                      setSpotlightMember(m);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Consumables (Favors), Lounge Stash, Bird Feeder & Top Utilities */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Executive Lounge: Real-Life Whiskies & Cigars Stash */}
              <ExecutiveLoungeWidget loungeItems={loungeItems} />

              {birdFeederCash > 0 && (
                <button
                  type="button"
                  onClick={handleClaimBirdFeeder}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-950 border border-amber-500 text-amber-300 text-xs font-bold hover:bg-amber-900 transition-transform hover:scale-105 cursor-pointer shadow animate-bounce"
                  title="Claim Carmela's stashed cash"
                >
                  Bird Feeder: +${birdFeederCash}
                </button>
              )}

              {consumables.length > 0 && (
                <div className="flex items-center gap-1.5 mr-2">
                  {consumables.map((favor) => (
                    <button
                      key={favor.id}
                      type="button"
                      onClick={() => handleUseFavor(favor)}
                      className="px-2.5 py-1 rounded bg-sky-950 border border-sky-500 text-sky-200 text-xs font-bold hover:bg-sky-900 transition-transform hover:scale-105 cursor-pointer shadow"
                    >
                      Use: {favor.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Holsten's Diner Tabletop Jukebox */}
              <JukeboxWidget />

              <button
                type="button"
                onClick={() => setIsRulesOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-stone-900/90 border border-stone-700 text-stone-300 hover:text-amber-400 text-xs font-semibold cursor-pointer"
              >
                Rules
              </button>

              <button
                type="button"
                onClick={() => setIsCrtEnabled((prev) => !prev)}
                className="px-2.5 py-1.5 rounded-lg bg-stone-900/90 border border-stone-700 text-stone-300 hover:text-amber-400 text-xs font-semibold cursor-pointer"
              >
                CRT: {isCrtEnabled ? 'ON' : 'OFF'}
              </button>

              <button
                type="button"
                onClick={() => setIsMuted(sounds.toggleMute())}
                className="p-1.5 rounded-lg bg-stone-900/90 border border-stone-700 text-stone-300 hover:text-amber-400 text-xs font-semibold cursor-pointer"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </header>

          {/* Active Boss Crisis Warning */}
          {activeBoss && blindType === 'BOSS' && (
            <BossBlindBanner boss={activeBoss} isNeutralized={isBossNeutralized} />
          )}

          {/* Center Table Area with Mahogany Rail */}
          <div className="my-auto py-2 bg-stone-950/70 border-4 border-amber-950/90 rounded-3xl p-4 sm:p-6 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Left HUD: Season, The Vig, Hands & Discards */}
              <div className="bg-stone-950/95 border-2 border-stone-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-2xl">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-amber-500 font-mono-numbers">
                    <span>SEASON {season} OF 6</span>
                    <span className="uppercase text-stone-400">{blindType} BLIND</span>
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-stone-100 mt-1">
                    {blindType === 'SMALL'
                      ? 'The Drop'
                      : blindType === 'BIG'
                      ? 'The Sit-Down'
                      : activeBoss?.name || 'The Crisis'}
                  </h3>
                  <div className="text-[10px] text-amber-600 font-mono-numbers mt-0.5">
                    Stakes: {difficulty} ({difficultyMultiplier}× Vig)
                  </div>
                </div>

                {/* The Boss's Cut Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-numbers mb-1.5">
                    <span className="text-neutral-300 font-bold tracking-wide uppercase">THE BOSS&apos;S CUT</span>
                    <span className="text-amber-300 font-black text-sm neon-boss-cut">
                      ${currentVigCollected.toLocaleString()} / ${targetVig.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3.5 rounded-full bg-stone-900 border border-stone-800 overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-400 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (currentVigCollected / Math.max(1, targetVig)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* FBI Wiretap Cassette Tape Heat Meter (0-100%) */}
                <div className="pt-2 border-t border-neutral-800/80" data-testid="fbi-heat-meter">
                  <HeatMeter heat={fbiHeat} />
                </div>

                {/* Counters */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-sky-950/90 border border-sky-800 p-2.5 rounded-xl shadow">
                    <span className="text-[10px] uppercase font-bold text-sky-400 block tracking-wider">
                      Hands Left
                    </span>
                    <span className="font-mono-numbers font-black text-2xl text-sky-200">
                      {handsLeft}
                    </span>
                  </div>

                  <div className="bg-rose-950/90 border border-rose-800 p-2.5 rounded-xl shadow">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">
                      Discards Left
                    </span>
                    <span className="font-mono-numbers font-black text-2xl text-rose-200">
                      {discardsLeft}
                    </span>
                  </div>
                </div>

                {/* Bankroll & High Stakes Chips */}
                <div className="border-t border-stone-800 pt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {/* High Stakes Poker Clay Chips */}
                      <div className="flex items-center -space-x-1.5 drop-shadow-md">
                        <PhotoRealisticChip denomination="1K" size="sm" />
                        <PhotoRealisticChip denomination="500" size="sm" />
                        <PhotoRealisticChip denomination="100" size="sm" />
                      </div>
                      <span className="text-stone-400 uppercase font-bold text-[10px] tracking-wider">
                        Bankroll
                      </span>
                    </div>

                    <span className="font-mono-numbers font-black text-emerald-400 text-lg">
                      ${cash.toLocaleString()}
                    </span>
                  </div>

                  {/* Interest Forecast Badge */}
                  <div className="text-[10px] font-mono-numbers text-stone-500 flex items-center justify-between">
                    <span>Round Interest:</span>
                    <span className="text-emerald-400 font-bold">
                      +${Math.min(
                        (crew.some((m) => m.passiveType === 'BENNY_MASTERMIND') ? 6 : 5) +
                          loungeItems.reduce((acc, i) => acc + (i.effect.interestCapBonus || 0), 0),
                        Math.floor(cash / (crew.some((m) => m.passiveType === 'BENNY_MASTERMIND') ? 4 : 5))
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Area: Hand Preview & Felt Action Area */}
              <div className="md:col-span-3 flex flex-col items-center justify-center">
                {/* Hand Combo Preview Pill */}
                <div className="bg-stone-950/95 border-2 border-amber-600/80 px-6 py-2.5 rounded-2xl shadow-2xl text-center mb-3 min-w-[300px]">
                  <div className="text-xs font-mono-numbers font-black text-stone-400 uppercase tracking-wider">
                    {selectedCards.length > 0 ? currentHandPreview.handName : 'Select up to 5 cards'}
                  </div>
                  {selectedCards.length > 0 && (
                    <div className="flex items-center justify-center gap-3 mt-1">
                      <span className="text-sky-400 font-mono-numbers font-black text-xl">
                        {previewHandLevel?.chips || currentHandPreview.baseChips} Chips
                      </span>
                      <span className="text-stone-500 font-black">×</span>
                      <span className="text-rose-400 font-mono-numbers font-black text-xl">
                        {previewHandLevel?.mult || currentHandPreview.baseMult} Mult
                      </span>
                    </div>
                  )}
                </div>

                {/* Utility sorting controls */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleSortHand('rank')}
                    aria-pressed={sortPreference === 'rank'}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      sortPreference === 'rank'
                        ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 border-amber-300 shadow-md font-black'
                        : 'bg-stone-900/90 hover:bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {sortPreference === 'rank' ? '✓ Sorted: Rank' : 'Sort Rank'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortHand('suit')}
                    aria-pressed={sortPreference === 'suit'}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      sortPreference === 'suit'
                        ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 border-amber-300 shadow-md font-black'
                        : 'bg-stone-900/90 hover:bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {sortPreference === 'suit' ? '✓ Sorted: Suit' : 'Sort Suit'}
                  </button>
                  {selectedCards.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playCardDeselect();
                        setSelectedCards([]);
                      }}
                      className="px-3 py-1 bg-stone-900/90 hover:bg-stone-800 text-stone-400 text-xs font-bold rounded-lg border border-stone-700 cursor-pointer transition-colors"
                    >
                      Deselect ({selectedCards.length})
                    </button>
                  )}
                </div>

                {/* Balatro-Style Center Scoring Zone: The played cards smoothly levitate out of the hand into this center lane on the felt table */}
                {scoringSteps !== null ? (
                  <div className="w-full flex flex-col items-center justify-center mb-2 animate-scoring-levitate">
                    <div className="text-[10px] sm:text-xs font-mono-numbers font-black text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 bg-stone-950/90 px-3 py-1 rounded-full border border-amber-600/50 shadow-lg">
                      <span>♠ ACTIVE SCORING LANE ♠</span>
                    </div>

                    {/* The Levitated Played Cards */}
                    <div className="relative flex items-center justify-center -space-x-1 sm:space-x-2 py-3 px-4 bg-stone-900/80 border-2 border-amber-500/70 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.8),0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-sm min-h-[148px] sm:min-h-[178px]">
                      {selectedCards.map((card, idx) => {
                        const isScoringHighlight = activeStep?.highlightCardId === card.id;
                        const burstText = isScoringHighlight
                          ? activeStep?.chipsAdd
                            ? `+${activeStep.chipsAdd}`
                            : activeStep?.multAdd
                            ? `+${activeStep.multAdd} Mult`
                            : null
                          : null;
                        const burstColor = activeStep?.multAdd ? 'mult' : 'chips';
                        const isMucking = muckingCardIds.includes(card.id);

                        return (
                          <CardView
                            key={`scoring-${card.id}`}
                            card={card}
                            isSelected={false}
                            isCenterScoring={true}
                            isDebuffed={checkCardDebuffed(card)}
                            isMucking={isMucking}
                            onToggleSelect={() => {}}
                            isScoringHighlight={isScoringHighlight}
                            wobbleStyle={getWobbleStyle(idx, true)}
                            burstText={burstText}
                            burstColor={burstColor}
                          />
                        );
                      })}
                    </div>

                    {/* Unplayed Cards remaining in hand rack below at low opacity */}
                    <div className="mt-2 text-[10px] text-stone-500 font-mono-numbers uppercase tracking-wider">
                      Hand in Rack
                    </div>
                    <div className="relative flex items-end justify-center pb-1 px-2 w-full overflow-visible h-32 sm:h-38 -space-x-1.5 sm:space-x-2 opacity-35 pointer-events-none scale-90 transition-all">
                      {hand
                        .filter((c) => !selectedCards.some((s) => s.id === c.id))
                        .map((card, idx) => (
                          <CardView
                            key={card.id}
                            card={card}
                            isSelected={false}
                            isDebuffed={checkCardDebuffed(card)}
                            onToggleSelect={() => {}}
                            wobbleStyle={getWobbleStyle(idx, false)}
                          />
                        ))}
                    </div>
                  </div>
                ) : (
                  /* Standard Hand Cards Area - Rigid non-expanding playing field with Balatro draw & muck physics */
                  <div className="relative flex items-end justify-center pb-2 px-2 w-full overflow-visible h-48 sm:h-56 -space-x-1.5 sm:space-x-2">
                    {hand.map((card, idx) => {
                      const isSelected = selectedCards.some((c) => c.id === card.id);
                      const isFacedown = activeBoss?.rule === 'PANIC_ATTACK' && !isBossNeutralized && !isSelected;
                      const isMucking = muckingCardIds.includes(card.id);
                      const isDrawing = drawingCardIds.includes(card.id);
                      const drawDelay = isDrawing ? drawingCardIds.indexOf(card.id) * 55 : 0;

                      return (
                        <CardView
                          key={card.id}
                          card={card}
                          isSelected={isSelected}
                          isDebuffed={checkCardDebuffed(card)}
                          onToggleSelect={handleToggleCardSelect}
                          isFacedown={isFacedown}
                          isMucking={isMucking}
                          isDrawing={isDrawing}
                          drawDelay={drawDelay}
                          wobbleStyle={getWobbleStyle(idx, isSelected)}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Action Buttons: Kick Up (Play Hand), Ditch (Discard), and Lay Low */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-3 w-full max-w-lg">
                  <button
                    type="button"
                    disabled={selectedCards.length === 0 || handsLeft <= 0 || scoringSteps !== null || isActionLocked}
                    onClick={handlePlayHand}
                    data-testid="kick-up-button"
                    className={`flex-1 min-w-[140px] py-3.5 px-4 rounded-xl font-cinzel font-black text-sm sm:text-base border transition-all cursor-pointer shadow-xl ${
                      selectedCards.length > 0 && handsLeft > 0 && !scoringSteps && !isActionLocked
                        ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-stone-950 border-emerald-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                        : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                    }`}
                  >
                    KICK UP [Enter]
                  </button>

                  <button
                    type="button"
                    disabled={
                      selectedCards.length === 0 ||
                      discardsLeft <= 0 ||
                      scoringSteps !== null ||
                      isActionLocked ||
                      (activeBoss?.rule === 'PINE_BARRENS' && !isBossNeutralized)
                    }
                    onClick={handleDiscard}
                    data-testid="discard-button"
                    className={`flex-1 min-w-[120px] py-3.5 px-3 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer shadow-xl ${
                      selectedCards.length > 0 &&
                      discardsLeft > 0 &&
                      !scoringSteps &&
                      !isActionLocked &&
                      !(activeBoss?.rule === 'PINE_BARRENS' && !isBossNeutralized)
                        ? 'bg-stone-900 hover:bg-stone-800 text-rose-300 hover:text-rose-200 border-rose-800/80 hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                        : 'bg-stone-950 text-stone-700 border-stone-900 cursor-not-allowed'
                    }`}
                  >
                    DITCH [D] ({discardsLeft})
                  </button>

                  <button
                    type="button"
                    disabled={handsLeft <= 0 || scoringSteps !== null || isActionLocked}
                    onClick={handleLayLow}
                    data-testid="lay-low-button"
                    title="Lay low in safehouse: Costs 1 hand, cools FBI wiretap heat by -25%, discards and draws fresh hand."
                    className={`py-3.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer shadow-xl flex items-center justify-center gap-1.5 ${
                      handsLeft > 0 && !scoringSteps && !isActionLocked
                        ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600/70 hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-stone-950 text-stone-700 border-stone-900 cursor-not-allowed'
                    }`}
                  >
                    <span>LAY LOW [L]</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-black">(-25%)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 3. SCORING ANIMATION OVERLAY */}
      {scoringSteps && (
        <ScoringAnimationOverlay
          steps={scoringSteps}
          onStepChange={setActiveStep}
          onComplete={handleScoringComplete}
        />
      )}

      {/* 4. BACKROOM SHOP */}
      {screen === 'shop' && (
        <BackroomShop
          cash={cash}
          crew={crew}
          maxCrew={MAX_CREW_SIZE}
          consumables={consumables}
          maxConsumables={MAX_CONSUMABLES_SIZE}
          loungeItems={loungeItems}
          maxLoungeItems={2}
          handLevels={handLevels}
          onBuyCrew={handleBuyCrew}
          onSellCrew={handleWhackCrew}
          onBuyBusiness={handleBuyBusiness}
          onBuyFavor={handleBuyFavor}
          onUseFavor={handleUseFavor}
          onBuyLoungeItem={handleBuyLoungeItem}
          onSellLoungeItem={handleSellLoungeItem}
          onNextRound={handleNextBlindFromShop}
          onRerollShop={(cost) => {
            setCash((c) => c - cost);
            setHasRerolledInShop(true);
          }}
          onInspectCrew={(m) => {
            sounds.playCardSelect();
            setSpotlightMember(m);
          }}
        />
      )}

      {/* 5. WHISKY & CIGAR ROUND VICTORY MODAL */}
      {roundVictoryData && (
        <WhiskyCigarVictoryModal
          isBoss={roundVictoryData.isBoss}
          season={roundVictoryData.season}
          boss={roundVictoryData.boss}
          crew={crew}
          basePayout={roundVictoryData.basePayout}
          leftoverHandsBonus={roundVictoryData.leftoverHandsBonus}
          interestEarned={roundVictoryData.interestEarned}
          totalPayout={roundVictoryData.totalPayout}
          onContinue={() => {
            setRoundVictoryData(null);
            setScreen('shop');
          }}
        />
      )}

      {/* 6. CHARACTER SPOTLIGHT & QUOTE MODAL */}
      {spotlightMember && (
        <CharacterSpotlightModal
          member={spotlightMember}
          onClose={() => setSpotlightMember(null)}
          onMoveLeft={handleMoveCrewLeft}
          onMoveRight={handleMoveCrewRight}
          canMoveLeft={spotlightIndex > 0}
          canMoveRight={spotlightIndex >= 0 && spotlightIndex < crew.length - 1}
          allowSell={screen === 'shop'}
          onSell={handleWhackCrew}
        />
      )}

      {/* 7. GAME OVER (WHACKED) */}
      {screen === 'gameover' && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="bg-stone-900 border-2 border-red-700/80 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <span className="text-4xl block mb-2">☠️</span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-red-500 mb-2">
              YOU GOT WHACKED
            </h2>
            <p className="text-stone-300 text-sm mb-6 italic">
              "You were light on the weekly envelope. Tony doesn't give third chances."
            </p>

            {/* Run Stats */}
            <div className="grid grid-cols-2 gap-3 bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs font-mono-numbers mb-6">
              <div>
                <span className="text-stone-500 uppercase block">Season Reached</span>
                <span className="text-amber-400 font-bold text-lg">{season} of 6</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase block">Best Hand</span>
                <span className="text-emerald-400 font-bold text-lg">
                  ${finalStats.bestHandScore.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              data-start="true"
              onClick={startNewRun}
              className="w-full py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-stone-100 font-black rounded-xl border border-red-400 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 text-base"
            >
              Sit Down Again (Play Again)
            </button>
          </div>
        </div>
      )}

      {/* 8. VICTORY (BOSS OF THE FAMILY) */}
      {screen === 'victory' && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="bg-stone-900 border-2 border-amber-500 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <img
              src={TONY_PORTRAIT}
              alt="Tony Soprano"
              className="w-24 h-24 rounded-full border-4 border-amber-400 mx-auto mb-4 object-cover shadow-xl"
              referrerPolicy="no-referrer"
            />
            <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-amber-400 mb-2">
              BOSS OF NORTH JERSEY
            </h2>
            <p className="text-stone-200 text-sm mb-6 italic">
              "You conquered all 6 Seasons. The Feds are baffled, New York respects you, and the envelope is bulging."
            </p>

            <div className="grid grid-cols-2 gap-3 bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs font-mono-numbers mb-6">
              <div>
                <span className="text-stone-500 uppercase block">Highest Score</span>
                <span className="text-emerald-400 font-bold text-lg">
                  ${finalStats.bestHandScore.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-stone-500 uppercase block">Final Bankroll</span>
                <span className="text-amber-400 font-bold text-lg">${cash.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              data-start="true"
              onClick={startNewRun}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black rounded-xl border border-amber-200 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 text-base"
            >
              Start Another Run
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <RulesCompendiumModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* Federal Backroom Raid Modal */}
      {fbiRaidData && (
        <FbiRaidModal
          data={fbiRaidData}
          onDismiss={() => setFbiRaidData(null)}
        />
      )}

      {/* Whack / Sever Ties Animated Toast */}
      {whackToast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-950/95 border-2 border-red-500 text-red-100 px-5 py-3 rounded-2xl shadow-[0_0_35px_rgba(239,68,68,0.8)] font-cinzel font-black tracking-wide text-xs sm:text-sm animate-whack-toast flex items-center gap-2.5 pointer-events-none"
          data-testid="whack-toast"
        >
          <span className="text-lg">🪓</span>
          <span>{whackToast}</span>
        </div>
      )}

      {/* "Cut to Black" Series Finale Abrupt Blackout */}
      {isCutToBlack && (
        <div
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center cursor-none select-none transition-none"
          data-testid="cut-to-black"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
