'use strict';

const SPECIES_ITHORIANO = {
  name: 'Ithoriano',
  abilityAdj: { wis: 2, cha: 2, dex: -2 },
  speed: '6 sq',
  autoLangs: ['Básico', 'Ithorês'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Ithorianos não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Vontade de Ferro', desc: '+2 de bônus de espécie à Defesa de Vontade.' },
    { name: 'Urrar', desc: 'Ação padrão: emite urro subsônico em cone de 6 quadrados. Ataque especial (1d20 + nível) vs. Fortitude de todos no cone; sucesso = 3d6 dano sônico, falha = metade. Cada uso move o ithoriano 1 passo no marcador de condição. Dados extras (d6) adicionais custam +1 passo cada.' },
    { name: 'Instinto de Sobrevivência', desc: 'Pode refazer qualquer teste de Sobrevivência (segundo resultado é definitivo).' },
    { name: 'Aptidão Extra Condicional', desc: 'Um ithoriano com Conhecimentos (Ciências Biológicas) como perícia treinada recebe Foco em Perícia (Conhecimentos [Ciências Biológicas]) como aptidão bônus.' },
  ],
  conditionalFeats: [{ feat: 'Foco em Perícia (Conhecimentos [Ciências Biológicas])', requiresAnyKnowledge: true, condText: 'Conhecimentos (Ciências Biológicas) treinado' }],
};
