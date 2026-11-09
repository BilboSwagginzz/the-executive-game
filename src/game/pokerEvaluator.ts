import { Card, HandEvaluation, PokerHandType } from './types';

export const DEFAULT_HAND_SCORES: Record<PokerHandType, { name: string; chips: number; mult: number }> = {
  HIGH_CARD: { name: 'High Card', chips: 5, mult: 1 },
  PAIR: { name: 'Pair', chips: 10, mult: 2 },
  TWO_PAIR: { name: 'Two Pair', chips: 20, mult: 2 },
  THREE_OF_A_KIND: { name: 'Three of a Kind', chips: 30, mult: 3 },
  STRAIGHT: { name: 'Straight', chips: 30, mult: 4 },
  FLUSH: { name: 'Flush', chips: 35, mult: 4 },
  FULL_HOUSE: { name: 'Full House', chips: 40, mult: 4 },
  FOUR_OF_A_KIND: { name: 'Four of a Kind', chips: 60, mult: 7 },
  STRAIGHT_FLUSH: { name: 'Straight Flush', chips: 100, mult: 8 },
  ROYAL_FLUSH: { name: 'Royal Flush', chips: 150, mult: 10 },
};

export function evaluateHand(cards: Card[]): HandEvaluation {
  if (!cards || cards.length === 0) {
    return {
      handType: 'HIGH_CARD',
      handName: 'No Cards',
      scoringCards: [],
      baseChips: 0,
      baseMult: 0,
    };
  }

  // Filter regular scoring cards vs concrete (stone) cards
  const standardCards = cards.filter((c) => c.enhancement !== 'CONCRETE');
  const concreteCards = cards.filter((c) => c.enhancement === 'CONCRETE');

  // If all cards are concrete cards:
  if (standardCards.length === 0) {
    const base = DEFAULT_HAND_SCORES.HIGH_CARD;
    return {
      handType: 'HIGH_CARD',
      handName: 'Concrete Block',
      scoringCards: cards,
      baseChips: base.chips,
      baseMult: base.mult,
    };
  }

  // Sort descending by rank
  const sorted = [...standardCards].sort((a, b) => b.rank - a.rank);

  // Group by rank
  const rankGroups: Record<number, Card[]> = {};
  for (const c of sorted) {
    if (!rankGroups[c.rank]) rankGroups[c.rank] = [];
    rankGroups[c.rank].push(c);
  }

  // Group by suit
  const suitGroups: Record<string, Card[]> = {};
  for (const c of sorted) {
    if (!suitGroups[c.suit]) suitGroups[c.suit] = [];
    suitGroups[c.suit].push(c);
  }

  // Sort groups by size descending, then by rank descending
  const rankGroupList = Object.entries(rankGroups)
    .map(([rankStr, grp]) => ({ rank: Number(rankStr), cards: grp, count: grp.length }))
    .sort((a, b) => b.count - a.count || b.rank - a.rank);

  const isFlush = Object.values(suitGroups).some((grp) => grp.length >= 5);
  const flushSuitCards = Object.values(suitGroups).find((grp) => grp.length >= 5);

  const straightResult = checkStraight(sorted);

  // Royal Flush & Straight Flush check
  if (isFlush && flushSuitCards) {
    const flushSorted = [...flushSuitCards].sort((a, b) => b.rank - a.rank);
    const flushStraight = checkStraight(flushSorted);
    if (flushStraight.isStraight) {
      const isRoyal = flushStraight.cards[0].rank === 14 && flushStraight.cards[4].rank === 10;
      const hType: PokerHandType = isRoyal ? 'ROYAL_FLUSH' : 'STRAIGHT_FLUSH';
      const base = DEFAULT_HAND_SCORES[hType];
      return {
        handType: hType,
        handName: base.name,
        scoringCards: [...flushStraight.cards, ...concreteCards],
        baseChips: base.chips,
        baseMult: base.mult,
      };
    }
  }

  // Four of a Kind
  if (rankGroupList[0].count >= 4) {
    const base = DEFAULT_HAND_SCORES.FOUR_OF_A_KIND;
    return {
      handType: 'FOUR_OF_A_KIND',
      handName: base.name,
      scoringCards: [...rankGroupList[0].cards.slice(0, 4), ...concreteCards],
      baseChips: base.chips,
      baseMult: base.mult,
    };
  }

  // Full House (3 of one rank + 2 of another)
  if (rankGroupList[0].count >= 3 && rankGroupList.length > 1 && rankGroupList[1].count >= 2) {
    const base = DEFAULT_HAND_SCORES.FULL_HOUSE;
    return {
      handType: 'FULL_HOUSE',
      handName: base.name,
      scoringCards: [
        ...rankGroupList[0].cards.slice(0, 3),
        ...rankGroupList[1].cards.slice(0, 2),
        ...concreteCards,
      ],
      baseChips: base.chips,
      baseMult: base.mult,
    };
  }

  // Flush
  if (isFlush && flushSuitCards) {
    const base = DEFAULT_HAND_SCORES.FLUSH;
    return {
      handType: 'FLUSH',
      handName: base.name,
      scoringCards: [...flushSuitCards.slice(0, 5), ...concreteCards],
      baseChips: base.chips,
      baseMult: base.mult,
    };
  }

  // Straight
  if (straightResult.isStraight) {
    const base = DEFAULT_HAND_SCORES.STRAIGHT;
    return {
      handType: 'STRAIGHT',
      handName: base.name,
      scoringCards: [...straightResult.cards, ...concreteCards],
      baseChips: base.chips,
      baseMult: base.mult,
    };
  }

  // Three of a Kind
  if (rankGroupList[0].count >= 3) {
    const base = DEFAULT_HAND_SCORES.THREE_OF_A_KIND;
    return {
      handType: 'THREE_OF_A_KIND',
      handName: base.name,
      scoringCards: [...rankGroupList[0].cards.slice(0, 3), ...concreteCards],
      baseChips: base.chips,
      baseMult: base.mult,
    };
  }

  // Two Pair
  if (rankGroupList[0].count >= 2 && rankGroupList.length > 1 && rankGroupList[1].count >= 2) {
    const base = DEFAULT_HAND_SCORES.TWO_PAIR;
    return {
      handType: 'TWO_PAIR',
      handName: base.name,
      scoringCards: [
        ...rankGroupList[0].cards.slice(0, 2),
        ...rankGroupList[1].cards.slice(0, 2),
        ...concreteCards,
      ],
      baseChips: base.chips,
      baseMult: base.mult,
    };
  }

  // Pair
  if (rankGroupList[0].count >= 2) {
    const base = DEFAULT_HAND_SCORES.PAIR;
    return {
      handType: 'PAIR',
      handName: base.name,
      scoringCards: [...rankGroupList[0].cards.slice(0, 2), ...concreteCards],
      baseChips: base.chips,
      baseMult: base.mult,
    };
  }

  // High Card
  const base = DEFAULT_HAND_SCORES.HIGH_CARD;
  return {
    handType: 'HIGH_CARD',
    handName: base.name,
    scoringCards: [sorted[0], ...concreteCards],
    baseChips: base.chips,
    baseMult: base.mult,
  };
}

