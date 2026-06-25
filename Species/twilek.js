'use strict';

const SPECIES_TWILEK = {
  name: "Twi'lek",
  abilityAdj: { cha: 2, wis: -2 },
  speed: '6 sq',
  autoLangs: ['Básico', 'Ryl'],
  traits: [
    { name: 'Estatura Mediana', desc: "Twi'leks não recebem quaisquer bônus ou penalidades por seu tamanho." },
    { name: 'Ludibriador', desc: 'Pode refazer qualquer teste de Dissimulação (segundo resultado é definitivo).' },
    { name: 'Grande Fortitude', desc: '+2 de bônus de espécie à Defesa de Fortitude. Resistência natural a toxinas e enfermidades.' },
    { name: 'Visão na Penumbra', desc: 'Ignora camuflagem (mas não camuflagem total) pela escuridão.' },
  ]
};
