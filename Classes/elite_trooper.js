'use strict';

import { classTrees } from './_shared.js';
import { CLASS_SCOUT } from './scout.js';
import { CLASS_SOLDIER } from './soldier.js';

/** @type {import('../src/types/game.js').ClassData} */
export const CLASS_ELITE_TROOPER = {
  key: 'eliteTrooper',
  name: 'Soldado de Elite',
  prestige: true,
  description: 'O soldado de elite representa um indivíduo que recebeu treinamentos avançados de combate. Altamente treinado e versátil, é capaz de inúmeras missões relacionadas a combate, das mais furtivas às mais brutais.',
  prereqs: {
    bab: 7,
    feats: [
      'Artes Marciais I',
      'Proficiência com Armaduras (leves)',
      'Proficiência com Armaduras (médias)',
      'Tiro à Queima Roupa',
    ],
    notes: ['Ao menos um talento das árvores de Especialista em Armaduras, Comando ou Especialista em Armas'],
  },
  hitDie: 12,
  startingHP: 12,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 4, ref: 2, will: 0 },
  baseAttack: [1,2,3,4,5,6,7,8,9,10],
  classSkills: ['climb','endurance','initiative','jump','knowledge','mechanics','perception','pilot','swim','treatInjury'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'delayDamage', 'talent'],
    2:  ['damageReduction'],
    3:  ['talent'],
    4:  ['damageReduction'],
    5:  ['talent'],
    6:  ['damageReduction'],
    7:  ['talent'],
    8:  ['damageReduction'],
    9:  ['talent'],
    10: ['damageReduction'],
  },
  bonusFeatList: [],
  talentTrees: [
    {
      key: 'weaponMaster',
      name: 'Árvore de Talentos do Mestre em Armas',
      description: 'Você é perito em empunhar uma variedade de armas e pode brandir armas específicas com poder e precisão mortais.',
      talents: [
        { id: 'weaponFocusGreater', name: 'Foco em Arma Maior', description: 'Escolha uma única arma exótica ou um grupo de armas com o qual tenha proficiência. Você recebe +1 nas jogadas de ataque com a arma exótica escolhida ou uma arma do grupo escolhido. Acumula com a aptidão Foco em Arma. Selecionável várias vezes (grupos diferentes).', prerequisites: [], requiresFeat: 'Foco em Arma (com a arma/grupo escolhido)', multiSelect: true },
        { id: 'devastatingAttackGreater', name: 'Ataque Devastador Maior', description: 'Sempre que fizer um ataque bem sucedido com a arma exótica ou grupo escolhido, você trata o limite de dano do alvo como 10 pontos a menos ao determinar o resultado. Substitui os efeitos de Ataque Devastador.', prerequisites: ['weaponFocusGreater'], requiresTalent: 'Ataque Devastador', requiresFeat: 'Foco em Arma (arma/grupo escolhido)' },
        { id: 'penetratingAttackGreater', name: 'Ataque Penetrante Maior', description: 'Sempre que fizer um ataque bem sucedido com a arma exótica ou grupo escolhido, você trata a redução de dano do alvo como 10 pontos a menos ao determinar o resultado. Substitui os efeitos de Ataque Penetrante.', prerequisites: ['weaponFocusGreater'], requiresTalent: 'Ataque Penetrante', requiresFeat: 'Foco em Arma (arma/grupo escolhido)' },
        { id: 'weaponSpecGreater', name: 'Especialização em Arma Maior', description: 'Escolha uma arma exótica ou um grupo de armas. Você recebe +2 nas jogadas de dano com a arma escolhida. Acumula com Especialização em Arma. Exige proficiência. Selecionável várias vezes (grupos diferentes).', prerequisites: ['weaponFocusGreater'], requiresFeat: 'Foco em Arma (arma/grupo escolhido)', multiSelect: true },
        { id: 'exoticWeaponMastery', name: 'Maestria em Armas Exóticas', description: 'Você é considerado proficiente com qualquer arma exótica, mesmo sem possuir a aptidão Proficiência com Arma Exótica apropriada.', prerequisites: [] },
        { id: 'multiattackHeavy', name: 'Proficiência em Ataques Múltiplos (armas pesadas)', description: 'Quando fizer múltiplos ataques com armas pesadas como uma ação de ataque total, você reduz a penalidade em 2. Selecionável várias vezes (redução adicional de 2 cada).', prerequisites: [], multiSelect: true },
        { id: 'multiattackRifles', name: 'Proficiência em Ataques Múltiplos (rifles)', description: 'Quando fizer múltiplos ataques com rifles como uma ação de ataque total, você reduz a penalidade em 2. Selecionável várias vezes (redução adicional de 2 cada).', prerequisites: [], multiSelect: true },
        { id: 'controlledBurst', name: 'Rajada Controlada', description: 'A penalidade ao atacar em modo de disparo automático ou empregando a aptidão Rajada de Tiros é reduzida em 2. Se a arma só funciona em disparo automático, você não sofre penalidade na jogada de ataque.', prerequisites: [] },
      ],
    },
    // Também pode escolher talentos das árvores do Comando (Soldado) e da Camuflagem (Batedor)
    ...classTrees(CLASS_SOLDIER, 'commando'),
    ...classTrees(CLASS_SCOUT, 'camouflage'),
  ],
};
