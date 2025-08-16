import { describe, it, expect } from 'vitest';
import { SeededRandom, generateSeed } from '../prng';

describe('SeededRandom', () => {
  describe('deterministic behavior', () => {
    it('should produce same sequence with same seed', () => {
      const rng1 = new SeededRandom('test-seed');
      const rng2 = new SeededRandom('test-seed');
      
      const sequence1 = Array.from({ length: 10 }, () => rng1.next());
      const sequence2 = Array.from({ length: 10 }, () => rng2.next());
      
      sequence1.forEach((value, index) => {
        expect(value).toBe(sequence2[index]);
      });
    });

    it('should produce different sequences with different seeds', () => {
      const rng1 = new SeededRandom('seed1');
      const rng2 = new SeededRandom('seed2');
      
      const sequence1 = Array.from({ length: 10 }, () => rng1.next());
      const sequence2 = Array.from({ length: 10 }, () => rng2.next());
      
      let differences = 0;
      sequence1.forEach((value, index) => {
        if (value !== sequence2[index]) {
          differences++;
        }
      });
      
      expect(differences).toBeGreaterThan(0);
    });
  });

  describe('next()', () => {
    it('should return values between 0 and 1', () => {
      const rng = new SeededRandom('test');
      
      for (let i = 0; i < 100; i++) {
        const value = rng.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });

  describe('nextInt()', () => {
    it('should return integers within specified range', () => {
      const rng = new SeededRandom('test');
      
      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(5, 10);
        expect(value).toBeGreaterThanOrEqual(5);
        expect(value).toBeLessThanOrEqual(10);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it('should include both min and max values', () => {
      const rng = new SeededRandom('test');
      const values = new Set();
      
      for (let i = 0; i < 1000; i++) {
        values.add(rng.nextInt(0, 2));
      }
      
      expect(values.has(0)).toBe(true);
      expect(values.has(1)).toBe(true);
      expect(values.has(2)).toBe(true);
    });
  });

  describe('nextBoolean()', () => {
    it('should return both true and false values', () => {
      const rng = new SeededRandom('test');
      const values = new Set();
      
      for (let i = 0; i < 100; i++) {
        values.add(rng.nextBoolean());
      }
      
      expect(values.has(true)).toBe(true);
      expect(values.has(false)).toBe(true);
    });
  });

  describe('shuffle()', () => {
    it('should maintain array length', () => {
      const rng = new SeededRandom('test');
      const array = [1, 2, 3, 4, 5];
      const shuffled = rng.shuffle(array);
      
      expect(shuffled).toHaveLength(array.length);
    });

    it('should not modify original array', () => {
      const rng = new SeededRandom('test');
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      
      rng.shuffle(original);
      
      expect(original).toEqual(originalCopy);
    });

    it('should contain all original elements', () => {
      const rng = new SeededRandom('test');
      const array = [1, 2, 3, 4, 5];
      const shuffled = rng.shuffle(array);
      
      array.forEach(item => {
        expect(shuffled).toContain(item);
      });
    });

    it('should be deterministic with same seed', () => {
      const array = [1, 2, 3, 4, 5];
      const rng1 = new SeededRandom('test');
      const rng2 = new SeededRandom('test');
      
      const shuffled1 = rng1.shuffle(array);
      const shuffled2 = rng2.shuffle(array);
      
      expect(shuffled1).toEqual(shuffled2);
    });
  });

  describe('choice()', () => {
    it('should return element from array', () => {
      const rng = new SeededRandom('test');
      const array = ['a', 'b', 'c', 'd'];
      
      for (let i = 0; i < 100; i++) {
        const choice = rng.choice(array);
        expect(array).toContain(choice);
      }
    });

    it('should eventually select all elements', () => {
      const rng = new SeededRandom('test');
      const array = ['a', 'b', 'c'];
      const selected = new Set();
      
      for (let i = 0; i < 100; i++) {
        selected.add(rng.choice(array));
      }
      
      expect(selected.size).toBe(3);
      expect(selected.has('a')).toBe(true);
      expect(selected.has('b')).toBe(true);
      expect(selected.has('c')).toBe(true);
    });
  });
});

describe('generateSeed', () => {
  it('should generate different seeds on subsequent calls', () => {
    const seed1 = generateSeed();
    const seed2 = generateSeed();
    
    expect(seed1).not.toBe(seed2);
  });

  it('should generate string seeds', () => {
    const seed = generateSeed();
    expect(typeof seed).toBe('string');
    expect(seed.length).toBeGreaterThan(0);
  });
});