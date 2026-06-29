'use strict';

import { CLASS_JEDI_KNIGHT } from './jedi_knight.js';

// Reaproveita a árvore do Duelista do Cavaleiro Jedi (jedi_knight.js deve ser
// carregado antes). O Mestre Jedi também escolhe de quaisquer árvores da Força.
/** @type {import('../src/types/game.js').ClassData} */
export const CLASS_JEDI_MASTER = {
  key: 'jediMaster',
  name: 'Mestre Jedi',
  prestige: true,
  description: 'Os Mestres Jedi representam o pináculo da ordem Jedi: poderosos na Força e pacientes o bastante para transmitir suas habilidades e ensinar novas gerações. Destemido (imune ao medo) e dotado de Serenidade meditativa.',
  prereqs: {
    minLevel: 12,
    trainedSkills: ['useTheForce'],
    feats: ['Sensitivo à Força', 'Proficiência com Armas (Sabres-de-luz)'],
    notes: ['Qualquer Técnica da Força', 'Deve ser membro da tradição Jedi'],
  },
  hitDie: 10,
  startingHP: 10,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 3, ref: 3, will: 3 },
  baseAttack: [1,2,3,4,5],
  classSkills: ['acrobatics','initiative','know1','know2','know3','know4','mechanics','perception','pilot','jump','endurance','useTheForce'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'dauntless', 'serenity', 'talent'],
    2:  ['forceSecret'],
    3:  ['forceSecret', 'talent'],
    4:  ['forceSecret'],
    5:  ['forceSecret', 'talent'],
  },
  bonusFeatList: [],
  talentTrees: (typeof CLASS_JEDI_KNIGHT !== 'undefined')
    ? CLASS_JEDI_KNIGHT.talentTrees.filter(t => t.key === 'duelist')
    : [],
};
