import React from 'react';
import { useNavigate } from 'react-router-dom';

const Rules: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Grim Game Rules</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Back to Lobby
          </button>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-8 space-y-6">
          
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Overview</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong>Players & Teams:</strong> 4 players, 2 teams (partners sit opposite). Clockwise play.</li>
              <li><strong>Deck:</strong> 32 cards (7,8,9,10,J,Q,K,A in each suit; no 2–6, no jokers).</li>
              <li><strong>Match Length:</strong> Fixed number of deals (default 12, configurable 10–15).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Rank Orders</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong>High:</strong> A &gt; K &gt; Q &gt; J &gt; 10 &gt; 9 &gt; 8 &gt; 7</li>
              <li><strong>Low:</strong> 7 &lt; 8 &lt; 9 &lt; 10 &lt; J &lt; Q &lt; K &lt; A</li>
              <li>Applies within all suits, including trump.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Deal Structure</h2>
            <div className="text-slate-300 space-y-3">
              <p>Each deal has <strong>at most 3 auctions:</strong></p>
              
              <div className="ml-4">
                <h4 className="font-semibold text-white">Round 1 (4 cards each)</h4>
                <p>Auction → If won: choose High/Low + Trump/No-Trump → play 4 tricks → score → deal ends.</p>
                <p>If all pass: set cards aside, pre-declare trump suit → Round 2.</p>
              </div>
              
              <div className="ml-4">
                <h4 className="font-semibold text-white">Round 2 (new 4 cards each)</h4>
                <p>Auction → If won: choose High/Low + Trump/No-Trump → play 4 tricks → score → deal ends.</p>
                <p>If all pass → Round 3.</p>
              </div>
              
              <div className="ml-4">
                <h4 className="font-semibold text-white">Round 3 (8-card stage)</h4>
                <p>Auction → If won: choose High/Low + Trump/No-Trump → play 8 tricks → score → deal ends.</p>
                <p>If all pass: <strong>Make-5 fallback</strong> with pre-declared trump.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Auction</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong>Bids:</strong> Pass / Grim / Double Grim</li>
              <li><strong>Double Grim = Takeover:</strong> The overcaller becomes declarer and selects High/Low and Trump/No-Trump.</li>
              <li>Auction continues until someone wins or all pass.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Trick Play</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Must follow suit if possible; otherwise any card.</li>
              <li>If any trump is played, highest trump (by chosen order) wins.</li>
              <li>Otherwise highest of led suit wins.</li>
              <li><strong>Declarer leads</strong> the first trick after winning auction.</li>
              <li>Trick winner leads next trick.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Scoring</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Grim Success Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>4-card Grim: Declarer's team wins all 4 tricks</li>
                  <li>8-card Grim: Declarer's team wins all 8 tricks</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Points</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>4-card Grim: +16 / -32</li>
                  <li>4-card Double Grim: +32 / -64</li>
                  <li>8-card Grim: +64 / -128</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Make-5 Fallback</h2>
            <div className="text-slate-300 space-y-2">
              <p>Only occurs when all three auctions pass:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Uses the pre-declared suit trump (no No-Trump option)</li>
                <li><strong>Leading team</strong> must take 5+ tricks → +5 points</li>
                <li><strong>Non-leading team</strong> must take 4+ tricks → +10 points</li>
                <li>Only one side can score (8 tricks total)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Dealer & Leading Team</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>After each deal, the <strong>next dealer</strong> is any member of the <strong>losing team</strong>.</li>
              <li>Dealing starts to the left, so the first recipient is on the <strong>leading team</strong>.</li>
              <li>The <strong>leading team</strong> is always the opposing team of the dealer's team.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Coin Toss</h2>
            <div className="text-slate-300 space-y-2">
              <p>At the start of each match:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Fair coin toss determines which team deals Deal 1</li>
                <li>Randomly selects one of the two seats from that team as initial dealer</li>
                <li>Sets up the dealer/leading team relationship for the entire match</li>
                <li>Can be skipped for manual dealer selection</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Winning</h2>
            <p className="text-slate-300">
              After all deals are completed, the team with the higher total score wins the match.
              Scores are displayed as Team NS, Team EW, and the difference (NS - EW).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Rules;