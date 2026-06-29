'use strict';

/** @type {import('../src/types/game.js').SpeciesData} */
export const SPECIES_QUARREN = {
  name: 'Quarren',
  abilityAdj: { con: 2, wis: -2, cha: -2 },
  speed: '6 sq (nado: 4 sq)',
  autoLangs: ['Básico', 'Quarrenês'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Quarren não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Respirar Debaixo d\'Água', desc: 'Como criaturas aquáticas, não se afogam na água.' },
    { name: 'Especialista em Nado', desc: 'Pode refazer qualquer teste de Nadar (segundo resultado é definitivo). Pode escolher 10 em Nadar mesmo distraído ou sob ameaça.' },
    { name: 'Visão na Penumbra', desc: 'Ignora camuflagem (mas não camuflagem total) pela escuridão.' },
    { name: 'Aptidão Extra Condicional', desc: 'Um quarren com Persuasão como perícia treinada recebe Foco em Perícia (Persuasão) como aptidão bônus.' },
  ],
  conditionalFeats: [{ feat: 'Foco em Perícia (Persuasão)', requiresTrained: 'persuasion', condText: 'Persuasão treinada' }],
};
