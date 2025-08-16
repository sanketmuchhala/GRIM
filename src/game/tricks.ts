import { 
  Card, 
  Seat, 
  Suit, 
  Trump, 
  RankOrder, 
  Trick, 
  TrickCard,
  getNextSeat 
} from './types';
import { getWinningCard } from './ranks';

export function canPlayCard(
  card: Card, 
  hand: Card[], 
  ledSuit: Suit | undefined
): boolean {
  // If no suit led yet, any card can be played
  if (!ledSuit) return true;
  
  // If card follows suit, it's valid
  if (card.suit === ledSuit) return true;
  
  // If player has no cards of led suit, any card can be played
  const hasLedSuit = hand.some(c => c.suit === ledSuit);
  return !hasLedSuit;
}

export function getLegalCards(hand: Card[], ledSuit: Suit | undefined): Card[] {
  if (!ledSuit) return hand;
  
  const followingSuit = hand.filter(card => card.suit === ledSuit);
  return followingSuit.length > 0 ? followingSuit : hand;
}

export function completeTrick(
  trick: Trick, 
  rankOrder: RankOrder, 
  trump?: Trump
): Trick {
  if (trick.cards.length !== 4 || !trick.ledSuit) {
    throw new Error("Cannot complete incomplete trick");
  }
  
  const cardsWithSeats = trick.cards.map(tc => ({
    card: tc.card,
    seat: tc.seat
  }));
  
  const winner = getWinningCard(cardsWithSeats, trick.ledSuit, rankOrder, trump);
  
  return {
    ...trick,
    winner: winner.seat as Seat
  };
}

export function getNextLeader(
  trick: Trick, 
  declarer?: Seat
): Seat {
  // First trick: declarer leads
  if (declarer && trick.cards.length === 0) {
    return declarer;
  }
  
  // Subsequent tricks: winner of previous trick leads
  if (trick.winner) {
    return trick.winner;
  }
  
  throw new Error("Cannot determine next leader");
}

export function validateTrickPlay(
  seat: Seat,
  card: Card,
  hand: Card[],
  trick: Trick,
  expectedPlayer: Seat
): { valid: boolean; error?: string } {
  // Check if it's player's turn
  if (seat !== expectedPlayer) {
    return { valid: false, error: "Not your turn" };
  }
  
  // Check if player has the card
  if (!hand.some(c => c.id === card.id)) {
    return { valid: false, error: "Card not in hand" };
  }
  
  // Check if card follows suit rules
  if (!canPlayCard(card, hand, trick.ledSuit)) {
    return { valid: false, error: "Must follow suit if possible" };
  }
  
  return { valid: true };
}

export function getTrickDisplayText(trick: Trick): string {
  if (trick.cards.length === 0) return "No cards played";
  
  const cardTexts = trick.cards.map(tc => 
    `${tc.seat}: ${tc.card.rank}${tc.card.suit}`
  );
  
  let result = cardTexts.join(", ");
  
  if (trick.winner) {
    result += ` (${trick.winner} wins)`;
  }
  
  return result;
}

export function calculateTrickWinners(
  tricks: Trick[],
  rankOrder: RankOrder,
  trump?: Trump
): Trick[] {
  return tricks.map(trick => {
    if (trick.cards.length === 4 && trick.ledSuit && !trick.winner) {
      return completeTrick(trick, rankOrder, trump);
    }
    return trick;
  });
}