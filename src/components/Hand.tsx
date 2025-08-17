import React from 'react';
import { Card, Seat, Suit } from '../game/types';
import { getCardDisplay, getCardColor, sortHand } from '../game/deck';
import { getLegalCards } from '../game/tricks';

interface HandProps {
  cards: Card[];
  seat: Seat;
  isCurrentPlayer: boolean;
  ledSuit?: Suit;
  onCardClick?: (card: Card) => void;
  showCards?: boolean;
}

const Hand: React.FC<HandProps> = ({
  cards,
  isCurrentPlayer,
  ledSuit,
  onCardClick,
  showCards = true
}) => {
  const sortedCards = sortHand(cards);
  const legalCards = getLegalCards(sortedCards, ledSuit);
  
  const getCardClasses = (card: Card) => {
    const baseClasses = "w-12 h-16 border-2 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200";
    const colorClasses = getCardColor(card.suit) === 'red' 
      ? "text-red-500" 
      : "text-gray-800";
    
    const isLegal = legalCards.some(c => c.id === card.id);
    const interactiveClasses = isCurrentPlayer && onCardClick && isLegal
      ? "hover:scale-105 hover:bg-blue-100 border-blue-400"
      : isCurrentPlayer && onCardClick && !isLegal
      ? "opacity-50 cursor-not-allowed border-gray-400"
      : "border-gray-300";
    
    return `${baseClasses} ${colorClasses} ${interactiveClasses} bg-white`;
  };

  const handleCardClick = (card: Card) => {
    if (isCurrentPlayer && onCardClick) {
      const isLegal = legalCards.some(c => c.id === card.id);
      if (isLegal) {
        onCardClick(card);
      }
    }
  };

  if (!showCards) {
    return (
      <div className="flex space-x-1">
        {cards.map((_, index) => (
          <div
            key={index}
            className="w-12 h-16 bg-blue-900 border-2 border-blue-700 rounded-lg flex items-center justify-center"
          >
            <div className="w-6 h-8 bg-blue-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {sortedCards.map((card) => (
        <div
          key={card.id}
          className={getCardClasses(card)}
          onClick={() => handleCardClick(card)}
          title={`${getCardDisplay(card)} ${!legalCards.some(c => c.id === card.id) && isCurrentPlayer ? '(Cannot play)' : ''}`}
        >
          {getCardDisplay(card)}
        </div>
      ))}
      {isCurrentPlayer && (
        <div className="text-xs text-green-400 mt-2">
          Your turn
        </div>
      )}
    </div>
  );
};

export default Hand;