import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, ScoringContext } from './scoring';
import { Card, CrewMember, HandLevel, PokerHandType } from './types';
import { DEFAULT_HAND_SCORES, evaluateHand } from './pokerEvaluator';

function createMockCard(suit: 'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES', rank: Card['rank'], id = 'c'): Card {
  return {
    id,
    suit,
    rank,
    baseChips: rank <= 10 ? rank : rank === 14 ? 11 : 10,
  };
}

function createDefaultHandLevels(): Record<PokerHandType, HandLevel> {
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

test('calculates basic hand score with Paulie Walnuts', () => {
  const cards = [
    createMockCard('HEARTS', 10, '1'),
    createMockCard('SPADES', 10, '2'),
    createMockCard('CLUBS', 4, '3'),
  ];
  const evalResult = evaluateHand(cards);

  const paulie: CrewMember = {
    id: 'paulie',
    name: 'Paulie Walnuts',
    moniker: 'Hehe',
    quote: 'Hehe! Tone, look at this!',
    mobRank: 'Capo',
    quotes: ['Hehe! Tone, look at this!'],
    rarity: 'Common',
    cost: 4,
    description: '+4 Mult',
    passiveType: 'PAULIE_MULT',
  };

  const ctx: ScoringContext = {
    evaluation: evalResult,
    playedCards: cards,
    heldCards: [],
    crew: [paulie],
    handLevels: createDefaultHandLevels(),
    activeBoss: null,
    cash: 10,
    deckCount: 40,
  };

  const result = calculateScore(ctx);
  // Pair base is 10 chips, 2 mult
  // 10 of hearts (10 chips) + 10 of spades (10 chips) = +20 chips => 30 chips
  // Paulie adds +4 mult => 2 + 4 = 6 mult
  // Total score = 30 * 6 = 180
  assert.equal(result.finalChips, 30);
  assert.equal(result.finalMult, 6);
  assert.equal(result.totalScore, 180);
});

test('Silvio Dante correctly copies the crew member to his right', () => {
  const cards = [
    createMockCard('HEARTS', 10, '1'),
    createMockCard('SPADES', 10, '2'),
  ];
  const evalResult = evaluateHand(cards);

  const silvio: CrewMember = {
    id: 'silvio',
    name: 'Silvio Dante',
    moniker: 'Consigliere',
    quote: 'Our friend over there...',
    mobRank: 'Consigliere',
    quotes: ['Our friend over there...'],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Copies adjacent crew',
    isConsigliere: true,
    passiveType: 'SILVIO_COPY',
  };

  const paulie: CrewMember = {
    id: 'paulie',
    name: 'Paulie Walnuts',
    moniker: 'Hehe',
    quote: 'Hehe!',
    mobRank: 'Capo',
    quotes: ['Hehe!'],
    rarity: 'Common',
    cost: 4,
    description: '+4 Mult',
    passiveType: 'PAULIE_MULT',
  };

  const ctx: ScoringContext = {
    evaluation: evalResult,
    playedCards: cards,
    heldCards: [],
    crew: [silvio, paulie], // Silvio should copy Paulie, so Paulie triggers twice
    handLevels: createDefaultHandLevels(),
    activeBoss: null,
    cash: 10,
    deckCount: 40,
  };

  const result = calculateScore(ctx);
  // Pair base mult is 2 + 4 (Silvio) + 4 (Paulie) = 10 mult
  assert.equal(result.finalMult, 10);
});

test('FBI Wiretap boss blind nullifies face cards chips', () => {
  const cards = [
    createMockCard('HEARTS', 13, 'k1'), // King (Face card)
    createMockCard('SPADES', 13, 'k2'), // King (Face card)
  ];
  const evalResult = evaluateHand(cards);

  const ctx: ScoringContext = {
    evaluation: evalResult,
    playedCards: cards,
    heldCards: [],
    crew: [],
    handLevels: createDefaultHandLevels(),
    activeBoss: {
      id: 'fbi',
      name: 'FBI Wiretap',
      subtitle: 'The Feds are listening',
      description: 'Face cards score 0 chips',
      season: 2,
      multiplier: 1.5,
      rule: 'FBI_WIRETAP',
    },
    cash: 10,
    deckCount: 40,
  };

  const result = calculateScore(ctx);
  // Pair base chips is 10. Kings give 0 chips due to FBI wiretap.
  assert.equal(result.finalChips, 10);
});

test('Meadow Soprano defends against FBI Wiretap debuff on face cards', () => {
  const cards = [
    createMockCard('HEARTS', 13, 'k1'), // King (Face card)
    createMockCard('SPADES', 13, 'k2'), // King (Face card)
  ];
  const evalResult = evaluateHand(cards);

  const meadow: CrewMember = {
    id: 'meadow',
    name: 'Meadow Soprano',
    moniker: 'Ivy League',
    quote: 'Civil liberties!',
    mobRank: 'Associate',
    quotes: ['Civil liberties!'],
    rarity: 'Rare',
    cost: 8,
    description: 'Defense against boss debuffs',
    passiveType: 'MEADOW_COLUMBIA',
  };

  const ctx: ScoringContext = {
    evaluation: evalResult,
    playedCards: cards,
    heldCards: [],
    crew: [meadow],
    handLevels: createDefaultHandLevels(),
    activeBoss: {
      id: 'fbi',
      name: 'FBI Wiretap',
      subtitle: 'The Feds are listening',
      description: 'Face cards score 0 chips',
      season: 2,
      multiplier: 1.5,
      rule: 'FBI_WIRETAP',
    },
    cash: 10,
    deckCount: 40,
  };

  const result = calculateScore(ctx);
  // Meadow neutralizes the wiretap! Pair base 10 + 10 (k1) + 10 (k2) + 18*2 (Meadow) = 66 chips
  assert.equal(result.finalChips, 66);
});

test('Patsy Parisi grants x2 Mult and +50 Chips on Two Pair', () => {
  const cards = [
    createMockCard('HEARTS', 8, '8h'),
    createMockCard('SPADES', 8, '8s'),
    createMockCard('CLUBS', 5, '5c'),
    createMockCard('DIAMONDS', 5, '5d'),
  ];
  const evalResult = evaluateHand(cards);

  const patsy: CrewMember = {
    id: 'patsy',
    name: 'Patsy Parisi',
    moniker: 'Not cinematic',
    quote: 'It won’t be cinematic.',
    mobRank: 'Soldier',
    quotes: ['It won’t be cinematic.'],
    rarity: 'Rare',
    cost: 8,
    description: 'Two pair boost',
    passiveType: 'PATSY_TWO_PAIR',
  };

  const ctx: ScoringContext = {
    evaluation: evalResult,
    playedCards: cards,
    heldCards: [],
    crew: [patsy],
    handLevels: createDefaultHandLevels(),
    activeBoss: null,
    cash: 10,
    deckCount: 40,
  };

  const result = calculateScore(ctx);
  // Two Pair base is 20 chips, 2 mult
  // 8h(8) + 8s(8) + 5c(5) + 5d(5) = +26 chips => 46 chips
  // Patsy adds +50 chips => 96 chips, and x2 mult => 2 * 2 = 4 mult
  assert.equal(result.finalChips, 96);
  assert.equal(result.finalMult, 4);
});

test('Executive Lounge collectibles apply card bonuses and mult multipliers', () => {
  const cards = [
    createMockCard('HEARTS', 4, '4h'),
    createMockCard('SPADES', 4, '4s'),
  ];
  const evalResult = evaluateHand(cards);

  const wildTurkey = {
    id: 'wild_turkey_101',
    name: 'Wild Turkey 101 Bourbon',
    brand: 'Wild Turkey',
    itemType: 'WHISKY' as const,
    rarity: 'Common' as const,
    cost: 4,
    origin: 'Kentucky',
    description: 'Low cards get +15 chips',
    flavorQuote: 'Burns going down',
    effect: {
      cardRankBonus: { isFaceCard: false, chips: 15 },
    },
  };

  const macallan25 = {
    id: 'macallan_25_sherry',
    name: 'The Macallan 25yr Sherry Oak',
    brand: 'Macallan',
    itemType: 'WHISKY' as const,
    rarity: 'Legendary' as const,
    cost: 13,
    origin: 'Highlands',
    description: 'Final mult x1.35',
    flavorQuote: 'Boss reserve',
    effect: {
      multMultiplier: 1.35,
    },
  };

  const ctx: ScoringContext = {
    evaluation: evalResult,
    playedCards: cards,
    heldCards: [],
    crew: [],
    loungeItems: [wildTurkey, macallan25],
    handLevels: createDefaultHandLevels(),
    activeBoss: null,
    cash: 10,
    deckCount: 40,
  };

  const result = calculateScore(ctx);
  // Pair base: 10 chips, 2 mult
  // Card 4h: 4 base + 15 Wild Turkey = 19 chips
  // Card 4s: 4 base + 15 Wild Turkey = 19 chips
  // Total chips = 10 + 19 + 19 = 48 chips
  // Mult = 2 * 1.35 = 2.7 -> rounded to 3
  assert.equal(result.finalChips, 48);
  assert.equal(result.finalMult, 3);
});

test('FBI heat calculation accounts for illegal hands, violent soldiers, concrete and laundered cards', () => {
  // Test 1: Four of a Kind (+8) with Paulie (violent: +2) and 1 Concrete (+5) = 15 Heat
  const fourKings = [
    createMockCard('HEARTS', 13, 'k1'),
    createMockCard('SPADES', 13, 'k2'),
    createMockCard('CLUBS', 13, 'k3'),
    createMockCard('DIAMONDS', 13, 'k4'),
    { ...createMockCard('HEARTS', 2, 'c1'), enhancement: 'CONCRETE' as const },
  ];
  const evalResult = evaluateHand(fourKings);
  const paulie: CrewMember = {
    id: 'paulie',
    name: 'Paulie Walnuts',
    moniker: 'Hehe',
    quote: 'Hehe!',
    mobRank: 'Capo',
    quotes: ['Hehe!'],
    rarity: 'Common',
    cost: 4,
    description: '+4 Mult',
    passiveType: 'PAULIE_MULT',
  };

  const res1 = calculateScore({
    evaluation: evalResult,
    playedCards: fourKings,
    heldCards: [],
    crew: [paulie],
    handLevels: createDefaultHandLevels(),
    activeBoss: null,
    cash: 10,
    deckCount: 40,
  });
  // 8 (Four of a Kind) + 2 (Paulie) + 5 (1 Concrete) = 15
  assert.equal(res1.heatChange, 15);

  // Test 2: Pair (+1) with no violent soldiers and 1 Laundered (-8) = -7 Heat
  const launderedCards = [
    { ...createMockCard('HEARTS', 10, '1'), enhancement: 'LAUNDERED' as const },
    createMockCard('SPADES', 10, '2'),
  ];
  const eval2 = evaluateHand(launderedCards);
  const res2 = calculateScore({
    evaluation: eval2,
    playedCards: launderedCards,
    heldCards: [],
    crew: [],
    handLevels: createDefaultHandLevels(),
    activeBoss: null,
    cash: 10,
    deckCount: 40,
  });
  // 1 (Pair) + 0 - 8 (1 Laundered) = -7
  assert.equal(res2.heatChange, -7);
});

