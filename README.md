# Star Wars Saga Edition — Ficha de Personagem Automática

Ficha de personagem digital para o sistema **Star Wars Saga Edition** (SWSE). Funciona direto no navegador, **mesmo sem internet**, e pode ser **instalada no seu dispositivo** como um aplicativo.

## Funcionalidades

- **Classes heroicas com multiclasse** — Jedi, Nobre, Malandro, Batedor e Soldado, com progressão por nível. Cada nível pode avançar em uma classe já adquirida ou adicionar uma nova. O botão **Desfazer Nível** retrocede o último nível ganho (PV e escolhas) caso a classe escolhida tenha sido errada.
- **Classes de prestígio** — 12 classes avançadas disponíveis: Ás da Pilotagem, Caçador de Recompensas, Senhor do Crime, Soldado de Elite, Adepto da Força, Discípulo da Força, Pistoleiro, Cavaleiro Jedi, Mestre Jedi, Oficial, Aprendiz Sith e Lorde Sith.
- **Progressão por XP** — o campo de Experiência controla a subida de nível: só é possível subir quando o XP total atinge o limite necessário. A ficha mostra o quanto falta para o próximo nível e avisa quando o nível concede **Aptidão** e/ou **Aumento de Habilidade**.
- **Aptidões com descrição e pré-requisitos** — cada aptidão mostra o que concede e o que exige; as que você não atende ficam **bloqueadas**, evitando escolhas inválidas. As aptidões são separadas em **Aptidões** (bônus de classe) e **Aptidões Extras** (iniciais de classe, concedidas pela espécie e ganhas ao subir de nível).
- **Árvores de Talentos** — escolha visual das árvores de cada classe, com pré-requisitos conferidos automaticamente e talentos que podem ser escolhidos mais de uma vez (respeitando o limite quando há).
- **Talentos da Força** — uma seção própria que aparece para personagens Sensitivos à Força, com as quatro árvores de Talentos da Força (Alterar, Controlar, Lado Negro e Sentidos).
- **Poderes da Força** — aprendidos pela aptidão Treinamento na Força, com a quantidade de poderes calculada automaticamente e a descrição completa de cada poder.
- **Espécies** — 23 espécies com ajustes de atributo, deslocamento, idiomas e características próprias. Algumas concedem aptidões automaticamente, outras de forma condicional (conforme as perícias treinadas) ou por escolha (como a aptidão extra do Humano).
- **Descrições no toque do mouse** — passe o mouse sobre qualquer talento, aptidão ou poder para ver a descrição completa; clique para fixar a descrição na tela.
- **HP, Defesas e Perícias automáticas** — tudo calculado conforme as regras enquanto você preenche.
- **Pontuação do Lado Sombrio** — trilha clicável de 25 pontos.
- **Descrição física e História** — campos para detalhar a aparência do personagem, retrato e um espaço dedicado para escrever a história de origem.
- **Pontos da Força e de Destino** — campos próprios na ficha principal.
- **Salvamento automático** — a ficha guarda tudo sozinha enquanto você edita, e oferece **Exportar / Importar** para backup ou para transferir entre dispositivos.
- **Funciona offline e instalável** — depois de aberta uma vez, a ficha funciona sem internet e pode ser instalada como aplicativo.
- **Tema "Datapad Imperial"** — visual escuro inspirado nos painéis do Império.

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
| Limite de dano | `Defesa de Fortitude + mod. tamanho` (Pequeno/Médio = Fortitude; aptidão Limite de Dano Aprimorado +5) |
| HP inicial | `máximo do dado da classe + mod. CON` |
| HP por nível | `rolagem do dado + mod. CON (mínimo 1)` |
| BAB (multiclasse) | soma do BAB de cada classe no seu nível de classe |
| Bônus de dano | `½ nível de personagem` (arredondado para baixo) |
| Bônus de defesa (multiclasse) | melhor bônus por defesa entre todas as classes |

## Salvamento

Os dados são salvos automaticamente no `localStorage` do navegador sob a chave `swse-character-sheet`. Para transferir entre navegadores ou fazer backup, use os botões **Exportar** / **Importar** no topo da página.

## Referências

- [Wiki SWSE — Multiclasse](https://swse.fandom.com/wiki/Multiclassing)
- [Wiki SWSE — Benefícios por Nível](https://swse.fandom.com/wiki/Level_Benefits)
- [Wiki SWSE — Bônus de Classe](https://swse.fandom.com/wiki/Class_Bonuses)

---

*Projeto não oficial. Star Wars é propriedade da Lucasfilm Ltd. / Disney. Star Wars Saga Edition é publicado pela Wizards of the Coast. Este projeto não tem fins lucrativos.*
