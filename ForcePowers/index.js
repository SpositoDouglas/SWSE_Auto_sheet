'use strict';

/*
 * ALL_FORCE_POWERS — catálogo de Poderes da Força do SWSE.
 * Chave = nome do poder (português).
 *
 * Campos:
 *   descriptor  : [Telecinético], [Lado Negro], [Lado da Luz], [Afetar a Mente] (ou '')
 *   time        : tipo de ação para ativar
 *   target      : alvo(s) afetado(s)
 *   description : efeito do poder (teste de Usar a Força e resultados)
 *   special     : regras especiais / uso de Ponto da Força (opcional)
 *
 * Poderes são adquiridos pela aptidão repetível "Treinamento na Força", que
 * concede 1 + modificador de Sabedoria (mínimo 1) poderes a cada vez. O mesmo
 * poder pode ser escolhido mais de uma vez (cada escolha = um uso extra).
 */
const ALL_FORCE_POWERS = {
  'Atordoamento da Força': {
    descriptor: '',
    time: 'Ação padrão',
    target: 'Uma criatura dentro de 6 quadrados ou na linha de visão.',
    description: 'Você recorre à Força para sobrecarregar os sentidos de um inimigo, possivelmente atordoando-o. Compare o teste de Usar a Força com a Defesa de Fortitude do alvo: se igualar ou exceder, o alvo cai 1 passo em seu marcador de condição, e mais 1 passo adicional para cada 5 pontos de excesso. Alvos maiores que Médio somam modificador de tamanho à Fortitude (Colossal +50, Imenso +20, Enorme +10, Grande +5).',
    special: 'Gaste 1 Ponto da Força para mover o alvo 1 passo negativo adicional em seu marcador de condição.',
  },

  'Desarmar da Força': {
    descriptor: '[Telecinético]',
    time: 'Ação padrão',
    target: 'Uma criatura dentro de 12 quadrados e na linha de visão.',
    description: 'Você usa a Força para puxar a arma das mãos do alvo. Use o teste de Usar a Força no lugar da jogada de ataque para desarmar. Se bem sucedido, você pode deixar o item caído no espaço do alvo ou trazê-lo voando para sua mão (precisa ter uma mão livre).',
    special: 'Gaste 1 Ponto da Força para danificar a arma: se o desarme for bem sucedido, ela recebe dano igual ao resultado do teste. Declare antes do ataque.',
  },

  'Empurrão da Força': {
    descriptor: '[Telecinético]',
    time: 'Ação padrão',
    target: 'Um objeto ou personagem dentro de 12 quadrados e na linha de visão.',
    description: 'Você empurra um alvo para longe. O alvo faz um teste de Força (somando BAB e modificador de tamanho). Se você superar, empurra o alvo 1 quadrado, +1 quadrado para cada 5 pontos de excesso. Se empurrado contra um objeto maior, sofre 1d6 de dano.',
    special: 'Gaste 1 Ponto da Força para aplicar -5 ao teste de Força do alvo e causar 2d6 de dano adicional se empurrá-lo contra um objeto maior.',
  },

  'Fúria Sombria': {
    descriptor: '[Lado Negro]',
    time: 'Ação rápida',
    target: 'Você.',
    description: 'Você entra em fúria conforme o lado negro flui através de você. CD 15: +2 de fúria em ataques e dano corpo-a-corpo até o fim do seu turno. CD 20: +4. CD 25: +6.',
    special: 'Enquanto em fúria, não pode usar perícias/tarefas que exijam paciência ou concentração. Gaste 1 Ponto da Força para estender a duração até o fim do encontro.',
  },

  'Estrangulamento da Força': {
    descriptor: '[Telecinético]',
    time: 'Ação padrão',
    target: 'Um alvo dentro de 6 quadrados ou na linha de visão.',
    description: 'Você aperta ou esmaga o inimigo com a Força. Se o teste igualar/exceder o Limite de Dano do alvo — CD 15: 2d6 de dano e o alvo só pode fazer uma ação rápida no próximo turno; CD 20: 4d6; CD 25: 6d6. Caso contrário, metade do dano e você não pode manter o poder.',
    special: 'Pode manter rodada a rodada (ação padrão, novo teste). Ao sofrer dano enquanto mantém: teste de Usar a Força CD 15 + dano recebido. Gaste 1 Ponto da Força para +2d6 de dano.',
  },

  'Golpe da Força': {
    descriptor: '[Telecinético]',
    time: 'Ação padrão',
    target: 'Todas as criaturas num cone de 6 quadrados na linha de visão.',
    description: 'Você golpeia uma ou mais criaturas com a Força (efeito de área). Compare com a Defesa de Fortitude de cada alvo: se igualar/exceder, 4d6 de dano da Força e o alvo cai prostrado; senão, metade do dano e não cai. Alvos maiores que Médio somam modificador de tamanho à Fortitude (Colossal +50, Imenso +20, Enorme +10, Grande +5).',
    special: 'Gaste 1 Ponto da Força para causar 2d6 de dano adicional aos alvos na área.',
  },

  'Impulso': {
    descriptor: '',
    time: 'Ação livre',
    target: 'Você.',
    description: 'A Força lhe permite saltar grandes alturas e distâncias e mover-se rapidamente. CD 10: +10 da Força em testes de Saltar e +2 quadrados de deslocamento até o início do próximo turno. CD 15: +20 e +4 quadrados. CD 20: +30 e +6 quadrados.',
    special: 'Gaste 1 Ponto da Força para +10 no bônus de Saltar e +2 quadrados de deslocamento. Usar Impulso conta como início de uma corrida para a CD de Saltar.',
  },

  'Mover Objeto': {
    descriptor: '[Telecinético]',
    time: 'Ação padrão',
    target: 'Um personagem ou objeto dentro de 12 quadrados ou na linha de visão.',
    description: 'Você move telecineticamente um objeto até 6 quadrados. O resultado determina o tamanho máximo: CD 15 Médio (2d6); CD 20 Grande (4d6); CD 25 Enorme (6d6); CD 30 Imenso (8d6); CD 35 Colossal (10d6). Contra criatura resistente, o teste também deve exceder a Defesa de Vontade; para arremessar contra outro alvo, exceder a Defesa de Reflexos dele.',
    special: 'Pode manter rodada a rodada (ação padrão, novo teste). Ao sofrer dano: teste CD 15 + dano para manter. Gaste 1 Ponto da Força para +1 categoria de tamanho e +2d6 de dano.',
  },

  'Neutralizar Energia': {
    descriptor: '',
    time: 'Reação',
    target: 'Um ataque contra você por arma que cause dano de energia.',
    description: 'Você neutraliza espontaneamente um ataque de arma de energia (sabre-de-luz, blaster). Se o teste de Usar a Força igualar/exceder o dano causado, o ataque é neutralizado e você não recebe dano; senão, recebe dano normal.',
    special: 'Você deve estar atento ao ataque (não surpreendido). Se bem sucedido, gaste 1 Ponto da Força para recuperar pontos de vida igual ao dano neutralizado (até seu máximo).',
  },

  'Devolver': {
    descriptor: '',
    time: 'Reação',
    target: 'Um poder da Força direcionado a você.',
    description: 'Você absorve e deflete um poder da Força usado contra você. Se seu teste igualar/exceder o resultado do poder, você o redireciona sem sofrer efeitos. Se exceder por 5 ou mais, pode voltar o poder contra o criador (que sofre os efeitos com base no teste original dele).',
    special: 'Se refletido de volta à origem, ela pode devolvê-lo novamente gastando outro uso de Devolver. Gaste 1 Ponto da Força (reação) para não sofrer efeitos de um poder devolvido duas vezes.',
  },

  'Poder de Batalha': {
    descriptor: '',
    time: 'Ação rápida',
    target: 'Você.',
    description: 'Você usa a Força para ampliar suas proezas de batalha. CD 15: +1 da Força na próxima jogada de ataque (antes do fim do próximo turno) e +1d6 de dano se acertar. CD 20: +2d6 de dano. CD 25: +3d6 de dano.',
    special: 'Gaste 1 Ponto da Força para causar 2d6 de dano adicional no próximo ataque.',
  },

  'Relâmpago da Força': {
    descriptor: '[Lado Negro]',
    time: 'Ação padrão',
    target: 'Um alvo na linha de visão e dentro de 6 quadrados.',
    description: 'Você dispara arcos mortais de energia da Força. Compare o teste com a Defesa de Reflexos do alvo: se igualar/exceder, 8d6 de dano e o alvo cai 1 passo no marcador de condição; senão, metade do dano e não se move no marcador.',
    special: 'Gaste 1 Ponto da Força para mover o alvo 1 passo negativo extra no marcador de condição quando bem sucedido.',
  },

  'Rompimento da Força': {
    descriptor: '[Lado da Luz]',
    time: 'Ação padrão',
    target: 'Usuário da Força com Valor do Lado Negro 1+ dentro de 12 quadrados e na linha de visão.',
    description: 'Você rompe o acesso à Força de outro usuário. Se o teste igualar/exceder a Defesa de Vontade do alvo — CD 25: o alvo não pode gastar Pontos da Força por um número de horas igual ao seu Valor do Lado Negro; CD 30: além disso, cai 1 passo no marcador a cada poder usado nesse período; CD 35: cai 2 passos.',
    special: 'Sem efeito em alvos com Valor do Lado Negro 0. Gaste 1 Ponto da Força para dobrar a duração.',
  },

  'Transferência Vital': {
    descriptor: '[Lado da Luz]',
    time: 'Ação padrão',
    target: 'Uma criatura tocada.',
    description: 'Você usa sua própria força vital para curar outra criatura. CD 15: cura 2× o nível do alvo em PV; CD 20: 3×; CD 25: 4×. A cada uso, você sofre metade do dano que curou (arredondado para baixo). Não pode curar a si mesmo.',
    special: 'Gaste 1 Ponto da Força para não receber nenhum dano ao usar este poder.',
  },

  'Truque Mental': {
    descriptor: '[Afetar a Mente]',
    time: 'Ação padrão',
    target: 'Uma criatura com Inteligência 3+ na linha de visão e dentro de 12 quadrados.',
    description: 'Você altera as percepções do alvo ou implanta uma sugestão. Se igualar/exceder a Defesa de Vontade, escolha um efeito: criar alucinação (permite usar Furtividade mesmo se o alvo estiver atento); fintar (próximo ataque ignora o bônus de Destreza do alvo na Defesa de Reflexos); fazer uma sugestão improvável parecer razoável; ou encher o alvo de medo (foge por 1 minuto; negado se o nível do alvo ≥ seu nível).',
    special: 'Ao fazer uma sugestão, gaste 1 Ponto da Força para melhorar a atitude do alvo em 1 passo, +1 passo para cada 5 pontos de excesso sobre a Defesa de Vontade.',
  },

  'Visão Distante': {
    descriptor: '',
    time: 'Ação de rodada completa',
    target: 'Uma criatura que você conheça ou tenha encontrado antes.',
    description: 'Você recebe uma impressão vaga de eventos ao redor de um ser distante. Se o teste igualar/exceder a Defesa de Vontade do alvo, você sente se ele está vivo ou morto e percebe vagamente seus arredores, o que ocorre agora e emoções fortes. Falha: nenhuma informação e não pode tentar de novo contra o mesmo alvo por 24 horas. Um alvo morto tem Defesa de Vontade 30 para este poder.',
    special: 'Se bem sucedido, gaste 1 Ponto da Força para obter uma imagem mental clara dos arredores do alvo e criaturas/objetos numa área de 6 quadrados ao redor dele.',
  },
};
