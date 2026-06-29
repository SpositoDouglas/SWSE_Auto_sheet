'use strict';

/*
 * ALL_FEATS — catálogo de aptidões do SWSE.
 * Chave = nome exato usado em startingFeats e bonusFeatList das classes.
 *
 * Campos:
 *   description  : texto do benefício (das regras em português)
 *   prereqText   : pré-requisitos legíveis por humanos
 *   prereqs      : objeto para verificação automática na ficha
 *     bab          : BAB mínimo (número)
 *     str/dex/con/int/wis/cha : valor mínimo do atributo
 *     feats        : array misto — cada item é:
 *                    string  → pré-requisito AND (precisa ter essa aptidão)
 *                    array   → pré-requisito OR  (basta ter qualquer uma das listadas)
 *     trainedSkills: array de skill IDs que precisam estar treinadas
 *   multiSelect  : true se pode ser escolhida várias vezes (para grupos/armas diferentes)
 */
export const ALL_FEATS = {

  // ── A ──────────────────────────────────────────────────────────────────────

  'Acuidade com Armas': {
    description: 'Quando estiver usando uma arma leve ou um sabre-de-luz, você pode utilizar seu modificador de Destreza ao invés do seu modificador de Força nas jogadas de ataque.',
    prereqText: 'BAB +1',
    prereqs: { bab: 1 },
  },

  'Arremessar': {
    description: 'Se for bem sucedido em derrubar um oponente com um ataque de prender, o oponente cai em qualquer espaço não ocupado que você desejar, a até 1 quadrado dentro de seu alcance, e sofre dano de contusão igual ao seu dano de ataque desarmado.',
    prereqText: 'Derrubar, BAB +1',
    prereqs: { bab: 1, feats: ['Derrubar'] },
  },

  'Artes Marciais I': {
    description: 'O dano causado por seus ataques desarmados aumenta em um tipo de dado (1d4→1d6). Além disso, você ganha +1 de bônus de esquiva em sua Defesa de Reflexos.',
    prereqText: '—',
    prereqs: {},
  },

  'Artes Marciais II': {
    description: 'O dano causado por seus ataques desarmados aumenta em um tipo de dado (1d6→1d8). Além disso, você ganha +1 de bônus de esquiva em sua Defesa de Reflexos (acumula com Artes Marciais I).',
    prereqText: 'Artes Marciais I, BAB +3',
    prereqs: { bab: 3, feats: ['Artes Marciais I'] },
  },

  'Artes Marciais III': {
    description: 'O dano causado por seus ataques desarmados aumenta em um tipo de dado (1d8→1d10). Além disso, você ganha +1 de bônus de esquiva em sua Defesa de Reflexos (acumula com Artes Marciais I e II).',
    prereqText: 'Artes Marciais I, Artes Marciais II, BAB +6',
    prereqs: { bab: 6, feats: ['Artes Marciais I', 'Artes Marciais II'] },
  },

  'Ataque Acrobático': {
    description: 'Se você for bem sucedido em um teste de Acrobacia para evitar um ataque de oportunidade, você ganha um bônus de +2 em seu próximo ataque contra esse oponente, desde que o ataque ocorra antes do final do seu turno atual.',
    prereqText: 'Treinado em Acrobacia',
    prereqs: { trainedSkills: ['acrobatics'] },
  },

  'Ataque Coordenado': {
    description: 'Você é automaticamente bem sucedido quando estiver usando uma ação de prestar auxílio para ajudar em um ataque de um aliado ou atrapalhar o de um inimigo, desde que o alvo esteja adjacente a você ou em alcance à queima roupa.',
    prereqText: 'BAB +2',
    prereqs: { bab: 2 },
  },

  'Ataque Duplo': {
    description: 'Escolha uma arma exótica ou grupo de armas. Quando usar uma ação de ataque total, você pode fazer um ataque adicional se estiver empunhando a arma escolhida. Entretanto, recebe −5 de penalidade em todas as jogadas de ataque.',
    prereqText: 'BAB +6, proficiente com a arma escolhida',
    prereqs: { bab: 6 },
    multiSelect: true,
  },

  'Ataque em Movimento': {
    description: 'Quando estiver fazendo um ataque com uma arma corpo-a-corpo ou à distância, você pode se mover antes e depois do ataque, desde que sua distância total percorrida não seja maior que seu deslocamento.',
    prereqText: 'Destreza 13',
    prereqs: { dex: 13 },
  },

  'Ataque Giratório': {
    description: 'Utilizando uma ação de rodada completa, você pode fazer um ataque em área com sua arma corpo-a-corpo, golpeando cada alvo dentro do seu alcance.',
    prereqText: 'Destreza 13, Inteligência 13, Defesa em Corpo-a-Corpo, BAB +4',
    prereqs: { bab: 4, dex: 13, int: 13, feats: [['Defesa em Corpo-a-Corpo', 'Defender-se em Corpo-a-Corpo', 'Defesa Corpo-a-Corpo']] },
  },

  'Ataque Poderoso': {
    description: 'Na sua ação, antes de fazer uma jogada de ataque, você pode subtrair um número (até o seu BAB) de todas as jogadas de ataques corpo-a-corpo e adicionar o mesmo número em todas as jogadas de dano corpo-a-corpo.',
    prereqText: 'Força 13',
    prereqs: { str: 13 },
  },

  'Ataque Rápido': {
    description: 'Quando usar uma arma corpo-a-corpo, você pode desferir dois golpes como um único ataque contra um alvo. Você sofre −2 de penalidade na jogada de ataque, mas causa +1 dado de dano.',
    prereqText: 'BAB +1, proficiente com a arma',
    prereqs: { bab: 1 },
    multiSelect: true,
  },

  'Ataque Triplo': {
    description: 'Escolha uma arma exótica ou grupo de armas. Quando usar uma ação de ataque total, você pode fazer mais um ataque adicional além do Ataque Duplo, acumulando −5 adicional (total −10) em todas as jogadas de ataque.',
    prereqText: 'BAB +11, Ataque Duplo (arma escolhida), proficiente com a arma',
    prereqs: { bab: 11, feats: ['Ataque Duplo'] },
    multiSelect: true,
  },


  // ── C ──────────────────────────────────────────────────────────────────────

  'Certeiro': {
    description: 'Se você mirar antes de fazer um ataque à distância e o ataque acertar, aumente o dano causado em um dado de dano adicional.',
    prereqText: 'Tiro à Queima-Roupa, Tiro Preciso, BAB +4',
    prereqs: { bab: 4, feats: [['Tiro à Queima-Roupa', 'Tiro à Queima Roupa'], 'Tiro Preciso'] },
  },

  'Cirurgia com Cibernéticos': {
    description: 'Você pode instalar uma prótese cibernética em um ser vivo. O procedimento cirúrgico requer 1 hora de trabalho ininterrupto, após isso, um teste de Tratar Ferimentos CD 20 determina o sucesso.',
    prereqText: 'Treinado em Tratar Ferimentos',
    prereqs: { trainedSkills: ['treatInjury'] },
  },

  'Combate Veicular': {
    description: 'Uma vez por rodada, quando estiver pilotando um veículo ou espaçonave, você pode anular um acerto ao ser bem sucedido num teste de Pilotar contra CD igual ao resultado da jogada de ataque.',
    prereqText: 'Treinado em Pilotar',
    prereqs: { trainedSkills: ['pilot'] },
  },

  'Crítico Triplicado': {
    description: 'Escolha uma arma. Quando obtiver um sucesso decisivo com a arma escolhida, o dano é triplicado (ao invés de duplicado).',
    prereqText: 'Proficiente com a arma, BAB +8',
    prereqs: { bab: 8 },
    multiSelect: true,
  },

  // ── D ──────────────────────────────────────────────────────────────────────

  'Defesa em Corpo-a-Corpo': {
    description: 'Quando você usar uma ação padrão para fazer um ataque corpo-a-corpo, você pode receber até −5 na jogada de ataque e adicionar o mesmo valor como bônus de esquiva na Defesa de Reflexos até o seu próximo turno.',
    prereqText: 'Inteligência 13',
    prereqs: { int: 13 },
  },

  'Defender-se em Corpo-a-Corpo': {
    description: 'Quando você usar uma ação padrão para fazer um ataque corpo-a-corpo, você pode receber até −5 na jogada de ataque e adicionar o mesmo valor como bônus de esquiva na Defesa de Reflexos até o seu próximo turno.',
    prereqText: 'Inteligência 13',
    prereqs: { int: 13 },
  },

  'Defesa Corpo-a-Corpo': {
    description: 'Quando você usar uma ação padrão para fazer um ataque corpo-a-corpo, você pode receber até −5 na jogada de ataque e adicionar o mesmo valor como bônus de esquiva na Defesa de Reflexos até o seu próximo turno.',
    prereqText: 'Inteligência 13',
    prereqs: { int: 13 },
  },

  'Defesas Aprimoradas': {
    description: 'Você ganha +1 de bônus em suas Defesas de Reflexos, Fortitude e Vontade.',
    prereqText: '—',
    prereqs: {},
  },

  'Derrubar': {
    description: 'Se você for bem sucedido em um ataque de prender e seu oponente falhar no teste resistido, ele cai no seu próprio espaço e não é mais considerado preso. O oponente caído sofre −5 em jogadas de ataque corpo-a-corpo.',
    prereqText: 'BAB +1',
    prereqs: { bab: 1 },
  },

  'Desarme Aprimorado': {
    description: 'Você ganha +5 de bônus em qualquer jogada de ataque corpo-a-corpo feita para desarmar um oponente. Além disso, se você falhar em desarmar, o oponente não ganha a chance de fazer um ataque livre contra você.',
    prereqText: 'Inteligência 13, Defesa em Corpo-a-Corpo',
    prereqs: { int: 13, feats: [['Defesa em Corpo-a-Corpo', 'Defender-se em Corpo-a-Corpo', 'Defesa Corpo-a-Corpo']] },
  },

  // ── E ──────────────────────────────────────────────────────────────────────

  'Encontrão': {
    description: 'Após fazer um ataque corpo-a-corpo bem sucedido contra um oponente até uma categoria de tamanho maior que a sua, você pode mover esse oponente 1 quadrado em qualquer direção como uma ação livre.',
    prereqText: 'Força 13, BAB +1',
    prereqs: { str: 13, bab: 1 },
  },

  'Especialista Cirúrgico': {
    description: 'Você pode realizar uma cirurgia em 10 minutos ao invés de 1 hora.',
    prereqText: 'Treinado em Tratar Ferimentos',
    prereqs: { trainedSkills: ['treatInjury'] },
  },

  'Esquiva': {
    description: 'Durante seu turno, você pode designar um oponente e receber +1 de bônus de esquiva na Defesa de Reflexos contra ataques feitos por esse oponente.',
    prereqText: 'Destreza 13',
    prereqs: { dex: 13 },
  },

  'Esmagar': {
    description: 'Se for bem sucedido em imobilizar um oponente com um ataque de prender, você pode imediatamente causar dano de contusão igual ao seu dano de ataque desarmado ou dano de garra.',
    prereqText: 'Imobilizar, BAB +1',
    prereqs: { bab: 1, feats: ['Imobilizar'] },
  },

  // ── F ──────────────────────────────────────────────────────────────────────

  'Favorecido pela Força': {
    description: 'Você ganha três Pontos da Força adicionais a cada nível.',
    prereqText: 'Sensitivo à Força',
    prereqs: { feats: ['Sensitivo à Força'] },
  },

  // Foco em Arma (Weapon Focus): +1 nas jogadas de ataque com o grupo de armas
  // (ou arma exótica) escolhido. Exige proficiência com a arma escolhida.
  // Uma entrada por grupo de armas — escolha o tipo correspondente.
  'Foco em Arma (Armas Simples)': {
    description: 'Você ganha +1 de bônus em todas as jogadas de ataque com armas simples.',
    prereqText: 'Proficiência com Armas (Armas Simples)',
    prereqs: { feats: ['Proficiência com Armas (Armas Simples)'] },
  },

  'Foco em Arma (Pistolas)': {
    description: 'Você ganha +1 de bônus em todas as jogadas de ataque com pistolas.',
    prereqText: 'Proficiência com Armas (Pistolas)',
    prereqs: { feats: ['Proficiência com Armas (Pistolas)'] },
  },

  'Foco em Arma (Rifles)': {
    description: 'Você ganha +1 de bônus em todas as jogadas de ataque com rifles.',
    prereqText: 'Proficiência com Armas (Rifles)',
    prereqs: { feats: ['Proficiência com Armas (Rifles)'] },
  },

  'Foco em Arma (sabres-de-luz)': {
    description: 'Você ganha +1 de bônus em todas as jogadas de ataque com sabres-de-luz.',
    prereqText: 'Proficiência com Armas (Sabres-de-luz)',
    prereqs: { feats: ['Proficiência com Armas (Sabres-de-luz)'] },
  },

  'Foco em Arma (armas de combate corpo-a-corpo avançadas)': {
    description: 'Você ganha +1 de bônus em todas as jogadas de ataque com armas de combate corpo-a-corpo avançadas.',
    prereqText: 'Proficiência com Armas (armas de combate corpo-a-corpo avançadas)',
    prereqs: { feats: ['Proficiência com Armas (armas de combate corpo-a-corpo avançadas)'] },
  },

  'Foco em Arma (armas pesadas)': {
    description: 'Você ganha +1 de bônus em todas as jogadas de ataque com armas pesadas.',
    prereqText: 'Proficiência com Armas (armas pesadas)',
    prereqs: { feats: ['Proficiência com Armas (armas pesadas)'] },
  },

  'Foco em Arma (arma exótica)': {
    description: 'Você ganha +1 de bônus em todas as jogadas de ataque com uma arma exótica escolhida. Escolha novamente para aplicar a outra arma exótica.',
    prereqText: 'Proficiência com Arma Exótica (com a arma escolhida)',
    prereqs: { feats: ['Proficiência com Arma Exótica'] },
    multiSelect: true,
  },

  'Foco em Perícia': {
    description: 'Uma perícia treinada de sua escolha recebe +5 de bônus de competência.',
    prereqText: '—',
    prereqs: {},
    multiSelect: true,
  },

  'Foco em Perícia (Dissimulação)': {
    description: 'Você recebe +5 de bônus de competência em testes de Dissimulação.',
    prereqText: 'Dissimulação treinada (traço de espécie Neimoidiano)',
    prereqs: {},
    speciesOnly: true,
  },

  'Foco em Perícia (Iniciativa)': {
    description: 'Você recebe +5 de bônus de competência em testes de Iniciativa.',
    prereqText: 'Iniciativa treinada (traço de espécie Cereano)',
    prereqs: {},
    speciesOnly: true,
  },

  'Foco em Perícia (Obter Informações)': {
    description: 'Você recebe +5 de bônus de competência em testes de Obter Informações.',
    prereqText: 'Obter Informações treinado (traço de espécie Bothano)',
    prereqs: {},
    speciesOnly: true,
  },

  'Foco em Perícia (Percepção)': {
    description: 'Você recebe +5 de bônus de competência em testes de Percepção.',
    prereqText: 'Percepção treinada (traço de espécie Mon Calamari)',
    prereqs: {},
    speciesOnly: true,
  },

  'Foco em Perícia (Persuasão)': {
    description: 'Você recebe +5 de bônus de competência em testes de Persuasão.',
    prereqText: 'Persuasão treinada (traço de espécie Quarren)',
    prereqs: {},
    speciesOnly: true,
  },

  'Foco em Perícia (Sobrevivência)': {
    description: 'Você recebe +5 de bônus de competência em testes de Sobrevivência.',
    prereqText: 'Sobrevivência treinada (traço de espécie Ewok/Rodiano)',
    prereqs: {},
    speciesOnly: true,
  },

  'Foco em Perícia (Conhecimentos [Ciências Biológicas])': {
    description: 'Você recebe +5 de bônus de competência em testes de Conhecimentos (Ciências Biológicas).',
    prereqText: 'Conhecimentos (Ciências Biológicas) treinado (traço de espécie Ithoriano)',
    prereqs: {},
    speciesOnly: true,
  },

  'Fúria Nata': {
    description: 'Uma vez por dia, utilizando uma ação rápida, você pode entrar em fúria por 5 + modificador de Constituição rodadas. Em fúria recebe +2 de bônus nas jogadas de ataque e dano em corpo-a-corpo, mas não pode usar Mecânica, Furtividade ou Usar a Força. Ao terminar a fúria, cai 1 passo persistente no marcador de condição (recuperação: mínimo 10 minutos de descanso).',
    prereqText: 'Traço de espécie Wookie',
    prereqs: {},
    speciesOnly: true,
  },

  'Franco-Atirador': {
    description: 'Você sempre ignora cobertura leve quando fizer um ataque à distância.',
    prereqText: 'Tiro à Queima-Roupa, Tiro Preciso, BAB +4',
    prereqs: { bab: 4, feats: [['Tiro à Queima-Roupa', 'Tiro à Queima Roupa'], 'Tiro Preciso'] },
  },

  'Fúria Assustadora': {
    description: 'Quando estiver em fúria, seus bônus de fúria nas jogadas de ataque e dano corpo-a-corpo aumentam para +5 (ao invés de +2).',
    prereqText: 'Fúria Nata (traço de espécie), BAB +1',
    prereqs: { bab: 1, feats: ['Fúria Nata'] },
  },

  'Fúria Extra': {
    description: 'Você pode entrar em fúria uma vez a mais por dia.',
    prereqText: 'Fúria Nata (traço de espécie)',
    prereqs: { feats: ['Fúria Nata'] },
    multiSelect: true,
  },

  // ── I ──────────────────────────────────────────────────────────────────────

  'Imobilizar': {
    description: 'Se for bem sucedido em um ataque de prender e seu oponente falhar no teste resistido, ele é imobilizado até o início do seu próximo turno. Uma criatura imobilizada não pode se mover ou executar qualquer ação, e perde seu bônus de Destreza na Defesa de Reflexos.',
    prereqText: 'BAB +1',
    prereqs: { bab: 1 },
  },

  'Impulso Eficaz': {
    description: 'Você pode gastar duas ações rápidas na mesma rodada para causar +1 dado de dano em seu próximo ataque corpo-a-corpo na mesma rodada.',
    prereqText: 'Força 13',
    prereqs: { str: 13 },
  },

  'Investida Aprimorada': {
    description: 'Você pode realizar uma investida sem precisar se mover em uma linha reta, e pode mudar de direção para evitar obstáculos.',
    prereqText: 'Destreza 13, Esquiva, Mobilidade',
    prereqs: { dex: 13, feats: ['Esquiva', 'Mobilidade'] },
  },

  'Investida Poderosa': {
    description: 'Quando realizar uma investida, você ganha um bônus adicional de +2 em suas jogadas de ataque. Se o ataque corpo-a-corpo acertar, adicione metade de seu nível ao dano.',
    prereqText: 'Tamanho Médio ou maior, BAB +1',
    prereqs: { bab: 1 },
  },

  // ── L ──────────────────────────────────────────────────────────────────────

  'Limite de Dano Aprimorado': {
    description: 'Você adiciona 5 pontos em seu Limite de Dano.',
    prereqText: '—',
    prereqs: {},
    multiSelect: true,
  },

  'Linguista': {
    description: 'Você recebe um número de idiomas bônus igual a 1 + seu modificador de Inteligência (mínimo de 1).',
    prereqText: 'Inteligência 13',
    prereqs: { int: 13 },
    multiSelect: true,
  },

  'Lingüista': {
    description: 'Você recebe um número de idiomas bônus igual a 1 + seu modificador de Inteligência (mínimo de 1).',
    prereqText: 'Inteligência 13',
    prereqs: { int: 13 },
    multiSelect: true,
  },

  // ── M ──────────────────────────────────────────────────────────────────────

  'Maestria com Duas Armas I': {
    description: 'Quando atacar com duas armas ou com as duas extremidades de uma arma dupla, como parte de uma ação de ataque total, você recebe −5 de penalidade (ao invés de −10) em todas as jogadas de ataque.',
    prereqText: 'Destreza 13, BAB +1',
    prereqs: { dex: 13, bab: 1 },
  },

  'Maestria com Duas Armas II': {
    description: 'Quando atacar com duas armas ou com as duas extremidades de uma arma dupla, como parte de uma ação de ataque total, você recebe −2 de penalidade (ao invés de −10) em todas as jogadas de ataque.',
    prereqText: 'Destreza 15, BAB +6, Maestria com Duas Armas I',
    prereqs: { dex: 15, bab: 6, feats: ['Maestria com Duas Armas I'] },
  },

  'Maestria com Duas Armas III': {
    description: 'Quando atacar com duas armas ou com as duas extremidades de uma arma dupla, como parte de uma ação de ataque total, você não recebe nenhuma penalidade em suas jogadas de ataque.',
    prereqText: 'Destreza 17, BAB +11, Maestria com Duas Armas I, Maestria com Duas Armas II',
    prereqs: { dex: 17, bab: 11, feats: ['Maestria com Duas Armas I', 'Maestria com Duas Armas II'] },
  },

  'Mobilidade': {
    description: 'Você ganha +5 de bônus na Defesa de Reflexos contra ataques de oportunidade provocados quando entrar ou sair de uma área ameaçada.',
    prereqText: 'Destreza 13, Esquiva',
    prereqs: { dex: 13, feats: ['Esquiva'] },
  },

  // ── P ──────────────────────────────────────────────────────────────────────

  'Poderoso na Força': {
    description: 'Quando gastar um Ponto da Força para melhorar o resultado de uma jogada, você joga d8s ao invés de d6s.',
    prereqText: '—',
    prereqs: {},
  },

  'Proficiência com Armas (Armas Simples)': {
    description: 'Você é proficiente com todas as armas simples. Sem a penalidade de −5 em jogadas de ataque com essas armas.',
    prereqText: '—',
    prereqs: {},
  },

  'Proficiência com Armas (Pistolas)': {
    description: 'Você é proficiente com todas as pistolas blaster e armas similares. Sem a penalidade de −5 em jogadas de ataque com essas armas.',
    prereqText: '—',
    prereqs: {},
  },

  'Proficiência com Armas (Rifles)': {
    description: 'Você é proficiente com todos os rifles blaster e armas similares. Sem a penalidade de −5 em jogadas de ataque com essas armas.',
    prereqText: '—',
    prereqs: {},
  },

  'Proficiência com Armas (Sabres-de-luz)': {
    description: 'Você é proficiente com sabres-de-luz e armas similares. Sem a penalidade de −5 em jogadas de ataque com essas armas.',
    prereqText: '—',
    prereqs: {},
  },

  'Proficiência com Armas (armas de combate corpo-a-corpo avançadas)': {
    description: 'Você é proficiente com armas de combate corpo-a-corpo avançadas (vibroespadas, vibroporretes, etc.). Sem a penalidade de −5 em jogadas de ataque com essas armas.',
    prereqText: '—',
    prereqs: {},
  },

  'Proficiência com Armas (armas pesadas)': {
    description: 'Você é proficiente com armas pesadas (canhões de repetição, lança-foguetes, etc.). Sem a penalidade de −5 em jogadas de ataque com essas armas.',
    prereqText: '—',
    prereqs: {},
  },

  'Proficiência com Arma Exótica': {
    description: 'Você pode fazer jogadas de ataque com uma arma exótica específica sem receber a penalidade de −5.',
    prereqText: 'BAB +1',
    prereqs: { bab: 1 },
    multiSelect: true,
  },

  'Proficiência com Armaduras (leves)': {
    description: 'Quando você usar armaduras leves, não recebe penalidade de armadura nas jogadas de ataque ou testes de perícia e recebe todos os bônus especiais da armadura.',
    prereqText: '—',
    prereqs: {},
  },

  'Proficiência com Armaduras (médias)': {
    description: 'Quando você usar armaduras médias, não recebe penalidade de armadura nas jogadas de ataque ou testes de perícia e recebe todos os bônus especiais da armadura.',
    prereqText: 'Proficiência com Armaduras (leves)',
    prereqs: { feats: ['Proficiência com Armaduras (leves)'] },
  },

  'Proficiência com Armaduras (pesadas)': {
    description: 'Quando você usar armaduras pesadas, não recebe penalidade de armadura nas jogadas de ataque ou testes de perícia e recebe todos os bônus especiais da armadura.',
    prereqText: 'Proficiência com Armaduras (leves), Proficiência com Armaduras (médias)',
    prereqs: { feats: [
      'Proficiência com Armaduras (leves)',
      'Proficiência com Armaduras (médias)',
    ]},
  },

  // ── R ──────────────────────────────────────────────────────────────────────

  'Rajada de Tiros': {
    description: 'Quando usar uma arma de disparo automático, você pode atirar uma pequena rajada como um único ataque contra um alvo. Recebe −5 na jogada de ataque, mas causa +2 dados de dano.',
    prereqText: 'Proficiência com Armas (armas pesadas), proficiente na arma',
    prereqs: { feats: ['Proficiência com Armas (armas pesadas)'] },
  },

  'Recuperação Rápida': {
    description: 'Você pode gastar duas ações rápidas, ao invés de três, para subir 1 passo em seu marcador de condição.',
    prereqText: 'Constituição 13, Treinado em Tolerância',
    prereqs: { con: 13, trainedSkills: ['endurance'] },
  },

  'Reflexos em Combate': {
    description: 'Quando os oponentes deixam a guarda aberta, você pode fazer um número de ataques de oportunidade adicionais igual ao seu modificador de Destreza.',
    prereqText: '—',
    prereqs: {},
  },

  'Retomar o Fôlego Extra': {
    description: 'Você pode usar Retomar o Fôlego uma vez a mais por dia (mas ainda apenas uma vez por encontro).',
    prereqText: 'Treinado em Tolerância',
    prereqs: { trainedSkills: ['endurance'] },
    multiSelect: true,
  },

  // ── S ──────────────────────────────────────────────────────────────────────

  'Saque Rápido': {
    description: 'Você pode sacar ou colocar no coldre uma arma utilizando uma ação rápida ao invés de uma ação de movimento.',
    prereqText: 'BAB +1',
    prereqs: { bab: 1 },
  },

  'Sensitivo à Força': {
    description: 'Você pode fazer testes de Usar a Força — Usar a Força torna-se uma perícia de classe. Além disso, toda vez que adquirir um novo talento você tem a opção de escolher um talento da Força.',
    prereqText: 'Não pode ser um dróide',
    prereqs: {},
  },

  // ── T ──────────────────────────────────────────────────────────────────────

  'Tiro à Queima-Roupa': {
    description: 'Você ganha +1 de bônus nas jogadas de ataque e dano com armas de combate à distância contra oponentes dentro do alcance à queima roupa.',
    prereqText: '—',
    prereqs: {},
  },

  'Tiro à Queima Roupa': {
    description: 'Você ganha +1 de bônus nas jogadas de ataque e dano com armas de combate à distância contra oponentes dentro do alcance à queima roupa.',
    prereqText: '—',
    prereqs: {},
  },

  'Tiro Distante': {
    description: 'Quando usar uma arma de combate à distância, as penalidades de alcance (curto, médio, longo) são reduzidas em uma categoria.',
    prereqText: 'Tiro à Queima-Roupa',
    prereqs: { feats: [['Tiro à Queima-Roupa', 'Tiro à Queima Roupa']] },
  },

  'Tiro em Investida': {
    description: 'Quando estiver em investida, você pode fazer um ataque à distância ao invés de um ataque corpo-a-corpo ao término de seu movimento, com −2 de penalidade na Defesa de Reflexos.',
    prereqText: 'BAB +4',
    prereqs: { bab: 4 },
  },

  'Tiro Meticuloso': {
    description: 'Se você mirar antes de fazer um ataque à distância, você ganha um bônus de +1 em sua jogada de ataque.',
    prereqText: 'Tiro à Queima-Roupa, BAB +2',
    prereqs: { bab: 2, feats: [['Tiro à Queima-Roupa', 'Tiro à Queima Roupa']] },
  },

  'Tiro Preciso': {
    description: 'Você pode atirar ou arremessar uma arma de combate à distância em um oponente engajado em combate corpo-a-corpo sem sofrer a penalidade normal de −5.',
    prereqText: 'Tiro à Queima-Roupa',
    prereqs: { feats: [['Tiro à Queima-Roupa', 'Tiro à Queima Roupa']] },
  },

  'Tiro Rápido': {
    description: 'Quando usar uma arma de combate à distância, você pode disparar dois tiros como um único ataque contra um alvo. Você sofre −2 de penalidade na jogada de ataque, mas causa +1 dado de dano.',
    prereqText: 'BAB +1, proficiente com a arma',
    prereqs: { bab: 1 },
    multiSelect: true,
  },

  'Treinamento em Perícia': {
    description: 'Escolha uma perícia não treinada de sua lista de perícias de classe. Você se torna treinado nessa perícia.',
    prereqText: '—',
    prereqs: {},
    multiSelect: true,
  },

  'Treinamento na Força': {
    description: 'Você adiciona ao seu conjunto de poderes da Força um número de poderes igual a 1 + seu modificador de Sabedoria (mínimo de 1).',
    prereqText: 'Sensitivo à Força, Treinado em Usar a Força',
    prereqs: { feats: ['Sensitivo à Força'], trainedSkills: ['useTheForce'] },
    multiSelect: true,
  },

  'Trespassar': {
    description: 'Se você causar a um oponente uma quantidade de dano suficiente para reduzir seus pontos de vida a 0, poderá executar um ataque corpo-a-corpo extra contra outro oponente dentro do alcance. Pode ser usado apenas uma vez por rodada.',
    prereqText: 'Força 13, Ataque Poderoso',
    prereqs: { str: 13, feats: ['Ataque Poderoso'] },
  },

  'Trespassar Aprimorado': {
    description: 'Como a aptidão Trespassar, exceto que você não tem limite do número de vezes que pode usá-la por rodada.',
    prereqText: 'Força 13, Ataque Poderoso, Trespassar, BAB +4',
    prereqs: { str: 13, bab: 4, feats: ['Ataque Poderoso', 'Trespassar'] },
  },

  // ── V ──────────────────────────────────────────────────────────────────────

  'Vigoroso': {
    description: 'Você ganha +1 ponto de vida por nível de personagem.',
    prereqText: '—',
    prereqs: {},
  },
};
