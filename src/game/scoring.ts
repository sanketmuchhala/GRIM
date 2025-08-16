import { 
  AuctionBid, 
  TeamId, 
  Trick, 
  Phase, 
  getSeatTeam,
  getOpposingTeam 
} from './types';

export interface ScoreResult {
  teamScores: Record<TeamId, number>;
  message: string;
}

export function calculateGrimScore(
  declaringTeam: TeamId,
  winningBid: AuctionBid,
  tricks: Trick[],
  totalTricks: number
): ScoreResult {
  const declaringTeamTricks = tricks.filter(trick => 
    trick.winner && getSeatTeam(trick.winner) === declaringTeam
  ).length;
  
  const success = declaringTeamTricks === totalTricks;
  
  let points = 0;
  let message = "";
  
  if (totalTricks === 4) {
    // 4-card Grim
    if (winningBid === "Grim") {
      points = success ? 16 : -32;
      message = success 
        ? `${declaringTeam} wins all 4 tricks: +16 points`
        : `${declaringTeam} fails Grim: -32 points`;
    } else if (winningBid === "DoubleGrim") {
      points = success ? 32 : -64;
      message = success 
        ? `${declaringTeam} wins all 4 tricks (Double): +32 points`
        : `${declaringTeam} fails Double Grim: -64 points`;
    }
  } else if (totalTricks === 8) {
    // 8-card Grim
    if (winningBid === "Grim") {
      points = success ? 64 : -128;
      message = success 
        ? `${declaringTeam} wins all 8 tricks: +64 points`
        : `${declaringTeam} fails 8-card Grim: -128 points`;
    }
  }
  
  const teamScores: Record<TeamId, number> = { NS: 0, EW: 0 };
  teamScores[declaringTeam] = points;
  
  return { teamScores, message };
}

export function calculateMake5Score(
  leadingTeam: TeamId,
  tricks: Trick[]
): ScoreResult {
  const leadingTeamTricks = tricks.filter(trick => 
    trick.winner && getSeatTeam(trick.winner) === leadingTeam
  ).length;
  
  const nonLeadingTeam = getOpposingTeam(leadingTeam);
  const nonLeadingTeamTricks = 8 - leadingTeamTricks;
  
  const teamScores: Record<TeamId, number> = { NS: 0, EW: 0 };
  let message = "";
  
  if (leadingTeamTricks >= 5) {
    teamScores[leadingTeam] = 5;
    message = `${leadingTeam} takes ${leadingTeamTricks} tricks: +5 points`;
  } else if (nonLeadingTeamTricks >= 4) {
    teamScores[nonLeadingTeam] = 10;
    message = `${nonLeadingTeam} takes ${nonLeadingTeamTricks} tricks: +10 points`;
  } else {
    message = `No team scores (${leadingTeam}: ${leadingTeamTricks}, ${nonLeadingTeam}: ${nonLeadingTeamTricks})`;
  }
  
  return { teamScores, message };
}

export function addScores(
  currentScores: Record<TeamId, number>,
  scoreToAdd: Record<TeamId, number>
): Record<TeamId, number> {
  return {
    NS: currentScores.NS + scoreToAdd.NS,
    EW: currentScores.EW + scoreToAdd.EW
  };
}

export function getScoreDifference(scores: Record<TeamId, number>): number {
  return scores.NS - scores.EW;
}

export function getLeadingTeam(scores: Record<TeamId, number>): TeamId | null {
  const diff = getScoreDifference(scores);
  if (diff > 0) return "NS";
  if (diff < 0) return "EW";
  return null;
}

export function formatScore(scores: Record<TeamId, number>): string {
  const diff = getScoreDifference(scores);
  return `NS: ${scores.NS}, EW: ${scores.EW} (${diff >= 0 ? '+' : ''}${diff})`;
}