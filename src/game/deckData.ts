import { BossBlind, Card, CrewMember, Favor, FrontBusiness, Suit } from './types';

export const BACKROOM_BG = '/src/assets/images/sopranos_poker_backroom_1794078117419.jpg';
export const BADA_BING_CELEBRATION = '/src/assets/images/bada_bing_crew_celebration_1794090650601.jpg';

// Core 7 Show-Accurate High-Fidelity Pixel Portraits (Redone to be dramatic, not comedic)
export const TONY_PORTRAIT = '/src/assets/images/tony_soprano_portrait_1794091772231.jpg';
export const PAULIE_PORTRAIT = '/src/assets/images/paulie_walnuts_portrait_1794091773618.jpg';
export const SILVIO_PORTRAIT = '/src/assets/images/silvio_dante_portrait_1794091773836.jpg';
export const CHRIS_PORTRAIT = '/src/assets/images/chris_moltisanti_portrait_1794091774209.jpg';
export const FURIO_PORTRAIT = '/src/assets/images/furio_giunta_portrait_1794091789194.jpg';
export const UNCLE_JUNIOR_PORTRAIT = '/src/assets/images/uncle_junior_portrait_1794091791109.jpg';
export const PHIL_LEOTARDO_PORTRAIT = '/src/assets/images/phil_leotardo_portrait_1794091791637.jpg';

// Additional 13 Show-Accurate High-Fidelity Pixel Portraits
export const RALPH_PORTRAIT = '/src/assets/images/ralph_cifaretto_portrait_1794091791505.jpg';
export const JOHNNY_SACK_PORTRAIT = '/src/assets/images/johnny_sack_portrait_1794091807790.jpg';
export const RICHIE_PORTRAIT = '/src/assets/images/richie_aprile_portrait_1794091809308.jpg';
export const PUSSY_PORTRAIT = '/src/assets/images/big_pussy_portrait_1794091808793.jpg';
export const CARMELA_PORTRAIT = '/src/assets/images/carmela_soprano_portrait_1794091808593.jpg';
export const ARTIE_PORTRAIT = '/src/assets/images/artie_bucco_portrait_1794091831383.jpg';
export const MIKEY_PORTRAIT = '/src/assets/images/mikey_palmice_portrait_1794091832540.jpg';
export const FEECH_PORTRAIT = '/src/assets/images/feech_lamanna_portrait_1794091832534.jpg';
export const JANICE_PORTRAIT = '/src/assets/images/janice_soprano_portrait_1794091832962.jpg';
export const BOBBY_PORTRAIT = '/src/assets/images/bobby_bacala_portrait_1794091850387.jpg';
export const LIVIA_PORTRAIT = '/src/assets/images/livia_soprano_portrait_1794091850888.jpg';
export const MELFI_PORTRAIT = '/src/assets/images/dr_melfi_portrait_1794091853277.jpg';
export const HESH_PORTRAIT = '/src/assets/images/hesh_rabkin_portrait_1794091852403.jpg';

// 15 Deep Cut & Family Show-Accurate High-Fidelity Pixel Portraits
export const JACKIE_JR_PORTRAIT = '/src/assets/images/jackie_jr_portrait_1794094813756.jpg';
export const AJ_SOPRANO_PORTRAIT = '/src/assets/images/aj_soprano_portrait_1794094815509.jpg';
export const MEADOW_SOPRANO_PORTRAIT = '/src/assets/images/meadow_soprano_portrait_1794094814782.jpg';
export const LITTLE_CARMINE_PORTRAIT = '/src/assets/images/little_carmine_portrait_1794094816593.jpg';
export const ADRIANA_PORTRAIT = '/src/assets/images/adriana_lacerva_portrait_1794094817268.jpg';
export const TONY_B_PORTRAIT = '/src/assets/images/tony_blundetto_portrait_1794094817452.jpg';
export const PATSY_PORTRAIT = '/src/assets/images/patsy_parisi_portrait_1794094818125.jpg';
export const BENNY_PORTRAIT = '/src/assets/images/benny_fazio_portrait_1794094819647.jpg';
export const ROSALIE_PORTRAIT = '/src/assets/images/rosalie_aprile_portrait_1794094820027.jpg';
export const GLORIA_PORTRAIT = '/src/assets/images/gloria_trillo_portrait_1794094821131.jpg';
export const AGENT_HARRIS_PORTRAIT = '/src/assets/images/agent_harris_portrait_1794094821282.jpg';
export const GIGI_PORTRAIT = '/src/assets/images/gigi_cestone_portrait_1794094821357.jpg';
export const SVETLANA_PORTRAIT = '/src/assets/images/svetlana_portrait_1794094821576.jpg';
export const BEANSIE_PORTRAIT = '/src/assets/images/beansie_gaeta_portrait_1794094823157.jpg';
export const GINNY_SACK_PORTRAIT = '/src/assets/images/ginny_sack_portrait_1794094823330.jpg';

// Victory Scene: Atmospheric Scotch Whisky & Lit Maduro Cigar
export const CIGAR_WHISKY_VICTORY = '/src/assets/images/cigar_whisky_tribute_1794094842319.jpg';

