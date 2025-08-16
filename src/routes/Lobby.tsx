import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state';
import { TeamId, Seat, SEATS } from '../game/types';
import NameEditor from '../components/NameEditor';
import CoinTossModal from '../components/CoinTossModal';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const {
    config,
    coinToss,
    updatePlayerName,
    newGame,
    performCoinToss,
    skipCoinToss,
    startDeal
  } = useGameStore();

  const [showCoinToss, setShowCoinToss] = useState(false);
  const [dealsCount, setDealsCount] = useState(config.deals);

  const handleToggleBot = (seat: Seat) => {
    // Toggle bot status for the seat
    const newBots = { ...config.bots };
    newBots[seat] = !newBots[seat];
    
    // Update the game config
    newGame({
      ...config,
      bots: newBots
    });
  };

  const handleStartMatch = () => {
    // Update deals count if changed
    if (dealsCount !== config.deals) {
      newGame({
        ...config,
        deals: dealsCount
      });
    }
    setShowCoinToss(true);
  };

  const handleCoinTossComplete = () => {
    setShowCoinToss(false);
    startDeal();
    navigate('/table');
  };

  const handleSkipCoinToss = (team: TeamId) => {
    skipCoinToss(team);
    setShowCoinToss(false);
    startDeal();
    navigate('/table');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Grim Card Game
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Settings */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Game Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Deals
                </label>
                <select
                  value={dealsCount}
                  onChange={(e) => setDealsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[10, 11, 12, 13, 14, 15].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Player Setup */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Players</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {SEATS.map(seat => (
                <div key={seat} className="bg-slate-700 rounded-lg p-3">
                  <NameEditor
                    seat={seat}
                    currentName={config.playerNames[seat]}
                    onNameChange={updatePlayerName}
                    isBot={config.bots[seat] || false}
                    onToggleBot={handleToggleBot}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-slate-400">
              <p>• Teams: NS vs EW (partners sit opposite)</p>
              <p>• Toggle Human/Bot for each seat</p>
              <p>• Click names to edit</p>
            </div>
          </div>
        </div>
        
        {/* Team Preview */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Team Preview</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Team NS</h3>
              <div className="space-y-1">
                <div>{config.playerNames.N} (North) {config.bots.N && '🤖'}</div>
                <div>{config.playerNames.S} (South) {config.bots.S && '🤖'}</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-400 mb-2">Team EW</h3>
              <div className="space-y-1">
                <div>{config.playerNames.E} (East) {config.bots.E && '🤖'}</div>
                <div>{config.playerNames.W} (West) {config.bots.W && '🤖'}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Start Game */}
        <div className="mt-8 text-center">
          <button
            onClick={handleStartMatch}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-lg transition-colors"
          >
            Start Match ({dealsCount} deals)
          </button>
          
          {coinToss && (
            <div className="mt-4 p-4 bg-blue-900/50 rounded-lg">
              <div className="text-green-400 font-semibold">
                Previous coin toss: Team {coinToss.team} deals first (Seat: {coinToss.dealerSeat})
              </div>
              <div className="flex space-x-3 mt-3">
                <button
                  onClick={() => navigate('/table')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
                >
                  Continue Game
                </button>
                <button
                  onClick={() => setShowCoinToss(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  New Coin Toss
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Rules Link */}
        <div className="mt-6 text-center">
          <a
            href="#/rules"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            View Game Rules
          </a>
        </div>
      </div>
      
      <CoinTossModal
        isOpen={showCoinToss}
        onTossComplete={handleCoinTossComplete}
        onSkip={handleSkipCoinToss}
        onPerformToss={performCoinToss}
      />
    </div>
  );
};

export default Lobby;