function checkStraight(sortedDesc: Card[]): { isStraight: boolean; cards: Card[] } {
  // Deduplicate ranks
  const uniqueRanks: Card[] = [];
  const seenRanks = new Set<number>();
  for (const c of sortedDesc) {
    if (!seenRanks.has(c.rank)) {
      seenRanks.add(c.rank);
      uniqueRanks.push(c);
    }
  }

  if (uniqueRanks.length < 5) {
    return { isStraight: false, cards: [] };
  }

  // Standard consecutive sequence check
  for (let i = 0; i <= uniqueRanks.length - 5; i++) {
    const slice = uniqueRanks.slice(i, i + 5);
    const isConsecutive = slice.every(
      (card, idx) => idx === 0 || slice[idx - 1].rank - card.rank === 1
    );
    if (isConsecutive) {
      return { isStraight: true, cards: slice };
    }
  }

  // Ace-Low Straight (A, 5, 4, 3, 2)
  const hasAce = uniqueRanks.find((c) => c.rank === 14);
  const five = uniqueRanks.find((c) => c.rank === 5);
  const four = uniqueRanks.find((c) => c.rank === 4);
  const three = uniqueRanks.find((c) => c.rank === 3);
  const two = uniqueRanks.find((c) => c.rank === 2);

  if (hasAce && five && four && three && two) {
    return {
      isStraight: true,
      cards: [five, four, three, two, hasAce],
    };
  }

  return { isStraight: false, cards: [] };
}
