'use strict';

const SPECIES_KELDOR = {
  name: 'Kel Dor',
  abilityAdj: { dex: 2, wis: 2, con: -2 },
  speed: '6 sq',
  autoLangs: ['Básico', 'Kel Dor'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Kel dor não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Senso Apurado da Força', desc: 'Pode refazer um teste de Usar a Força ao sondar sentimentos ou sentir a Força, ficando com o melhor resultado.' },
    { name: 'Visão na Penumbra', desc: 'Ignora camuflagem (mas não camuflagem total) pela escuridão.' },
    { name: 'Equipamento Especial', desc: 'Sem óculos protetores: considerado cego. Sem máscara respiratória: começa a sufocar. Reposição da máscara: 2.000 cr (500 em Dorin); filtros anuais: 200 cr (50 em Dorin). Personagens kel dor iniciam com esses itens sem custo. A máscara é tóxica para outras espécies.' },
  ]
};
