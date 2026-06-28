'use strict';

const SPECIES_GAMORREANO = {
  name: 'Gamorreano',
  abilityAdj: { str: 2, dex: -2, int: -2 },
  speed: '6 sq',
  autoLangs: ['Básico (entendem, não falam)', 'Gamorreano (apenas falado)'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Gamorreanos não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Primitivos', desc: 'Não recebe a aptidão Proficiência com Armas (pistolas, rifles ou armas pesadas) como aptidão inicial no 1º nível, mesmo se a classe lhes garantir.' },
    { name: 'Grande Fortitude', desc: '+2 de bônus de espécie à Defesa de Fortitude.' },
    { name: 'Aptidão Extra', desc: 'A espécie recebe Limite de Dano Aprimorado como aptidão bônus.' },
  ],
  autoFeats: ['Limite de Dano Aprimorado'],
};
