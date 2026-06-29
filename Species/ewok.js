'use strict';

/** @type {import('../src/types/game.js').SpeciesData} */
export const SPECIES_EWOK = {
  name: 'Ewok',
  abilityAdj: { dex: 2, str: -2 },
  speed: '4 sq',
  autoLangs: ['Ewokês (apenas falado)'],
  traits: [
    { name: 'Baixa Estatura', desc: 'Criatura Pequena: +1 bônus de tamanho à Defesa de Reflexos e +5 a testes de Furtividade. Limites de levantar/carregar equivalem a 3/4 dos valores de criaturas Médias.' },
    { name: 'Primitivos', desc: 'Não recebe a aptidão Proficiência com Armas (pistolas, rifles ou armas pesadas) como aptidão inicial no 1º nível, mesmo se a classe lhes garantir.' },
    { name: 'Olfato', desc: 'Quando a até 10 quadrados de distância, ignora obstáculos e coberturas em testes de Percepção e não recebe penalidade por baixa visibilidade ao rastrear.' },
    { name: 'Sorrateiro', desc: 'Pode refazer um teste de Furtividade, mas o segundo resultado é definitivo mesmo se for inferior ao primeiro.' },
    { name: 'Aptidão Extra Condicional', desc: 'Um ewok com Sobrevivência como perícia treinada recebe Foco em Perícia (Sobrevivência) como aptidão bônus.' },
  ],
  conditionalFeats: [{ feat: 'Foco em Perícia (Sobrevivência)', requiresTrained: 'survival', condText: 'Sobrevivência treinada' }],
};
