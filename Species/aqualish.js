'use strict';

/** @type {import('../src/types/game.js').SpeciesData} */
export const SPECIES_AQUALISH = {
  name: 'Aqualish',
  abilityAdj: { con: 2, wis: -2, cha: -2 },
  speed: '6 sq',
  autoLangs: ['Aqualish', 'Básico'],
  autoFeats: ['Vigoroso'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Aqualish não recebem bônus ou penalidades especiais por seu tamanho.' },
    { name: 'Respirar Debaixo D\'Água', desc: 'Como criaturas anfíbias, os aqualishes não se afogam na água.' },
    { name: 'Nadador Experiente', desc: 'Um aqualish pode escolher jogar novamente qualquer teste da perícia Nadar, mas o resultado da nova jogada deve ser aceito mesmo que seja pior. Um aqualish também pode escolher um 10 em testes de Nadar, mesmo quando distraído ou ameaçado.' },
    { name: 'Aptidão Bônus', desc: 'Os aqualish recebem a aptidão Vigoroso como aptidão bônus.' },
  ],
};
