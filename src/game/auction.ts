import { AuctionBid, AuctionState, Seat, getNextSeat } from './types';

export function canPlaceBid(auction: AuctionState, seat: Seat, bid: AuctionBid): boolean {
  // Can always pass
  if (bid === "Pass") return true;
  
  // Can't bid Grim if there's already a Grim or DoubleGrim
  if (bid === "Grim" && auction.currentBid) return false;
  
  // Can only DoubleGrim if there's already a Grim (not DoubleGrim)
  if (bid === "DoubleGrim" && auction.currentBid !== "Grim") return false;
  
  return true;
}

export function isAuctionComplete(auction: AuctionState): boolean {
  const bids = auction.bids;
  
  // Need at least 4 bids
  if (bids.length < 4) return false;
  
  // If someone has bid and 3 consecutive passes follow
  if (auction.declarer) {
    const lastThreeBids = bids.slice(-3);
    return lastThreeBids.every(b => b.bid === "Pass");
  }
  
  // If all 4 players have passed
  const lastFourBids = bids.slice(-4);
  return lastFourBids.every(b => b.bid === "Pass");
}

export function getAuctionResult(auction: AuctionState): {
  winner?: Seat;
  winningBid?: AuctionBid;
  allPassed: boolean;
} {
  if (!isAuctionComplete(auction)) {
    return { allPassed: false };
  }
  
  if (auction.declarer && auction.currentBid) {
    return {
      winner: auction.declarer,
      winningBid: auction.currentBid,
      allPassed: false
    };
  }
  
  return { allPassed: true };
}

export function getNextBidder(auction: AuctionState, currentBidder: Seat): Seat {
  return getNextSeat(currentBidder);
}

export function validateBidSequence(bids: Array<{ seat: Seat; bid: AuctionBid }>): boolean {
  let currentBid: AuctionBid | undefined;
  
  for (const bid of bids) {
    if (bid.bid === "Pass") continue;
    
    if (bid.bid === "Grim") {
      if (currentBid) return false; // Can't bid Grim after another bid
      currentBid = "Grim";
    } else if (bid.bid === "DoubleGrim") {
      if (currentBid !== "Grim") return false; // Can only DoubleGrim after Grim
      currentBid = "DoubleGrim";
    }
  }
  
  return true;
}