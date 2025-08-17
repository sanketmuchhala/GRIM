import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  GameState, 
  GameConfig, 
  Seat, 
  TeamId, 
  Card, 
  AuctionBid, 
  RankOrder, 
  Trump, 
  CoinTossResult,
  SEATS,
  getSeatTeam,
  getNextSeat,
  getOpposingTeam,
  TEAM_SEATS
} from './types';
import { createDeck, shuffleDeck, dealCards } from './deck';
import { generateSeed, SeededRandom } from './prng';
import { getBotBid, getBotCard, getBotRankOrder, getBotTrump } from './bots';
import { getWinningCard } from './ranks';
import { calculateGrimScore, addScores } from './scoring';

interface GameStore extends GameState {
  // Actions
  newGame: (config: GameConfig) => void;
  performCoinToss: () => CoinTossResult;
  skipCoinToss: (team: TeamId) => void;
  startDeal: () => void;
  placeBid: (seat: Seat, bid: AuctionBid) => void;
  selectRankOrder: (order: RankOrder) => void;
  selectTrump: (trump: Trump) => void;
  playCard: (seat: Seat, card: Card) => void;
  nextDeal: () => void;
  resetGame: () => void;
  updatePlayerName: (seat: Seat, name: string) => void;
  addLogEntry: (message: string) => void;
  handleAllPass: () => void;
  completeTrick: () => void;
  processBotTurn: () => void;
  scoreRound: () => void;
}

const initialGameConfig: GameConfig = {
  deals: 12,
  bots: {
    N: true,
    E: true,
    S: false, // Human player
    W: true
  },
  playerNames: {
    N: "North (Bot)",
    E: "East (Bot)", 
    S: "You",
    W: "West (Bot)"
  }
};

