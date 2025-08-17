import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state';
import { Seat, SEATS } from '../game/types';
import Hand from '../components/Hand';
import AuctionPanel from '../components/AuctionPanel';
import TrickArea from '../components/TrickArea';
import Scoreboard from '../components/Scoreboard';
import EventLog from '../components/EventLog';
import NameEditor from '../components/NameEditor';
import { isAuctionComplete } from '../game/auction';

const Table: React.FC = () => {
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const {
    hands,
    currentPlayer,
    currentTrick,
    completedTricks,
    auction,
    scores,
    dealIndex,
    config,
    log,
    dealer,
    leadingTeam,
    phase,
    rankOrder,
    trump,
    isGameOver,
    placeBid,
    selectRankOrder,
    selectTrump,
    playCard,
    nextDeal,
    resetGame,
    processBotTurn
  } = useGameStore();

  // Auto-process bot turns
  useEffect(() => {
    if (!isGameOver) {
      processBotTurn();
    }
  }, [currentPlayer, trump, rankOrder, isGameOver, processBotTurn]);

  const seatPositions: Record<Seat, { 
    position: string; 
    handClass: string;
    nameClass: string;
  }> = {
    N: { 
      position: 'top-4 left-1/2 transform -translate-x-1/2',
      handClass: 'justify-center',
      nameClass: 'text-center'
    },
    E: { 
      position: 'top-1/2 right-4 transform -translate-y-1/2',
      handClass: 'justify-end',
      nameClass: 'text-right'
    },
    S: { 
      position: 'bottom-4 left-1/2 transform -translate-x-1/2',
      handClass: 'justify-center',
      nameClass: 'text-center'
    },
    W: { 
      position: 'top-1/2 left-4 transform -translate-y-1/2',
      handClass: 'justify-start',
      nameClass: 'text-left'
    }
  };

  const showDeclarerChoices = auction.declarer && 
    isAuctionComplete(auction) && 
    (!rankOrder || !trump);

  const isInTrickPlay = trump && rankOrder && !showDeclarerChoices;

  if (isGameOver) {
    const finalWinner = scores.NS > scores.EW ? "NS" : 
                       scores.EW > scores.NS ? "EW" : "Tie";
    
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Game Over!</h1>
          
          <div className="bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Final Scores</h2>
            <div className="space-y-2 text-xl">
              <div>Team NS: {scores.NS}</div>
              <div>Team EW: {scores.EW}</div>
            </div>
            
            {finalWinner !== "Tie" ? (
              <div className="text-green-400 text-2xl font-bold mt-4">
                Team {finalWinner} Wins!
              </div>
            ) : (
              <div className="text-yellow-400 text-2xl font-bold mt-4">
                It's a Tie!
              </div>
            )}
          </div>
          
          <div className="space-x-4">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              New Game
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Grim - Deal {dealIndex + 1}</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-300">
            Dealer: {dealer} | Leading: {leadingTeam}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              title="Reset current game"
            >
              Reset Game
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              Lobby
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
        {/* Game Table Area */}
        <div className="xl:col-span-3 relative">
          {/* Game Table */}
          <div className="relative h-full bg-slate-800 rounded-lg p-4">
            
            {/* Players and Hands */}
            {SEATS.map(seat => {
              const position = seatPositions[seat];
              const isCurrentPlayerSeat = currentPlayer === seat;
              const showCards = seat === 'S'; // Show only human player's cards
              
              return (
                <div key={seat} className={`absolute ${position.position}`}>
                  <div className={`space-y-2 ${position.nameClass}`}>
                    <NameEditor
                      seat={seat}
                      currentName={config.playerNames[seat]}
                      onNameChange={() => {}}
                      isBot={config.bots[seat] || false}
                      disabled={true}
                    />
                    {seat === dealer && (
                      <div className="text-yellow-400 text-xs">DEALER</div>
                    )}
                    {isCurrentPlayerSeat && (
                      <div className="text-green-400 text-xs">TURN</div>
                    )}
                  </div>
                  
                  <div className={`mt-2 flex ${position.handClass}`}>
                    <Hand
                      cards={hands[seat]}
                      seat={seat}
                      isCurrentPlayer={Boolean(isCurrentPlayerSeat && isInTrickPlay)}
                      ledSuit={currentTrick.ledSuit}
                      onCardClick={isInTrickPlay && seat === 'S' && isCurrentPlayerSeat ? (card) => playCard(seat, card) : undefined}
                      showCards={showCards}
                    />
                  </div>
                </div>
              );
            })}
            
            {/* Center - Trick Area or Auction */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {isInTrickPlay ? (
                <TrickArea
                  currentTrick={currentTrick}
                  completedTricks={completedTricks}
                  trump={trump}
                />
              ) : (
                <div className="bg-slate-700 rounded-lg p-4 min-w-96">
                  <AuctionPanel
                    auction={auction}
                    currentPlayer={currentPlayer}
                    onBid={(bid) => placeBid(currentPlayer, bid)}
                    onSelectRankOrder={selectRankOrder}
                    onSelectTrump={selectTrump}
                    rankOrder={rankOrder}
                    trump={trump}
                    phase={phase}
                    showDeclarerChoices={showDeclarerChoices || false}
                    isHumanTurn={currentPlayer === 'S'}
                    isHumanDeclarer={auction.declarer === 'S'}
                  />
                </div>
              )}
            </div>
            
            {/* Phase indicator */}
            <div className="absolute top-4 left-4 bg-blue-900/50 rounded-lg p-3">
              <div className="text-sm text-blue-300 font-semibold">
                Phase: {phase} {phase === "Round1" ? "Round 1" : phase === "Round2" ? "Round 2" : phase === "Round3" ? "Round 3" : ""}
              </div>
              {trump && (
                <div className="text-sm text-yellow-300 font-medium">
                  Trump: {trump === "NT" ? "No Trump" : trump}
                </div>
              )}
              {rankOrder && (
                <div className="text-sm text-purple-300 font-medium">
                  Order: {rankOrder}
                </div>
              )}
              {!trump && !rankOrder && auction.declarer && (
                <div className="text-sm text-orange-300 animate-pulse">
                  Waiting for declarer choices...
                </div>
              )}
            </div>
            
            {/* Round Complete / Next Deal */}
            {phase === "Score" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-green-900/95 rounded-lg p-6 text-center border-2 border-green-500 shadow-2xl">
                  <div className="text-green-400 font-bold text-xl mb-3">Round Complete!</div>
                  <div className="text-white mb-4">
                    Latest Scores: NS {scores.NS}, EW {scores.EW}
                  </div>
                  <button
                    onClick={nextDeal}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg"
                  >
                    Continue to Next Deal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          <Scoreboard
            scores={scores}
            dealIndex={dealIndex}
            totalDeals={config.deals}
            playerNames={config.playerNames}
          />
          
          <EventLog
            events={log}
            maxHeight={300}
          />
        </div>
      </div>
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Reset Game?</h3>
            <p className="text-slate-300 mb-6">
              This will reset the current game and return to the lobby. Your progress will be lost.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  resetGame();
                  setShowResetConfirm(false);
                  navigate('/');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
              >
                Reset Game
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;