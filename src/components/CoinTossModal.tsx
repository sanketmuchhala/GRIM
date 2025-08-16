import React, { useState } from 'react';
import { TeamId, CoinTossResult } from '../game/types';

interface CoinTossModalProps {
  isOpen: boolean;
  onTossComplete: (result: CoinTossResult) => void;
  onSkip: (team: TeamId) => void;
  onPerformToss: () => CoinTossResult;
}

const CoinTossModal: React.FC<CoinTossModalProps> = ({
  isOpen,
  onTossComplete,
  onSkip,
  onPerformToss
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinTossResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleToss = async () => {
    setIsFlipping(true);
    setResult(null);
    setShowResult(false);

    // Animate for 2 seconds
    setTimeout(() => {
      const tossResult = onPerformToss();
      setResult(tossResult);
      setIsFlipping(false);
      setShowResult(true);
    }, 2000);
  };

  const handleConfirm = () => {
    if (result) {
      onTossComplete(result);
      resetModal();
    }
  };

  const handleRetoss = () => {
    setResult(null);
    setShowResult(false);
    handleToss();
  };

  const handleSkipToss = (team: TeamId) => {
    onSkip(team);
    resetModal();
  };

  const resetModal = () => {
    setIsFlipping(false);
    setResult(null);
    setShowResult(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Coin Toss
        </h2>
        
        <div className="text-center mb-8">
          <p className="text-slate-300 mb-4">
            Who deals the first hand?
          </p>
          
          {/* Coin Animation */}
          <div className="flex justify-center mb-6">
            <div 
              className={`w-24 h-24 rounded-full border-4 border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-2xl font-bold transition-transform duration-200 ${
                isFlipping ? 'animate-spin' : ''
              }`}
              style={{
                animationDuration: isFlipping ? '0.1s' : '0s',
                animationIterationCount: isFlipping ? 'infinite' : '1'
              }}
            >
              {isFlipping ? '?' : (result ? (result.team === 'NS' ? 'NS' : 'EW') : 'FLIP')}
            </div>
          </div>

          {!result && !isFlipping && (
            <button
              onClick={handleToss}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Toss the Coin
            </button>
          )}

          {isFlipping && (
            <p className="text-yellow-400 font-semibold">
              Flipping...
            </p>
          )}

          {showResult && result && (
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-green-400 font-semibold text-lg">
                  Result: Team {result.team} deals first!
                </p>
                <p className="text-slate-300 text-sm mt-2">
                  Dealer Seat: {result.dealerSeat}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Dealing starts left of dealer, so Team {result.team === 'NS' ? 'EW' : 'NS'} receives first card.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleRetoss}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Retoss
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>

        {!result && !isFlipping && (
          <div className="border-t border-slate-600 pt-4">
            <p className="text-slate-400 text-sm mb-3 text-center">
              Or manually choose:
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleSkipToss('NS')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Team NS
              </button>
              <button
                onClick={() => handleSkipToss('EW')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Team EW
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinTossModal;