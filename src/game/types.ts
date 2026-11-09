export type Suit = 'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES';

export type CardRank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export type CardEnhancement = 'NORMAL' | 'CONCRETE' | 'LAUNDERED' | 'GOLD' | 'HOLO' | 'STEEL' | 'GLASS';

export interface Card {
  id: string;
  suit: Suit;
  rank: CardRank;
  baseChips: number;
  enhancement?: CardEnhancement;
  isDebuffed?: boolean;
}

export type PokerHandType =
  | 'HIGH_CARD'
  | 'PAIR'
  | 'TWO_PAIR'
  | 'THREE_OF_A_KIND'
  | 'STRAIGHT'
  | 'FLUSH'
  | 'FULL_HOUSE'
  | 'FOUR_OF_A_KIND'
  | 'STRAIGHT_FLUSH'
  | 'ROYAL_FLUSH';

export interface HandEvaluation {
  handType: PokerHandType;
  handName: string;
  scoringCards: Card[];
  baseChips: number;
  baseMult: number;
}

export interface HandLevel {
  level: number;
  chips: number;
  mult: number;
  playedCount: number;
}

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';

export type MobRank = 'Associate' | 'Soldier' | 'Capo' | 'Consigliere' | 'Underboss' | 'Boss';

export type GameDifficulty = 'ASSOCIATE' | 'CAPO' | 'NY_BOSS';

export interface CrewMember {
  id: string;
  name: string;
  moniker: string;
  mobRank: MobRank;
  quote: string;
  quotes: string[];
  rarity: Rarity;
  cost: number;
  description: string;
  image?: string;
  iconName?: string;
  isConsigliere?: boolean;
  passiveType:
    | 'PAULIE_MULT'
    | 'FURIO_CHIPS'
    | 'SILVIO_COPY'
    | 'CHRIS_STRAIGHT_FLUSH'
    | 'UNCLE_JUNIOR_LOW'
    | 'DR_MELFI_CALM'
    | 'CARMELA_BIRD_FEEDER'
    | 'LIVIA_POOR_YOU'
    | 'BOBBY_CLUBS_SPADES'
    | 'HESH_SHYLOCK'
    | 'TONY_DON'
    | 'RALPHIE_EARNER'
    | 'JOHNNY_SACK_DIAMONDS'
    | 'RICHIE_JACKET'
    | 'PUSSY_OCEAN'
    | 'ARTIE_VESUVIO'
    | 'JANICE_RETRIGGER'
    | 'MIKEY_MIDOL'
    | 'FEECH_SEVENTIES'
    | 'PHIL_CAN'
    | 'JACKIE_JR_RESPECT'
    | 'AJ_EXISTENTIAL'
    | 'MEADOW_COLUMBIA'
    | 'LITTLE_CARMINE_PROPANE'
    | 'ADRIANA_CRAZY_HORSE'
    | 'TONY_B_EVEN_HEAL'
    | 'PATSY_TWO_PAIR'
    | 'BENNY_MASTERMIND'
    | 'ROSALIE_NOSTRADAMUS'
    | 'GLORIA_LONDON_BROIL'
    | 'AGENT_HARRIS_TIPOFF'
    | 'GIGI_ULCER'
    | 'SVETLANA_TITANIUM'
    | 'BEANSIE_PIZZERIA'
    | 'GINNY_SACK_STASH';
  counter?: number;
}

export interface FrontBusiness {
  id: string;
  name: string;
  handType: PokerHandType;
  chipsBonus: number;
  multBonus: number;
  cost: number;
  description: string;
}

export interface Favor {
  id: string;
  name: string;
  category: 'FAVOR' | 'BRIBE' | 'HIT';
  cost: number;
  description: string;
  targetType: 'CARD_SELECT' | 'INSTANT' | 'BOSS_REROLL';
  effectType:
    | 'WHACK_CARD'
    | 'CONCRETE_CARD'
    | 'LAUNDER_CARD'
    | 'GOLD_CARD'
    | 'BRIBE_DA'
    | 'CASH_ENVELOPE'
    | 'MATTRESS_MULT'
    | 'SATRIALE_FLUSH_CONVERT';
}

export type BlindType = 'SMALL' | 'BIG' | 'BOSS';

export interface BossBlind {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  season?: number;
  multiplier: number;
  rule:
    | 'PINE_BARRENS' // Discards frozen
    | 'FBI_WIRETAP' // Face cards score 0 chips
    | 'PANIC_ATTACK' // 1 less hand and cards facedown
    | 'WAR_WITH_NY' // Target Vig +40%
    | 'RAT_IN_CREW' // Leftmost Crew disabled
    | 'CHRIS_REHAB' // Mults clamped by 25%
    | 'DAVEY_BUSTOUT' // 0 cash payout from round
    | 'EXECUTIVE_RAID' // Black suits (Spades & Clubs) score 0 chips
    | 'RUSSIAN_COMMANDO' // Only hands with 4 or fewer cards score
    | 'SITDOWN_CARMINE' // Cannot play the same hand type consecutively
    | 'COLUMBUS_RIOT' // Red suits (Hearts & Diamonds) debuffed
    | 'JUNIOR_TRIAL'; // Retriggers disabled
}

export interface BlindInfo {
  type: BlindType;
  title: string;
  targetVig: number;
  reward: number;
  boss?: BossBlind;
}

export type LoungeItemType = 'WHISKY' | 'CIGAR';

export interface LoungeItem {
  id: string;
  name: string;
  brand: string;
  itemType: LoungeItemType;
  rarity: Rarity;
  cost: number;
  description: string;
  origin: string;
  flavorQuote: string;
  effect: {
    chipsBonus?: number;
    multBonus?: number;
    multMultiplier?: number;
    handSizeBonus?: number;
    extraHands?: number;
    extraDiscards?: number;
    interestCapBonus?: number;
    cashPerRound?: number;
    cashPerSmallBlind?: number;
    suitBonus?: { suit: Suit; chips?: number; mult?: number };
    cardRankBonus?: { isFaceCard?: boolean; chips?: number; mult?: number };
    handTypeBonus?: { handTypes: PokerHandType[]; mult?: number; chips?: number };
  };
}

export interface ScoreStep {
  type: 'BASE' | 'CARD' | 'CREW' | 'BOSS' | 'LOUNGE' | 'FINAL';
  sourceName: string;
  chipsAdd?: number;
  multAdd?: number;
  multMultiplier?: number;
  currentChips: number;
  currentMult: number;
  message: string;
  highlightCardId?: string;
  crewIndex?: number;
}

export type JukeboxTrackId = 'trip_hop' | 'crooner' | 'blues_rock' | 'lounge_noir';

export interface JukeboxTrack {
  id: JukeboxTrackId;
  title: string;
  artist: string;
  genre: string;
  year: string;
  vibe: string;
}

export interface FbiRaidData {
  confiscatedCash: number;
  reason: string;
}

