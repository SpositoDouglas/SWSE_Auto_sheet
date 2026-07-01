// src/logic/calculations.js
// Funções puras de cálculo do SWSE — extraídas de js/script.js para serem
// testáveis (Vitest) e reutilizáveis. Mantêm exatamente as fórmulas oficiais
// já implementadas no app.

/**
 * Calcula o modificador de um atributo SWSE.
 * @param {number} score - O valor do atributo (1–40)
 * @returns {number} O modificador (pode ser negativo)
 */
export function calcMod(score) {
  return Math.floor((score - 10) / 2);
}

/**
 * Calcula uma defesa (Fortitude, Reflexo ou Vontade).
 * Fórmula: 10 + nível heróico + melhor bônus de classe + modificador de atributo + misc
 *
 * @param {{ level: number, classBonuses: number[], abilityMod: number, misc?: number }} params
 * @returns {number}
 */
export function calcDefense({ level, classBonuses, abilityMod, misc = 0 }) {
  const bestClassBonus = Math.max(0, ...classBonuses);
  return 10 + level + bestClassBonus + abilityMod + misc;
}

/**
 * Calcula o total de uma perícia.
 * Fórmula: ½ nível + mod. atributo + misc + 5 (treinado) + 5 (foco)
 *
 * @param {{ level: number, abilityMod: number, misc?: number, trained?: boolean, focus?: boolean }} params
 * @returns {number}
 */
export function calcSkill({ level, abilityMod, misc = 0, trained = false, focus = false }) {
  return Math.floor(level / 2)
    + abilityMod
    + misc
    + (trained ? 5 : 0)
    + (focus ? 5 : 0);
}

/**
 * Calcula o HP ganho por nível (mínimo 1).
 * @param {number} roll - Resultado da rolagem do dado de vida
 * @param {number} conMod - Modificador de Constituição
 * @returns {number}
 */
export function calcHpPerLevel(roll, conMod) {
  return Math.max(1, roll + conMod);
}

/**
 * Calcula o HP do nível 1 (HP inicial da classe + modificador de Constituição).
 * @param {number} startingHP - HP inicial da classe (campo `startingHP`)
 * @param {number} conMod - Modificador de Constituição
 * @returns {number}
 */
export function calcHpLevel1(startingHP, conMod) {
  return startingHP + conMod;
}

/**
 * Calcula o Bônus de Base de Ataque em multiclasse.
 * Regra oficial (SWSE, pág. 28/116): some o BAB de cada classe, usando o valor
 * da tabela de cada classe no nível de classe correspondente. Ex.: nobre 6 (+4)
 * / soldado 2 (+2) → BAB +6.
 * @param {number[]} babs - Array com o BAB de cada classe no seu nível de classe
 * @returns {number}
 */
export function calcMulticlassBAB(babs) {
  return babs.reduce((sum, b) => sum + b, 0);
}

/**
 * Calcula o Bônus de Dano por nível (SWSE, pág. 28).
 * Todo personagem causa dano extra em ataques corpo-a-corpo e à distância igual
 * à metade do nível de personagem, arredondado para baixo (nível 1 → +0).
 * @param {number} charLevel - Nível de personagem (nível heróico)
 * @returns {number}
 */
export function calcDamageBonus(charLevel) {
  return Math.floor(charLevel / 2);
}

/**
 * Calcula o Limite de Dano (SWSE, pág. 28/154).
 * Fórmula: Defesa de Fortitude + modificador de tamanho. Para tamanho
 * Pequeno/Médio o modificador é 0 (Limite de Dano = Fortitude). A aptidão
 * Limite de Dano Aprimorado soma +5 por escolha (acumula).
 *
 * @param {{ fortDefense: number, sizeMod?: number, improvedThreshold?: number, misc?: number }} params
 * @returns {number}
 */
export function calcDamageThreshold({ fortDefense, sizeMod = 0, improvedThreshold = 0, misc = 0 }) {
  return fortDefense + sizeMod + improvedThreshold * 5 + misc;
}

/**
 * Calcula os Pontos da Força do nível atual (SWSE, pág. 96).
 * Fórmula: base + ½ nível de personagem (arredondado p/ baixo) + (Favorecido pela
 * Força ? 3 : 0). O `base` depende da classe do último nível ganho: 5 para as
 * classes base, 6 para a maioria das classes de prestígio e 7 para as de forte
 * conexão com a Força (Discípulo da Força, Mestre Jedi, Lorde Sith). A cada novo
 * nível os pontos restantes são perdidos e o total é redefinido para este valor.
 *
 * @param {{ base: number, charLevel: number, favored?: boolean }} params
 * @returns {number}
 */
export function calcForcePoints({ base, charLevel, favored = false }) {
  return base + Math.floor(charLevel / 2) + (favored ? 3 : 0);
}

/**
 * Efeitos de um passo do Marcador de Condição (SWSE, pág. 155).
 * Cada passo aplica a mesma penalidade a TODAS as Defesas, jogadas de ataque,
 * testes de habilidade e testes de perícia. O penúltimo passo (–10) também
 * reduz o deslocamento à metade; o último passo é Indefeso (inconsciente/desabilitado).
 *
 * @typedef {Object} ConditionEffect
 * @property {number}  penalty   - Penalidade numérica (0, 1, 2, 5 ou 10) aplicada como valor negativo
 * @property {boolean} halfSpeed - Deslocamento reduzido à metade
 * @property {boolean} helpless  - Indefeso (inconsciente/desabilitado)
 */

/**
 * Traduz o valor do marcador de condição na penalidade e efeitos correspondentes.
 * @param {string} condition - 'normal' | '-1' | '-2' | '-5' | '-10' | 'helpless'
 * @returns {ConditionEffect}
 */
export function conditionEffect(condition) {
  switch (condition) {
    case '-1':       return { penalty: 1,  halfSpeed: false, helpless: false };
    case '-2':       return { penalty: 2,  halfSpeed: false, helpless: false };
    case '-5':       return { penalty: 5,  halfSpeed: false, helpless: false };
    case '-10':      return { penalty: 10, halfSpeed: true,  helpless: false };
    case 'helpless': return { penalty: 10, halfSpeed: true,  helpless: true  };
    default:         return { penalty: 0,  halfSpeed: false, helpless: false };
  }
}