const createInitialState = (config: GameConfig): GameState => {
  const seed = generateSeed();
  
  return {
    seed,
    dealer: "N",
    leadingTeam: "EW", // Will be set by coin toss
    phase: "Round1",
    round: 1,
    hands: { N: [], E: [], S: [], W: [] },
    setAsideR1: { N: [], E: [], S: [], W: [] },
    currentTrick: { cards: [] },
    completedTricks: [],
    auction: { bids: [] },
    scores: { NS: 0, EW: 0 },
    dealIndex: 0,
    log: [],
    currentPlayer: "N",
    isGameOver: false,
    config
  };
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(initialGameConfig),

      newGame: (config: GameConfig) => {
        set(createInitialState(config));
        get().addLogEntry("New game started");
      },

      performCoinToss: () => {
        const state = get();
        const rng = new SeededRandom(state.seed + "_cointoss");
        const team: TeamId = rng.nextBoolean() ? "NS" : "EW";
        const dealerSeat = rng.choice(TEAM_SEATS[team]);
        
        const result: CoinTossResult = { team, dealerSeat };
        
        set({
          coinToss: result,
          dealer: dealerSeat,
          leadingTeam: getOpposingTeam(team)
        });
        
        get().addLogEntry(`Coin toss result: Team ${team} deals first (Seat: ${dealerSeat})`);
        return result;
      },

      skipCoinToss: (team: TeamId) => {
        const rng = new SeededRandom(get().seed + "_manual");
        const dealerSeat = rng.choice(TEAM_SEATS[team]);
        
        const result: CoinTossResult = { team, dealerSeat };
        
        set({
          coinToss: result,
          dealer: dealerSeat,
          leadingTeam: getOpposingTeam(team)
        });
        
        get().addLogEntry(`Manual selection: Team ${team} deals first (Seat: ${dealerSeat})`);
      },

      startDeal: () => {
        const state = get();
        if (!state.coinToss) return;
        
        const deck = createDeck();
        const shuffled = shuffleDeck(deck, state.seed + "_deal" + state.dealIndex);
        
        // Deal 4 cards to each player (Round 1)
        const hands = dealCards(shuffled, 4, 4);
        const dealerIndex = SEATS.indexOf(state.dealer);
        const startIndex = (dealerIndex + 1) % 4; // Deal starts left of dealer
        
        const newHands: Record<Seat, Card[]> = { N: [], E: [], S: [], W: [] };
        for (let i = 0; i < 4; i++) {
          const seatIndex = (startIndex + i) % 4;
          const seat = SEATS[seatIndex];
          newHands[seat] = hands[i];
        }
        
        set({
          hands: newHands,
          phase: "Round1",
          round: 1,
          currentPlayer: getNextSeat(state.dealer), // Auction starts left of dealer
          auction: { bids: [] },
          currentTrick: { cards: [] },
          completedTricks: [],
          rankOrder: undefined,
          trump: undefined
        });
        
        get().addLogEntry(`Deal ${state.dealIndex + 1}: Cards dealt. Auction begins.`);
      },

      placeBid: (seat: Seat, bid: AuctionBid) => {
        const state = get();
        const newBids = [...state.auction.bids, { seat, bid }];
        
        let newCurrentBid = state.auction.currentBid;
        let newBidder = state.auction.bidder;
        let newDeclarer = state.auction.declarer;
        
        if (bid === "Grim") {
          newCurrentBid = "Grim";
          newBidder = seat;
          newDeclarer = seat;
        } else if (bid === "DoubleGrim") {
          newCurrentBid = "DoubleGrim";
          newBidder = seat;
          newDeclarer = seat; // Takeover
        }
        
        set({
          auction: {
            ...state.auction,
            bids: newBids,
            currentBid: newCurrentBid,
            bidder: newBidder,
            declarer: newDeclarer
          },
          currentPlayer: getNextSeat(seat)
        });
        
        get().addLogEntry(`${seat}: ${bid}`);
        
        // Check if auction is complete
        if (newBids.length >= 4) {
          if (newDeclarer) {
            // Someone has bid - check if 3 consecutive passes after the last non-pass bid
            let lastNonPassIndex = -1;
            for (let i = newBids.length - 1; i >= 0; i--) {
              if (newBids[i].bid !== "Pass") {
                lastNonPassIndex = i;
                break;
              }
            }
            if (lastNonPassIndex >= 0) {
              const bidsAfterLastNonPass = newBids.slice(lastNonPassIndex + 1);
              if (bidsAfterLastNonPass.length >= 3 && bidsAfterLastNonPass.every(b => b.bid === "Pass")) {
                get().addLogEntry(`${newDeclarer} wins auction with ${newCurrentBid}`);
                // Auction is complete, now declarer needs to choose rank order and trump
              }
            }
          } else {
            // Check if all 4 players have passed in succession
            if (newBids.length >= 4) {
              const lastFourBids = newBids.slice(-4);
              const allPass = lastFourBids.every(b => b.bid === "Pass");
              if (allPass) {
                get().addLogEntry("All players passed");
                get().handleAllPass();
                return;
              }
            }
          }
        }
      },

      selectRankOrder: (order: RankOrder) => {
        set({ rankOrder: order });
        get().addLogEntry(`Rank order: ${order}`);
      },

      selectTrump: (trump: Trump) => {
        set({ trump });
        const trumpText = trump === "NT" ? "No Trump" : trump;
        get().addLogEntry(`Trump: ${trumpText}`);
        
        // Start trick play
        const state = get();
        if (state.auction.declarer) {
          set({ currentPlayer: state.auction.declarer });
          get().addLogEntry(`${state.auction.declarer} leads`);
        }
      },

      playCard: (seat: Seat, card: Card) => {
        const state = get();
        
        // Remove card from hand
        const newHands = { ...state.hands };
        newHands[seat] = newHands[seat].filter(c => c.id !== card.id);
        
        // Add to current trick
        const newTrick = { ...state.currentTrick };
        newTrick.cards.push({ seat, card });
        
        // Set led suit if this is the first card
        if (newTrick.cards.length === 1) {
          newTrick.ledSuit = card.suit;
        }
        
        get().addLogEntry(`${seat} plays ${card.rank}${card.suit}`);
        
        // Check if trick is complete
        if (newTrick.cards.length === 4) {
          // Determine trick winner
          const cardsWithSeats = newTrick.cards.map(tc => ({
            card: tc.card,
            seat: tc.seat
          }));
          
          const winner = getWinningCard(cardsWithSeats, newTrick.ledSuit!, state.rankOrder!, state.trump);
          newTrick.winner = winner.seat as Seat;
          
          // Move completed trick
          const newCompletedTricks = [...state.completedTricks, newTrick];
          
          set({
            hands: newHands,
            currentTrick: { cards: [] },
            completedTricks: newCompletedTricks,
            currentPlayer: winner.seat as Seat // Winner leads next trick
          });
          
          get().addLogEntry(`${winner.seat} wins the trick`);
          
          // Check if all tricks are complete
          const expectedTricks = state.phase === "Round1" || state.phase === "Round2" ? 4 : 8;
          if (newCompletedTricks.length >= expectedTricks) {
            get().scoreRound();
          }
        } else {
          set({
            hands: newHands,
            currentTrick: newTrick,
            currentPlayer: getNextSeat(seat)
          });
        }
      },

      nextDeal: () => {
        const state = get();
        const newDealIndex = state.dealIndex + 1;
        
        if (newDealIndex >= state.config.deals) {
          set({ isGameOver: true });
          get().addLogEntry("Game Over!");
          return;
        }
        
        // Determine next dealer (losing team)
        const nsScore = state.scores.NS;
        const ewScore = state.scores.EW;
        const losingTeam: TeamId = nsScore <= ewScore ? "NS" : "EW";
        const newDealer = TEAM_SEATS[losingTeam][0]; // Pick first seat of losing team
        
        set({
          dealIndex: newDealIndex,
          dealer: newDealer,
          leadingTeam: getOpposingTeam(losingTeam),
          phase: "Round1",
          round: 1,
          hands: { N: [], E: [], S: [], W: [] },
          setAsideR1: { N: [], E: [], S: [], W: [] },
          currentTrick: { cards: [] },
          completedTricks: [],
          auction: { bids: [] },
          rankOrder: undefined,
          trump: undefined,
          predeclaredTrump: undefined
        });
        
        get().startDeal();
      },

      resetGame: () => {
        const state = get();
        set(createInitialState(state.config));
      },

      updatePlayerName: (seat: Seat, name: string) => {
        const state = get();
        set({
          config: {
            ...state.config,
            playerNames: {
              ...state.config.playerNames,
              [seat]: name
            }
          }
        });
      },

      addLogEntry: (message: string) => {
        const state = get();
        set({
          log: [...state.log, `${new Date().toLocaleTimeString()}: ${message}`]
        });
      },

      handleAllPass: () => {
        const state = get();
        
        if (state.round === 1) {
          // Set aside Round 1 cards and deal Round 2 cards (4 new cards each)
          const deck = createDeck();
          const shuffled = shuffleDeck(deck, state.seed + "_round2_" + state.dealIndex);
          const hands = dealCards(shuffled.slice(16), 4, 4); // Skip first 16 cards (Round 1)
          const dealerIndex = SEATS.indexOf(state.dealer);
          const startIndex = (dealerIndex + 1) % 4;
          
          const newHands: Record<Seat, Card[]> = { N: [], E: [], S: [], W: [] };
          for (let i = 0; i < 4; i++) {
            const seatIndex = (startIndex + i) % 4;
            const seat = SEATS[seatIndex];
            newHands[seat] = hands[i];
          }
          
          set({
            setAsideR1: { ...state.hands }, // Save Round 1 cards
            hands: newHands,
            phase: "Round2",
            round: 2,
            auction: { bids: [] },
            currentPlayer: getNextSeat(state.dealer),
            currentTrick: { cards: [] },
            completedTricks: [],
            rankOrder: undefined,
            trump: undefined
          });
          get().addLogEntry("All passed Round 1. Round 2 begins.");
          
        } else if (state.round === 2) {
          // Combine Round 1 and Round 2 cards for Round 3 (8 cards each)
          const combinedHands: Record<Seat, Card[]> = { N: [], E: [], S: [], W: [] };
          SEATS.forEach(seat => {
            combinedHands[seat] = [...state.setAsideR1[seat], ...state.hands[seat]];
          });
          
          set({ 
            hands: combinedHands,
            phase: "Round3", 
            round: 3,
            auction: { bids: [] },
            currentPlayer: getNextSeat(state.dealer),
            currentTrick: { cards: [] },
            completedTricks: [],
            rankOrder: undefined,
            trump: undefined
          });
          get().addLogEntry("All passed Round 2. Round 3 begins with 8 cards.");
          
        } else {
          // Round 3 all pass - go to Make-5 
          set({ 
            phase: "Make5",
            trump: "S", // Default trump for Make-5
            rankOrder: "High", // Default order for Make-5
            currentPlayer: state.auction.declarer || getNextSeat(state.dealer)
          });
          get().addLogEntry("All passed Round 3. Make-5 begins.");
        }
      },

      completeTrick: () => {
        get().addLogEntry("Trick completed");
      },

      processBotTurn: () => {
        const state = get();
        const currentPlayer = state.currentPlayer;
        const isBot = state.config.bots[currentPlayer];
        
        if (!isBot) return; // Not a bot's turn
        
        // Handle bot auction
        if (!state.trump || !state.rankOrder) {
          const bid = getBotBid(currentPlayer, state.auction, state.seed);
          setTimeout(() => {
            get().placeBid(currentPlayer, bid);
            
            // If bot wins auction, make declarer choices
            const newState = get();
            if (newState.auction.declarer === currentPlayer && !newState.rankOrder) {
              setTimeout(() => {
                const rankOrder = getBotRankOrder(newState.seed + "_" + currentPlayer);
                get().selectRankOrder(rankOrder);
                
                setTimeout(() => {
                  const trump = getBotTrump(newState.seed + "_" + currentPlayer);
                  get().selectTrump(trump);
                }, 300);
              }, 300);
            }
          }, 600);
          return;
        }
        
        // Handle bot card play
        if (state.trump && state.rankOrder) {
          const hand = state.hands[currentPlayer];
          if (hand.length > 0) {
            const card = getBotCard(
              currentPlayer, 
              hand, 
              state.currentTrick.ledSuit, 
              state.seed, 
              state.completedTricks.length
            );
            setTimeout(() => {
              get().playCard(currentPlayer, card);
            }, 600);
          }
        }
      },

      scoreRound: () => {
        const state = get();
        
        if (!state.auction.declarer || !state.auction.currentBid) return;
        
        const declaringTeam = getSeatTeam(state.auction.declarer);
        const expectedTricks = state.phase === "Round1" || state.phase === "Round2" ? 4 : 8;
        
        const scoreResult = calculateGrimScore(
          declaringTeam,
          state.auction.currentBid,
          state.completedTricks,
          expectedTricks
        );
        
        const newScores = addScores(state.scores, scoreResult.teamScores);
        
        set({
          scores: newScores,
          phase: "Score"
        });
        
        get().addLogEntry(scoreResult.message);
        get().addLogEntry(`Scores: NS ${newScores.NS}, EW ${newScores.EW}`);
      }
    }),
    {
      name: 'grim-game-storage',
    }
  )
);