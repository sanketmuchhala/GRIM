import { AuctionBid, Card, Seat, AuctionState } from './types';
import { SeededRandom } from './prng';
import { getLegalCards } from './tricks';

export function getBotBid(
  seat: Seat, 
  auction: AuctionState,
  seed: string
): AuctionBid {
  const rng = new SeededRandom(seed + "_bot_bid_" + seat + "_" + auction.bids.length);
  
  // 80% chance to pass, 15% Grim, 5% Double Grim (if possible)
  const random = rng.next();
  
  if (random < 0.8) {
    return "Pass";
  } else if (random < 0.95 && !auction.currentBid) {
    return "Grim";
  } else if (auction.currentBid === "Grim") {
    return "DoubleGrim";
  } else {
    return "Pass";
  }
}

export function getBotCard(
  seat: Seat,
  hand: Card[],
  ledSuit: string | undefined,
  seed: string,
  trickNumber: number
): Card {
  const rng = new SeededRandom(seed + "_bot_card_" + seat + "_" + trickNumber);
  
  // Get legal cards and pick randomly
  const legalCards = getLegalCards(hand, ledSuit as any);
  
  if (legalCards.length === 0) {
    return hand[0]; // Fallback
  }
  
  return rng.choice(legalCards);
}

export function getBotRankOrder(seed: string): "High" | "Low" {
  const rng = new SeededRandom(seed + "_rank_order");
  return rng.nextBoolean() ? "High" : "Low";
}

export function getBotTrump(seed: string): "S" | "H" | "D" | "C" | "NT" {
  const rng = new SeededRandom(seed + "_trump");
  const options: ("S" | "H" | "D" | "C" | "NT")[] = ["S", "H", "D", "C", "NT"];
  return rng.choice(options);
}