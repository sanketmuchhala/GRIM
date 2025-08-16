import React from 'react';
import { TeamId } from '../game/types';

interface ScoreboardProps {
  scores: Record<TeamId, number>;
  dealIndex: number;
  totalDeals: number;
  playerNames: Record<string, string>;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  scores,
  dealIndex,
  totalDeals,
  playerNames
}) => {
  const difference = scores.NS - scores.EW;
  const leadingTeam = difference > 0 ? "NS" : difference < 0 ? "EW" : null;

  return (
    <div className="bg-slate-800 rounded-lg p-4 min-w-64">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Scoreboard
      </h2>
      
      <div className="mb-4 text-center">
        <div className="text-slate-300">Deal {dealIndex + 1} of {totalDeals}</div>
        {difference !== 0 && (
          <div className={`text-sm mt-1 ${difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {Math.abs(difference)} point {difference > 0 ? 'lead' : 'behind'}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Team NS */}
        <div className={`
          p-3 rounded-lg border-2 
          ${leadingTeam === "NS" ? 'border-green-400 bg-green-900/20' : 'border-slate-600 bg-slate-700'}
        `}>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-semibold">Team NS</div>
              <div className="text-xs text-slate-400">
                {playerNames.N} & {playerNames.S}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {scores.NS}
              </div>
              {leadingTeam === "NS" && (
                <div className="text-green-400 text-xs">Leading</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Team EW */}
        <div className={`
          p-3 rounded-lg border-2 
          ${leadingTeam === "EW" ? 'border-green-400 bg-green-900/20' : 'border-slate-600 bg-slate-700'}
        `}>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-semibold">Team EW</div>
              <div className="text-xs text-slate-400">
                {playerNames.E} & {playerNames.W}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {scores.EW}
              </div>
              {leadingTeam === "EW" && (
                <div className="text-green-400 text-xs">Leading</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Difference */}
      <div className="mt-4 p-3 bg-slate-700 rounded-lg text-center">
        <div className="text-slate-300 text-sm mb-1">Difference (NS - EW)</div>
        <div className={`text-xl font-bold ${
          difference > 0 ? 'text-green-400' : 
          difference < 0 ? 'text-red-400' : 
          'text-gray-400'
        }`}>
          {difference >= 0 ? '+' : ''}{difference}
        </div>
      </div>
      
      {/* Game status */}
      {leadingTeam && (
        <div className="mt-3 text-center">
          <div className="text-green-400 text-sm">
            Team {leadingTeam} is leading
          </div>
        </div>
      )}
      
      {difference === 0 && (
        <div className="mt-3 text-center">
          <div className="text-gray-400 text-sm">
            Tied game
          </div>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;