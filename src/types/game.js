// src/types/game.js
// Define apenas tipos JSDoc (IntelliSense). Não exporta código executável.
// Os typedefs refletem a ESTRUTURA REAL dos dados do projeto.

// ─── CLASSES ─────────────────────────────────────────────────────────────────

/**
 * Bônus fixos de defesa concedidos pela classe.
 * @typedef {Object} ClassDefenseBonus
 * @property {number} fort - Bônus de Fortitude
 * @property {number} ref  - Bônus de Reflexo
 * @property {number} will - Bônus de Vontade
 */

/**
 * Um talento dentro de uma árvore de talentos.
 * @typedef {Object} Talent
 * @property {string}   id            - ID único do talento
 * @property {string}   name          - Nome do talento (português)
 * @property {string}   description   - Descrição do efeito
 * @property {string[]} prerequisites - IDs de talentos pré-requisito (da mesma classe)
 * @property {string}   [requiresFeat] - Aptidão exigida (ex.: 'Foco em Arma (sabres-de-luz)'); várias separadas por '; '
 * @property {string}   [requiresTalent] - Talento exigido por NOME (ex.: 'Defesa com Sabre-de-Luz'); vários separados por '; '
 * @property {string}   [requiresTrainedSkill] - ID de perícia que precisa estar treinada (ex.: 'initiative')
 * @property {number}   [requiresBab]  - BAB mínimo exigido
 * @property {boolean}  [multiSelect]  - Pode ser escolhido mais de uma vez
 * @property {number}   [maxSelect]    - Limite de escolhas (quando repetível)
 */

/**
 * Uma árvore de talentos da classe.
 * @typedef {Object} TalentTree
 * @property {string}   key         - Chave única da árvore
 * @property {string}   name        - Nome da árvore
 * @property {string}   description - Descrição/tema da árvore
 * @property {Talent[]} talents     - Talentos da árvore
 */

/**
 * Pré-requisitos de entrada de uma classe de prestígio.
 * @typedef {Object} ClassPrereqs
 * @property {number}   [minLevel]      - Nível de personagem mínimo
 * @property {string[]} [trainedSkills] - IDs de perícias que precisam estar treinadas
 * @property {string[]} [feats]         - Aptidões exigidas
 * @property {number}   [bab]           - BAB mínimo
 * @property {string[]} [talents]       - Talentos exigidos
 * @property {string}   [notes]         - Observações adicionais
 */

/**
 * Dados completos de uma classe (base ou de prestígio).
 * @typedef {Object} ClassData
 * @property {string}                       key               - Chave única (ex.: 'jedi')
 * @property {string}                       name              - Nome da classe (português)
 * @property {boolean}                      [prestige]        - É classe de prestígio
 * @property {ClassPrereqs}                 [prereqs]         - Pré-requisitos de entrada (prestígio)
 * @property {string}                       [description]     - Descrição da classe
 * @property {number}                       hitDie            - Dado de vida (ex.: 10 para d10)
 * @property {number}                       [startingHP]      - HP inicial no nível 1
 * @property {number}                       [trainedSkillsBase] - Perícias treinadas iniciais (+ mod INT)
 * @property {ClassDefenseBonus}            defenseBonus      - Bônus fixos de defesa da classe
 * @property {number[]}                     baseAttack        - Progressão do BAB por nível (índice 0 = nível 1)
 * @property {string[]}                     [classSkills]     - IDs das perícias de classe
 * @property {string[]}                     [startingFeats]   - Aptidões iniciais concedidas
 * @property {Object.<string, string>}      [startingFeatsNotes] - Notas sobre aptidões iniciais condicionais
 * @property {Object.<string, string[]>}    levelFeatures     - Benefícios por nível de classe (ex.: { '1': ['talent', ...] })
 * @property {string[]}                     [bonusFeatList]   - Aptidões disponíveis como bônus
 * @property {TalentTree[]}                 talentTrees       - Árvores de talentos da classe
 */

// ─── ESPÉCIES ────────────────────────────────────────────────────────────────

/**
 * Ajustes de atributo da espécie (apenas os atributos alterados).
 * @typedef {Object} AbilityAdj
 * @property {number} [str]
 * @property {number} [dex]
 * @property {number} [con]
 * @property {number} [int]
 * @property {number} [wis]
 * @property {number} [cha]
 */

/**
 * Uma característica racial (texto descritivo).
 * @typedef {Object} SpeciesTrait
 * @property {string} name - Nome da característica
 * @property {string} desc - Descrição
 */

/**
 * Aptidão condicional concedida pela espécie quando uma condição é atendida.
 * @typedef {Object} ConditionalFeat
 * @property {string}  feat                  - Nome da aptidão concedida
 * @property {string}  [requiresTrained]     - ID de perícia que precisa estar treinada
 * @property {boolean} [requiresAnyKnowledge] - Exige qualquer Conhecimento treinado
 * @property {string}  [condText]            - Texto da condição (exibição)
 */

/**
 * Dados completos de uma espécie.
 * @typedef {Object} SpeciesData
 * @property {string}            name              - Nome da espécie (português)
 * @property {AbilityAdj}        abilityAdj        - Ajustes de atributo
 * @property {string}            speed             - Deslocamento (ex.: '6 sq')
 * @property {string[]}          autoLangs         - Idiomas automáticos
 * @property {SpeciesTrait[]}    traits            - Características raciais
 * @property {string[]}          [autoFeats]       - Aptidões concedidas automaticamente
 * @property {{name: string}[]}  [choiceFeats]     - Slots de aptidão de escolha livre (ex.: Humano)
 * @property {ConditionalFeat[]} [conditionalFeats] - Aptidões condicionais de espécie
 */

export {}; // trata o arquivo como módulo ES
