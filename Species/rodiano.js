'use strict';

/** @type {import('../src/types/game.js').SpeciesData} */
export const SPECIES_RODIANO = {
  name: 'Rodiano',
  abilityAdj: { dex: 2, wis: -2, cha: -2 },
  speed: '6 sq',
  autoLangs: ['Básico', 'Rodês'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Rodianos não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Percepção Elevada', desc: 'Pode jogar novamente qualquer teste de Percepção (segundo resultado é definitivo).' },
    { name: 'Visão na Penumbra', desc: 'Ignora camuflagem (mas não camuflagem total) pela escuridão.' },
    { name: 'Aptidão Extra Condicional', desc: 'Um rodiano com Sobrevivência como perícia treinada recebe Foco em Perícia (Sobrevivência) automaticamente.' },
  ],
  conditionalFeats: [{ feat: 'Foco em Perícia (Sobrevivência)', requiresTrained: 'survival', condText: 'Sobrevivência treinada' }],
};
