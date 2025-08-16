import type { 
  Suit, 
  Seat, 
  TeamId, 
  Card
} from './types';
import { SEATS, getOpposingTeam } from './types';
import { createDeck, shuffleDeck, dealCards } from './deck';

export interface Make5Setup {
  trump: Suit;
  leadingTeam: TeamId;
  hands: Record<Seat, Card[]>;
}

export function setupMake5(
  predeclaredTrump: Suit,
  leadingTeam: TeamId,
  setAsideCards: Record<Seat, Card[]>,
  seed: string,
  dealIndex: number
): Make5Setup {
  // Create and shuffle deck
  const deck = createDeck();
  const shuffled = shuffleDeck(deck, seed + "_make5_" + dealIndex);
  
  // Remove the set aside cards from deck
  const setAsideIds = Object.values(setAsideCards)
    .flat()
    .map(card => card.id);
  
  const remainingDeck = shuffled.filter(card => !setAsideIds.includes(card.id));
  
  // Deal 4 more cards to each player (total 8 each)
  const additionalHands = dealCards(remainingDeck, 4, 4);
  
  // Combine with set aside cards
  const hands: Record<Seat, Card[]> = { N: [], E: [], S: [], W: [] };
  for (let i = 0; i < 4; i++) {
    const seat = SEATS[i];
    hands[seat] = [...setAsideCards[seat], ...additionalHands[i]];
  }
  
  return {
    trump: predeclaredTrump,
    leadingTeam,
    hands
  };
}

export function selectPredeclaredTrump(
  leadingTeam: TeamId,
  availableSuits: Suit[] = ["S", "H", "D", "C"]
): Suit {
  // For now, just return the first available suit
  // In a real implementation, this would be chosen by the first recipient
  return availableSuits[0];
}

export function getMake5Targets(leadingTeam: TeamId): {
  leadingTarget: number;
  nonLeadingTarget: number;
  leadingReward: number;
  nonLeadingReward: number;
} {
  return {
    leadingTarget: 5,
    nonLeadingTarget: 4,
    leadingReward: 5,
    nonLeadingReward: 10
  };
}

export function evaluateMake5Result(
  leadingTeam: TeamId,
  leadingTeamTricks: number
): {
  winner?: TeamId;
  points: number;
  message: string;
} {
  const nonLeadingTeam = getOpposingTeam(leadingTeam);
  const nonLeadingTeamTricks = 8 - leadingTeamTricks;
  
  const targets = getMake5Targets(leadingTeam);
  
  if (leadingTeamTricks >= targets.leadingTarget) {
    return {
      winner: leadingTeam,
      points: targets.leadingReward,
      message: `${leadingTeam} takes ${leadingTeamTricks}/8 tricks: +${targets.leadingReward} points`
    };
  }
  
  if (nonLeadingTeamTricks >= targets.nonLeadingTarget) {
    return {
      winner: nonLeadingTeam,
      points: targets.nonLeadingReward,
      message: `${nonLeadingTeam} takes ${nonLeadingTeamTricks}/8 tricks: +${targets.nonLeadingReward} points`
    };
  }
  
  return {
    points: 0,
    message: `No team scores (${leadingTeam}: ${leadingTeamTricks}, ${nonLeadingTeam}: ${nonLeadingTeamTricks})`
  };
}