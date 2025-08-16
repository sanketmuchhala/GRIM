import React from 'react';
import { AuctionBid, AuctionState, Seat, RankOrder, Trump } from '../game/types';
import { canPlaceBid } from '../game/auction';

interface AuctionPanelProps {
  auction: AuctionState;
  currentPlayer: Seat;
  onBid: (bid: AuctionBid) => void;
  onSelectRankOrder?: (order: RankOrder) => void;
  onSelectTrump?: (trump: Trump) => void;
  rankOrder?: RankOrder;
  trump?: Trump;
  phase: string;
  showDeclarerChoices: boolean;
  isHumanTurn?: boolean;
  isHumanDeclarer?: boolean;
}

const AuctionPanel: React.FC<AuctionPanelProps> = ({
  auction,
  currentPlayer,
  onBid,
  onSelectRankOrder,
  onSelectTrump,
  rankOrder,
  trump,
  phase,
  showDeclarerChoices,
  isHumanTurn = false,
  isHumanDeclarer = false
}) => {
  const canBid = (bid: AuctionBid) => canPlaceBid(auction, currentPlayer, bid);

  const getBidButtonClass = (bid: AuctionBid) => {
    const baseClass = "px-4 py-2 rounded font-semibold transition-colors";
    const canPlace = canBid(bid);
    
    if (!canPlace) {
      return `${baseClass} bg-gray-600 text-gray-400 cursor-not-allowed`;
    }
    
    switch (bid) {
      case "Pass":
        return `${baseClass} bg-gray-700 hover:bg-gray-600 text-white`;
      case "Grim":
        return `${baseClass} bg-red-700 hover:bg-red-600 text-white`;
      case "DoubleGrim":
        return `${baseClass} bg-purple-700 hover:bg-purple-600 text-white`;
      default:
        return `${baseClass} bg-blue-700 hover:bg-blue-600 text-white`;
    }
  };

  const handleBid = (bid: AuctionBid) => {
    if (canBid(bid)) {
      onBid(bid);
    }
  };

  if (showDeclarerChoices) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Declarer Choices - {auction.declarer}
        </h3>
        
        {!rankOrder && (
          <div className="mb-4">
            <h4 className="text-white mb-2">Choose Rank Order:</h4>
            {isHumanDeclarer ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => onSelectRankOrder?.("High")}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded font-semibold"
                >
                  High (A-K-Q-J-10-9-8-7)
                </button>
                <button
                  onClick={() => onSelectRankOrder?.("Low")}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded font-semibold"
                >
                  Low (7-8-9-10-J-Q-K-A)
                </button>
              </div>
            ) : (
              <div className="text-yellow-400">Bot is deciding...</div>
            )}
          </div>
        )}
        
        {rankOrder && !trump && (
          <div className="mb-4">
            <h4 className="text-white mb-2">Choose Trump:</h4>
            {isHumanDeclarer ? (
              <div className="flex space-x-2 flex-wrap">
                <button
                  onClick={() => onSelectTrump?.("S")}
                  className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-semibold"
                >
                  ♠ Spades
                </button>
                <button
                  onClick={() => onSelectTrump?.("H")}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-semibold"
                >
                  ♥ Hearts
                </button>
                <button
                  onClick={() => onSelectTrump?.("D")}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-semibold"
                >
                  ♦ Diamonds
                </button>
                <button
                  onClick={() => onSelectTrump?.("C")}
                  className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-semibold"
                >
                  ♣ Clubs
                </button>
                <button
                  onClick={() => onSelectTrump?.("NT")}
                  className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded font-semibold"
                >
                  No Trump
                </button>
              </div>
            ) : (
              <div className="text-yellow-400">Bot is deciding...</div>
            )}
          </div>
        )}
        
        {rankOrder && trump && (
          <div className="text-green-400">
            Ready to play! {auction.declarer} will lead.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        Auction - {phase}
      </h3>
      
      {auction.bids.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm text-slate-300 mb-2">Bidding History:</h4>
          <div className="text-xs text-slate-400 max-h-24 overflow-y-auto">
            {auction.bids.map((bid, index) => (
              <div key={index}>
                {bid.seat}: {bid.bid}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {auction.currentBid && (
        <div className="mb-4 text-yellow-400">
          Current bid: {auction.currentBid} by {auction.bidder}
        </div>
      )}
      
      <div className="mb-4">
        <div className="text-white mb-2">
          {currentPlayer}'s turn to bid:
        </div>
        {isHumanTurn ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleBid("Pass")}
              className={getBidButtonClass("Pass")}
              disabled={!canBid("Pass")}
            >
              Pass
            </button>
            <button
              onClick={() => handleBid("Grim")}
              className={getBidButtonClass("Grim")}
              disabled={!canBid("Grim")}
            >
              Grim
            </button>
            <button
              onClick={() => handleBid("DoubleGrim")}
              className={getBidButtonClass("DoubleGrim")}
              disabled={!canBid("DoubleGrim")}
            >
              Double Grim
            </button>
          </div>
        ) : (
          <div className="text-yellow-400">
            Bot is thinking...
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionPanel;