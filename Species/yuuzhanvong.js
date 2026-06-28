'use strict';

const SPECIES_YUUZHANVONG = {
  name: 'Yuuzhan Vong',
  abilityAdj: { str: 2, wis: -2 },
  speed: '6 sq',
  autoLangs: ['Yuuzhan Vong'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Yuuzhan Vong não recebem bônus ou penalidades especiais por seu tamanho.' },
    { name: 'Imunidade à Força', desc: 'Os yuuzhan vong não podem pegar a aptidão Sensitivo à Força, não podem fazer testes de Usar a Força, e nunca ganham Pontos da Força. Além disso, eles são imunes a qualquer efeito da Força que atinja sua Defesa de Vontade (incluindo poderes da Força e aspectos da perícia Usar a Força).' },
    { name: 'Tecnofobia', desc: 'Os yuuzhan vong recebem uma penalidade de -5 em jogadas de ataque e testes de perícia feitos quando estiverem usando armas ou ferramentas tecnológicas.' },
    { name: 'Familiaridade com Arma', desc: 'Os yuuzhan vong tratam o cajado amphi como uma arma simples ao invés de arma exótica.' },
  ],
};
