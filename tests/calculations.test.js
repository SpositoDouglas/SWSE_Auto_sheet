import { describe, it, expect } from 'vitest';
import {
  calcMod,
  calcDefense,
  calcSkill,
  calcHpPerLevel,
  calcHpLevel1,
  calcMulticlassBAB,
  calcDamageBonus,
  calcDamageThreshold,
  calcForcePoints,
  conditionEffect,
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

describe('calcMulticlassBAB — soma o BAB de cada classe', () => {
  it('uma classe → usa seu BAB',  () => expect(calcMulticlassBAB([3])).toBe(3));
  it('multiclasse → soma os BABs', () => expect(calcMulticlassBAB([2, 4])).toBe(6));
  it('exemplo do livro: nobre 6 (+4) / soldado 2 (+2) → +6', () => {
    expect(calcMulticlassBAB([4, 2])).toBe(6);
  });
  it('três classes → soma todas', () => expect(calcMulticlassBAB([1, 2, 3])).toBe(6));
  it('array vazio → 0',           () => expect(calcMulticlassBAB([])).toBe(0));
});

// ─── Bônus de Dano ───────────────────────────────────────────────────────────

describe('calcDamageBonus — metade do nível (arredondado p/ baixo)', () => {
  it('nível 1 → +0',   () => expect(calcDamageBonus(1)).toBe(0));
  it('nível 2 → +1',   () => expect(calcDamageBonus(2)).toBe(1));
  it('nível 4 → +2',   () => expect(calcDamageBonus(4)).toBe(2));
  it('nível 11 → +5',  () => expect(calcDamageBonus(11)).toBe(5));
  it('nível 12 → +6',  () => expect(calcDamageBonus(12)).toBe(6));
  it('nível 20 → +10', () => expect(calcDamageBonus(20)).toBe(10));
});

// ─── Limite de Dano ──────────────────────────────────────────────────────────

describe('calcDamageThreshold — Limite de Dano', () => {
  it('Pequeno/Médio → igual à Defesa de Fortitude', () => {
    expect(calcDamageThreshold({ fortDefense: 14 })).toBe(14);
  });
  it('com Limite de Dano Aprimorado (×1) → +5', () => {
    expect(calcDamageThreshold({ fortDefense: 14, improvedThreshold: 1 })).toBe(19);
  });
  it('Limite de Dano Aprimorado acumula (×2) → +10', () => {
    expect(calcDamageThreshold({ fortDefense: 14, improvedThreshold: 2 })).toBe(24);
  });
  it('modificador de tamanho Grande (+5) via misc', () => {
    expect(calcDamageThreshold({ fortDefense: 18, misc: 5 })).toBe(23);
  });
  it('Colossal (+50) + aptidão + misc combinados', () => {
    expect(calcDamageThreshold({ fortDefense: 20, sizeMod: 50, improvedThreshold: 1, misc: 2 })).toBe(77);
  });
});

// ─── Pontos da Força ─────────────────────────────────────────────────────────

describe('calcForcePoints — Pontos da Força por nível', () => {
  // Classes base (5 + ½ nível)
  it('classe base, nível 1 → 5 + ⌊1/2⌋ = 5', () => {
    expect(calcForcePoints({ base: 5, charLevel: 1 })).toBe(5);
  });
  it('classe base (Soldado 5), nível 5 → 5 + ⌊5/2⌋ = 7', () => {
    expect(calcForcePoints({ base: 5, charLevel: 5 })).toBe(7);
  });
  it('nível ímpar arredonda ½ para baixo (nível 3) → 5 + 1 = 6', () => {
    expect(calcForcePoints({ base: 5, charLevel: 3 })).toBe(6);
  });

  // Classes de prestígio (6 + ½ nível)
  it('prestígio comum (base 6), nível 8 → 6 + 4 = 10', () => {
    expect(calcForcePoints({ base: 6, charLevel: 8 })).toBe(10);
  });

  // Classes de prestígio poderosas (7 + ½ nível)
  it('prestígio poderoso (base 7), nível 8 → 7 + 4 = 11', () => {
    expect(calcForcePoints({ base: 7, charLevel: 8 })).toBe(11);
  });

  // Favorecido pela Força (+3)
  it('Favorecido pela Força soma +3 (base 5, nível 1) → 8', () => {
    expect(calcForcePoints({ base: 5, charLevel: 1, favored: true })).toBe(8);
  });
  it('Favorecido com prestígio poderoso (base 7, nível 8) → 14', () => {
    expect(calcForcePoints({ base: 7, charLevel: 8, favored: true })).toBe(14);
  });
  it('favored: false é o padrão (sem +3)', () => {
    expect(calcForcePoints({ base: 6, charLevel: 8, favored: false })).toBe(10);
  });
});

// ─── Marcador de Condição ────────────────────────────────────────────────────

describe('conditionEffect — penalidades do marcador de condição', () => {
  it('normal → sem penalidade', () => {
    expect(conditionEffect('normal')).toEqual({ penalty: 0, halfSpeed: false, helpless: false });
  });
  it('valor desconhecido/ausente → sem penalidade', () => {
    expect(conditionEffect(undefined)).toEqual({ penalty: 0, halfSpeed: false, helpless: false });
  });
  it('−1 passo → penalidade 1', () => {
    expect(conditionEffect('-1')).toEqual({ penalty: 1, halfSpeed: false, helpless: false });
  });
  it('−2 passos → penalidade 2', () => {
    expect(conditionEffect('-2')).toEqual({ penalty: 2, halfSpeed: false, helpless: false });
  });
  it('−5 passos → penalidade 5', () => {
    expect(conditionEffect('-5')).toEqual({ penalty: 5, halfSpeed: false, helpless: false });
  });
  it('−10 passos → penalidade 10 + deslocamento à metade', () => {
    expect(conditionEffect('-10')).toEqual({ penalty: 10, halfSpeed: true, helpless: false });
  });
  it('indefeso → helpless + deslocamento à metade', () => {
    expect(conditionEffect('helpless')).toEqual({ penalty: 10, halfSpeed: true, helpless: true });
  });
});
