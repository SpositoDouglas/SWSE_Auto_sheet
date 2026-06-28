'use strict';

const SPECIES_HUTT = {
  name: 'Hutt',
  abilityAdj: { str: 2, con: 2, int: 2, dex: -6 },
  speed: '2 sq',
  autoLangs: ['Básico', 'Huttês'],
  traits: [
    { name: 'Estatura Grande', desc: 'Como criaturas Grandes, os hutts recebem -1 de penalidade na sua Defesa de Reflexos, -5 de penalidade de tamanho nos seus testes de Furtividade e um bônus de tamanho de +5 no seu Limite de Dano. Os limites para levantar e carregar são o dobro dos de personagens Médios.' },
    { name: 'Resistência à Força', desc: 'Bônus de espécie de +5 na Defesa de Vontade contra qualquer teste de Usar a Força.' },
    { name: 'Estabilidade Suprema', desc: 'Não se pode fazer um hutt tropeçar nem derrubá-lo.' },
    { name: 'Perícias', desc: 'Um hutt pode jogar novamente um teste de Persuasão, mantendo o melhor resultado.' },
  ],
};
