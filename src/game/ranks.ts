import { Card, Rank, RankOrder, Trump, Suit } from './types';

const HIGH_ORDER: Rank[] = ["A", "K", "Q", "J", 10, 9, 8, 7];
const LOW_ORDER: Rank[] = [7, 8, 9, 10, "J", "Q", "K", "A"];

export function getRankValue(rank: Rank, order: RankOrder): number {
  const orderArray = order === "High" ? HIGH_ORDER : LOW_ORDER;
  return orderArray.indexOf(rank);
}

export function compareRanks(rank1: Rank, rank2: Rank, order: RankOrder): number {
  const value1 = getRankValue(rank1, order);
  const value2 = getRankValue(rank2, order);
  return value1 - value2;
}

export function compareCards(card1: Card, card2: Card, order: RankOrder, trump?: Trump): number {
  const isTrump1 = trump !== "NT" && card1.suit === trump;
  const isTrump2 = trump !== "NT" && card2.suit === trump;
  
  // Trump cards always beat non-trump cards
  if (isTrump1 && !isTrump2) return -1;
  if (!isTrump1 && isTrump2) return 1;
  
  // If both trump or both non-trump, compare by rank
  if (card1.suit === card2.suit || (isTrump1 && isTrump2)) {
    return compareRanks(card1.rank, card2.rank, order);
  }
  
  // Different suits, neither trump - no comparison possible
  return 0;
}

export function getWinningCard(
  cards: Array<{ card: Card; seat: string }>, 
  ledSuit: Suit, 
  order: RankOrder, 
  trump?: Trump
): { card: Card; seat: string } {
  if (cards.length === 0) {
    throw new Error("Cannot determine winner from empty cards array");
  }
  
  let winner = cards[0];
  
  for (let i = 1; i < cards.length; i++) {
    const current = cards[i];
    const winnerCard = winner.card;
    const currentCard = current.card;
    
    const winnerIsTrump = trump !== "NT" && winnerCard.suit === trump;
    const currentIsTrump = trump !== "NT" && currentCard.suit === trump;
    const winnerFollowsSuit = winnerCard.suit === ledSuit;
    const currentFollowsSuit = currentCard.suit === ledSuit;
    
    // Current card wins if:
    // 1. It's trump and winner isn't
    // 2. Both trump and current has higher rank
    // 3. Both follow suit and current has higher rank
    // 4. Current follows suit and winner doesn't (and neither is trump)
    
    if (currentIsTrump && !winnerIsTrump) {
      winner = current;
    } else if (currentIsTrump && winnerIsTrump) {
      if (compareRanks(currentCard.rank, winnerCard.rank, order) < 0) {
        winner = current;
      }
    } else if (!currentIsTrump && !winnerIsTrump) {
      if (currentFollowsSuit && !winnerFollowsSuit) {
        winner = current;
      } else if (currentFollowsSuit && winnerFollowsSuit) {
        if (compareRanks(currentCard.rank, winnerCard.rank, order) < 0) {
          winner = current;
        }
      }
    }
  }
  
  return winner;
}