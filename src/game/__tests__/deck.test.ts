import { describe, it, expect } from 'vitest';
import { createDeck, shuffleDeck, dealCards, sortHand, getCardDisplay, getCardColor } from '../deck';
import { Card } from '../types';

describe('Deck utilities', () => {
  describe('createDeck', () => {
    it('should create a 32-card deck', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(32);
    });

    it('should have 4 suits with 8 ranks each', () => {
      const deck = createDeck();
      const suits = ['S', 'H', 'D', 'C'];
      const ranks = [7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
      
      suits.forEach(suit => {
        const suitCards = deck.filter(card => card.suit === suit);
        expect(suitCards).toHaveLength(8);
        
        ranks.forEach(rank => {
          const card = suitCards.find(c => c.rank === rank);
          expect(card).toBeDefined();
          expect(card?.id).toBe(`${suit}${rank}`);
        });
      });
    });
  });

  describe('shuffleDeck', () => {
    it('should maintain deck size after shuffling', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck, 'test-seed');
      expect(shuffled).toHaveLength(32);
    });

    it('should be deterministic with same seed', () => {
      const deck = createDeck();
      const shuffled1 = shuffleDeck(deck, 'test-seed');
      const shuffled2 = shuffleDeck(deck, 'test-seed');
      
      shuffled1.forEach((card, index) => {
        expect(card.id).toBe(shuffled2[index].id);
      });
    });

    it('should produce different results with different seeds', () => {
      const deck = createDeck();
      const shuffled1 = shuffleDeck(deck, 'seed1');
      const shuffled2 = shuffleDeck(deck, 'seed2');
      
      let differences = 0;
      shuffled1.forEach((card, index) => {
        if (card.id !== shuffled2[index].id) {
          differences++;
        }
      });
      
      expect(differences).toBeGreaterThan(0);
    });
  });

  describe('dealCards', () => {
    it('should deal specified number of cards to each player', () => {
      const deck = createDeck();
      const hands = dealCards(deck, 4, 4);
      
      expect(hands).toHaveLength(4);
      hands.forEach(hand => {
        expect(hand).toHaveLength(4);
      });
    });

    it('should deal cards round-robin style', () => {
      const deck = [
        { id: '1', suit: 'S', rank: 7 },
        { id: '2', suit: 'H', rank: 8 },
        { id: '3', suit: 'D', rank: 9 },
        { id: '4', suit: 'C', rank: 10 },
        { id: '5', suit: 'S', rank: 'J' },
        { id: '6', suit: 'H', rank: 'Q' },
        { id: '7', suit: 'D', rank: 'K' },
        { id: '8', suit: 'C', rank: 'A' },
      ] as Card[];
      
      const hands = dealCards(deck, 2, 4);
      
      expect(hands[0]).toEqual([deck[0], deck[4]]);
      expect(hands[1]).toEqual([deck[1], deck[5]]);
      expect(hands[2]).toEqual([deck[2], deck[6]]);
      expect(hands[3]).toEqual([deck[3], deck[7]]);
    });
  });

  describe('getCardDisplay', () => {
    it('should display cards with suit symbols', () => {
      expect(getCardDisplay({ id: 'S7', suit: 'S', rank: 7 })).toBe('7♠');
      expect(getCardDisplay({ id: 'HA', suit: 'H', rank: 'A' })).toBe('A♥');
      expect(getCardDisplay({ id: 'DK', suit: 'D', rank: 'K' })).toBe('K♦');
      expect(getCardDisplay({ id: 'CJ', suit: 'C', rank: 'J' })).toBe('J♣');
    });
  });

  describe('getCardColor', () => {
    it('should return red for hearts and diamonds', () => {
      expect(getCardColor('H')).toBe('red');
      expect(getCardColor('D')).toBe('red');
    });

    it('should return black for spades and clubs', () => {
      expect(getCardColor('S')).toBe('black');
      expect(getCardColor('C')).toBe('black');
    });
  });

  describe('sortHand', () => {
    it('should sort cards by suit then rank', () => {
      const hand: Card[] = [
        { id: 'HA', suit: 'H', rank: 'A' },
        { id: 'S7', suit: 'S', rank: 7 },
        { id: 'H8', suit: 'H', rank: 8 },
        { id: 'SA', suit: 'S', rank: 'A' },
      ];
      
      const sorted = sortHand(hand);
      
      expect(sorted[0].id).toBe('S7');
      expect(sorted[1].id).toBe('SA');
      expect(sorted[2].id).toBe('H8');
      expect(sorted[3].id).toBe('HA');
    });
  });
});