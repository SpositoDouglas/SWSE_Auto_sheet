'use strict';

const SPECIES_NEIMOIDIANO = {
  name: 'Neimoidiano',
  abilityAdj: { int: 2, wis: 2, str: -6 },
  speed: '6 sq',
  autoLangs: ['Básico', 'Neimoidiano', 'Pak Pak'],
  conditionalFeats: [
    { feat: 'Foco em Perícia (Dissimulação)', requiresTrained: 'deception', condText: 'Dissimulação treinada' },
  ],
  traits: [
    { name: 'Estatura Mediana', desc: 'Neimoidianos não recebem bônus ou penalidades especiais por seu tamanho.' },
    { name: 'Aptidão Bônus Condicional', desc: 'Os neimoidianos com Dissimulação como perícia treinada ganham Foco em Perícia (Dissimulação) como aptidão bônus.' },
    { name: 'Perícias', desc: 'Um neimoidiano pode jogar novamente um teste de Dissimulação, mas deve manter o segundo resultado.' },
  ],
};
