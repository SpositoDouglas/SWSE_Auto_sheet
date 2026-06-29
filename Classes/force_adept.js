'use strict';

export const CLASS_FORCE_ADEPT = {
  key: 'forceAdept',
  name: 'Adepto da Força',
  prestige: true,
  description: 'O adepto da Força é poderoso na Força, mas segue um caminho diferente do dos Jedi — vindo de uma tradição com crenças e códigos próprios. Para o adepto, a Força é mais misteriosa e sobrenatural.',
  prereqs: {
    minLevel: 7,
    trainedSkills: ['useTheForce'],
    feats: ['Sensitivo à Força'],
  },
  hitDie: 8,
  startingHP: 8,
  trainedSkillsBase: 0,
  defenseBonus: { fort: 2, ref: 2, will: 4 },
  baseAttack: [0,1,2,3,3,4,5,6,6,7],
  classSkills: ['deception','initiative','know1','know2','know3','know4','perception','persuasion','survival','treatInjury','useTheForce'],
  startingFeats: [],
  levelFeatures: {
    1:  ['defenseBonus', 'talent'],
    2:  ['forceTechnique'],
    3:  ['talent'],
    4:  ['forceTechnique'],
    5:  ['talent'],
    6:  ['forceTechnique'],
    7:  ['talent'],
    8:  ['forceTechnique'],
    9:  ['talent'],
    10: ['forceTechnique'],
  },
  bonusFeatList: [],
  talentTrees: [
    {
      key: 'darkSideDevotee',
      name: 'Árvore de Talentos do Devoto do Lado Negro',
      description: 'Suas emoções negativas mais intensas permitem que o lado negro flua através de você, conferindo-lhe grande poder.',
      talents: [
        { id: 'channelAggression', name: 'Canalizar Agressão', description: 'Se você for bem sucedido em um ataque contra um oponente flanqueado ou alvo que tenha perdido o bônus de Destreza na Defesa de Reflexos, você pode gastar um ponto da Força como ação livre para causar dano adicional igual a 1d6 por nível de classe (máximo de 10d6).', prerequisites: [] },
        { id: 'incapacitatingAttack', name: 'Ataque Incapacitante', description: 'Toda vez que obtiver um acerto crítico, você pode gastar um ponto da Força para também reduzir o deslocamento do alvo pela metade até que ele se recupere totalmente (PV ao máximo).', prerequisites: ['channelAggression'] },
        { id: 'channelAnger', name: 'Canalizar Ira', description: 'Como ação rápida, gaste um ponto da Força para receber +2 de fúria nas jogadas de ataque e dano corpo-a-corpo por 5 + seu modificador de Constituição rodadas. Ao término, você cai 1 passo no marcador de condição. Em fúria, não pode usar perícias que exijam paciência/concentração (Mecânica, Furtividade, Usar a Força).', prerequisites: ['channelAggression'] },
        { id: 'embraceDarkSide', name: 'Abraçar o Lado Negro', description: 'Toda vez que usar um poder da Força [lado negro], você pode jogar novamente o teste de Usar a Força, mas deve usar o novo resultado, mesmo pior. Ao escolher este talento, você não mais poderá usar poderes [Lado da Luz].', prerequisites: ['channelAggression', 'channelAnger'] },
      ],
    },
    {
      key: 'forceAdept',
      name: 'Árvore de Talentos do Adepto da Força',
      description: 'Adeptos da Força utilizam-se da Força para sobreviver em mundos periféricos, e frequentemente possuem poderes da Força singulares que utilizam particularmente bem.',
      talents: [
        { id: 'forcePowerAdept', name: 'Adepto do Poder da Força', description: 'Selecione um poder da Força que você conheça. Ao usá-lo, você tem a opção de gastar um ponto da Força para realizar dois testes de Usar a Força, usando o melhor resultado. Selecionável várias vezes (poder diferente; efeitos não acumulam).', prerequisites: [], multiSelect: true },
        { id: 'fortifiedBody', name: 'Corpo Fortificado', description: 'A Força protege você contra indisposições, toxinas e envenenamento por radiação, tornando-o imune a doenças, venenos e radiação.', prerequisites: [], requiresFeat: 'Equilíbrio' },
        { id: 'forceTreatment', name: 'Tratamento da Força', description: 'Você pode fazer um teste de Usar a Força no lugar de um teste de Tratar Ferimentos (e é considerado treinado nela para esse fim). Pode administrar primeiros socorros, tratar doenças, venenos e radiação sem kit médico ou medpac.', prerequisites: [] },
      ],
    },
    {
      key: 'forceItem',
      name: 'Árvore de Talentos do Item da Força',
      description: 'Você pode imbuir armas e objetos com o poder da Força.',
      talents: [
        { id: 'poweredWeapon', name: 'Arma Poderosa', description: 'Gaste um ponto da Força (ação de rodada completa) para tornar uma arma corpo-a-corpo poderosa: ela causa um dado a mais de dano, mas apenas quando empunhada por você (ex.: sabre-de-luz causa 3d8 ao invés de 2d8).', prerequisites: [] },
        { id: 'attuneWeapon', name: 'Harmonizar Arma', description: 'Gaste um ponto da Força (ação de rodada completa) para harmonizar uma arma corpo-a-corpo. Toda vez que empunhá-la, você recebe +1 de bônus da Força nas jogadas de ataque. A arma está harmonizada apenas com você.', prerequisites: [] },
        { id: 'forceTalisman', name: 'Talismã da Força', description: 'Gaste um ponto da Força (ação de rodada completa) para criar um talismã. Enquanto o usar/carregar, recebe +1 de bônus da Força em uma de suas Defesas. Apenas um talismã ativo por vez; se destruído, não pode criar outro por 24 horas.', prerequisites: [] },
        { id: 'forceTalismanGreater', name: 'Talismã da Força Maior', description: 'Como Talismã da Força, exceto que o bônus da Força se estende para todas as suas três Defesas (Reflexos, Fortitude e Vontade).', prerequisites: ['forceTalisman'] },
      ],
    },
  ],
};
