'use strict';

export const SPECIES_SULLUSTANO = {
  name: 'Sullustano',
  abilityAdj: { dex: 2, con: -2 },
  speed: '6 sq',
  autoLangs: ['Básico', 'Sullustês'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Sullustanos não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Visão no Escuro', desc: 'Ignora camuflagem (incluindo camuflagem total) pela escuridão, embora não distinga cores no escuro.' },
    { name: 'Especialista em Escalada', desc: 'Pode escolher 10 em testes de Escalar mesmo distraído ou sob ameaça.' },
    { name: 'Percepção Elevada', desc: 'Pode jogar novamente qualquer teste de Percepção (segundo resultado é definitivo).' },
  ]
};
