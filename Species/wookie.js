'use strict';

const SPECIES_WOOKIE = {
  name: 'Wookie',
  abilityAdj: { str: 4, con: 2, dex: -2, wis: -2, cha: -2 },
  speed: '6 sq',
  autoLangs: ['Básico (entendem, não falam)', 'Shyriiwook'],
  traits: [
    { name: 'Estatura Mediana', desc: 'Wookies não recebem quaisquer bônus ou penalidades por seu tamanho.' },
    { name: 'Recuperação Extraordinária', desc: 'Recupera pontos de vida no dobro da velocidade normal.' },
    { name: 'Fúria Nata', desc: 'Uma vez por dia como ação rápida: entra em fúria por 5 + mod. CON rodadas. Em fúria: +2 em ataques/dano corpo-a-corpo, mas não pode usar Mecânica, Furtividade ou Usar a Força. Ao fim, cai 1 passo persistente no marcador de condição (recuperação: mínimo 10 minutos de descanso).' },
    { name: 'Familiaridade com Armas', desc: 'Com Proficiência com Armas (Rifles), também é proficiente com besta de energia.' },
    { name: 'Perícias', desc: 'Pode escolher 10 em testes de Escalar mesmo distraído ou sob ameaça. Pode refazer qualquer teste de Persuasão para intimidar (segundo resultado é definitivo).' },
  ]
};
