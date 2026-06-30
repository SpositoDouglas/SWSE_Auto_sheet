'use strict';

/*
 * Técnicas e Segredos da Força (SWSE, págs. 106 e 108).
 *
 * TÉCNICAS DA FORÇA — adquiridas em níveis pares (2º, 4º, 6º, 8º, 10º) das
 *   classes de prestígio Adepto da Força, Cavaleiro Jedi e Aprendiz Sith.
 * SEGREDOS DA FORÇA — adquiridos a cada nível a partir do 2º (2º–5º) das
 *   classes de prestígio Discípulo da Força, Mestre Jedi e Lorde Sith.
 *
 * Os slots (quantos e em quais níveis) são lidos do `levelFeatures` de cada
 * classe ('forceTechnique' / 'forceSecret'); estas listas são apenas o catálogo
 * de escolhas. Cada objeto é indexado pelo nome (português).
 *
 * Campos:
 *   description : efeito da técnica/segredo
 *   repeatable  : pode ser escolhida mais de uma vez (opcional)
 */

export const ALL_FORCE_TECHNIQUES = {
  'Recuperar Ponto da Força': {
    description: 'No final de um encontro você automaticamente recupera 1 Ponto da Força gasto durante o mesmo.',
  },
  'Mestria com Poder da Força': {
    description: 'Escolha um poder da Força. Você pode escolher 10 nos testes de Usar a Força para ativar esse poder mesmo quando distraído ou ameaçado. Você pode escolher essa técnica diversas vezes; cada vez que a receber, ela se aplica a um novo poder da Força.',
    repeatable: true,
  },
  'Transe da Força Aprimorado': {
    description: 'A cada hora que você permanecer em um transe da Força (perícia Usar a Força), você recupera um número de pontos de vida igual a 2 × seu nível de personagem.',
  },
  'Mover Objetos Leves Aprimorado': {
    description: 'Você pode fazer um teste de Usar a Força para mover objetos leves como uma ação rápida em vez de uma ação de movimento. Usar o objeto leve como um projétil requer uma ação de movimento (em vez de uma ação padrão).',
  },
  'Sentir a Força Aprimorado': {
    description: 'Você pode usar a habilidade sentir a Força (perícia Usar a Força) como uma ação de movimento em vez de uma ação de rodada completa.',
  },
  'Sentir os Arredores Aprimorado': {
    description: 'Você pode usar a habilidade sentir os arredores (perícia Usar a Força) como uma ação livre em vez de uma ação rápida.',
  },
  'Telepatia Aprimorada': {
    description: 'Sempre que usar a habilidade telepatia (perícia Usar a Força), você pode refazer a jogada do seu teste e manter o melhor resultado.',
  },
};

export const ALL_FORCE_SECRETS = {
  'Poder Devastador': {
    description: 'Quando usar um poder da Força que cause dano, você pode gastar um Ponto da Força para aumentar o dado de dano do poder em 50%. Alternativamente, gaste um Ponto de Destino para dobrar o número de dados de dano.',
  },
  'Poder Distante': {
    description: 'Quando usar um poder da Força com alcance expresso numericamente, você pode gastar um Ponto da Força para multiplicar o alcance por 10. Alternativamente, gaste um Ponto de Destino para aumentar o alcance para qualquer lugar dentro do mesmo sistema estelar. Esse segredo não remove a necessidade de linha de visão.',
  },
  'Poder Multi-Alvos': {
    description: 'Quando usar um poder da Força que afete um único alvo, você pode gastar um Ponto da Força para afetar um alvo adicional. Alternativamente, gaste um Ponto de Destino para afetar um alvo por cada quatro níveis de personagem.',
  },
  'Poder Acelerado': {
    description: 'Quando usar um poder da Força que requeira uma ação padrão ou de movimento para ativar, você pode gastar um Ponto da Força para ativá-lo como uma ação rápida. Alternativamente, gaste um Ponto de Destino para ativá-lo como uma reação.',
  },
  'Poder Modificado': {
    description: 'Quando usar um poder da Força com efeito de área em cone (como o Golpe da Força), você pode gastar um Ponto da Força para afetar uma linha de 1 quadrado de largura e (5 × o comprimento do cone) quadrados de comprimento. Alternativamente, gaste um Ponto de Destino para afetar um ou mais alvos à sua escolha que estejam dentro do número de quadrados ao seu redor igual ao comprimento do cone.',
  },
};