export function createStandardDeck(): Card[] {
  const suits: Suit[] = ['CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (let rank = 2; rank <= 14; rank++) {
      const baseChips = rank <= 10 ? rank : rank === 14 ? 11 : 10;
      deck.push({
        id: `card_${suit}_${rank}_${Math.random().toString(36).substring(2, 7)}`,
        suit,
        rank: rank as Card['rank'],
        baseChips,
        enhancement: 'NORMAL',
      });
    }
  }

  return shuffleDeck(deck);
}

export function shuffleDeck<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const ALL_CREW_MEMBERS: CrewMember[] = [
  {
    id: 'paulie',
    name: 'Paulie Walnuts',
    moniker: 'The Hitman',
    mobRank: 'Capo',
    quote: 'Hehe! Tone, hear what I told him?',
    quotes: [
      'Hehe! Tone, hear what I told him? I said, "You remember your first blowjob?" He said, "Yeah." I said, "How long did it take the guy to cum?" Hehe!',
      "You're not gonna believe this. He killed 16 Czechoslovakians. The guy was an interior decorator!",
      "Oof, madonn'! He looks terrible!",
      "F***ing slander, ask me!",
      'Ride the painted pony, let the spinning wheel glide.',
      "As far as f***ing modeling was concerned, I would've been a success.",
    ],
    rarity: 'Common',
    cost: 4,
    description: '+4 Mult to every played hand. 1-in-6 chance to ditch an extra card.',
    image: PAULIE_PORTRAIT,
    passiveType: 'PAULIE_MULT',
  },
  {
    id: 'silvio',
    name: 'Silvio Dante',
    moniker: 'Consigliere',
    mobRank: 'Consigliere',
    quote: 'Just when I thought I was out, they pull me back in!',
    quotes: [
      'Just when I thought I was out, they pull me back in!',
      "Our friend over there with the stomach... he's concerned.",
      'Leave the f***ing cheese there! I love f***ing cheese at my feet!',
      'Timeline got f***ed up.',
      'Some people are so far behind in a race that they actually believe they’re leading.',
    ],
    rarity: 'Uncommon',
    cost: 7,
    description: 'Consigliere: Copies the ability of the crew member placed to his right.',
    image: SILVIO_PORTRAIT,
    isConsigliere: true,
    passiveType: 'SILVIO_COPY',
  },
  {
    id: 'chris',
    name: 'Christopher Moltisanti',
    moniker: 'The Protégé',
    mobRank: 'Soldier',
    quote: 'I did-dent!',
    quotes: [
      'I did-dent!',
      'Where’s my arc, Paulie? Where’s my arc?',
      'Fear knocked on the door. Faith answered. There was no one there.',
      'He was an interior decorator? His house looked like shit!',
      'It’s an optical illusion about the chin!',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Permanently scales +3 Mult whenever a Straight or Flush is played.',
    image: CHRIS_PORTRAIT,
    counter: 0,
    passiveType: 'CHRIS_STRAIGHT_FLUSH',
  },
  {
    id: 'furio',
    name: 'Furio Giunta',
    moniker: 'The Enforcer',
    mobRank: 'Soldier',
    quote: 'Give me one thousand dollars.',
    quotes: [
      'Give me one thousand dollars.',
      'You got a bee on-a you hat.',
      'Stupida f***ing game!',
      'In Napoli, lot of people are not so happy for Columbus.',
      'Don’t bitch to me.',
    ],
    rarity: 'Rare',
    cost: 8,
    description: 'Converts cash into +60 Chips per hand (+25 Chips if under $5 cash).',
    image: FURIO_PORTRAIT,
    passiveType: 'FURIO_CHIPS',
  },
  {
    id: 'junior',
    name: 'Uncle Junior',
    moniker: 'Corrado Soprano',
    mobRank: 'Boss',
    quote: 'What kind of way is that to talk to a sick man?',
    quotes: [
      'What kind of way is that to talk to a sick man?',
      'You got a problem besides those pants?',
      'You’re fleecing me! A hand of gabagool costs more than this!',
      'Take it easy, we’re not making a western here.',
      'Some people are out there stuffing themselves, and I get a dry bagel.',
      'Pass the red peppers.',
    ],
    rarity: 'Common',
    cost: 5,
    description: 'Hands where all scoring cards have rank 8 or below gain +45 Chips and +4 Mult.',
    image: UNCLE_JUNIOR_PORTRAIT,
    passiveType: 'UNCLE_JUNIOR_LOW',
  },
  {
    id: 'phil',
    name: 'Phil Leotardo',
    moniker: 'The Shah of Iran',
    mobRank: 'Boss',
    quote: '20 years in the can. I wanted manicott’, I compromised.',
    quotes: [
      '20 years in the can. I wanted manicott’, I compromised. I ate grilled cheese off the radiator instead.',
      'There’s no scraps in my scrapbook.',
      'Adios, you f***ing skank!',
      'Let me tell you a couple of three things.',
      'Five f***ing families, and we got this pygmy thing over in Jersey!',
    ],
    rarity: 'Rare',
    cost: 8,
    description: 'If your played hand contains exactly 4 cards, grants ×2.5 Mult.',
    image: PHIL_LEOTARDO_PORTRAIT,
    passiveType: 'PHIL_CAN',
  },
  {
    id: 'ralphie',
    name: 'Ralph Cifaretto',
    moniker: 'Top Earner',
    mobRank: 'Capo',
    quote: 'She was a whoo-ah!',
    quotes: [
      'She was a whoo-ah! And that wasn’t my kid she was carrying!',
      'I have come to reclaim Rome for my people!',
      'A: She was a whoo-ah. B: She hit me. And that wasn’t my kid she was carrying.',
      'Why not? I’m a great cook! A secret recipe with the sour cream.',
      'What, it’s my fault the horse was sick?!',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Earns +18 Mult on every hand, but 1-in-6 chance to incinerate $2 cash.',
    image: RALPH_PORTRAIT,
    passiveType: 'RALPHIE_EARNER',
  },
  {
    id: 'johnny_sack',
    name: 'Johnny Sack',
    moniker: 'Underboss of NY',
    mobRank: 'Underboss',
    quote: 'What is this, the F***ING U.N. NOW?!',
    quotes: [
      'What is this, the F***ING U.N. NOW?!',
      'Speak! Before I lose my temper!',
      'Her name is Ginny, and she’s rubenesque!',
      'My temper, Tony... my temper.',
      'I’ll demand he’s taxed. But clip him? Over an insult?',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: '+35 Chips and +2 Mult for every Diamond scored in the hand.',
    image: JOHNNY_SACK_PORTRAIT,
    passiveType: 'JOHNNY_SACK_DIAMONDS',
  },
  {
    id: 'richie',
    name: 'Richie Aprile',
    moniker: 'Tremendous Moxie',
    mobRank: 'Capo',
    quote: "It’s the jaaacket! The jacket I took off Rocco DiMeo!",
    quotes: [
      "It’s the jaaacket! The jacket I took off Rocco DiMeo! Cocksucker had the toughest reputation in Essex County!",
      'He couldn’t f***ing sell it. He’s not respected.',
      'You got tremendous moxie for your size.',
      'I’ll build a ramp up to your ass... drive a Lionel up in there.',
      'Don’t give me those Manson lamps!',
    ],
    rarity: 'Common',
    cost: 5,
    description: '+4 Mult and +20 Chips for each Jack scored.',
    image: RICHIE_PORTRAIT,
    passiveType: 'RICHIE_JACKET',
  },
  {
    id: 'pussy',
    name: 'Big Pussy Bonpensiero',
    moniker: 'Booty',
    mobRank: 'Soldier',
    quote: 'Anyway, four dollars a pound.',
    quotes: [
      'Anyway, four dollars a pound.',
      'Tone, I swear on my mother, it wasn’t me!',
      'You know who talks to the feds? Nobody!',
      'I’m a mind reader! I see right through this table!',
      'These guys on the boat... they’re laughing at me.',
    ],
    rarity: 'Common',
    cost: 5,
    description: '+15 Chips for every 4 cards remaining in your draw pile.',
    image: PUSSY_PORTRAIT,
    passiveType: 'PUSSY_OCEAN',
  },
  {
    id: 'carmela',
    name: 'Carmela Soprano',
    moniker: 'The First Lady',
    mobRank: 'Associate',
    quote: 'I took the $40,000 from the bird feeder.',
    quotes: [
      'I took the $40,000 from the bird feeder! And don’t you deny it was there!',
      'More is lost by indecision than wrong decision.',
      'What you do feeds this family, Tony.',
      'I’m having Father Phil over for baked ziti.',
      'You have an emotional affair with that psychiatrist!',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Skims $4 from every won blind into an emergency envelope you can cash out.',
    image: CARMELA_PORTRAIT,
    passiveType: 'CARMELA_BIRD_FEEDER',
  },
  {
    id: 'artie',
    name: 'Artie Bucco',
    moniker: 'Warm & Convivial',
    mobRank: 'Associate',
    quote: 'I cook with non-stop ass rape from these distributors!',
    quotes: [
      'I cook with non-stop ass rape from these distributors!',
      'A warm and convivial host, that’s what Zagat called me!',
      'Jean-Philippe, qu’est-ce que c’est? Message machine broken?!',
      'Rabbit with garlic and rosemary, freshly harvested from my garden.',
      'You know what, Tony? You burned down my restaurant!',
    ],
    rarity: 'Common',
    cost: 4,
    description: '+1 Discard per round and +25 Chips whenever you play a Two Pair or Full House.',
    image: ARTIE_PORTRAIT,
    passiveType: 'ARTIE_VESUVIO',
  },
  {
    id: 'mikey',
    name: 'Mikey Palmice',
    moniker: 'Grab a Midol',
    mobRank: 'Soldier',
    quote: 'Go take a Midol, JoJo.',
    quotes: [
      'Go take a Midol, JoJo.',
      'I told you, it’s a muscular spasm in my shoulder!',
      'Hey, who’s that behind you in the woods?!',
      'Were you wearing a wire on Junior?',
      'I’m Junior’s right hand, prick!',
    ],
    rarity: 'Common',
    cost: 5,
    description: '+14 Mult if your scored hand contains exactly 1 Face card.',
    image: MIKEY_PORTRAIT,
    passiveType: 'MIKEY_MIDOL',
  },
  {
    id: 'feech',
    name: 'Feech La Manna',
    moniker: 'King of Georgia Peaches',
    mobRank: 'Capo',
    quote: 'Back in my day, in the 70s...',
    quotes: [
      'Back in my day, in the 70s, a man gave his word, that was that!',
      'Did I ever tell you about the bakery on 8th Avenue?',
      'So I took his shoe and I beat him with it!',
      'What are you looking at? I made my bones before you were born!',
      'Good bread, good meat, good god let’s eat.',
    ],
    rarity: 'Common',
    cost: 5,
    description: '+25 Chips for every 2, 3, 4, 5, or 6 scored in your hand.',
    image: FEECH_PORTRAIT,
    passiveType: 'FEECH_SEVENTIES',
  },
  {
    id: 'janice',
    name: 'Janice Soprano',
    moniker: 'Parvati',
    mobRank: 'Associate',
    quote: 'I have an extraordinary visual sense.',
    quotes: [
      'I have an extraordinary visual sense.',
      'Richie had tremendous moxie! He put a ramp up to the house!',
      'You think you’re the only one who had a childhood with Livia?!',
      'I’m in touch with my inner guru.',
      'He hit me, Tony... so I shot him in the kitchen.',
    ],
    rarity: 'Rare',
    cost: 7,
    description: 'Re-triggers the very first scoring card 1 extra time!',
    image: JANICE_PORTRAIT,
    passiveType: 'JANICE_RETRIGGER',
  },
  {
    id: 'bobby',
    name: 'Bobby Bacala',
    moniker: 'The Gentle Giant',
    mobRank: 'Soldier',
    quote: 'To the victor belongs the spoils.',
    quotes: [
      'To the victor belongs the spoils.',
      'Why don’t you look in the mirror sometime, you insensitive cocksucker!',
      'You know, Quasimodo predicted all of this.',
      'I like toy trains, alright?! Blue comet is worth three grand!',
      'Karen’s baked ziti... it’s still in the freezer.',
    ],
    rarity: 'Common',
    cost: 5,
    description: '+30 Chips for every Spade or Club scored in your hand.',
    image: BOBBY_PORTRAIT,
    passiveType: 'BOBBY_CLUBS_SPADES',
  },
  {
    id: 'livia',
    name: 'Livia Soprano',
    moniker: 'The Matriarch',
    mobRank: 'Associate',
    quote: 'Poor you! I gave my life to my children on a silver platter.',
    quotes: [
      'Poor you! I gave my life to my children on a silver platter.',
      'I wish the Lord would take me now.',
      'These blabbermouth cunts!',
      'He was a saint! Johnny Boy was a saint!',
      'Look at you, walking around like you own the place.',
      'Water, water, water... it’s like living next to Gunga Din!',
    ],
    rarity: 'Rare',
    cost: 8,
    description: 'Grants ×3 Mult if your scored hand contains zero Hearts.',
    image: LIVIA_PORTRAIT,
    passiveType: 'LIVIA_POOR_YOU',
  },
  {
    id: 'melfi',
    name: 'Dr. Jennifer Melfi',
    moniker: 'The Analyst',
    mobRank: 'Associate',
    quote: 'How does that make you feel, Tony?',
    quotes: [
      'How does that make you feel, Tony?',
      'Depression is rage turned inward.',
      'Have you been taking your lithium?',
      'No. (I will not ask Tony to avenge me.)',
      'Our sessions are privileged and strictly confidential.',
    ],
    rarity: 'Rare',
    cost: 8,
    description: 'Neutralizes psychological Boss Blind debuffs and grants +1 Hand each round.',
    image: MELFI_PORTRAIT,
    passiveType: 'DR_MELFI_CALM',
  },
  {
    id: 'hesh',
    name: 'Hesh Rabkin',
    moniker: 'The Shylock',
    mobRank: 'Associate',
    quote: 'A hit is a hit, and this my friend, is not a hit.',
    quotes: [
      'A hit is a hit, and this my friend, is not a hit.',
      'Vig is the lifeblood of this business, Tone.',
      'Now that’s what I call a vig! Ten points a week, minimum.',
      'I got horses out in Monmouth county that cost less to feed than this racket.',
      'Frank Sinatra once sat right where you’re sitting.',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Grants +75 Chips per hand, but skims 10% off final Mult.',
    image: HESH_PORTRAIT,
    passiveType: 'HESH_SHYLOCK',
  },
  {
    id: 'tony',
    name: 'Tony Soprano',
    moniker: 'The Don',
    mobRank: 'Boss',
    quote: 'All due respect, you got no idea what it is to be Number One.',
    quotes: [
      'All due respect, you got no idea what it is to be Number One. Every decision you make affects every facet of every other thing.',
      'Those who want respect, give respect.',
      'Where is the smoked turkey?! I’ve been dreaming of that lo mein all the way over here!',
      'I’m like King Midas in reverse: everything I touch turns to shit.',
      'Even a broken clock is right twice a day.',
      'It’s good to be in something from the ground floor. I came too late for that, I know.',
    ],
    rarity: 'Legendary',
    cost: 10,
    description: 'Face cards (J, Q, K, A) grant +25 Chips & +5 Mult. Grants ×1.75 Mult on Boss Blinds.',
    image: TONY_PORTRAIT,
    passiveType: 'TONY_DON',
  },
  {
    id: 'jackie_jr',
    name: 'Jackie Aprile Jr.',
    moniker: 'Out of Respect for My Fawtha',
    mobRank: 'Associate',
    quote: 'Out of respect for my fawtha.',
    quotes: [
      'Out of respect for my fawtha.',
      'I was gonna say, like, the crank do you think?',
      'No offense, but I got an uncle who’s a capo.',
      'Who’s speaking here? Is somebody speaking?',
      'A-S-S as in how about giving me some?',
    ],
    rarity: 'Common',
    cost: 5,
    description: 'If scoring High Card or Pair, grants +60 Chips & +4 Mult out of respect.',
    image: JACKIE_JR_PORTRAIT,
    passiveType: 'JACKIE_JR_RESPECT',
  },
  {
    id: 'aj_soprano',
    name: 'AJ Soprano',
    moniker: 'The Nihilist',
    mobRank: 'Associate',
    quote: 'It’s dicked up. What’s the point?',
    quotes: [
      'It’s dicked up. What’s the point? In the end, we all die in our own arms.',
      'Death just shows the ultimate absurdity of life.',
      'I didn’t do nuthin’!',
      'You got me a Nissan Xterra?!',
      'So that’s a crack ho!',
    ],
    rarity: 'Common',
    cost: 4,
    description: 'Existential dread fuels +8 Mult on every hand played.',
    image: AJ_SOPRANO_PORTRAIT,
    passiveType: 'AJ_EXISTENTIAL',
  },
  {
    id: 'meadow_soprano',
    name: 'Meadow Soprano',
    moniker: 'The Ivy League Scholar',
    mobRank: 'Associate',
    quote: 'You’re in the waste management business! Everyone knows that!',
    quotes: [
      'You’re in the waste management business! Everyone knows that!',
      'Look at the state of civil liberties in this country since 9/11!',
      'Sometimes we’re all hypocrites.',
      'I can’t parallel park! The space was too small!',
      'You have no idea what it’s like to be Tony Soprano’s daughter.',
    ],
    rarity: 'Rare',
    cost: 8,
    description: 'Constitutional legal defense: Neutralizes Boss suit debuffs. Face cards grant +18 Chips & +3 Mult.',
    image: MEADOW_SOPRANO_PORTRAIT,
    passiveType: 'MEADOW_COLUMBIA',
  },
  {
    id: 'little_carmine',
    name: 'Little Carmine',
    moniker: 'The Malaprop Master',
    mobRank: 'Underboss',
    quote: 'We’re talking about the sacred and the propane.',
    quotes: [
      'We’re talking about the sacred and the propane.',
      'It’s common knowledge the guy’s retarded.',
      'You’re at the precipice of an enormous crossroads.',
      'A pint of blood costs more than a gallon of gold.',
      'Very allegorical.',
      'Even in the hot tub, with the chits and the golf...',
    ],
    rarity: 'Rare',
    cost: 8,
    description: 'The Sacred & The Propane: Grants +50 Chips and elevates final score by ×1.5 Mult.',
    image: LITTLE_CARMINE_PORTRAIT,
    passiveType: 'LITTLE_CARMINE_PROPANE',
  },
  {
    id: 'adriana',
    name: 'Adriana La Cerva',
    moniker: 'Crazy Horse Hostess',
    mobRank: 'Associate',
    quote: 'Christofuh, please! They know everything!',
    quotes: [
      'Christofuh, please! They know everything!',
      'I have irritable bowel syndrome!',
      'I run the Crazy Horse, Tony! It’s a legitimate venue!',
      'Cosette was cold, she just crawled under there for warmth!',
      'He gave me a tennis bracelet!',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Crazy Horse Lounge: Clubs grant +14 Chips & +3 Mult each when scored.',
    image: ADRIANA_PORTRAIT,
    passiveType: 'ADRIANA_CRAZY_HORSE',
  },
  {
    id: 'tony_b',
    name: 'Tony Blundetto',
    moniker: 'Tony B',
    mobRank: 'Soldier',
    quote: 'West Caldwell... Wes Call-well!',
    quotes: [
      'West Caldwell... Wes Call-well!',
      'M’boy, are you fat!',
      'I was thinking of opening a massage parlor. Totally legit.',
      'Twelve grand in a bag tossed from a car... it was like mana from heaven.',
      'I did 10 years, Tone. I’m trying to walk the straight line.',
    ],
    rarity: 'Uncommon',
    cost: 7,
    description: 'Therapeutic discipline: Each scored even card (2, 4, 6, 8, 10) grants +6 Mult.',
    image: TONY_B_PORTRAIT,
    passiveType: 'TONY_B_EVEN_HEAL',
  },
  {
    id: 'patsy',
    name: 'Patsy Parisi',
    moniker: 'Cold-Blooded Twin',
    mobRank: 'Soldier',
    quote: 'It won’t be cinematic.',
    quotes: [
      'It won’t be cinematic.',
      'My twin brother Spoons... they told me it was Philly Parisi.',
      'Here’s some scrap iron for your pool.',
      'You want a pastry? It’s on the house.',
      'If you ever look at him again, it won’t be cinematic.',
    ],
    rarity: 'Rare',
    cost: 8,
    description: 'Twin vengeance: If played hand is Two Pair, grants +50 Chips & ×2 Mult.',
    image: PATSY_PORTRAIT,
    passiveType: 'PATSY_TWO_PAIR',
  },
  {
    id: 'benny',
    name: 'Benny Fazio',
    moniker: 'Criminal Mastermind',
    mobRank: 'Soldier',
    quote: 'I’m a criminal mastermind, Tone.',
    quotes: [
      'I’m a criminal mastermind, Tone.',
      'Artie Bucco came to my house at 3 in the morning with a gun!',
      'I was picking up the girl, Tone, that’s all!',
      'Phil Leotardo jumped me with a cane outside the salon.',
      'We got the credit card skimmer dialed in.',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Skims the books: Grants +40 Chips per hand, and Backroom shop rerolls cost $2 less.',
    image: BENNY_PORTRAIT,
    passiveType: 'BENNY_MASTERMIND',
  },
  {
    id: 'rosalie',
    name: 'Rosalie Aprile',
    moniker: 'The Matriarch',
    mobRank: 'Associate',
    quote: 'F***ing nosy?! Eat your manicott’!',
    quotes: [
      'F***ing nosy?! Eat your manicott’!',
      'Judas took 30 pieces of silver. You’re giving it away for free!',
      'What? It’s true! The man was a saint!',
      'F*** Nostradamus! Quasimodo predicted all this!',
      'Carmela, you have to stand by your man.',
    ],
    rarity: 'Uncommon',
    cost: 7,
    description: 'Fierce encouragement: Full House and Three of a Kind grant +80 Chips & +6 Mult.',
    image: ROSALIE_PORTRAIT,
    passiveType: 'ROSALIE_NOSTRADAMUS',
  },
  {
    id: 'gloria',
    name: 'Gloria Trillo',
    moniker: 'The High-Stakes Romance',
    mobRank: 'Associate',
    quote: 'Poor you! Always with the drama!',
    quotes: [
      'Poor you! Always with the drama!',
      'You’re not gonna throw a steak at me, are you?',
      'I know how to sell a Mercedes-Benz.',
      'Did you tell her about us?!',
      'I’m a grown woman, Tony.',
    ],
    rarity: 'Rare',
    cost: 8,
    description: 'London Broil drama: Grants +5 Mult, but on your very last remaining hand grants ×3 Mult!',
    image: GLORIA_PORTRAIT,
    passiveType: 'GLORIA_LONDON_BROIL',
  },
  {
    id: 'agent_harris',
    name: 'Agent Dwight Harris',
    moniker: 'The Satriale’s Regular',
    mobRank: 'Associate',
    quote: 'Damn! We’re gonna win this thing!',
    quotes: [
      'Damn! We’re gonna win this thing!',
      'Can I get a veal parmesan hero, Tone?',
      'I’m in anti-terrorism now. Pakistan division.',
      'Phil Leotardo... he’s at an oyster bay payphone.',
      'I shouldn’t be telling you this.',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Veal Parm Tip-Off: Grants +35 Chips (+100 Chips against all Boss Blinds).',
    image: AGENT_HARRIS_PORTRAIT,
    passiveType: 'AGENT_HARRIS_TIPOFF',
  },
  {
    id: 'gigi',
    name: 'Gigi Cestone',
    moniker: 'The Stressed Capo',
    mobRank: 'Capo',
    quote: 'The stress... it’s like a bowling ball in my gut.',
    quotes: [
      'The stress... it’s like a bowling ball in my gut.',
      'Ralphie’s an earner, but he’s a sick f***.',
      'Just another turkey sandwich from Satriale’s.',
      'Tony put me in charge of the crew, not Ralph!',
      'I gotta hit the bathroom...',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Capo’s Ulcer: High early tension grants +14 Mult on every hand.',
    image: GIGI_PORTRAIT,
    passiveType: 'GIGI_ULCER',
  },
  {
    id: 'svetlana',
    name: 'Svetlana Kirilenko',
    moniker: 'The Steel Will',
    mobRank: 'Associate',
    quote: 'You are boring woman.',
    quotes: [
      'You are boring woman.',
      'In Russia, we have saying: "A fish rots from head down."',
      'I have titanium leg. It does not feel cold.',
      'Janice, give me back my leg.',
      'Tony is strong man. Like Russian bear.',
    ],
    rarity: 'Rare',
    cost: 7,
    description: 'Russian Titanium Resolve: Grants +45 Chips and cannot be disabled by Boss Blinds.',
    image: SVETLANA_PORTRAIT,
    passiveType: 'SVETLANA_TITANIUM',
  },
  {
    id: 'beansie',
    name: 'Beansie Gaeta',
    moniker: 'The Loyal Friend',
    mobRank: 'Associate',
    quote: 'A slice of pizza and a root beer, on the house.',
    quotes: [
      'A slice of pizza and a root beer, on the house.',
      'Richie, I’m not a kid anymore. I paid my dues.',
      'Tony, he backed his car right over me!',
      'Miami is warm, Tone. The doctors say it’s good for my back.',
      'I’ll never testify. You know me.',
    ],
    rarity: 'Common',
    cost: 5,
    description: 'Pizzeria Revenue: Scored cards grant +20 Chips each.',
    image: BEANSIE_PORTRAIT,
    passiveType: 'BEANSIE_PIZZERIA',
  },
  {
    id: 'ginny_sack',
    name: 'Ginny Sack',
    moniker: 'The Secret Stash',
    mobRank: 'Associate',
    quote: 'John loves me just the way I am.',
    quotes: [
      'John loves me just the way I am.',
      'John, what are you doing home early?!',
      'I was just doing the laundry...',
      'It’s the Atkins diet, John. It takes time.',
      'Have some butter brickle, John.',
    ],
    rarity: 'Uncommon',
    cost: 6,
    description: 'Secret Stash: Scored Diamonds grant +5 Mult each.',
    image: GINNY_SACK_PORTRAIT,
    passiveType: 'GINNY_SACK_STASH',
  },
];

export const ALL_FRONT_BUSINESSES: FrontBusiness[] = [
  {
    id: 'fb_sanitation',
    name: 'Barone Sanitation',
    handType: 'FULL_HOUSE',
    chipsBonus: 25,
    multBonus: 3,
    cost: 3,
    description: 'Levels up Full House: +25 Chips & +3 Mult.',
  },
  {
    id: 'fb_badabing',
    name: 'The Bada Bing!',
    handType: 'FLUSH',
    chipsBonus: 20,
    multBonus: 3,
    cost: 3,
    description: 'Levels up Flush: +20 Chips & +3 Mult.',
  },
  {
    id: 'fb_satriales',
    name: "Satriale's Pork Store",
    handType: 'TWO_PAIR',
    chipsBonus: 15,
    multBonus: 2,
    cost: 3,
    description: 'Levels up Two Pair: +15 Chips & +2 Mult.',
  },
  {
    id: 'fb_hud',
    name: 'HUD Housing Racket',
    handType: 'STRAIGHT',
    chipsBonus: 25,
    multBonus: 3,
    cost: 3,
    description: 'Levels up Straight: +25 Chips & +3 Mult.',
  },
  {
    id: 'fb_executive',
    name: 'The Executive Game',
    handType: 'HIGH_CARD',
    chipsBonus: 12,
    multBonus: 1,
    cost: 2,
    description: 'Levels up High Card: +12 Chips & +1 Mult.',
  },
  {
    id: 'fb_sportsbook',
    name: 'O.C. Sports Book',
    handType: 'THREE_OF_A_KIND',
    chipsBonus: 20,
    multBonus: 2,
    cost: 3,
    description: 'Levels up Three of a Kind: +20 Chips & +2 Mult.',
  },
  {
    id: 'fb_newark_port',
    name: 'Port of Newark Hijack',
    handType: 'FOUR_OF_A_KIND',
    chipsBonus: 40,
    multBonus: 4,
    cost: 4,
    description: 'Levels up Four of a Kind: +40 Chips & +4 Mult.',
  },
  {
    id: 'fb_zwitterino',
    name: 'Zwitterino Cement Racket',
    handType: 'STRAIGHT_FLUSH',
    chipsBonus: 60,
    multBonus: 6,
    cost: 5,
    description: 'Levels up Straight Flush: +60 Chips & +6 Mult.',
  },
];

export const ALL_FAVORS: Favor[] = [
  {
    id: 'f_fishes',
    name: 'Sleeping with the Fishes',
    category: 'HIT',
    cost: 4,
    description: 'Permanently removes 1 selected card from your deck (Deck thinning).',
    targetType: 'CARD_SELECT',
    effectType: 'WHACK_CARD',
  },
  {
    id: 'f_concrete',
    name: 'Dipped in Concrete',
    category: 'FAVOR',
    cost: 4,
    description: 'Coats 1 selected card into Concrete (+50 Chips, scores with any hand).',
    targetType: 'CARD_SELECT',
    effectType: 'CONCRETE_CARD',
  },
  {
    id: 'f_launder',
    name: 'Laundered Stash',
    category: 'FAVOR',
    cost: 4,
    description: 'Marks 1 selected card as Laundered (Pays +$3 every time it scores).',
    targetType: 'CARD_SELECT',
    effectType: 'LAUNDER_CARD',
  },
  {
    id: 'f_bribe_da',
    name: 'Bribe the D.A.',
    category: 'BRIBE',
    cost: 5,
    description: 'Neutralizes the current active Boss Blind penalty!',
    targetType: 'BOSS_REROLL',
    effectType: 'BRIBE_DA',
  },
  {
    id: 'f_envelope',
    name: 'The Weekly Envelope',
    category: 'FAVOR',
    cost: 3,
    description: 'Instant +$12 cash injection from your street soldiers.',
    targetType: 'INSTANT',
    effectType: 'CASH_ENVELOPE',
  },
  {
    id: 'f_mattresses',
    name: 'Go to the Mattresses',
    category: 'FAVOR',
    cost: 4,
    description: 'War footing: Your very next played hand receives ×2 Mult!',
    targetType: 'INSTANT',
    effectType: 'MATTRESS_MULT',
  },
];

export const ALL_BOSS_BLINDS: BossBlind[] = [
  {
    id: 'b_pine_barrens',
    name: 'Pine Barrens',
    subtitle: 'Lost in the frozen woods with Valery',
    description: 'Discards are frozen! Discarding cards is forbidden.',
    multiplier: 1.35,
    rule: 'PINE_BARRENS',
  },
  {
    id: 'b_fbi_wiretap',
    name: 'FBI Wiretap',
    subtitle: 'The Feds bugged the Green Grove nursing home',
    description: 'Face cards (J, Q, K) are under surveillance: 0 Chips awarded.',
    multiplier: 1.4,
    rule: 'FBI_WIRETAP',
  },
  {
    id: 'b_panic_attack',
    name: "Tony's Panic Attack",
    subtitle: 'Seeing the ducks fly away...',
    description: 'Start with 1 fewer Hand, and cards in hand are dealt blurred.',
    multiplier: 1.45,
    rule: 'PANIC_ATTACK',
  },
  {
    id: 'b_war_with_ny',
    name: 'War with New York',
    subtitle: 'Phil Leotardo has had enough',
    description: 'Phil demands heavy tribute: Target Vig is increased by 35%.',
    multiplier: 1.6,
    rule: 'WAR_WITH_NY',
  },
  {
    id: 'b_rat_in_crew',
    name: 'A Rat in the Crew',
    subtitle: 'Someone is wearing a wire to the sit-down',
    description: 'Your leftmost Crew member is disabled for the entire round.',
    multiplier: 1.5,
    rule: 'RAT_IN_CREW',
  },
  {
    id: 'b_chris_rehab',
    name: 'Christopher in Rehab',
    subtitle: 'The intervention got emotional',
    description: 'Crew morale is fractured: All hand multipliers reduced by 25%.',
    multiplier: 1.55,
    rule: 'CHRIS_REHAB',
  },
  {
    id: 'b_executive_raid',
    name: 'Executive Game Raid',
    subtitle: 'State Police kick down the motel door',
    description: 'Spades & Clubs are confiscated by the precinct: 0 Chips awarded.',
    multiplier: 1.4,
    rule: 'EXECUTIVE_RAID',
  },
  {
    id: 'b_davey_bustout',
    name: 'Davey Scatino Bust-Out',
    subtitle: 'Ramsey Outdoor Sporting Goods drained dry',
    description: 'Davey has no cash left: $0 round payout awarded.',
    multiplier: 1.35,
    rule: 'DAVEY_BUSTOUT',
  },
  {
    id: 'b_russian_commando',
    name: 'The Russian Commando',
    subtitle: 'Interior decorator who killed 16 Czechoslovakians',
    description: 'Russian ambush: Hands played with more than 4 cards have Mult reduced to 1.',
    multiplier: 1.5,
    rule: 'RUSSIAN_COMMANDO',
  },
  {
    id: 'b_columbus_riot',
    name: 'Columbus Day Riot',
    subtitle: 'Silvio leads the parade confrontation',
    description: 'Hearts & Diamonds caught in the protest: 0 Chips awarded.',
    multiplier: 1.4,
    rule: 'COLUMBUS_RIOT',
  },
  {
    id: 'b_sitdown_carmine',
    name: 'Sit-Down with Carmine',
    subtitle: 'Carmine Lupertazzi demands a 40% piece of the Esplanade',
    description: 'Heavy New York tribute: Target Vig is increased by 40%.',
    multiplier: 1.65,
    rule: 'WAR_WITH_NY',
  },
  {
    id: 'b_junior_trial',
    name: 'Uncle Junior on Trial',
    subtitle: 'Courtroom chaos and flashbulbs',
    description: 'Feds watching every angle: Leftmost Crew member is disabled.',
    multiplier: 1.45,
    rule: 'RAT_IN_CREW',
  },
];

export function getRandomBossForSeason(season: number, usedBossIds: string[] = []): BossBlind {
  const unused = ALL_BOSS_BLINDS.filter((b) => !usedBossIds.includes(b.id));
  const pool = unused.length > 0 ? unused : ALL_BOSS_BLINDS;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return { ...picked, season };
}

export function getSeasonTargetVig(
  season: number,
  blindType: 'SMALL' | 'BIG' | 'BOSS',
  boss?: BossBlind,
  difficultyMultiplier: number = 1.5
): number {
  // Exponential base season scaling for high-stakes roguelike tension:
  // S1: 800 (Capo: 1,200 | NY Boss: 1,760) -> strictly requires 2-3 solid hands
  // S2: 3,200 (Capo: 4,800 | NY Boss: 7,040)
  // S3: 14,000 (Capo: 21,000 | NY Boss: 30,800)
  // S4: 60,000 (Capo: 90,000 | NY Boss: 132,000)
  // S5: 260,000 (Capo: 390,000 | NY Boss: 572,000)
  // S6: 1,100,000 (Capo: 1,650,000 | NY Boss: 2,420,000; Boss reaches 5M - 8M+!)
  const seasonBases = [800, 3200, 14000, 60000, 260000, 1100000];
  const base = seasonBases[Math.min(season - 1, seasonBases.length - 1)];

  let raw = base;
  if (blindType === 'SMALL') {
    raw = base;
  } else if (blindType === 'BIG') {
    raw = Math.round(base * 1.75);
  } else {
    // BOSS
    const mult = boss ? boss.multiplier : 2.5;
    raw = Math.round(base * 3.5 * mult);
  }

  return Math.round(raw * difficultyMultiplier);
}
