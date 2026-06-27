'use strict';

const SPECIES_JAWA = {
  name: 'Jawa',
  abilityAdj: { dex: 2, str: -2 },
  speed: '4 sq',
  autoLangs: ['Jawês', 'Língua Comercial Jawa'],
  traits: [
    { name: 'Estatura Pequena', desc: 'Como criaturas Pequenas, Jawas recebem +1 de bônus de tamanho em sua Defesa de Reflexos e +5 de bônus de tamanho em testes de Furtividade. Entretanto, seus limites de carga e levantamento são três quartos dos de personagens Médios.' },
    { name: 'Visão no Escuro', desc: 'Jawas ignoram camuflagem (inclusive camuflagem total) proveniente da escuridão. Entretanto, não conseguem perceber cores em escuridão total.' },
    { name: 'Habitante do Deserto', desc: 'Ao realizar testes de Sobrevivência para resistir aos efeitos do Calor Extremo, Jawas podem refazer o teste e manter o melhor dos dois resultados.' },
    { name: 'Catador', desc: 'Sempre que um Jawa armado com uma arma Iônica causar dano com sucesso a um Droide ou Veículo, o Jawa adiciona metade de seu Nível de Personagem em dano Iônico extra.' },
    { name: 'Engenhoqueiro', desc: 'Um Jawa pode refazer qualquer teste de Mecânica, mas deve manter o segundo resultado, mesmo que seja pior. Além disso, Mecânica é sempre uma perícia de classe para Jawas.' },
  ],
};
