'use strict';

export const SPECIES_MONCALAMARI = {
  name: 'Mon Calamari',
  abilityAdj: { int: 2, wis: 2, con: -2 },
  speed: '6 sq (nado: 4 sq)',
  autoLangs: ['Básico', 'Mon Calamariano'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Mon calamari não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Respirar Debaixo d\'Água', desc: 'Como criaturas anfíbias, não se afogam na água.' },
    { name: 'Especialista em Nado', desc: 'Pode refazer qualquer teste de Nadar (segundo resultado é definitivo). Pode escolher 10 em Nadar mesmo distraído ou sob ameaça.' },
    { name: 'Visão na Penumbra', desc: 'Ignora camuflagem (mas não camuflagem total) pela escuridão.' },
    { name: 'Aptidão Extra Condicional', desc: 'Um mon calamari com Percepção como perícia treinada recebe Foco em Perícia (Percepção) como aptidão bônus.' },
  ],
  conditionalFeats: [{ feat: 'Foco em Perícia (Percepção)', requiresTrained: 'perception', condText: 'Percepção treinada' }],
};
