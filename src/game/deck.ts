import { Card, Suit, Rank, SUITS, RANKS } from './types';
import { SeededRandom } from './prng';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${suit}${rank}`,
        suit,
        rank,
      });
    }
  }
  
  return deck;
}

export function shuffleDeck(deck: Card[], seed: string): Card[] {
  const rng = new SeededRandom(seed);
  return rng.shuffle(deck);
}

export function dealCards(deck: Card[], numCards: number, numPlayers: number): Card[][] {
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);
  
  for (let i = 0; i < numCards * numPlayers; i++) {
    const playerIndex = i % numPlayers;
    hands[playerIndex].push(deck[i]);
  }
  
  return hands;
}

export function sortHand(hand: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = { S: 0, H: 1, D: 2, C: 3 };
  const rankOrder: Record<Rank, number> = { 
    7: 0, 8: 1, 9: 2, 10: 3, J: 4, Q: 5, K: 6, A: 7 
  };
  
  return [...hand].sort((a, b) => {
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return rankOrder[a.rank] - rankOrder[b.rank];
  });
}

export function getCardDisplay(card: Card): string {
  const suitSymbols: Record<Suit, string> = {
    S: '♠',
    H: '♥',
    D: '♦',
    C: '♣'
  };
  
  return `${card.rank}${suitSymbols[card.suit]}`;
}

export function getCardColor(suit: Suit): 'red' | 'black' {
  return suit === 'H' || suit === 'D' ? 'red' : 'black';
}