# Grim Card Game

A complete implementation of the **Grim** card game built with React + Vite + TypeScript, deployable to GitHub Pages with a built-in **coin toss** to determine the initial dealer team.

## 🎮 Live Demo

Visit the live game: [https://yourusername.github.io/GRIM/](https://yourusername.github.io/GRIM/)

## 🎯 Game Overview

**Grim** is a trick-taking card game for 4 players in 2 teams featuring:

- **Coin toss** for initial dealer determination
- **3-round auction system** per deal (4-card → 4-card → 8-card → Make-5 fallback)
- **High/Low rank orders** chosen by declarer
- **Trump or No-Trump** play
- **Double Grim takeover** bidding
- **Make-5 fallback** when all auctions pass
- **Deterministic gameplay** with seeded randomization

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Deployment to GitHub Pages

#### Option 1: GitHub Actions (Recommended)

1. Push your code to GitHub
2. Go to **Settings** → **Pages** → **Source** → **GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` will automatically:
   - Run tests and linting
   - Build the project
   - Deploy to GitHub Pages

#### Option 2: Manual Deployment

```bash
# Build and deploy manually
npm run deploy
```

**Important:** The app uses `HashRouter` to support GitHub Pages routing. All routes work correctly on refresh.

## 🎲 Coin Toss → Deal 1 Flow

### Initial Setup
1. **New Match**: Players configure game settings (deals count, player names, bots)
2. **Start Match**: Triggers the coin toss modal

### Coin Toss Process
3. **Coin Toss Modal**: 
   - Animated coin flip (2-second animation)
   - Fair 50/50 result using seeded PRNG
   - Displays result: "Team X deals first (Seat: Y)"
   - Option to retoss or manually select dealer

4. **Dealer & Leading Setup**:
   - **Dealer Team**: The team that won the coin toss
   - **Dealer Seat**: Randomly selected from the winning team
   - **Leading Team**: The opposing team (receives first card)

### Deal 1 Begins
5. **Card Distribution**: 
   - Dealing starts left of dealer
   - Leading team receives first card (alternating clockwise)
   - Each player gets 4 cards for Round 1 auction

6. **Ongoing Dealer Rotation**:
   - After each deal, next dealer = any member of **losing team**
   - Maintains dealer/leading relationship throughout match

## 🏗️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Routing**: React Router (HashRouter for GitHub Pages)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Actions → GitHub Pages

## 📁 Project Structure

```
src/
├── game/                 # Game logic
│   ├── types.ts         # TypeScript interfaces
│   ├── state.ts         # Zustand store
│   ├── prng.ts          # Seeded random number generator
│   ├── deck.ts          # Card deck utilities
│   ├── ranks.ts         # Rank comparison logic
│   ├── auction.ts       # Auction logic
│   ├── tricks.ts        # Trick play logic
│   ├── scoring.ts       # Scoring calculations
│   └── make5.ts         # Make-5 fallback logic
├── components/          # React components
│   ├── CoinTossModal.tsx # Coin toss with animation
│   ├── AuctionPanel.tsx # Bidding interface
│   ├── Hand.tsx         # Player hand display
│   ├── TrickArea.tsx    # Central trick display
│   ├── Scoreboard.tsx   # Score tracking
│   ├── EventLog.tsx     # Game events log
│   └── NameEditor.tsx   # Player name editing
├── routes/              # Main screens
│   ├── Lobby.tsx        # Game setup & coin toss
│   ├── Table.tsx        # Main game table
│   └── Rules.tsx        # Rules documentation
└── test/                # Unit tests
```

## 🧪 Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage**:
- ✅ Deck creation and seeded shuffling
- ✅ PRNG deterministic behavior  
- ✅ Rank comparison (High/Low orders)
- ✅ Trick winner determination
- ✅ Auction logic and validation
- ✅ Scoring calculations

## 🎲 Deterministic Seeds

For reproducible games, try these seeds in the developer console:

```javascript
// Set specific seed before starting new game
localStorage.setItem('grim-game-seed', 'grimtest1');

// Coin toss outcomes:
// 'grimtest1' → Team NS wins toss
// 'grimtest2' → Team EW wins toss  
// 'grimtest3' → Close competitive game
```

## 🎮 Game Rules Summary

### Core Mechanics
- **32-card deck** (7,8,9,10,J,Q,K,A in each suit)
- **4 players, 2 teams** (NS vs EW, partners opposite)
- **3 auction rounds max** per deal: 4-card → 4-card → 8-card → Make-5

### Auction & Scoring
- **Bids**: Pass / Grim / Double Grim (takeover)
- **Grim scoring**: 4-card (+16/-32), 8-card (+64/-128)
- **Double Grim**: 4-card (+32/-64)
- **Make-5**: Leading team 5+ tricks (+5), Non-leading 4+ tricks (+10)

### Key Features
- **Coin toss** determines initial dealer team
- **Pre-declared trump** from Round 1 all-pass
- **High/Low rank orders** chosen by declarer
- **Dealer rotation** to losing team after each deal

## 🔧 Configuration

### Environment Variables
- `VITE_APP_TITLE`: App title (default: "Grim")
- `VITE_BASE_URL`: Base URL for deployment

### Game Settings
- **Deals per match**: 10-15 (default 12)
- **Bot players**: Toggle per seat
- **Player names**: Editable in lobby

## 📖 Full Rules

See [rules.md](rules.md) for complete game rules and strategies.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm test`
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

🤖 **Generated with [Claude Code](https://claude.ai/code)**

*Built following the complete Grim game specification with coin toss, deterministic gameplay, and GitHub Pages deployment.*
