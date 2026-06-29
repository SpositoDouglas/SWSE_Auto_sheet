'use strict';

import { classTrees } from './_shared.js';
import { CLASS_NOBLE } from './noble.js';

export const CLASS_CRIME_LORD = {
  key: 'crimeLord',
  name: 'Senhor do Crime',
  prestige: true,
  description: 'No submundo, alguns sempre ascendem ao topo, seja por visão, organização ou pura intimidação. Após conquistar um império às escondidas, o senhor do crime trava uma batalha diária para se manter no topo — e vivo.',
  prereqs: {
    minLevel: 7,
    trainedSkills: ['deception', 'persuasion'],
    notes: ['Ao menos um talento das árvores de talentos da Sorte, Linhagem ou Má Sorte'],
  },
  hitDie: 8,
  startingHP: 8,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 0, ref: 2, will: 4 },
  baseAttack: [0,1,2,3,3,4,5,6,6,7],
  classSkills: ['deception','gatherInfo','initiative','know1','know2','know3','know4','perception','persuasion','pilot'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'talent'],
    2:  ['commandCover'],
    3:  ['talent'],
    4:  [],
    5:  ['talent'],
    6:  [],
    7:  ['talent'],
    8:  [],
    9:  ['talent'],
    10: [],
  },
  bonusFeatList: [],
  talentTrees: [
    {
      key: 'infamous',
      name: 'Árvore de Talentos do Infame',
      description: 'Você é procurado em vários sistemas por atos criminosos e a sua maneira de realizar negócios conferiu-lhe uma repugnante reputação no submundo do crime.',
      talents: [
        { id: 'inspireFear1', name: 'Inspirar Medo I', description: 'Sua infâmia e má reputação é tal que qualquer oponente de nível menor ou igual ao seu nível de personagem sofre -1 nas jogadas de ataque e testes de perícia realizados contra você, inclusive testes de Usar a Força para ativar poderes que tenham você como alvo. Isso é um efeito mental de medo.', prerequisites: [] },
        { id: 'inspireFear2', name: 'Inspirar Medo II', description: 'Como Inspirar Medo I, exceto que a penalidade aumenta para -2.', prerequisites: ['inspireFear1'] },
        { id: 'inspireFear3', name: 'Inspirar Medo III', description: 'Como Inspirar Medo I, exceto que a penalidade aumenta para -5.', prerequisites: ['inspireFear1', 'inspireFear2'] },
        { id: 'notoriousCL', name: 'Notório', description: 'Sua reputação como senhor do crime é conhecida através da galáxia, mesmo em mundos fronteiriços. Quando não estiver disfarçado, você pode jogar novamente qualquer teste de Persuasão feito para intimidar os outros, utilizando o melhor resultado.', prerequisites: [] },
        { id: 'sharedNotoriety', name: 'Notoriedade Compartilhada', description: 'Quando seus seguidores invocam seu nome, os outros prestam atenção. Se você possuir seguidores (veja Atrair Seguidor), eles podem jogar novamente qualquer teste de Persuasão feito para intimidar outros.', prerequisites: ['notoriousCL'] },
      ],
    },
    {
      key: 'overlord',
      name: 'Árvore de Talentos do Mandante',
      description: 'Você possui a habilidade para atrair seguidores leais e é hábil em redirecionar aliados no campo de batalha.',
      talents: [
        { id: 'attractMinion', name: 'Atrair Seguidor', description: 'Você atrai um seguidor leal. O seguidor é um personagem não heróico com nível de classe igual a três quartos do seu nível de personagem, arredondado para baixo. Selecionável várias vezes (um seguidor a cada vez); normalmente apenas um o acompanha por vez. Cada seguidor que o acompanha numa aventura compartilha do total de XP recebido.', prerequisites: [], multiSelect: true },
        { id: 'impelAlly1', name: 'Impelir Aliado I', description: 'Você pode gastar uma ação rápida para conceder a um aliado a habilidade de mover-se no deslocamento normal dele. O aliado precisa realizar o movimento imediatamente em seu turno e antes de fazer qualquer coisa. Você pode usar este talento até três vezes em seu turno (uma ação rápida cada).', prerequisites: [] },
        { id: 'impelAlly2', name: 'Impelir Aliado II', description: 'Você pode gastar duas ações rápidas para conceder a um aliado a habilidade de realizar uma ação padrão ou de movimento. O aliado precisa realizar essa ação imediatamente em seu turno e antes de fazer qualquer coisa.', prerequisites: ['impelAlly1'] },
      ],
    },
    // Também pode escolher talentos da árvore da Influência (Nobre)
    ...classTrees(CLASS_NOBLE, 'influence'),
  ],
};
