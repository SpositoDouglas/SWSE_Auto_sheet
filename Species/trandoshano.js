'use strict';

export const SPECIES_TRANDOSHANO = {
  name: 'Trandoshano',
  abilityAdj: { str: 2, dex: -2 },
  speed: '6 sq',
  autoLangs: ['Básico', 'Dosh'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Trandoshanos não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Visão no Escuro', desc: 'Ignora camuflagem (incluindo camuflagem total) pela escuridão, embora não distinga cores no escuro.' },
    { name: 'Regeneração de Membros', desc: 'Regenera um membro perdido em 1d10 dias. Ao fim do período, todas as penalidades pela perda do membro são removidas.' },
    { name: 'Armadura Natural', desc: '+1 de bônus de armadura natural à Defesa de Reflexos (acumula com bônus de armadura de outra ordem).' },
    { name: 'Aptidão Extra', desc: 'Recebe a aptidão Vigoroso como bônus.' },
  ],
  autoFeats: ['Vigoroso'],
};
