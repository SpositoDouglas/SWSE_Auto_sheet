'use strict';

export const SPECIES_GUNGAN = {
  name: 'Gungan',
  abilityAdj: { dex: 2, int: -2, cha: -2 },
  speed: '6 sq (nado: 4 sq)',
  autoLangs: ['Básico', 'Gunganês'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Gungans não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Especialista em Nado', desc: 'Pode refazer qualquer teste de Nadar (segundo resultado é definitivo). Pode também escolher 10 em Nadar mesmo distraído ou sob ameaça.' },
    { name: 'Prender Respiração', desc: 'Pode prender a respiração por rodadas iguais a 25× seu valor de Constituição antes de precisar fazer testes de Tolerância.' },
    { name: 'Reflexos Rápidos', desc: '+2 de bônus de espécie à Defesa de Reflexos.' },
    { name: 'Visão na Penumbra', desc: 'Ignora camuflagem (mas não camuflagem total) pela escuridão.' },
    { name: 'Familiaridade com Armas', desc: 'Com Proficiência com Armas (armas simples), também é proficiente com o Atlatl e a Cesta.' },
  ]
};
