'use strict';

// Reaproveita a árvore do Sith do Aprendiz Sith (sith_apprentice.js deve ser
// carregado antes). O Lorde Sith também escolhe de quaisquer árvores da Força.
const CLASS_SITH_LORD = {
  key: 'sithLord',
  name: 'Lorde Sith',
  prestige: true,
  description: 'O Lorde Sith é o pináculo da tradição Sith. Suas mais sagradas tarefas incluem a preservação dos ensinamentos e a eventual ascensão dos Sith ao domínio da galáxia. Destemido (imune ao medo) e capaz de Tentação (Dun Möch) para corromper os outros.',
  prereqs: {
    minLevel: 12,
    trainedSkills: ['useTheForce'],
    feats: ['Sensitivo à Força', 'Proficiência com Armas (Sabres-de-luz)'],
    notes: ['Qualquer Técnica da Força', 'Valor do Lado Negro igual ao valor de Sabedoria', 'Deve ser membro da tradição Sith'],
  },
  hitDie: 10,
  startingHP: 10,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 3, ref: 3, will: 3 },
  baseAttack: [1,2,3,4,5],
  classSkills: ['deception','initiative','know1','know2','know3','know4','perception','persuasion','useTheForce'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'dauntless', 'temptation', 'talent'],
    2:  ['forceSecret'],
    3:  ['forceSecret', 'talent'],
    4:  ['forceSecret'],
    5:  ['forceSecret', 'talent'],
  },
  bonusFeatList: [],
  // Apenas a árvore Sith (o Aprendiz inclui outras árvores que NÃO se aplicam ao
  // Lorde Sith). Também pode escolher de quaisquer árvores da Força (Capítulo 6).
  talentTrees: classTrees(CLASS_SITH_APPRENTICE, 'sith'),
};
