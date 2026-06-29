import { describe, it, expect } from 'vitest';
import {
  calcMod,
  calcDefense,
  calcSkill,
  calcHpPerLevel,
  calcHpLevel1,
  calcMulticlassBAB,
} from '../src/logic/calculations.js';

// ─── Modificador de Atributo ────────────────────────────────────────────────

describe('calcMod — modificador de atributo', () => {
  it('score 10 → mod 0',  () => expect(calcMod(10)).toBe(0));
  it('score 11 → mod 0',  () => expect(calcMod(11)).toBe(0));
  it('score 12 → mod 1',  () => expect(calcMod(12)).toBe(1));
  it('score 14 → mod 2',  () => expect(calcMod(14)).toBe(2));
  it('score 18 → mod 4',  () => expect(calcMod(18)).toBe(4));
  it('score 8  → mod -1', () => expect(calcMod(8)).toBe(-1));
  it('score 6  → mod -2', () => expect(calcMod(6)).toBe(-2));
  it('score 1  → mod -5', () => expect(calcMod(1)).toBe(-5));
});

// ─── Defesas ────────────────────────────────────────────────────────────────

describe('calcDefense — Fortitude / Reflexo / Vontade', () => {
  it('nível 1, sem classe, CON 10 → 11', () => {
    expect(calcDefense({ level: 1, classBonuses: [0], abilityMod: 0 })).toBe(11);
  });

  it('nível 5, bônus de classe 2, CON 14 (mod +2) → 19', () => {
    expect(calcDefense({ level: 5, classBonuses: [2], abilityMod: 2 })).toBe(19);
  });

  it('multiclasse: usa o melhor bônus entre [1, 3] → usa 3', () => {
    expect(calcDefense({ level: 4, classBonuses: [1, 3], abilityMod: 1 })).toBe(18);
  });

  it('misc bônus é somado corretamente', () => {
    expect(calcDefense({ level: 3, classBonuses: [1], abilityMod: 0, misc: 2 })).toBe(16);
  });
});

// ─── Perícias ────────────────────────────────────────────────────────────────

describe('calcSkill — total de perícia', () => {
  it('nível 2, não treinado, mod 1 → 2', () => {
    expect(calcSkill({ level: 2, abilityMod: 1 })).toBe(2); // 1 + 1
  });

  it('nível 4, treinado, mod 2 → 9', () => {
    expect(calcSkill({ level: 4, abilityMod: 2, trained: true })).toBe(9); // 2 + 2 + 5
  });

  it('nível 4, treinado + foco, mod 2 → 14', () => {
    expect(calcSkill({ level: 4, abilityMod: 2, trained: true, focus: true })).toBe(14);
  });

  it('nível 10, treinado, mod 3, misc 2 → 15', () => {
    expect(calcSkill({ level: 10, abilityMod: 3, misc: 2, trained: true })).toBe(15);
    // 5 + 3 + 2 + 5 = 15
  });

  it('nível ímpar arredonda para baixo no ½', () => {
    expect(calcSkill({ level: 5, abilityMod: 0 })).toBe(2); // ⌊5/2⌋ = 2
  });
});

// ─── HP ─────────────────────────────────────────────────────────────────────

describe('calcHpLevel1 — HP do nível 1', () => {
  it('Jedi (d10) + CON 10 → 10', () => expect(calcHpLevel1(10, 0)).toBe(10));
  it('Jedi (d10) + CON 14 → 12', () => expect(calcHpLevel1(10, 2)).toBe(12));
  it('Nobre (d6) + CON 8  → 5',  () => expect(calcHpLevel1(6, -1)).toBe(5));
});

describe('calcHpPerLevel — HP por nível', () => {
  it('rolagem 8, CON mod 0 → 8',  () => expect(calcHpPerLevel(8, 0)).toBe(8));
  it('rolagem 1, CON mod 2 → 3',  () => expect(calcHpPerLevel(1, 2)).toBe(3));
  it('rolagem 1, CON mod -2 → mínimo 1', () => expect(calcHpPerLevel(1, -2)).toBe(1));
  it('rolagem 3, CON mod -4 → mínimo 1', () => expect(calcHpPerLevel(3, -4)).toBe(1));
});

// ─── BAB Multiclasse ─────────────────────────────────────────────────────────

describe('calcMulticlassBAB', () => {
  it('uma classe → usa seu BAB', () => expect(calcMulticlassBAB([3])).toBe(3));
  it('multiclasse → usa o maior',  () => expect(calcMulticlassBAB([2, 4])).toBe(4));
  it('array vazio → 0',            () => expect(calcMulticlassBAB([])).toBe(0));
});
