'use strict';

import { classTrees } from './_shared.js';
import { CLASS_SCOUNDREL } from './scoundrel.js';
import { CLASS_SCOUT } from './scout.js';

/** @type {import('../src/types/game.js').ClassData} */
export const CLASS_BOUNTY_HUNTER = {
  key: 'bountyHunter',
  name: 'Caçador de Recompensas',
  prestige: true,
  description: 'O caçador de recompensas lucra nas vinganças dos outros, rastreando fugitivos para seus inimigos, mestres ou simplesmente para a justiça. Confia no elemento surpresa e em seus instintos de caçador para capturar sua presa.',
  prereqs: {
    minLevel: 7,
    trainedSkills: ['survival'],
    notes: ['Ao menos dois talentos da árvore de talentos da Consciência'],
  },
  hitDie: 10,
  startingHP: 10,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 2, ref: 4, will: 0 },
  baseAttack: [0,1,2,3,4,5,6,8,9,10],
  classSkills: ['initiative','knowBureaucracy','knowGalactic','knowLifeSci','knowPhysSci','knowSocialSci','knowTactics','knowTech','gatherInfo','mechanics','perception','persuasion','pilot','stealth','survival'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'talent'],
    2:  ['familiarFoe'],
    3:  ['talent'],
    4:  ['familiarFoe'],
    5:  ['talent'],
    6:  ['familiarFoe'],
    7:  ['talent'],
    8:  ['familiarFoe'],
    9:  ['talent'],
    10: ['familiarFoe'],
  },
  bonusFeatList: [],
  talentTrees: [
    {
      key: 'bountyHunter',
      name: 'Árvore de Talentos do Caçador de Recompensas',
      description: 'A natureza do seu trabalho exige que caçadores de recompensas se associem com a escória do universo. Você está entre os melhores caçadores de recompensas da galáxia.',
      talents: [
        { id: 'huntersMark', name: 'Marca do Caçador', description: 'Se você mirar antes de fazer um ataque à distância, você faz seu alvo cair 1 passo no marcador de condição se o ataque causar dano.', prerequisites: [] },
        { id: 'huntersTarget', name: 'Alvo do Caçador', description: 'Uma vez por encontro, como uma ação livre, você pode escolher um oponente. Pelo resto do encontro, quando você for bem sucedido em um ataque corpo-a-corpo ou à distância contra esse oponente, você recebe um bônus na jogada de dano igual ao seu nível de classe.', prerequisites: ['huntersMark'] },
        { id: 'relentless', name: 'Implacável', description: 'Este talento é aplicado apenas para um oponente que você tenha escolhido como Alvo do Caçador. Qualquer ataque ou efeito originário deste alvo que normalmente faria você cair em seu marcador de condição, na verdade afeta seu marcador de condição.', prerequisites: ['huntersMark', 'huntersTarget'] },
        { id: 'notorious', name: 'Notório', description: 'Suas habilidades como caçador de recompensas são conhecidas através da galáxia, mesmo em mundos fronteiriços. Quando você não estiver disfarçado, você pode jogar novamente qualquer teste de Persuasão feito para intimidar os outros, utilizando o melhor resultado.', prerequisites: [] },
        { id: 'ruthlessNegotiator', name: 'Negociador Impiedoso', description: 'Quando você barganhar sobre o preço de uma caçada (perícia Persuasão), você pode jogar novamente seu teste de Persuasão e manter o melhor resultado.', prerequisites: ['notorious'] },
        { id: 'noPlaceToHide', name: 'Sem Lugar para se Esconder', description: 'Você pode escolher jogar novamente qualquer teste de Obter Informação feito para localizar um indivíduo específico, mas você deve manter o resultado da nova jogada mesmo se ele for pior.', prerequisites: [] },
      ],
    },
    // Também pode escolher talentos das árvores da Má Sorte (Malandro) e da Consciência (Batedor)
    ...classTrees(CLASS_SCOUNDREL, 'misfortune'),
    ...classTrees(CLASS_SCOUT, 'awareness'),
  ],
};
