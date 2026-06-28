'use strict';

const SPECIES_HUMANO = {
  name: 'Humano',
  abilityAdj: {},
  speed: '6 sq',
  autoLangs: ['Básico'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Humanos não recebem bônus ou penalidades por seu tamanho.' },
    { name: 'Perícia Treinada Extra', desc: 'Recebe uma perícia treinada adicional no primeiro nível, escolhida da lista de perícias de classe do personagem.' },
    { name: 'Aptidão Extra', desc: 'Recebe uma aptidão extra no primeiro nível.' },
  ],
  choiceFeats: [{ name: 'Aptidão Extra' }],
};
