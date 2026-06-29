'use strict';

/*
 * ALL_FORCE_TALENTS — Árvores de Talentos da Força (SWSE).
 *
 * Disponíveis apenas para personagens com a aptidão "Sensitivo à Força".
 * Um talento da Força pode ser escolhido no lugar de um talento de classe
 * (compartilham o mesmo slot de talento).
 *
 * Estrutura idêntica às árvores de classe:
 *   key, name, description, talents[] com id/name/description/prerequisites.
 * Campos extras opcionais:
 *   requiresDarkSide (na árvore): exige Valor do Lado Negro ≥ 1
 *   requiresAbility (no talento): { cha: 13, ... } valor mínimo de atributo
 *   requiresPower  (no talento): nome de Poder da Força que precisa conhecer
 *   multiSelect    (no talento): pode ser escolhido várias vezes
 */
export const ALL_FORCE_TALENTS = [
  {
    key: 'forceAlter',
    name: 'Árvore de Talentos de Alterar',
    description: 'A Força deu a você um considerável poder sobre o ambiente ao redor, assim como sobre aqueles próximos.',
    talents: [
      {
        id: 'disciplinedStrike',
        name: 'Golpe Disciplinado',
        description: 'Toda vez que você usar um poder da Força que tenha um efeito de área (como o Golpe da Força), você pode excluir certo número de alvos dos efeitos do poder. O número de alvos que você pode excluir dessa maneira é igual ao seu modificador de Sabedoria (mínimo de 1).',
        prerequisites: [],
      },
      {
        id: 'telekineticPower',
        name: 'Poder Telecinético',
        description: 'Toda vez que jogar um 20 natural no seu teste de Usar a Força para ativar um poder com o descritor [Telecinético], você pode escolher usar aquele poder de novo, imediatamente, como uma ação livre. Você pode direcionar o segundo uso do poder contra qualquer alvo dentro do alcance.',
        prerequisites: [],
      },
      {
        id: 'telekineticSavant',
        name: 'Sabedoria Telecinética',
        description: 'Uma vez por encontro, como uma ação rápida, você pode recuperar um poder da Força com o descritor [Telecinético] para o seu conjunto sem gastar um Ponto da Força. Você pode escolher esse talento várias vezes; cada vez que o fizer, poderá usá-lo uma vez a mais por encontro.',
        prerequisites: [],
        multiSelect: true,
      },
    ],
  },
  {
    key: 'forceControl',
    name: 'Árvore de Talentos de Controlar',
    description: 'Você aprendeu como regular seu próprio sistema corporal, controlar suas emoções e canalizar a Força.',
    talents: [
      {
        id: 'damageReduction10',
        name: 'Redução de Dano 10',
        description: 'Você pode gastar um Ponto da Força como uma ação padrão para ganhar Redução de Dano 10 por 1 minuto.',
        prerequisites: [],
      },
      {
        id: 'equilibrium',
        name: 'Equilíbrio',
        description: 'Como uma ação rápida você pode gastar um Ponto da Força para remover todas as condições debilitantes que o afetam e retornar ao estado normal.',
        prerequisites: [],
      },
      {
        id: 'forceFocus',
        name: 'Foco na Força',
        description: 'Como uma ação completa você pode fazer um teste de Usar a Força com CD 15. Se o teste for bem sucedido, você recupera um poder da Força gasto à sua escolha.',
        prerequisites: [],
      },
      {
        id: 'forceRecovery',
        name: 'Recuperação pela Força',
        description: 'Sempre que você utilizar Retomar o Fôlego, você recupera um número de pontos de vida adicionais de 1d6 por Ponto da Força que você possua (máximo de 10d6).',
        prerequisites: ['equilibrium'],
      },
    ],
  },
  {
    key: 'forceDarkSide',
    name: 'Árvore de Talentos do Lado Negro',
    description: 'O caminho para o lado negro da Força é rápido e fácil, fornecendo incrível poder. Você deve ter um Valor do Lado Negro de 1 ou maior para escolher talentos desta árvore; se seu Valor do Lado Negro for reduzido a 0, você perde acesso a todos os talentos dela até que aumente novamente.',
    requiresDarkSide: true,
    talents: [
      {
        id: 'darkPower',
        name: 'Poder do Lado Negro',
        description: 'Você permite que seu ódio alimente seus ataques. Sempre que gastar um Ponto da Força para modificar uma jogada de ataque, você pode escolher jogar um dado extra adicional e escolher o melhor resultado. No entanto, fazer isso aumenta seu Valor do Lado Negro em 1.',
        prerequisites: [],
      },
      {
        id: 'darkPresence',
        name: 'Presença Sombria',
        description: 'Como uma ação padrão você fornece a si mesmo e a todos os seus aliados dentro de uma área de 6 quadrados centrada em você um bônus da Força de +1 para todas as defesas até o final do encontro. Esses bônus são perdidos se você cair inconsciente ou morrer.',
        prerequisites: ['darkPower'],
        requiresAbility: { cha: 13 },
      },
      {
        id: 'revenge',
        name: 'Vingança',
        description: 'Sempre que um aliado de nível igual ou maior que você for morto ou reduzido a zero pontos de vida dentro de sua linha de visão, você recebe um bônus da Força de +2 em jogadas de ataque e dano até o final do encontro.',
        prerequisites: ['darkPresence', 'darkPower'],
      },
      {
        id: 'swiftPower',
        name: 'Poder Rápido',
        description: 'Uma vez por dia, você pode usar um poder da Força que normalmente toma uma ação padrão ou ação de movimento como uma ação rápida.',
        prerequisites: ['darkPower'],
      },
    ],
  },
  {
    key: 'forceSense',
    name: 'Árvore de Talentos dos Sentidos',
    description: 'Sua integração com a Força garante incríveis poderes de percepção.',
    talents: [
      {
        id: 'forcePerception',
        name: 'Percepção da Força',
        description: 'Você pode fazer um teste de Usar a Força em vez de um teste de Percepção para evitar ser surpreendido, notar inimigos, perceber alguma trapaça ou sentir a influência. Você é considerado treinado na perícia Percepção. Se lhe for concedida a chance de jogar novamente o teste de Percepção, você pode em vez disso jogar novamente o seu teste de Usar a Força.',
        prerequisites: [],
      },
      {
        id: 'forcePilot',
        name: 'Pilotar da Força',
        description: 'Você pode usar seu modificador do teste de Usar a Força em vez do seu modificador do teste de Pilotar quando fizer testes de Pilotar. Você é considerado treinado na perícia Pilotar. Se lhe for concedida a chance de jogar novamente o teste de Pilotar, você pode em vez disso jogar novamente o seu teste de Usar a Força.',
        prerequisites: [],
      },
      {
        id: 'foresight',
        name: 'Previsão',
        description: 'Você pode gastar um Ponto da Força para jogar novamente um teste de Iniciativa, mantendo o melhor dos dois resultados. Além disso, se você jogar um 20 natural no seu teste de Iniciativa, você imediatamente recupera o Ponto da Força gasto para ativar esse talento.',
        prerequisites: ['forcePerception'],
      },
      {
        id: 'measureForcePotential',
        name: 'Medir o Potencial da Força',
        description: 'Ao se concentrar em uma criatura específica na sua linha de visão (ação padrão, teste de Usar a Força), se o resultado igualar ou vencer a Defesa de Vontade do alvo, você sabe se ele possui ou não a aptidão Sensitivo à Força, quantos poderes da Força ele conhece (mas não quais) e quantos Pontos da Força ele tem atualmente.',
        prerequisites: ['forcePerception'],
      },
      {
        id: 'visions',
        name: 'Visões',
        description: 'Sempre que utilizar o poder Visão Distante, você pode gastar um Ponto da Força como uma ação rápida para ver o passado ou o futuro do alvo em vez do presente. Você declara quão longe deseja ver, até o máximo de 1 ano por nível do seu personagem.',
        prerequisites: ['forcePerception'],
        requiresPower: 'Visão Distante',
      },
    ],
  },
];
