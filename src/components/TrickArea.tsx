import React from 'react';
import { Trick, Seat } from '../game/types';
import { getCardDisplay, getCardColor } from '../game/deck';

interface TrickAreaProps {
  currentTrick: Trick;
  completedTricks: Trick[];
  trump?: string;
}

const TrickArea: React.FC<TrickAreaProps> = ({
  currentTrick,
  completedTricks,
  trump
}) => {
  const seatPositions: Record<Seat, { top: string; left: string; transform: string }> = {
    N: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
    E: { top: '50%', left: '90%', transform: 'translate(-100%, -50%)' },
    S: { top: '90%', left: '50%', transform: 'translate(-50%, -100%)' },
    W: { top: '50%', left: '10%', transform: 'translateY(-50%)' }
  };

  const getTrumpDisplay = () => {
    if (!trump) return null;
    if (trump === "NT") return "No Trump";
    
    const suitSymbols: Record<string, string> = {
      S: '♠', H: '♥', D: '♦', C: '♣'
    };
    
    return (
      <div className="absolute top-2 right-2 bg-yellow-700 text-white px-2 py-1 rounded text-sm">
        Trump: {trump === "NT" ? "NT" : suitSymbols[trump] || trump}
      </div>
    );
  };

  return (
    <div className="relative bg-green-800 rounded-lg w-96 h-64 mx-auto border-4 border-green-700">
      {getTrumpDisplay()}
      
      {/* Center area for trick count */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-white text-lg font-semibold">
          Trick {completedTricks.length + 1}
        </div>
        {currentTrick.ledSuit && (
          <div className="text-yellow-400 text-sm">
            Led: {currentTrick.ledSuit}
          </div>
        )}
      </div>
      
      {/* Current trick cards */}
      {currentTrick.cards.map((trickCard, index) => {
        const position = seatPositions[trickCard.seat];
        const color = getCardColor(trickCard.card.suit);
        const isWinner = currentTrick.winner === trickCard.seat;
        
        return (
          <div
            key={`${trickCard.seat}-${index}`}
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              transform: position.transform
            }}
          >
            <div className={`
              w-16 h-20 bg-white rounded-lg 
              flex flex-col items-center justify-center
              ${color === 'red' ? 'text-red-500' : 'text-gray-800'}
              font-bold text-sm shadow-lg
              ${isWinner ? 'border-4 border-yellow-400 bg-yellow-100' : 'border-2 border-gray-300'}
            `}>
              <div>{getCardDisplay(trickCard.card)}</div>
              <div className={`text-xs mt-1 ${isWinner ? 'text-yellow-700' : 'text-blue-600'}`}>
                {trickCard.seat}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Trick winner indicator */}
      {currentTrick.winner && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded text-sm">
          {currentTrick.winner} wins trick
        </div>
      )}
      
      {/* Show last completed trick winner */}
      {completedTricks.length > 0 && currentTrick.cards.length === 0 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
          Last trick: {completedTricks[completedTricks.length - 1].winner} won
        </div>
      )}
      
      {/* Completed tricks summary */}
      {completedTricks.length > 0 && (
        <div className="absolute bottom-2 left-2 text-white text-xs">
          Completed: {completedTricks.length}
        </div>
      )}
    </div>
  );
};

export default TrickArea;