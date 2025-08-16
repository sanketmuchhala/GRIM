import { describe, it, expect } from 'vitest';
import { getRankValue, compareRanks, compareCards, getWinningCard } from '../ranks';
import { Card, Rank } from '../types';

describe('Rank utilities', () => {
  describe('getRankValue', () => {
    it('should return correct values for High order', () => {
      expect(getRankValue('A', 'High')).toBe(0);
      expect(getRankValue('K', 'High')).toBe(1);
      expect(getRankValue('Q', 'High')).toBe(2);
      expect(getRankValue('J', 'High')).toBe(3);
      expect(getRankValue(10, 'High')).toBe(4);
      expect(getRankValue(9, 'High')).toBe(5);
      expect(getRankValue(8, 'High')).toBe(6);
      expect(getRankValue(7, 'High')).toBe(7);
    });

    it('should return correct values for Low order', () => {
      expect(getRankValue(7, 'Low')).toBe(0);
      expect(getRankValue(8, 'Low')).toBe(1);
      expect(getRankValue(9, 'Low')).toBe(2);
      expect(getRankValue(10, 'Low')).toBe(3);
      expect(getRankValue('J', 'Low')).toBe(4);
      expect(getRankValue('Q', 'Low')).toBe(5);
      expect(getRankValue('K', 'Low')).toBe(6);
      expect(getRankValue('A', 'Low')).toBe(7);
    });
  });

  describe('compareRanks', () => {
    it('should compare correctly in High order', () => {
      expect(compareRanks('A', 'K', 'High')).toBeLessThan(0); // A beats K
      expect(compareRanks('K', 'A', 'High')).toBeGreaterThan(0); // K loses to A
      expect(compareRanks('A', 'A', 'High')).toBe(0); // Equal
      expect(compareRanks(7, 8, 'High')).toBeGreaterThan(0); // 7 loses to 8
    });

    it('should compare correctly in Low order', () => {
      expect(compareRanks(7, 8, 'Low')).toBeLessThan(0); // 7 beats 8 (7 has index 0, 8 has index 1)
      expect(compareRanks(8, 7, 'Low')).toBeGreaterThan(0); // 8 loses to 7
      expect(compareRanks('A', 'K', 'Low')).toBeGreaterThan(0); // A (index 7) loses to K (index 6) in Low order
      expect(compareRanks('K', 'A', 'Low')).toBeLessThan(0); // K beats A in Low order
      expect(compareRanks('A', 'A', 'Low')).toBe(0); // Equal
    });
  });

  describe('compareCards', () => {
    const card1: Card = { id: 'SA', suit: 'S', rank: 'A' };
    const card2: Card = { id: 'SK', suit: 'S', rank: 'K' };
    const card3: Card = { id: 'HA', suit: 'H', rank: 'A' };

    it('should compare same-suit cards correctly', () => {
      expect(compareCards(card1, card2, 'High')).toBeLessThan(0); // SA beats SK
      expect(compareCards(card2, card1, 'High')).toBeGreaterThan(0); // SK loses to SA
    });

    it('should handle trump cards correctly', () => {
      // Hearts trump, comparing SA vs HA
      expect(compareCards(card1, card3, 'High', 'H')).toBeGreaterThan(0); // SA loses to HA (trump)
      expect(compareCards(card3, card1, 'High', 'H')).toBeLessThan(0); // HA (trump) beats SA
    });

    it('should handle No Trump correctly', () => {
      expect(compareCards(card1, card3, 'High', 'NT')).toBe(0); // Different suits, no trump
    });
  });

  describe('getWinningCard', () => {
    const cards = [
      { card: { id: 'S7', suit: 'S', rank: 7 } as Card, seat: 'N' },
      { card: { id: 'SA', suit: 'S', rank: 'A' } as Card, seat: 'E' },
      { card: { id: 'SK', suit: 'S', rank: 'K' } as Card, seat: 'S' },
      { card: { id: 'HQ', suit: 'H', rank: 'Q' } as Card, seat: 'W' },
    ];

    it('should determine winner with no trump (following suit)', () => {
      const winner = getWinningCard(cards, 'S', 'High');
      expect(winner.seat).toBe('E'); // SA is highest spade
    });

    it('should determine winner with trump', () => {
      const winner = getWinningCard(cards, 'S', 'High', 'H');
      expect(winner.seat).toBe('W'); // HQ is trump, beats all spades
    });

    it('should handle Low order correctly', () => {
      const winner = getWinningCard(cards, 'S', 'Low');
      expect(winner.seat).toBe('N'); // S7 is highest in Low order
    });

    it('should handle mixed suits with led suit preference', () => {
      const mixedCards = [
        { card: { id: 'S7', suit: 'S', rank: 7 } as Card, seat: 'N' },
        { card: { id: 'HA', suit: 'H', rank: 'A' } as Card, seat: 'E' },
        { card: { id: 'SK', suit: 'S', rank: 'K' } as Card, seat: 'S' },
        { card: { id: 'D8', suit: 'D', rank: 8 } as Card, seat: 'W' },
      ];

      const winner = getWinningCard(mixedCards, 'S', 'High', 'NT');
      expect(winner.seat).toBe('S'); // SK is highest spade (led suit)
    });
  });
});