'use strict';

/** @type {import('../src/types/game.js').SpeciesData} */
export const SPECIES_CODRUJI = {
  name: 'Codru-Ji',
  abilityAdj: {},
  speed: '6 sq',
  autoLangs: ['Básico', 'Codruês'],
  // Aptidões condicionais: concedidas gratuitamente quando a condição é atendida.
  //   feat            -> nome (chave em ALL_FEATS quando aplicável)
  //   requiresTrained -> id de perícia que precisa estar treinada (opcional)
  //   condText        -> texto do requisito p/ exibição (default: pré-req da aptidão)
  conditionalFeats: [
    { feat: 'Maestria com Duas Armas I', condText: 'DEX 13 e BAB +1' },
  ],
  traits: [
    { name: 'Estatura Mediana', desc: 'Codru-Ji não recebem bônus ou penalidades especiais por seu tamanho.' },
    { name: 'Aptidão Condicional: Maestria com Duas Armas I', desc: 'O Codru-Ji recebe a aptidão Maestria com Duas Armas I como aptidão bônus desde que cumpra os pré-requisitos (Destreza mínima 13 e Bônus de Ataque Base +1).' },
    { name: 'Braços Extras', desc: 'Codru-Ji possuem quatro braços e podem segurar até quatro itens ou armas ao mesmo tempo. Esta habilidade não concede ataques extras; porém, permite que o Codru-Ji empunhe duas armas de duas mãos simultaneamente.' },
    { name: 'Agarrador Habilidoso', desc: 'Devido aos seus braços extras, Codru-Ji recebem +5 de bônus de espécie em testes de Agarrar e de Prender.' },
  ],
};
