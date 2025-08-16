export type Suit = "S" | "H" | "D" | "C";
export type Rank = 7 | 8 | 9 | 10 | "J" | "Q" | "K" | "A";
export type RankOrder = "High" | "Low";
export type Trump = Suit | "NT";
export type Seat = "N" | "E" | "S" | "W";
export type TeamId = "NS" | "EW";
export type AuctionBid = "Pass" | "Grim" | "DoubleGrim";
export type Phase = "Round1" | "Round2" | "Round3" | "Make5" | "Score";

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export interface AuctionState {
  currentBid?: AuctionBid;
  bidder?: Seat;
  declarer?: Seat;
  bids: Array<{ seat: Seat; bid: AuctionBid }>;
}

export interface TrickCard {
  seat: Seat;
  card: Card;
}

export interface Trick {
  ledSuit?: Suit;
  cards: TrickCard[];
  winner?: Seat;
}

export interface CoinTossResult {
  team: TeamId;
  dealerSeat: Seat;
}

export interface GameConfig {
  deals: number;
  bots: Partial<Record<Seat, boolean>>;
  playerNames: Record<Seat, string>;
}

export interface GameState {
  seed: string;
  coinToss?: CoinTossResult;
  dealer: Seat;
  leadingTeam: TeamId;
  phase: Phase;
  round: 1 | 2 | 3;
  hands: Record<Seat, Card[]>;
  setAsideR1: Record<Seat, Card[]>;
  currentTrick: Trick;
  completedTricks: Trick[];
  auction: AuctionState;
  rankOrder?: RankOrder;
  trump?: Trump;
  predeclaredTrump?: Suit;
  scores: Record<TeamId, number>;
  dealIndex: number;
  log: string[];
  currentPlayer: Seat;
  isGameOver: boolean;
  config: GameConfig;
}

export const SEATS: Seat[] = ["N", "E", "S", "W"];
export const SUITS: Suit[] = ["S", "H", "D", "C"];
export const RANKS: Rank[] = [7, 8, 9, 10, "J", "Q", "K", "A"];

export const TEAM_SEATS: Record<TeamId, [Seat, Seat]> = {
  NS: ["N", "S"],
  EW: ["E", "W"],
};

export const SEAT_TEAMS: Record<Seat, TeamId> = {
  N: "NS",
  S: "NS",
  E: "EW",
  W: "EW",
};

export function getPartner(seat: Seat): Seat {
  const partners: Record<Seat, Seat> = {
    N: "S",
    S: "N",
    E: "W",
    W: "E",
  };
  return partners[seat];
}

export function getNextSeat(seat: Seat): Seat {
  const order: Record<Seat, Seat> = {
    N: "E",
    E: "S",
    S: "W",
    W: "N",
  };
  return order[seat];
}

export function getSeatTeam(seat: Seat): TeamId {
  return SEAT_TEAMS[seat];
}

export function getOpposingTeam(team: TeamId): TeamId {
  return team === "NS" ? "EW" : "NS";
}