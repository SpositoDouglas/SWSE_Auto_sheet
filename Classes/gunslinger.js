'use strict';

const CLASS_GUNSLINGER = {
  key: 'gunslinger',
  name: 'Pistoleiro',
  prestige: true,
  description: 'Profissionais liberais empunhadores de blasters que atiram primeiro e perguntam depois. Sacam e atiram rapidamente, mirando com mais precisão que qualquer outro tipo de guerreiro, e usam sua fama focada em combate como arma contra os oponentes.',
  prereqs: {
    minLevel: 7,
    feats: [
      'Tiro à Queima Roupa',
      'Tiro Preciso',
      'Saque Rápido',
      'Proficiência com Armas (Pistolas)',
    ],
  },
  hitDie: 8,
  startingHP: 8,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 0, ref: 4, will: 2 },
  baseAttack: [1,2,3,4,5,6,7,8,9,10],
  classSkills: ['acrobatics','deception','initiative','knowledge','perception','persuasion','pilot','stealth'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'talent'],
    2:  ['reliablePistol'],
    3:  ['talent'],
    4:  ['reliablePistol'],
    5:  ['talent'],
    6:  ['reliablePistol'],
    7:  ['talent'],
    8:  ['reliablePistol'],
    9:  ['talent'],
    10: ['reliablePistol'],
  },
  bonusFeatList: [],
  talentTrees: [
    {
      key: 'gunslinger',
      name: 'Árvore de Talentos do Pistoleiro',
      description: 'Você nunca viaja para qualquer lugar sem um blaster (ou dois) e sabe como se portar em um tiroteio. Os seguintes talentos podem ser usados apenas com pistolas e rifles.',
      talents: [
        { id: 'debilitatingShot', name: 'Tiro Debilitante', description: 'Se você mirar antes de fazer um ataque à distância e acertar, o alvo cai 1 passo em seu marcador de condição se o ataque causar dano.', prerequisites: [] },
        { id: 'sneakyShot', name: 'Tiro Dissimulado', description: 'Escolha um alvo em sua linha de visão a até 6 quadrados. Gaste duas ações rápidas no mesmo turno para fazer um teste de Dissimulação; se igualar ou exceder a Defesa de Vontade do alvo, ele não ganha o bônus de Destreza na Defesa de Reflexos contra seus ataques até o começo do próximo turno.', prerequisites: [] },
        { id: 'improvedQuickDraw', name: 'Saque Rápido Aprimorado', description: 'Se estiver carregando uma pistola (na mão ou em coldre), você pode sacá-la e fazer um único ataque durante uma rodada surpreendida mesmo se tiver sido surpreendido. Se não estiver surpreendido, pode fazer qualquer ação única da sua escolha normalmente.', prerequisites: [] },
        { id: 'trippingShot', name: 'Tiro de Derrubada', description: 'Se você mirar antes de um ataque à distância e acertar, você deixa o alvo caído prostrado em adição ao dano. Não pode derrubar alvos duas ou mais categorias de tamanho maiores que você.', prerequisites: [] },
        { id: 'multiattackPistols', name: 'Proficiência em Ataques Múltiplos (pistolas)', description: 'Quando fizer múltiplos ataques com qualquer tipo de pistola como uma ação de ataque total, você reduz a penalidade em 2. Selecionável várias vezes (redução adicional de 2 cada).', prerequisites: [], multiSelect: true },
        { id: 'rangedDisarm', name: 'Desarmar à Distância', description: 'Você pode desarmar um oponente usando um ataque à distância. Se o ataque de desarmar à distância falhar, seu oponente não recebe a chance de fazer um ataque livre contra você.', prerequisites: [] },
        { id: 'trigger', name: 'Eficaz no Gatilho', description: 'Você não sofre penalidade na sua jogada de ataque quando estiver usando a aptidão Tiro Rápido.', prerequisites: [] },
      ],
    },
    // Também pode escolher talentos das árvores da Sorte (Malandro) e da Consciência (Batedor)
    ...classTrees(CLASS_SCOUNDREL, 'fortune'),
    ...classTrees(CLASS_SCOUT, 'awareness'),
  ],
};
