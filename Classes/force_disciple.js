'use strict';

import { CLASS_FORCE_ADEPT } from './force_adept.js';

// Reaproveita as árvores de talentos do Adepto da Força (force_adept.js deve
// ser carregado antes deste arquivo no index.html). O Discípulo também pode
// escolher de quaisquer árvores de talentos da Força (Capítulo 6).
export const CLASS_FORCE_DISCIPLE = {
  key: 'forceDisciple',
  name: 'Discípulo da Força',
  prestige: true,
  description: 'Através da meditação e contemplação dos profundos mistérios da Força, alguns indivíduos transcendem o dogma e alcançam um novo entendimento de sua conexão com o universo. Indomável (imune a efeitos mentais) e Profeta, recebe dois Pontos de Destino por nível, podendo sacrificá-los por visões proféticas.',
  prereqs: {
    minLevel: 12,
    trainedSkills: ['useTheForce'],
    feats: ['Sensitivo à Força'],
    notes: [
      'Quaisquer dois talentos das árvores Devoto do Lado Negro, Adepto da Força ou Item da Força',
      'Poder da Força: Visão Distante',
      'Qualquer Técnica da Força',
    ],
  },
  hitDie: 8,
  startingHP: 8,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 3, ref: 3, will: 6 },
  baseAttack: [0,1,2,3,3],
  classSkills: ['initiative','know1','know2','know3','know4','perception','persuasion','useTheForce'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'indomitable', 'prophet', 'talent'],
    2:  ['forceSecret'],
    3:  ['forceSecret', 'talent'],
    4:  ['forceSecret'],
    5:  ['forceSecret', 'talent'],
  },
  bonusFeatList: [],
  talentTrees: (typeof CLASS_FORCE_ADEPT !== 'undefined') ? CLASS_FORCE_ADEPT.talentTrees : [],
};
