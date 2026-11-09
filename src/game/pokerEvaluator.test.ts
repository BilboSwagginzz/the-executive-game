import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateHand } from './pokerEvaluator';
import { Card } from './types';

function makeCard(suit: 'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES', rank: Card['rank'], id = 'c'): Card {
  return {
    id,
    suit,
    rank,
    baseChips: rank <= 10 ? rank : rank === 14 ? 11 : 10,
  };
}

test('evaluates High Card correctly', () => {
  const cards = [makeCard('HEARTS', 14), makeCard('CLUBS', 9), makeCard('SPADES', 4)];
  const result = evaluateHand(cards);
  assert.equal(result.handType, 'HIGH_CARD');
  assert.equal(result.scoringCards[0].rank, 14);
});

test('evaluates Pair and Two Pair correctly', () => {
  const pair = [makeCard('HEARTS', 10), makeCard('SPADES', 10), makeCard('CLUBS', 4)];
  assert.equal(evaluateHand(pair).handType, 'PAIR');

  const twoPair = [
    makeCard('HEARTS', 10),
    makeCard('SPADES', 10),
    makeCard('CLUBS', 4),
    makeCard('DIAMONDS', 4),
    makeCard('HEARTS', 2),
  ];
  assert.equal(evaluateHand(twoPair).handType, 'TWO_PAIR');
});

test('evaluates Straight and Ace-Low Straight', () => {
  const straight = [
    makeCard('HEARTS', 9),
    makeCard('SPADES', 8),
    makeCard('CLUBS', 7),
    makeCard('DIAMONDS', 6),
    makeCard('HEARTS', 5),
  ];
  assert.equal(evaluateHand(straight).handType, 'STRAIGHT');

  const aceLowStraight = [
    makeCard('HEARTS', 14),
    makeCard('SPADES', 5),
    makeCard('CLUBS', 4),
    makeCard('DIAMONDS', 3),
    makeCard('HEARTS', 2),
  ];
  assert.equal(evaluateHand(aceLowStraight).handType, 'STRAIGHT');
});

test('evaluates Flush and Full House', () => {
  const flush = [
    makeCard('HEARTS', 14),
    makeCard('HEARTS', 10),
    makeCard('HEARTS', 8),
    makeCard('HEARTS', 6),
    makeCard('HEARTS', 3),
  ];
  assert.equal(evaluateHand(flush).handType, 'FLUSH');

  const fullHouse = [
    makeCard('CLUBS', 8),
    makeCard('DIAMONDS', 8),
    makeCard('HEARTS', 8),
    makeCard('SPADES', 13),
    makeCard('HEARTS', 13),
  ];
  assert.equal(evaluateHand(fullHouse).handType, 'FULL_HOUSE');
});

test('evaluates Four of a Kind and Royal Flush', () => {
  const fourKind = [
    makeCard('CLUBS', 7),
    makeCard('DIAMONDS', 7),
    makeCard('HEARTS', 7),
    makeCard('SPADES', 7),
    makeCard('HEARTS', 2),
  ];
  assert.equal(evaluateHand(fourKind).handType, 'FOUR_OF_A_KIND');

  const royalFlush = [
    makeCard('SPADES', 14),
    makeCard('SPADES', 13),
    makeCard('SPADES', 12),
    makeCard('SPADES', 11),
    makeCard('SPADES', 10),
  ];
  assert.equal(evaluateHand(royalFlush).handType, 'ROYAL_FLUSH');
});
