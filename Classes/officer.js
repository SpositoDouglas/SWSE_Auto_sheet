'use strict';

import { classTrees } from './_shared.js';
import { CLASS_NOBLE } from './noble.js';
import { CLASS_SOLDIER } from './soldier.js';

/** @type {import('../src/types/game.js').ClassData} */
export const CLASS_OFFICER = {
  key: 'officer',
  name: 'Oficial',
  prestige: true,
  description: 'Mesmo as tropas mais bem treinadas precisam de alguém para tomar decisões e dar direções. O oficial cumpre esse papel — pronto para tomar decisões duras quando seus homens precisam de comando, liderando tropas em batalha e usando o campo a seu favor.',
  prereqs: {
    minLevel: 7,
    notes: [
      'Treinado em Conhecimentos (táticas)',
      'Ao menos um talento das árvores de Liderança ou Comando',
      'Deve fazer parte de uma organização com divisão militar ou paramilitar',
    ],
  },
  hitDie: 10,
  startingHP: 10,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 0, ref: 2, will: 4 },
  baseAttack: [1,2,3,4,5,6,7,8,9,10],
  classSkills: ['gatherInfo','initiative','knowBureaucracy','knowGalactic','knowLifeSci','knowPhysSci','knowSocialSci','knowTactics','knowTech','perception','persuasion','pilot','useComputer'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'talent'],
    2:  ['commandCover', 'shareTalent'],
    3:  ['talent'],
    4:  ['shareTalent'],
    5:  ['talent'],
    6:  ['shareTalent'],
    7:  ['talent'],
    8:  ['shareTalent'],
    9:  ['talent'],
    10: ['shareTalent'],
  },
  bonusFeatList: [],
  talentTrees: [
    {
      key: 'militaryTactics',
      name: 'Árvore de Talentos das Táticas Militares',
      description: 'Os oficiais estudam antigas batalhas procurando exemplos de boas táticas militares. Você é perito em liderar tropas em batalha e utilizar o campo de batalha em sua vantagem.',
      talents: [
        { id: 'assaultTactics', name: 'Táticas de Assalto', description: 'Como ação de movimento, escolha uma criatura ou objeto como alvo do assalto. Se você for bem sucedido em um teste de Conhecimentos (táticas) contra CD 15, você e todos os aliados capazes de ouvir e compreender você causam +1d6 de dano ao alvo em cada ataque bem sucedido, até o começo do seu próximo turno. Efeito de afetar a mente.', prerequisites: [] },
        { id: 'strategicPlacement', name: 'Táticas de Posicionamento Estratégico', description: 'Como ação de movimento, faça um teste de Conhecimentos (táticas) contra CD 15. Se bem sucedido, você e os aliados que possam ver, ouvir e compreender você recebem +1 de competência nas jogadas de ataque contra oponentes flanqueados OU +1 de deflexão na Defesa de Reflexos contra ataques de oportunidade (você escolhe), até o início do seu próximo turno. Com Líder Nato ou Análise da Batalha, o bônus aumenta para +2.', prerequisites: [] },
        { id: 'fieldTactics', name: 'Táticas de Campo', description: 'Como ação de movimento, faça um teste de Conhecimentos (táticas) contra CD 15. Se bem sucedido, você e todos os aliados a até 10 quadrados podem usar qualquer cobertura possível para receber +10 de cobertura na Defesa de Reflexos (ao invés de +5), até o começo do seu próximo turno. Efeito de afetar a mente.', prerequisites: ['strategicPlacement'] },
        { id: 'oneForAll', name: 'Um por Todos', description: 'Como reação, você pode escolher sofrer metade ou todo o dano de um único ataque a um aliado adjacente. Similarmente, um aliado adjacente pode escolher sofrer o dano de um ataque a você (mesmo sem possuir este talento).', prerequisites: ['strategicPlacement'] },
        { id: 'counterManeuver', name: 'Contra-Manobra', description: 'Como ação padrão, faça um teste de Conhecimentos (táticas) contra CD 15. Se bem sucedido, os inimigos em sua linha de visão perdem todos os bônus de competência, comando e moral nas jogadas de ataque e qualquer bônus de esquiva na Defesa de Reflexos até o início do seu próximo turno. Oficiais inimigos podem resistir com Conhecimentos (táticas).', prerequisites: ['strategicPlacement', 'fieldTactics'] },
        { id: 'shiftDefense1', name: 'Trocar Defesa I', description: 'Como ação rápida, sofra -2 em uma Defesa (Reflexos, Fortitude ou Vontade) para receber +1 de competência em outra Defesa até o começo do seu próximo turno.', prerequisites: [] },
        { id: 'shiftDefense2', name: 'Trocar Defesa II', description: 'Como ação rápida, sofra -5 em uma Defesa para receber +2 de competência em outra Defesa até o começo do seu próximo turno.', prerequisites: ['shiftDefense1'] },
        { id: 'shiftDefense3', name: 'Trocar Defesa III', description: 'Como ação rápida, receba +5 de competência em uma de suas Defesas se escolher sofrer -5 em outras duas Defesas.', prerequisites: ['shiftDefense1', 'shiftDefense2'] },
        { id: 'tacticalEdge', name: 'Margem Tática', description: 'Você pode usar os talentos Táticas de Assalto, Táticas de Posicionamento Estratégico ou Táticas de Campo como uma ação rápida ao invés de uma ação de movimento, desde que possua o talento em questão.', prerequisites: [] },
      ],
    },
    // Também pode escolher talentos das árvores da Liderança (Nobre) e do Comando (Soldado)
    ...classTrees(CLASS_NOBLE, 'leadership'),
    ...classTrees(CLASS_SOLDIER, 'commando'),
  ],
};
