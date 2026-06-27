# Star Wars Saga Edition — Ficha de Personagem Automática

Ficha de personagem digital para o sistema **Star Wars Saga Edition** (SWSE), construída como uma aplicação web estática — sem servidor, sem dependências, sem build. Basta abrir o `index.html` no navegador.

## Funcionalidades

- **Classes com multiclasse** — 5 classes heroicas (Jedi, Nobre, Malandro, Batedor, Soldado) com progressão por nível. Suporte completo a multiclasse: cada nível pode avançar em qualquer classe já adquirida ou adicionar uma nova. Botão **Desfazer Nível** retrocede o último nível ganho (PV e escolhas) caso a classe escolhida tenha sido errada.
- **Progressão por XP** — o campo de Experiência (na ficha principal) controla a subida de nível: só é possível ganhar um nível quando o XP total atinge o limite da Tabela 3-1. A ficha mostra o XP que falta para o próximo nível e indica quando o nível atual concede **Aptidão** e/ou **Aumento de Habilidade**.
- **Aptidões por nível** — nos níveis 1, 3, 6, 9, 12, 15 e 18 (Tabela 3-1) a ficha abre um slot para escolher uma aptidão no mesmo estilo das aptidões bônus de classe, porém da lista completa (não limitada à lista da classe).
- **HP automático** — nível 1 usa o máximo do dado da classe; nos demais, o usuário digita o resultado da rolagem e o modificador de CON é aplicado automaticamente (mínimo 1).
- **Defesas auto-calculadas** — Fortitude, Reflexo e Vontade calculados com `10 + nível heróico + melhor bônus de classe + modificador de atributo + misc`.
- **Árvores de Talentos** — modal interativo com as 4 árvores de cada classe, pré-requisitos verificados automaticamente, seleção com um clique.
- **Aptidões Bônus** — seleção das aptidões bônus de classe em cada nível par.
- **Sistema de Espécies** — 17 espécies com ajustes de atributo, deslocamento, idiomas automáticos e painel de características.
- **Perícias** — cálculo automático de `½ nível + mod. atributo + misc + 5 (treinado) + 5 (foco)`.
- **Pontuação do Lado Sombrio** — trilha clicável de 25 pips.
- **Retrato** — carregamento de imagem local salvo em base64.
- **Auto-save** — salva automaticamente no `localStorage` com debounce de 600 ms.
- **Export / Import JSON** — exporta e importa a ficha completa em JSON.
- **Tema "Datapad Imperial"** — fundo escuro estático em gradiente, fontes Orbitron + Share Tech Mono + Exo 2.

## Como usar

Clone o repositório e abra o arquivo diretamente no navegador:

```bash
git clone https://github.com/SpositoDouglas/SWSE_Auto_sheet.git
cd SWSE_Auto_sheet

```

## Estrutura do projeto

```
index.html          # Estrutura da ficha
css/
  styles.css        # Tema e layout
js/
  script.js         # Toda a lógica: cálculos, save/restore, UI
Classes/
  jedi.js           # Dados da classe Jedi (atributos, talentos, árvores)
  noble.js          # Dados da classe Nobre
  scoundrel.js      # Dados da classe Malandro
  scout.js          # Dados da classe Batedor
  soldier.js        # Dados da classe Soldado
  index.js          # Agrega todas as classes em ALL_CLASSES
```

## Regras do jogo implementadas

| Cálculo | Fórmula |
|---|---|
| Modificador de atributo | `⌊(score − 10) / 2⌋` |
| Total de perícia | `½ nível + mod. atributo + misc + 5 (treinado) + 5 (foco)` |
| Defesas | `10 + nível heróico + bônus de classe + mod. atributo + misc` |
| HP inicial | `máximo do dado da classe + mod. CON` |
| HP por nível | `rolagem do dado + mod. CON (mínimo 1)` |
| BAB (multiclasse) | maior BAB entre todas as classes |
| Bônus de defesa (multiclasse) | melhor bônus por defesa entre todas as classes |

## Salvamento

Os dados são salvos automaticamente no `localStorage` do navegador sob a chave `swse-character-sheet`. Para transferir entre navegadores ou fazer backup, use os botões **Exportar** / **Importar** no topo da página.

## Referências

- [Wiki SWSE — Multiclasse](https://swse.fandom.com/wiki/Multiclassing)
- [Wiki SWSE — Benefícios por Nível](https://swse.fandom.com/wiki/Level_Benefits)
- [Wiki SWSE — Bônus de Classe](https://swse.fandom.com/wiki/Class_Bonuses)

---

*Projeto não oficial. Star Wars é propriedade da Lucasfilm Ltd. / Disney. Star Wars Saga Edition é publicado pela Wizards of the Coast. Este projeto não tem fins lucrativos.*
