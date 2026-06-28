'use strict';

const CLASS_ACE_PILOT = {
  key: 'acePilot',
  name: 'Ás da Pilotagem',
  prestige: true,
  description: 'O ás da pilotagem está para o combate entre veículos da mesma forma que o soldado de elite está para o combate armado pessoal. Um veterano de incontáveis embates, define-se pelo veículo que pilota e testa suas habilidades repetidamente no cockpit, em desafios de vida ou morte.',
  prereqs: {
    minLevel: 7,
    trainedSkills: ['pilot'],
    feats: ['Combate Veicular'],
  },
  hitDie: 8,
  startingHP: 8,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 2, ref: 4, will: 0 },
  baseAttack: [0,1,2,3,3,4,5,6,6,7],
  classSkills: ['initiative','know1','know2','know3','know4','mechanics','perception','pilot','useComputer'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'talent'],
    2:  ['vehicularDodge'],
    3:  ['talent'],
    4:  ['vehicularDodge'],
    5:  ['talent'],
    6:  ['vehicularDodge'],
    7:  ['talent'],
    8:  ['vehicularDodge'],
    9:  ['talent'],
    10: ['vehicularDodge'],
  },
  bonusFeatList: [],
  talentTrees: [
    {
      key: 'pilotSpecialist',
      name: 'Árvore de Talentos do Especialista em Pilotagem',
      description: 'O ás da pilotagem confia em seus instintos apurados e anos de treinamento em pilotar para contramanobrar e destruir naves inimigas.',
      talents: [
        { id: 'fullThrottle', name: 'Aceleração Total', description: 'Você pode escolher 10 em testes de Pilotar feitos para aumentar o deslocamento de seu veículo. Além disso, quando você usar uma ação de movimento total enquanto pilota um veículo, seu veículo se moverá até cinco vezes seu deslocamento normal (ao invés do normal x4).', prerequisites: [] },
        { id: 'elusiveDogfighter', name: 'Duelista Elusivo', description: 'Quando engajado em um duelo de proximidade (dogfight), qualquer piloto inimigo próximo que esteja engajado nesse combate sofre -10 de penalidade nas jogadas de ataque quando você for bem sucedido no teste resistido de Pilotar.', prerequisites: [] },
        { id: 'vehicularEvasion', name: 'Evasão Veicular', description: 'Se o veículo que você estiver pilotando for acertado por um ataque de área, ele receberá metade do dano se o ataque acertar. Se o ataque de área errar seu veículo, ele não sofrerá dano. Você não pode se beneficiar deste talento quando seu veículo estiver estacionário ou desabilitado.', prerequisites: [] },
        { id: 'feint', name: 'Finta', description: 'Quando você lutar defensivamente como piloto de um veículo, você pode neutralizar um tiro que atingiria seu veículo usando a aptidão Combate Veicular uma vez a mais por rodada.', prerequisites: ['vehicularEvasion'] },
        { id: 'keepItTogether', name: 'Manter União', description: 'Uma vez por encontro, quando um veículo que esteja pilotando receber um dano que iguale ou exceda o limite de dano dele, seu veículo evita cair em seu marcador de condição.', prerequisites: [] },
        { id: 'tenaciousPursuit', name: 'Perseguição Persistente', description: 'Você pode jogar duas vezes qualquer teste resistido de Pilotar feito para iniciar um duelo de proximidade (dogfight), utilizando o melhor resultado.', prerequisites: [] },
      ],
    },
    {
      key: 'gunner',
      name: 'Árvore de Talentos do Artilheiro',
      description: 'Muitos artilheiros de naves estelares são peritos dentro e fora da cabine do piloto, sendo mortais com armas à distância de qualquer tipo.',
      talents: [
        { id: 'expertGunner', name: 'Artilheiro Especialista', description: 'Você recebe um bônus de +1 nas jogadas de ataque feitas usando armas de veículo.', prerequisites: [] },
        { id: 'dogfightGunner', name: 'Artilheiro de Duelo de Proximidade', description: 'Quando seu veículo estiver engajado em uma perseguição, você não sofre penalidade em suas jogadas de ataque com as armas do veículo mesmo se você não for o piloto.', prerequisites: ['expertGunner'] },
        { id: 'quickTrigger', name: 'Gatilho Rápido', description: 'Toda vez que um veículo inimigo se mover para fora do seu quadrado ou um quadrado adjacente, você pode realizar um único ataque contra esse veículo como um ataque de oportunidade.', prerequisites: ['expertGunner'] },
        { id: 'targetSystems', name: 'Acertar Sistemas', description: 'Toda vez que você causar um dano que iguale ou exceda o limite de dano do veículo, você faz esse veículo cair 1 passo em seu marcador de condição.', prerequisites: ['expertGunner'] },
      ],
    },
  ],
};
