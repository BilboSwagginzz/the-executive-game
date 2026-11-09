import { BossBlind, Card, CrewMember, HandEvaluation, HandLevel, LoungeItem, PokerHandType, ScoreStep } from './types';

export interface ScoringContext {
  evaluation: HandEvaluation;
  playedCards: Card[];
  heldCards: Card[];
  crew: CrewMember[];
  loungeItems?: LoungeItem[];
  handLevels: Record<PokerHandType, HandLevel>;
  activeBoss: BossBlind | null;
  cash: number;
  deckCount: number;
  handsLeft?: number;
  mattressActive?: boolean;
}

export interface ScoringResult {
  finalChips: number;
  finalMult: number;
  totalScore: number;
  steps: ScoreStep[];
  earnedCash: number;
  crewStateUpdates: Partial<CrewMember>[];
  heatChange: number;
}

export function calculateScore(ctx: ScoringContext): ScoringResult {
  const { evaluation, playedCards, crew, loungeItems = [], handLevels, activeBoss, cash, deckCount, handsLeft, mattressActive } = ctx;
  const steps: ScoreStep[] = [];
  const crewStateUpdates: Partial<CrewMember>[] = [];
  let earnedCash = 0;

  // 1. Initial Hand Level Base Chips & Mult
  const handLevel = handLevels[evaluation.handType] || { level: 1, chips: evaluation.baseChips, mult: evaluation.baseMult, playedCount: 0 };
  let currentChips = handLevel.chips;
  let currentMult = handLevel.mult;

  // Boss: Russian Commando limits hands to max 4 cards
  if (activeBoss?.rule === 'RUSSIAN_COMMANDO' && playedCards.length > 4) {
    currentMult = 1;
    steps.push({
      type: 'BOSS',
      sourceName: 'Russian Commando',
      currentChips,
      currentMult,
      message: 'Russian Commando ambushed! Hands with more than 4 cards have Mult reduced to 1.',
    });
  }

  steps.push({
    type: 'BASE',
    sourceName: `${evaluation.handName} (Lvl ${handLevel.level})`,
    chipsAdd: currentChips,
    multAdd: currentMult,
    currentChips,
    currentMult,
    message: `${evaluation.handName} Base: ${currentChips} Chips × ${currentMult} Mult`,
  });

  // Check Meadow Soprano protection against boss debuffs
  const hasMeadow = crew.some((m) => m.passiveType === 'MEADOW_COLUMBIA');

  // 2. Card Individual Chips & Enhancements
  for (const card of evaluation.scoringCards) {
    let cardChips = card.baseChips;
    let cardMult = 0;

    // Check Boss Blind: FBI Wiretap debuffs Face Cards (Jack, Queen, King)
    if (activeBoss?.rule === 'FBI_WIRETAP' && [11, 12, 13].includes(card.rank) && !hasMeadow) {
      steps.push({
        type: 'BOSS',
        sourceName: 'FBI Wiretap',
        currentChips,
        currentMult,
        message: `${getRankName(card.rank)} of ${card.suit} is WIRETAPPED! 0 Chips awarded.`,
        highlightCardId: card.id,
      });
      continue;
    }

    // Check Boss Blind: Executive Game Raid debuffs Spades & Clubs
    if (activeBoss?.rule === 'EXECUTIVE_RAID' && (card.suit === 'SPADES' || card.suit === 'CLUBS') && !hasMeadow) {
      steps.push({
        type: 'BOSS',
        sourceName: 'Executive Game Raid',
        currentChips,
        currentMult,
        message: `${getRankName(card.rank)} of ${card.suit} is confiscated by the precinct! 0 Chips awarded.`,
        highlightCardId: card.id,
      });
      continue;
    }

    // Check Boss Blind: Columbus Day Riot debuffs Hearts & Diamonds
    if (activeBoss?.rule === 'COLUMBUS_RIOT' && (card.suit === 'HEARTS' || card.suit === 'DIAMONDS') && !hasMeadow) {
      steps.push({
        type: 'BOSS',
        sourceName: 'Columbus Day Riot',
        currentChips,
        currentMult,
        message: `${getRankName(card.rank)} of ${card.suit} caught in the protest crossfire! 0 Chips awarded.`,
        highlightCardId: card.id,
      });
      continue;
    }

    // Concrete Enhancement (+50 chips)
    if (card.enhancement === 'CONCRETE') {
      cardChips += 50;
    }

    // Laundered Enhancement (+$3 Cash)
    if (card.enhancement === 'LAUNDERED') {
      earnedCash += 3;
      steps.push({
        type: 'CARD',
        sourceName: 'Laundered Card',
        currentChips,
        currentMult,
        message: `Laundered bill scored: +$3 clean cash!`,
        highlightCardId: card.id,
      });
    }

    // Holo Enhancement (+10 Mult)
    if (card.enhancement === 'HOLO') {
      cardMult += 10;
    }

    // Glass Enhancement (x2 Mult)
    let cardMultMultiplier = 1;
    if (card.enhancement === 'GLASS') {
      cardMultMultiplier = 2;
    }

    // Lounge item card-level effects (e.g. Wild Turkey 101, Johnnie Walker Blue, Lagavulin 16, Partagas Serie D4)
    for (const item of loungeItems) {
      if (item.effect.cardRankBonus) {
        const isFace = [11, 12, 13].includes(card.rank);
        if (item.effect.cardRankBonus.isFaceCard && isFace) {
          cardChips += item.effect.cardRankBonus.chips || 0;
          cardMult += item.effect.cardRankBonus.mult || 0;
          if (item.effect.cashPerRound) {
            earnedCash += 1;
          }
        } else if (item.effect.cardRankBonus.isFaceCard === false && !isFace && card.rank <= 7) {
          cardChips += item.effect.cardRankBonus.chips || 0;
          cardMult += item.effect.cardRankBonus.mult || 0;
        }
      }
      if (item.effect.suitBonus) {
        if (
          item.effect.suitBonus.suit === card.suit ||
          (item.effect.suitBonus.suit === 'HEARTS' && (card.suit === 'HEARTS' || card.suit === 'DIAMONDS'))
        ) {
          cardChips += item.effect.suitBonus.chips || 0;
          cardMult += item.effect.suitBonus.mult || 0;
        }
      }
    }

    currentChips += cardChips;
    currentMult = (currentMult + cardMult) * cardMultMultiplier;

    steps.push({
      type: 'CARD',
      sourceName: `${getRankName(card.rank)} of ${card.suit}`,
      chipsAdd: cardChips,
      multAdd: cardMult > 0 ? cardMult : undefined,
      multMultiplier: cardMultMultiplier > 1 ? cardMultMultiplier : undefined,
      currentChips,
      currentMult,
      message: `+${cardChips} Chips${cardMult > 0 ? ` & +${cardMult} Mult` : ''}${cardMultMultiplier > 1 ? ` (×${cardMultMultiplier})` : ''}`,
      highlightCardId: card.id,
    });
  }

  // 3. Crew Members (Jokers) Triggers
  for (let i = 0; i < crew.length; i++) {
    const member = crew[i];

    // Check Boss Blind: Rat in the Crew disables a random or specific crew member
    if (activeBoss?.rule === 'RAT_IN_CREW' && i === 0) {
      steps.push({
        type: 'BOSS',
        sourceName: 'A Rat in the Crew',
        currentChips,
        currentMult,
        message: `${member.name} is under FBI surveillance and inactive this round!`,
        crewIndex: i,
      });
      continue;
    }

    applyCrewMemberEffect(member, i, crew, {
      evaluation,
      playedCards,
      scoringCards: evaluation.scoringCards,
      cash,
      deckCount,
      handsLeft,
      activeBoss,
      currentChips: () => currentChips,
      currentMult: () => currentMult,
      setChips: (c) => (currentChips = c),
      setMult: (m) => (currentMult = m),
      steps,
      crewStateUpdates,
    });
  }

  // 4. Executive Lounge: Whiskies & Cigars Stash Triggers
  for (const item of loungeItems) {
    let loungeChipsAdd = item.effect.chipsBonus || 0;
    let loungeMultAdd = item.effect.multBonus || 0;
    let loungeMultMult = item.effect.multMultiplier || 1;

    if (item.effect.handTypeBonus && item.effect.handTypeBonus.handTypes.includes(evaluation.handType)) {
      loungeMultAdd += item.effect.handTypeBonus.mult || 0;
      loungeChipsAdd += item.effect.handTypeBonus.chips || 0;
    }

    if (loungeChipsAdd > 0 || loungeMultAdd > 0 || loungeMultMult > 1 || item.effect.cashPerRound) {
      currentChips += loungeChipsAdd;
      currentMult = Math.round((currentMult + loungeMultAdd) * loungeMultMult);
      if (item.effect.cashPerRound) {
        earnedCash += item.effect.cashPerRound;
      }
      steps.push({
        type: 'LOUNGE',
        sourceName: item.name,
        chipsAdd: loungeChipsAdd > 0 ? loungeChipsAdd : undefined,
        multAdd: loungeMultAdd > 0 ? loungeMultAdd : undefined,
        multMultiplier: loungeMultMult > 1 ? loungeMultMult : undefined,
        currentChips,
        currentMult,
        message: `${item.itemType === 'WHISKY' ? '🥃' : '💨'} ${item.name}: ${item.description}`,
      });
    }
  }

  // 5. Consumable: Go to the Mattresses (x2 Mult)
  if (mattressActive) {
    currentMult *= 2;
    steps.push({
      type: 'BASE',
      sourceName: 'Go to the Mattresses',
      multMultiplier: 2,
      currentChips,
      currentMult,
      message: `War footing active! ×2 Mult applied!`,
    });
  }

  // 6. Boss Blind Modifiers
  if (activeBoss?.rule === 'CHRIS_REHAB') {
    currentMult = Math.max(1, Math.round(currentMult * 0.75));
    steps.push({
      type: 'BOSS',
      sourceName: 'Christopher in Rehab',
      currentChips,
      currentMult,
      message: `Crew morale down: Mult reduced by 25%!`,
    });
  }

  // 7. Calculate FBI Heat Delta
  let heatChange = 0;
  // High-scoring "illegal" hand types:
  if (evaluation.handType === 'ROYAL_FLUSH' || evaluation.handType === 'STRAIGHT_FLUSH') {
    heatChange += 10;
  } else if (evaluation.handType === 'FOUR_OF_A_KIND') {
    heatChange += 8;
  } else if (evaluation.handType === 'FULL_HOUSE' || evaluation.handType === 'FLUSH') {
    heatChange += 4;
  } else if (evaluation.handType === 'STRAIGHT') {
    heatChange += 3;
  } else {
    heatChange += 1;
  }

  // Violent crew members present in your crew:
  const violentCrewIds = ['paulie', 'furio', 'chris', 'richie', 'mikey_palmice', 'tony_b'];
  const activeViolentCount = crew.filter((m) => violentCrewIds.includes(m.id)).length;
  heatChange += activeViolentCount * 2;

  // Concrete cards (+5% Heat each)
  const concreteCount = playedCards.filter((c) => c.enhancement === 'CONCRETE').length;
  heatChange += concreteCount * 5;

  // Laundered cards (-8% Heat each)
  const launderedCount = playedCards.filter((c) => c.enhancement === 'LAUNDERED').length;
  heatChange -= launderedCount * 8;

  const totalScore = currentChips * currentMult;

  steps.push({
    type: 'FINAL',
    sourceName: "The Boss's Cut Total",
    currentChips,
    currentMult,
    message: `${currentChips.toLocaleString()} Chips × ${currentMult.toLocaleString()} Mult = $${totalScore.toLocaleString()}`,
  });

  return {
    finalChips: currentChips,
    finalMult: currentMult,
    totalScore,
    steps,
    earnedCash,
    crewStateUpdates,
    heatChange,
  };
}

