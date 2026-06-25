'use strict';

const SPECIES_CEREANO = {
  name: 'Cereano',
  abilityAdj: { int: 2, wis: 2, dex: -2 },
  speed: '6 sq',
  autoLangs: ['Básico', 'Cereano'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Cereanos não recebem bônus ou penalidades por seu tamanho.' },
    { name: 'Iniciativa Intuitiva', desc: 'Pode jogar novamente qualquer teste de Iniciativa, mas o resultado do novo teste deve ser aceito mesmo se for pior que o anterior.' },
    { name: 'Aptidão Extra Condicional', desc: 'Um cereano com Iniciativa como perícia treinada recebe Foco em Perícia (Iniciativa) como aptidão bônus.' },
  ]
};
