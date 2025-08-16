# Grim Card Game Rules (v1.0)

## Overview

**Grim** is a trick-taking card game for 4 players in 2 teams (partners sit opposite). The game features a unique auction system with up to 3 rounds per deal and a coin toss to determine the initial dealer.

### Basic Setup
- **Players & Teams:** 4 players, 2 teams (NS vs EW, partners sit opposite)
- **Deck:** 32 cards (7,8,9,10,J,Q,K,A in each suit; no 2–6, no jokers)
- **Play:** Clockwise
- **Match Length:** Fixed number of deals (default 12, configurable 10–15)

## Rank Orders

The declarer chooses one rank order for the entire deal:

- **High Order:** A > K > Q > J > 10 > 9 > 8 > 7
- **Low Order:** 7 < 8 < 9 < 10 < J < Q < K < A

This order applies within **all suits**, including trump.

## Initial Dealer Selection

### Coin Toss
At the start of each match, a **coin toss** determines which team deals Deal 1:

1. Fair 50/50 coin toss (seeded for reproducibility)
2. Result selects the **initial dealer team** (NS or EW)
3. Randomly picks one of the two seats from that team as the initial **dealer seat**
4. The opposing team becomes the **leading team** for Deal 1
5. Can be skipped for manual dealer selection

The coin toss result is logged and displayed to all players.

## Deal Structure

Each deal consists of **at most 3 auction rounds:**

### Round 1: 4-Card Stage
1. Deal 4 cards to each player
2. **Auction** (Pass / Grim / Double Grim)
3. **If auction won:** Declarer chooses High/Low + Trump/No-Trump → play 4 tricks → score → deal ends
4. **If all pass:** Set those 4 cards aside (no peeking) + **pre-declare a suit trump** → Round 2

### Round 2: New 4-Card Stage  
1. Deal 4 new cards to each player
2. **Auction** (Pass / Grim / Double Grim)
3. **If auction won:** Declarer chooses High/Low + Trump/No-Trump → play 4 tricks → score → deal ends
4. **If all pass:** → Round 3

### Round 3: 8-Card Stage
1. Players pick up their Round 1 set-aside cards (now have 8 cards each)
2. **Auction** (Pass / Grim / Double Grim)  
3. **If auction won:** Declarer chooses High/Low + Trump/No-Trump → play 8 tricks → score → deal ends
4. **If all pass:** **Make-5 fallback** with the pre-declared trump from Round 1

## Auction Rules

### Bidding Options
- **Pass:** No bid
- **Grim:** Bid to win all tricks
- **Double Grim:** Takeover bid (overcalls Grim)

### Auction Flow
- Starts with player left of dealer
- Continues clockwise until won or all pass
- **Double Grim = Takeover:** The overcaller becomes declarer and selects High/Low and Trump/No-Trump
- Cannot bid Grim if there's already a bid
- Can only Double Grim if current bid is Grim (not Double Grim)

### Declarer Choices
After winning an auction, the declarer must choose:
1. **Rank Order:** High or Low
2. **Trump:** Spades (♠), Hearts (♥), Diamonds (♦), Clubs (♣), or No Trump (NT)

## Trick Play

### Rules
- Must **follow suit** if possible; otherwise any card
- If any trump is played, **highest trump** (by chosen order) wins
- Otherwise **highest of led suit** wins
- **Declarer leads** the first trick after winning auction
- Trick winner leads next trick

### Grim Success Requirements
- **4-card Grim:** Declarer's **team** must win all 4 tricks
- **8-card Grim:** Declarer's **team** must win all 8 tricks

## Scoring

### Grim Scoring
| Type | Success | Failure |
|------|---------|---------|
| 4-card Grim | +16 | -32 |
| 4-card Double Grim | +32 | -64 |
| 8-card Grim | +64 | -128 |

### Make-5 Fallback
Only occurs when all three auctions pass:

- Uses the **pre-declared suit trump** (no No-Trump option)
- **Leading team** must take 5+ tricks → **+5 points**
- **Non-leading team** must take 4+ tricks → **+10 points**  
- Only one side can score (8 tricks total)

## Dealer Rotation & Leading Team

### After Each Deal
- **Next dealer:** Any member of the **losing team** (team with lower score)
- **Leading team:** Always the opposing team of the dealer's team
- Dealing starts left of dealer, so **leading team receives first card**

### Pre-Declared Trump
- Chosen by the **first recipient** (member of leading team) after Round 1 all-pass
- Only applies to **Make-5** if Round 2 and Round 3 also pass
- Does **not** affect Round 2 or Round 3 if someone wins those auctions

## Winning the Match

After all deals are completed:
- Team with **higher total score** wins
- Scores displayed as: Team NS, Team EW, and difference (NS - EW)
- Ties are possible

## Example Deterministic Seeds

For reproducible games, use these seeds:

- **Seed:** `grimtest1` - NS wins coin toss, exciting comeback game
- **Seed:** `grimtest2` - EW wins coin toss, multiple Make-5 scenarios
- **Seed:** `grimtest3` - Close game with Double Grim attempts

## Key Strategic Elements

1. **Coin toss** sets the tone for dealer/leading dynamics
2. **Pre-declared trump** creates tension in Round 1 passing decisions
3. **Double Grim takeover** allows aggressive overcalling
4. **Make-5 scoring** (5 vs 10 points) rewards defensive play
5. **Dealer rotation** based on losing team creates comeback opportunities

---

*Generated with [Claude Code](https://claude.ai/code)*