function applyCrewMemberEffect(
  member: CrewMember,
  index: number,
  allCrew: CrewMember[],
  ctx: {
    evaluation: HandEvaluation;
    playedCards: Card[];
    scoringCards: Card[];
    cash: number;
    deckCount: number;
    handsLeft?: number;
    activeBoss: BossBlind | null;
    currentChips: () => number;
    currentMult: () => number;
    setChips: (c: number) => void;
    setMult: (m: number) => void;
    steps: ScoreStep[];
    crewStateUpdates: Partial<CrewMember>[];
  }
) {
  switch (member.passiveType) {
    case 'PAULIE_MULT': {
      // +4 Mult. "Hehe!"
      const newMult = ctx.currentMult() + 4;
      ctx.setMult(newMult);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        multAdd: 4,
        currentChips: ctx.currentChips(),
        currentMult: newMult,
        message: `${member.name}: "${member.quote}" (+4 Mult)`,
        crewIndex: index,
      });
      break;
    }

    case 'FURIO_CHIPS': {
      // Converts $5 bank interest into +60 chips
      const chipsAdd = ctx.cash >= 5 ? 60 : 25;
      const newChips = ctx.currentChips() + chipsAdd;
      ctx.setChips(newChips);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        chipsAdd,
        currentChips: newChips,
        currentMult: ctx.currentMult(),
        message: `${member.name}: "${member.quote}" (+${chipsAdd} Chips)`,
        crewIndex: index,
      });
      break;
    }

    case 'SILVIO_COPY': {
      // Consigliere copies the crew member to his right
      if (index + 1 < allCrew.length) {
        const target = allCrew[index + 1];
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          currentChips: ctx.currentChips(),
          currentMult: ctx.currentMult(),
          message: `${member.name}: "${member.quote}" (Duplicating ${target.name})`,
          crewIndex: index,
        });
        applyCrewMemberEffect(target, index + 1, allCrew, ctx);
      } else {
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          currentChips: ctx.currentChips(),
          currentMult: ctx.currentMult(),
          message: `${member.name}: "Nobody to my right to advise!"`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'CHRIS_STRAIGHT_FLUSH': {
      // +3 Mult permanently if hand is Straight or Flush
      const isEligible = ctx.evaluation.handType === 'STRAIGHT' || ctx.evaluation.handType === 'FLUSH' || ctx.evaluation.handType === 'STRAIGHT_FLUSH';
      const currentCounter = (member.counter || 0) + (isEligible ? 3 : 0);
      if (isEligible) {
        ctx.crewStateUpdates.push({ id: member.id, counter: currentCounter });
      }
      if (currentCounter > 0) {
        const newMult = ctx.currentMult() + currentCounter;
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          multAdd: currentCounter,
          currentChips: ctx.currentChips(),
          currentMult: newMult,
          message: `${member.name}: "${member.quote}" (+${currentCounter} Mult)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'UNCLE_JUNIOR_LOW': {
      // Hands where all scoring cards have rank <= 8 gain +45 chips and +4 mult
      const allLow = ctx.scoringCards.every((c) => c.rank <= 8);
      if (allLow && ctx.scoringCards.length > 0) {
        const newChips = ctx.currentChips() + 45;
        const newMult = ctx.currentMult() + 4;
        ctx.setChips(newChips);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd: 45,
          multAdd: 4,
          currentChips: newChips,
          currentMult: newMult,
          message: `${member.name}: "${member.quote}" (+45 Chips & +4 Mult for low cards)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'BOBBY_CLUBS_SPADES': {
      // +25 Chips per Spade or Club scored
      const count = ctx.scoringCards.filter((c) => c.suit === 'CLUBS' || c.suit === 'SPADES').length;
      if (count > 0) {
        const chipsAdd = count * 25;
        const newChips = ctx.currentChips() + chipsAdd;
        ctx.setChips(newChips);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd,
          currentChips: newChips,
          currentMult: ctx.currentMult(),
          message: `${member.name}: "${member.quote}" (+${chipsAdd} Chips from ${count} black suits)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'LIVIA_POOR_YOU': {
      // x3 Mult if hand contains zero Hearts!
      const hasHeart = ctx.scoringCards.some((c) => c.suit === 'HEARTS');
      if (!hasHeart && ctx.scoringCards.length > 0) {
        const newMult = ctx.currentMult() * 3;
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          multMultiplier: 3,
          currentChips: ctx.currentChips(),
          currentMult: newMult,
          message: `${member.name}: "${member.quote}" (×3 Mult for zero Hearts!)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'HESH_SHYLOCK': {
      // +50 Chips but -10% Mult
      const newChips = ctx.currentChips() + 65;
      const newMult = Math.max(1, Math.round(ctx.currentMult() * 0.9));
      ctx.setChips(newChips);
      ctx.setMult(newMult);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        chipsAdd: 65,
        currentChips: newChips,
        currentMult: newMult,
        message: `${member.name}: "${member.quote}" (+65 Chips, 10% Vig fee)`,
        crewIndex: index,
      });
      break;
    }

    case 'TONY_DON': {
      // Face cards give +25 Chips & +5 Mult; x1.75 on Boss Blinds
      const faceCardCount = ctx.scoringCards.filter((c) => [11, 12, 13, 14].includes(c.rank)).length;
      let newChips = ctx.currentChips() + faceCardCount * 25;
      let newMult = ctx.currentMult() + faceCardCount * 5;
      if (ctx.activeBoss) {
        newMult = Math.round(newMult * 1.75);
      }
      ctx.setChips(newChips);
      ctx.setMult(newMult);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        chipsAdd: faceCardCount * 25,
        multAdd: faceCardCount * 5,
        multMultiplier: ctx.activeBoss ? 1.75 : undefined,
        currentChips: newChips,
        currentMult: newMult,
        message: `${member.name}: "${member.quote}" (+${faceCardCount * 25} Chips, +${faceCardCount * 5} Mult${ctx.activeBoss ? ', ×1.75 Boss Mult' : ''})`,
        crewIndex: index,
      });
      break;
    }

    case 'RALPHIE_EARNER': {
      // +18 Mult
      const newMult = ctx.currentMult() + 18;
      ctx.setMult(newMult);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        multAdd: 18,
        currentChips: ctx.currentChips(),
        currentMult: newMult,
        message: `${member.name}: "${member.quote}" (+18 Mult)`,
        crewIndex: index,
      });
      break;
    }

    case 'JOHNNY_SACK_DIAMONDS': {
      // +35 Chips & +2 Mult per Diamond
      const diamondCount = ctx.scoringCards.filter((c) => c.suit === 'DIAMONDS').length;
      if (diamondCount > 0) {
        const chipsAdd = diamondCount * 35;
        const multAdd = diamondCount * 2;
        const newChips = ctx.currentChips() + chipsAdd;
        const newMult = ctx.currentMult() + multAdd;
        ctx.setChips(newChips);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd,
          multAdd,
          currentChips: newChips,
          currentMult: newMult,
          message: `${member.name}: "${member.quote}" (+${chipsAdd} Chips & +${multAdd} Mult from ${diamondCount} Diamonds)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'RICHIE_JACKET': {
      // +4 Mult & +20 Chips per Jack scored
      const jackCount = ctx.scoringCards.filter((c) => c.rank === 11).length;
      if (jackCount > 0) {
        const chipsAdd = jackCount * 20;
        const multAdd = jackCount * 4;
        const newChips = ctx.currentChips() + chipsAdd;
        const newMult = ctx.currentMult() + multAdd;
        ctx.setChips(newChips);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd,
          multAdd,
          currentChips: newChips,
          currentMult: newMult,
          message: `${member.name}: "The Jaaacket!" (+${chipsAdd} Chips & +${multAdd} Mult from ${jackCount} Jacks)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'PUSSY_OCEAN': {
      // +15 Chips for every 4 cards left in draw pile
      const setsOfFour = Math.floor(ctx.deckCount / 4);
      const chipsAdd = setsOfFour * 15;
      if (chipsAdd > 0) {
        const newChips = ctx.currentChips() + chipsAdd;
        ctx.setChips(newChips);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd,
          currentChips: newChips,
          currentMult: ctx.currentMult(),
          message: `${member.name}: "${member.quote}" (+${chipsAdd} Chips from ${ctx.deckCount} cards in deck)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'ARTIE_VESUVIO': {
      // +25 Chips on Two Pair or Full House
      if (ctx.evaluation.handType === 'TWO_PAIR' || ctx.evaluation.handType === 'FULL_HOUSE') {
        const newChips = ctx.currentChips() + 35;
        ctx.setChips(newChips);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd: 35,
          currentChips: newChips,
          currentMult: ctx.currentMult(),
          message: `${member.name}: "Vesuvio Special!" (+35 Chips for delicious pairing)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'JANICE_RETRIGGER': {
      // Re-trigger the first scoring card
      if (ctx.scoringCards.length > 0) {
        const firstCard = ctx.scoringCards[0];
        const chipsAdd = firstCard.enhancement === 'CONCRETE' ? 50 : firstCard.baseChips;
        const newChips = ctx.currentChips() + chipsAdd;
        ctx.setChips(newChips);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd,
          currentChips: newChips,
          currentMult: ctx.currentMult(),
          message: `${member.name}: "Extraordinary Visual Sense!" (Retriggering ${firstCard.rank} of ${firstCard.suit}: +${chipsAdd} Chips)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'MIKEY_MIDOL': {
      // +14 Mult if hand contains exactly 1 Face card
      const faceCount = ctx.scoringCards.filter((c) => [11, 12, 13, 14].includes(c.rank)).length;
      if (faceCount === 1) {
        const newMult = ctx.currentMult() + 14;
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          multAdd: 14,
          currentChips: ctx.currentChips(),
          currentMult: newMult,
          message: `${member.name}: "Take a Midol!" (+14 Mult for lone face card)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'FEECH_SEVENTIES': {
      // +25 Chips per low card (2..6)
      const lowCount = ctx.scoringCards.filter((c) => c.rank >= 2 && c.rank <= 6).length;
      if (lowCount > 0) {
        const chipsAdd = lowCount * 25;
        const newChips = ctx.currentChips() + chipsAdd;
        ctx.setChips(newChips);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd,
          currentChips: newChips,
          currentMult: ctx.currentMult(),
          message: `${member.name}: "Back in the '70s!" (+${chipsAdd} Chips from ${lowCount} low cards)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'PHIL_CAN': {
      // If hand contains exactly 4 cards, grants x2.5 Mult
      if (ctx.playedCards.length === 4) {
        const newMult = Math.round(ctx.currentMult() * 2.5);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          multMultiplier: 2.5,
          currentChips: ctx.currentChips(),
          currentMult: newMult,
          message: `${member.name}: "20 Years in the Can!" (×2.5 Mult for 4-card compromise!)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'JACKIE_JR_RESPECT': {
      // If Low Tier Hand (High Card or Pair), gains +60 Chips and +4 Mult
      if (ctx.evaluation.handType === 'HIGH_CARD' || ctx.evaluation.handType === 'PAIR') {
        const newChips = ctx.currentChips() + 60;
        const newMult = ctx.currentMult() + 4;
        ctx.setChips(newChips);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd: 60,
          multAdd: 4,
          currentChips: newChips,
          currentMult: newMult,
          message: `${member.name}: "${member.quote}" (+60 Chips & +4 Mult for low tier respect)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'AJ_EXISTENTIAL': {
      // Existential dread: +8 Mult
      const newMult = ctx.currentMult() + 8;
      ctx.setMult(newMult);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        multAdd: 8,
        currentChips: ctx.currentChips(),
        currentMult: newMult,
        message: `${member.name}: "${member.quote}" (+8 Mult through sheer apathy)`,
        crewIndex: index,
      });
      break;
    }

    case 'MEADOW_COLUMBIA': {
      // Face cards give +18 Chips and +3 Mult each
      const faceCount = ctx.scoringCards.filter((c) => [11, 12, 13, 14].includes(c.rank)).length;
      if (faceCount > 0) {
        const chipsAdd = faceCount * 18;
        const multAdd = faceCount * 3;
        const newChips = ctx.currentChips() + chipsAdd;
        const newMult = ctx.currentMult() + multAdd;
        ctx.setChips(newChips);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd,
          multAdd,
          currentChips: newChips,
          currentMult: newMult,
          message: `${member.name}: "${member.quote}" (+${chipsAdd} Chips & +${multAdd} Mult from ${faceCount} Honor Roll Face cards)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'LITTLE_CARMINE_PROPANE': {
      // The Sacred and the Propane: +50 Chips & x1.5 Mult
      const newChips = ctx.currentChips() + 50;
      const newMult = Math.round(ctx.currentMult() * 1.5);
      ctx.setChips(newChips);
      ctx.setMult(newMult);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        chipsAdd: 50,
        multMultiplier: 1.5,
        currentChips: newChips,
        currentMult: newMult,
        message: `${member.name}: "The Sacred and the Propane!" (+50 Chips & ×1.5 Mult)`,
        crewIndex: index,
      });
      break;
    }

    case 'ADRIANA_CRAZY_HORSE': {
      // Clubs give +14 Chips & +3 Mult each; +$2 cash if >=3 Clubs
      const clubCount = ctx.scoringCards.filter((c) => c.suit === 'CLUBS').length;
      if (clubCount > 0) {
        const chipsAdd = clubCount * 14;
        const multAdd = clubCount * 3;
        const newChips = ctx.currentChips() + chipsAdd;
        const newMult = ctx.currentMult() + multAdd;
        ctx.setChips(newChips);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd,
          multAdd,
          currentChips: newChips,
          currentMult: newMult,
          message: `${member.name}: "${member.quote}" (+${chipsAdd} Chips & +${multAdd} Mult from ${clubCount} Clubs)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'TONY_B_EVEN_HEAL': {
      // Even cards give +6 Mult each
      const evenCount = ctx.scoringCards.filter((c) => c.rank % 2 === 0).length;
      if (evenCount > 0) {
        const multAdd = evenCount * 6;
        const newMult = ctx.currentMult() + multAdd;
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          multAdd,
          currentChips: ctx.currentChips(),
          currentMult: newMult,
          message: `${member.name}: "West Caldwell Relaxation" (+${multAdd} Mult from ${evenCount} even cards)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'PATSY_TWO_PAIR': {
      // If hand is Two Pair, +50 Chips & x2 Mult
      if (ctx.evaluation.handType === 'TWO_PAIR') {
        const newChips = ctx.currentChips() + 50;
        const newMult = ctx.currentMult() * 2;
        ctx.setChips(newChips);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd: 50,
          multMultiplier: 2,
          currentChips: newChips,
          currentMult: newMult,
          message: `${member.name}: "It won't be cinematic!" (+50 Chips & ×2 Mult on Two Pair)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'BENNY_MASTERMIND': {
      // +40 Chips on every hand
      const newChips = ctx.currentChips() + 40;
      ctx.setChips(newChips);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        chipsAdd: 40,
        currentChips: newChips,
        currentMult: ctx.currentMult(),
        message: `${member.name}: "Criminal Mastermind at work!" (+40 Chips)`,
        crewIndex: index,
      });
      break;
    }

    case 'ROSALIE_NOSTRADAMUS': {
      // If Full House or Three of a Kind, +80 Chips & +6 Mult
      if (ctx.evaluation.handType === 'FULL_HOUSE' || ctx.evaluation.handType === 'THREE_OF_A_KIND') {
        const newChips = ctx.currentChips() + 80;
        const newMult = ctx.currentMult() + 6;
        ctx.setChips(newChips);
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          chipsAdd: 80,
          multAdd: 6,
          currentChips: newChips,
          currentMult: newMult,
          message: `${member.name}: "Eat your manicott'!" (+80 Chips & +6 Mult)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'GLORIA_LONDON_BROIL': {
      // If last hand (handsLeft <= 1), x3 Mult! Otherwise +5 Mult
      if (ctx.handsLeft !== undefined && ctx.handsLeft <= 1) {
        const newMult = ctx.currentMult() * 3;
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          multMultiplier: 3,
          currentChips: ctx.currentChips(),
          currentMult: newMult,
          message: `${member.name}: "London Broil flying!" (CLUTCH HAND: ×3 Mult!)`,
          crewIndex: index,
        });
      } else {
        const newMult = ctx.currentMult() + 5;
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          multAdd: 5,
          currentChips: ctx.currentChips(),
          currentMult: newMult,
          message: `${member.name}: "${member.quote}" (+5 Mult)`,
          crewIndex: index,
        });
      }
      break;
    }

    case 'AGENT_HARRIS_TIPOFF': {
      // +100 Chips against Boss Blinds, +35 against regular
      const chipsAdd = ctx.activeBoss ? 100 : 35;
      const newChips = ctx.currentChips() + chipsAdd;
      ctx.setChips(newChips);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        chipsAdd,
        currentChips: newChips,
        currentMult: ctx.currentMult(),
        message: `${member.name}: "Veal Parm Tip-Off" (+${chipsAdd} Chips${ctx.activeBoss ? ' vs Boss Blind' : ''})`,
        crewIndex: index,
      });
      break;
    }

    case 'GIGI_ULCER': {
      // +14 Mult
      const newMult = ctx.currentMult() + 14;
      ctx.setMult(newMult);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        multAdd: 14,
        currentChips: ctx.currentChips(),
        currentMult: newMult,
        message: `${member.name}: "Capo's Stress" (+14 Mult)`,
        crewIndex: index,
      });
      break;
    }

    case 'SVETLANA_TITANIUM': {
      // +45 Chips
      const newChips = ctx.currentChips() + 45;
      ctx.setChips(newChips);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        chipsAdd: 45,
        currentChips: newChips,
        currentMult: ctx.currentMult(),
        message: `${member.name}: "Russian Titanium Resolve" (+45 Chips)`,
        crewIndex: index,
      });
      break;
    }

    case 'BEANSIE_PIZZERIA': {
      // +20 Chips per scoring card
      const chipsAdd = ctx.scoringCards.length * 20;
      const newChips = ctx.currentChips() + chipsAdd;
      ctx.setChips(newChips);
      ctx.steps.push({
        type: 'CREW',
        sourceName: member.name,
        chipsAdd,
        currentChips: newChips,
        currentMult: ctx.currentMult(),
        message: `${member.name}: "Pizzeria Revenue" (+${chipsAdd} Chips from ${ctx.scoringCards.length} cards)`,
        crewIndex: index,
      });
      break;
    }

    case 'GINNY_SACK_STASH': {
      // Diamonds give +5 Mult each
      const diamondCount = ctx.scoringCards.filter((c) => c.suit === 'DIAMONDS').length;
      if (diamondCount > 0) {
        const multAdd = diamondCount * 5;
        const newMult = ctx.currentMult() + multAdd;
        ctx.setMult(newMult);
        ctx.steps.push({
          type: 'CREW',
          sourceName: member.name,
          multAdd,
          currentChips: ctx.currentChips(),
          currentMult: newMult,
          message: `${member.name}: "Secret Laundry Stash" (+${multAdd} Mult from ${diamondCount} Diamonds)`,
          crewIndex: index,
        });
      }
      break;
    }

    default:
      break;
  }
}

function getRankName(rank: number): string {
  if (rank <= 10) return String(rank);
  if (rank === 11) return 'Jack';
  if (rank === 12) return 'Queen';
  if (rank === 13) return 'King';
  return 'Ace';
}
