'use strict';

import { ALL_CLASSES, XP_THRESHOLDS, LEVEL_BENEFITS, MULTICLASS_EXCLUDED } from '../Classes/index.js';
import { SPECIES_DATA } from '../Species/index.js';
import { ALL_FEATS } from '../Feats/index.js';
import { ALL_FORCE_POWERS } from '../ForcePowers/index.js';
import { ALL_FORCE_TALENTS } from '../ForceTalents/index.js';
import { calcMod, calcDefense, calcSkill, calcHpPerLevel, calcHpLevel1, calcMulticlassBAB, conditionEffect } from '../src/logic/calculations.js';

// ============================================================
//  STAR WARS SAGA EDITION — FICHA ONLINE
// ============================================================

const LS_KEY = 'swse-character-sheet';

// ── Tooltip global (hover + pin ao clicar) ────────────────────────────────────

function escTooltip(text) {
  return (text || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

(function initTooltip() {
  const tip = document.createElement('div');
  tip.id = 'sw-tooltip';
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  let pinned = false;
  let pinnedEl = null;

  function show(text, x, y) {
    tip.textContent = text;
    tip.classList.add('visible');
    positionTip(x, y);
  }

  function hide() {
    tip.classList.remove('visible');
    tip.classList.remove('pinned');
    pinned = false;
    pinnedEl = null;
  }

  function positionTip(x, y) {
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    tip.style.left = '0';
    tip.style.top  = '0';
    const tw = tip.offsetWidth  || 260;
    const th = tip.offsetHeight || 60;
    let lx = x + margin;
    let ly = y + margin;
    if (lx + tw > vw - 8) lx = x - tw - margin;
    if (ly + th > vh - 8) ly = y - th - margin;
    tip.style.left = Math.max(8, lx) + 'px';
    tip.style.top  = Math.max(8, ly) + 'px';
  }

  document.addEventListener('mouseover', e => {
    if (pinned) return;
    const el = e.target.closest('.has-tooltip');
    if (!el) { tip.classList.remove('visible'); return; }
    const text = el.dataset.tooltip;
    if (!text) return;
    show(text, e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', e => {
    if (!tip.classList.contains('visible') || pinned) return;
    positionTip(e.clientX, e.clientY);
  });

  document.addEventListener('mouseout', e => {
    if (pinned) return;
    const el = e.target.closest('.has-tooltip');
    if (el) tip.classList.remove('visible');
  });

  document.addEventListener('click', e => {
    const el = e.target.closest('.has-tooltip');
    if (!el) {
      if (pinned) hide();
      return;
    }
    // Clique no botão de remover não deve pinnar
    if (e.target.closest('.at-remove-btn')) return;
    const text = el.dataset.tooltip;
    if (!text) return;
    if (pinned && pinnedEl === el) {
      hide();
    } else {
      pinned = true;
      pinnedEl = el;
      show(text, e.clientX, e.clientY);
      tip.classList.add('pinned');
    }
    e.stopPropagation();
  });
})();

// ============================================================
//  SKILLS DEFINITION
//  trainedOnly: ^ cannot be used untrained
//  armorPenalty: * armor check penalty applies
//  custom: user fills in the name (Knowledge skills)
//  marker: ► shown on original sheet
// ============================================================
const SKILLS = [
  { id: 'acrobatics',   name: 'Acrobacia',           ability: 'dex', armorPenalty: true,  trainedOnly: false },
  { id: 'know1',        name: 'Conhecimento',        ability: 'int', armorPenalty: false, trainedOnly: true,  custom: true },
  { id: 'know2',        name: 'Conhecimento',        ability: 'int', armorPenalty: false, trainedOnly: true,  custom: true },
  { id: 'know3',        name: 'Conhecimento',        ability: 'int', armorPenalty: false, trainedOnly: true,  custom: true },
  { id: 'know4',        name: 'Conhecimento',        ability: 'int', armorPenalty: false, trainedOnly: true,  custom: true },
  { id: 'deception',    name: 'Dissimulação',        ability: 'cha', armorPenalty: false, trainedOnly: false },
  { id: 'climb',        name: 'Escalar',             ability: 'str', armorPenalty: true,  trainedOnly: false },
  { id: 'stealth',      name: 'Furtividade',         ability: 'dex', armorPenalty: true,  trainedOnly: false },
  { id: 'initiative',   name: 'Iniciativa',          ability: 'dex', armorPenalty: true,  trainedOnly: false, marker: true },
  { id: 'mechanics',    name: 'Mecânica',            ability: 'int', armorPenalty: false, trainedOnly: true  },
  { id: 'ride',         name: 'Montar',              ability: 'dex', armorPenalty: true,  trainedOnly: false },
  { id: 'swim',         name: 'Nadar',               ability: 'str', armorPenalty: true,  trainedOnly: false },
  { id: 'gatherInfo',   name: 'Obter Informações',   ability: 'cha', armorPenalty: false, trainedOnly: false },
  { id: 'perception',   name: 'Percepção',           ability: 'wis', armorPenalty: false, trainedOnly: false, marker: true },
  { id: 'persuasion',   name: 'Persuasão',           ability: 'cha', armorPenalty: false, trainedOnly: false },
  { id: 'pilot',        name: 'Pilotar',             ability: 'dex', armorPenalty: false, trainedOnly: false },
  { id: 'jump',         name: 'Saltar',              ability: 'str', armorPenalty: true,  trainedOnly: false },
  { id: 'survival',     name: 'Sobrevivência',       ability: 'wis', armorPenalty: false, trainedOnly: false },
  { id: 'endurance',    name: 'Tolerância',          ability: 'con', armorPenalty: true,  trainedOnly: false },
  { id: 'treatInjury',  name: 'Tratar Ferimentos',   ability: 'wis', armorPenalty: false, trainedOnly: false },
  { id: 'useTheForce',  name: 'Usar a Força',        ability: 'cha', armorPenalty: false, trainedOnly: true  },
  { id: 'useComputer',  name: 'Usar Computador',     ability: 'int', armorPenalty: false, trainedOnly: false },
];

let activeSpeciesKey      = null;
let activeSpeciesAutoLangCount = 0;

// classLevels: [{classKey:'jedi', level:5}, {classKey:'noble', level:3}]
// hpByLevel:   [{classKey:'jedi', classLv:1, roll:10, total:13}, ...] index = charLevel-1
// acquiredTalents: [{classKey, treeKey, talentId, charLevel}, ...]
let classLevels      = [];
let hpByLevel        = [];
let acquiredTalents  = [];
// acquiredForcePowers: ['Mover Objeto', 'Impulso', ...] — pode repetir (cada repetição = uso extra)
let acquiredForcePowers = [];
let pendingLevelUp   = null; // {classKey, charLevel, isNew} while waiting HP roll

const EXTRA_SKILLS_COUNT = 4;
const WEAPONS_COUNT      = 5;
const EQUIPMENT_ROWS     = 14;
const LANGUAGES_COUNT    = 8;
const TALENTS_COUNT      = 16;
const ADD_FEATS_COUNT    = 16;

// ============================================================
//  UTILITY
// ============================================================

function abilityMod(score) {
  const s = parseInt(score, 10);
  if (isNaN(s)) return null;
  return calcMod(s);
}

function fmtMod(mod) {
  if (mod === null) return '—';
  return mod >= 0 ? '+' + mod : String(mod);
}

function getVal(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  if (el.type === 'checkbox') return el.checked;
  return el.value;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.type === 'checkbox') { el.checked = !!val; return; }
  el.value = val !== undefined && val !== null ? val : '';
}

function numVal(id, fallback = 0) {
  const v = parseInt(getVal(id), 10);
  return isNaN(v) ? fallback : v;
}

// ============================================================
//  DOM BUILDERS
// ============================================================

function buildWeapons() {
  const container = document.getElementById('weapons-container');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < WEAPONS_COUNT; i++) {
    const block = document.createElement('div');
    block.className = 'weapon-block';

    const cols = [
      { label: 'ARMA',      key: `wpn${i}-name`,   type: 'text',   cls: '' },
      { label: 'ATQ',       key: `wpn${i}-atk`,    type: 'number', cls: '' },
      { label: 'DANO',      key: `wpn${i}-dmg`,    type: 'text',   cls: '' },
      { label: 'CRÍTICO',   key: `wpn${i}-crit`,   type: 'text',   cls: '' },
      { label: 'ROF',       key: `wpn${i}-rof`,    type: 'text',   cls: '' },
      { label: 'TIPO',      key: `wpn${i}-type`,   type: 'text',   cls: '' },
    ];

    const row1 = document.createElement('div');
    row1.className = 'weapon-row1';

    cols.forEach(col => {
      const wrap = document.createElement('div');
      wrap.className = 'field-group';

      const lbl = document.createElement('label');
      lbl.className = 'field-label';
      lbl.textContent = col.label;

      const inp = document.createElement('input');
      inp.className = 'field-input';
      inp.type = col.type;
      inp.id = col.key;
      inp.dataset.key = col.key;
      inp.autocomplete = 'off';

      wrap.appendChild(lbl);
      wrap.appendChild(inp);
      row1.appendChild(wrap);
    });

    const notesRow = document.createElement('div');
    notesRow.className = 'weapon-notes-row';

    const notesLbl = document.createElement('span');
    notesLbl.className = 'weapon-notes-label';
    notesLbl.textContent = 'NOTAS:';

    const notesInp = document.createElement('input');
    notesInp.className = 'weapon-notes-input';
    notesInp.type = 'text';
    notesInp.id = `wpn${i}-notes`;
    notesInp.dataset.key = `wpn${i}-notes`;
    notesInp.autocomplete = 'off';

    notesRow.appendChild(notesLbl);
    notesRow.appendChild(notesInp);

    block.appendChild(row1);
    block.appendChild(notesRow);
    container.appendChild(block);
  }
}

function buildSkillRow(skill, container) {
  const row = document.createElement('div');
  row.className = 'skill-row';
  row.id = `skill-row-${skill.id}`;

  // Trained checkbox
  const trainedWrap = document.createElement('div');
  trainedWrap.className = 'skill-trained-cb';
  const trainedCb = document.createElement('input');
  trainedCb.type = 'checkbox';
  trainedCb.id = `sk-trained-${skill.id}`;
  trainedCb.dataset.key = `sk-trained-${skill.id}`;
  trainedWrap.appendChild(trainedCb);

  // Name cell
  const nameCell = document.createElement('div');
  nameCell.className = 'skill-name-cell';

  if (skill.custom) {
    const customInp = document.createElement('input');
    customInp.className = 'skill-custom-input';
    customInp.type = 'text';
    customInp.placeholder = skill.name + ' (...)';
    customInp.id = `sk-customname-${skill.id}`;
    customInp.dataset.key = `sk-customname-${skill.id}`;
    customInp.autocomplete = 'off';
    nameCell.appendChild(customInp);
  } else {
    const nameSpan = document.createElement('span');
    nameSpan.className = 'skill-name';
    if (skill.marker) {
      const mSpan = document.createElement('span');
      mSpan.className = 'skill-marker';
      mSpan.textContent = '▶ ';
      nameCell.appendChild(mSpan);
    }
    nameSpan.textContent = skill.name;
    nameCell.appendChild(nameSpan);
  }

  const badge = document.createElement('span');
  badge.className = 'skill-ability-badge';
  badge.textContent = skill.ability.toUpperCase();
  nameCell.appendChild(badge);

  let flags = '';
  if (skill.trainedOnly) flags += '^';
  if (skill.armorPenalty) flags += '*';
  if (flags) {
    const flagSpan = document.createElement('span');
    flagSpan.className = 'skill-flags';
    flagSpan.textContent = flags;
    nameCell.appendChild(flagSpan);
  }

  // Total (auto-calculated)
  const totalDiv = document.createElement('div');
  totalDiv.className = 'skill-total';
  totalDiv.id = `sk-total-${skill.id}`;
  totalDiv.textContent = '—';

  // Half level (auto)
  const halfDiv = document.createElement('div');
  halfDiv.className = 'skill-total';
  halfDiv.style.fontSize = '10px';
  halfDiv.style.color = 'var(--text-dim)';
  halfDiv.id = `sk-half-${skill.id}`;
  halfDiv.textContent = '—';

  // Ability mod (auto)
  const abilDiv = document.createElement('div');
  abilDiv.className = 'skill-total';
  abilDiv.style.fontSize = '10px';
  abilDiv.style.color = 'var(--text-dim)';
  abilDiv.id = `sk-ability-${skill.id}`;
  abilDiv.textContent = '—';

  // Misc input
  const miscInp = document.createElement('input');
  miscInp.className = 'skill-num-input';
  miscInp.type = 'number';
  miscInp.id = `sk-misc-${skill.id}`;
  miscInp.dataset.key = `sk-misc-${skill.id}`;
  miscInp.autocomplete = 'off';

  // Focus checkbox
  const focusWrap = document.createElement('div');
  focusWrap.className = 'skill-focus-cb';
  const focusCb = document.createElement('input');
  focusCb.type = 'checkbox';
  focusCb.id = `sk-focus-${skill.id}`;
  focusCb.dataset.key = `sk-focus-${skill.id}`;
  focusWrap.appendChild(focusCb);

  row.appendChild(trainedWrap);
  row.appendChild(nameCell);
  row.appendChild(totalDiv);
  row.appendChild(halfDiv);
  row.appendChild(abilDiv);
  row.appendChild(miscInp);
  row.appendChild(focusWrap);

  container.appendChild(row);
}

function buildSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;
  SKILLS.forEach(s => buildSkillRow(s, container));

  // Extra skills
  const extraContainer = document.getElementById('extra-skills-container');
  if (!extraContainer) return;
  for (let i = 0; i < EXTRA_SKILLS_COUNT; i++) {
    const skill = {
      id: `extra${i}`,
      name: '',
      ability: 'str',
      armorPenalty: false,
      trainedOnly: false,
      custom: true,
    };
    buildSkillRow(skill, extraContainer);
  }
}

function buildDarkSideTrack() {
  const track = document.getElementById('dark-side-track');
  if (!track) return;
  for (let i = 1; i <= 25; i++) {
    const pip = document.createElement('div');
    pip.className = 'ds-pip';
    pip.textContent = i;
    pip.dataset.score = i;
    pip.addEventListener('click', () => toggleDarkSide(i));
    track.appendChild(pip);
  }
}

function toggleDarkSide(score) {
  const pips = document.querySelectorAll('.ds-pip');
  const currentFilled = [...pips].filter(p => p.classList.contains('filled')).length;
  const clickedPip = [...pips].find(p => parseInt(p.dataset.score) === score);

  if (clickedPip.classList.contains('filled') && score === currentFilled) {
    clickedPip.classList.remove('filled');
  } else {
    pips.forEach(p => {
      const n = parseInt(p.dataset.score);
      p.classList.toggle('filled', n <= score);
    });
  }

  // Atualiza a árvore do Lado Negro (depende do Valor do Lado Negro)
  buildForceTalentsDisplay();
  saveData();
}

function buildEquipmentTable() {
  const tbody = document.getElementById('equipment-tbody');
  if (!tbody) return;
  for (let i = 0; i < EQUIPMENT_ROWS; i++) {
    const tr = document.createElement('tr');
    const cells = [
      { key: `eq-a-item-${i}`,  type: 'text'   },
      { key: `eq-a-loc-${i}`,   type: 'text'   },
      { key: `eq-a-wt-${i}`,    type: 'number' },
      { key: `eq-b-item-${i}`,  type: 'text'   },
      { key: `eq-b-loc-${i}`,   type: 'text'   },
      { key: `eq-b-wt-${i}`,    type: 'number' },
    ];
    cells.forEach(c => {
      const td = document.createElement('td');
      const inp = document.createElement('input');
      inp.className = 'equip-input';
      inp.type = c.type;
      inp.id = c.key;
      inp.dataset.key = c.key;
      inp.autocomplete = 'off';
      td.appendChild(inp);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
}

function buildSimpleList(containerId, prefix, count, inputClass, placeholder) {
  const c = document.getElementById(containerId);
  if (!c) return;
  for (let i = 0; i < count; i++) {
    const inp = document.createElement('input');
    inp.className = inputClass;
    inp.type = 'text';
    inp.id = `${prefix}-${i}`;
    inp.dataset.key = `${prefix}-${i}`;
    inp.placeholder = placeholder || '';
    inp.autocomplete = 'off';
    c.appendChild(inp);
  }
}

function buildTwoColList(containerId, prefix, count, rowClass, inputClass, srcClass, srcPlaceholder) {
  const c = document.getElementById(containerId);
  if (!c) return;
  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    row.className = rowClass;

    const inp = document.createElement('input');
    inp.className = inputClass;
    inp.type = 'text';
    inp.id = `${prefix}-${i}`;
    inp.dataset.key = `${prefix}-${i}`;
    inp.autocomplete = 'off';

    const src = document.createElement('input');
    src.className = srcClass;
    src.type = 'text';
    src.id = `${prefix}-src-${i}`;
    src.dataset.key = `${prefix}-src-${i}`;
    src.placeholder = srcPlaceholder || '';
    src.autocomplete = 'off';

    row.appendChild(inp);
    row.appendChild(src);
    c.appendChild(row);
  }
}

// ============================================================
//  SPECIES MANAGEMENT
// ============================================================

function updateAutoLanguages(autoLangs) {
  for (let i = 0; i < activeSpeciesAutoLangCount; i++) {
    const el = document.getElementById(`lang-${i}`);
    if (el) el.value = '';
  }
  autoLangs.forEach((lang, i) => {
    const el = document.getElementById(`lang-${i}`);
    if (el) el.value = lang;
  });
  activeSpeciesAutoLangCount = autoLangs.length;
}

function renderSpeciesTraits(speciesData) {
  const panel = document.getElementById('species-traits-panel');
  const body  = document.getElementById('species-traits-body');
  if (!panel || !body) return;

  if (!speciesData) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = '';

  const adjMap   = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };
  const adjEntries = Object.entries(speciesData.abilityAdj || {});
  const adjText  = adjEntries.length === 0
    ? 'Nenhum'
    : adjEntries.map(([ab, v]) => `${v > 0 ? '+' : ''}${v} ${adjMap[ab]}`).join(', ');

  let html = `<div class="species-adj-row">
    <span class="species-adj-label">AJUSTES DE HABILIDADE:</span>
    <span class="species-adj-value">${adjText}</span>
    <span class="species-adj-sep">|</span>
    <span class="species-adj-label">DESLOCAMENTO:</span>
    <span class="species-adj-value">${speciesData.speed}</span>
    <span class="species-adj-sep">|</span>
    <span class="species-adj-label">IDIOMAS AUTOMÁTICOS:</span>
    <span class="species-adj-value">${speciesData.autoLangs.join(', ')}</span>
  </div>
  <div class="species-traits-list">`;

  speciesData.traits.forEach(trait => {
    html += `<div class="species-trait-item">
      <span class="species-trait-name">${trait.name}</span>
      <span class="species-trait-desc">${trait.desc}</span>
    </div>`;
  });

  html += '</div>';
  body.innerHTML = html;
}

function applySpecies(newKey) {
  const oldData = activeSpeciesKey ? SPECIES_DATA[activeSpeciesKey] : null;
  const newData = newKey           ? SPECIES_DATA[newKey]           : null;

  const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  abilities.forEach(ab => {
    const input = document.getElementById(`${ab}-score`);
    if (!input || input.value === '') return;
    const oldAdj = (oldData?.abilityAdj[ab]) || 0;
    const newAdj = (newData?.abilityAdj[ab]) || 0;
    const delta  = newAdj - oldAdj;
    if (delta !== 0) input.value = (parseInt(input.value, 10) || 0) + delta;
  });

  // Limpa a aptidão de escolha de espécie ao trocar de espécie
  acquiredTalents = acquiredTalents.filter(t => t.treeKey !== '__speciesFeat__');

  activeSpeciesKey = newKey || null;

  const speedInput = document.getElementById('speed');
  if (speedInput && newData) speedInput.value = newData.speed;
  else if (speedInput && !newData) speedInput.value = '';

  updateAutoLanguages(newData ? newData.autoLangs : []);
  renderSpeciesTraits(newData);
  recalcAll();
  buildBonusFeatsDisplay();
  scheduleSave();
}

// ============================================================
//  CLASS MANAGEMENT
// ============================================================

function getCharLevel() {
  return hpByLevel.length;
}

function getClassLevel(classKey) {
  const entry = classLevels.find(e => e.classKey === classKey);
  return entry ? entry.level : 0;
}

function getBestDefBonus() {
  const best = { fort: 0, ref: 0, will: 0 };
  classLevels.forEach(e => {
    const cls = ALL_CLASSES[e.classKey];
    if (!cls) return;
    if ((cls.defenseBonus.fort || 0) > best.fort) best.fort = cls.defenseBonus.fort;
    if ((cls.defenseBonus.ref  || 0) > best.ref)  best.ref  = cls.defenseBonus.ref;
    if ((cls.defenseBonus.will || 0) > best.will)  best.will = cls.defenseBonus.will;
  });
  return best;
}

function getCharBAB() {
  // SWSE multiclass: highest BAB among classes at their current level
  const babs = classLevels.map(e => {
    const cls = ALL_CLASSES[e.classKey];
    return cls ? (cls.baseAttack[e.level - 1] || 0) : 0;
  });
  return calcMulticlassBAB(babs);
}

// ── Feat prerequisite helpers ─────────────────────────────────────────────────

function getAbilityScore(ability) {
  const el = document.getElementById(ability + '-score');
  return el ? (parseInt(el.value) || 10) : 10;
}

function isSkillTrained(skillId) {
  const cb = document.getElementById('sk-trained-' + skillId);
  return cb ? cb.checked : false;
}

let _checkingConditionalFeat = false; // guarda de reentrância p/ characterHasFeat
function characterHasFeat(name) {
  const norm = n => n.toLowerCase().replace(/[-\s]+/g, ' ').trim();
  const target = norm(name);
  // Starting feats of all active classes
  for (const entry of classLevels) {
    const cls = ALL_CLASSES[entry.classKey];
    if (cls?.startingFeats?.some(f => norm(f) === target)) return true;
  }
  // Acquired bonus feats (de classe) e aptidões ganhas por nível
  if (acquiredTalents.some(t => (t.treeKey === '__bonusFeat__' || t.treeKey === '__levelFeat__') && norm(t.talentId) === target)) return true;
  // Free-text feat inputs
  const inputs = document.querySelectorAll('[id^="feat-"]');
  for (const inp of inputs) {
    if (norm(inp.value || '') === target) return true;
  }
  // Aptidões automáticas de espécie (sempre concedidas)
  const sp = activeSpeciesKey ? SPECIES_DATA[activeSpeciesKey] : null;
  if (sp && Array.isArray(sp.autoFeats)) {
    if (sp.autoFeats.some(f => norm(f) === target)) return true;
  }
  // Aptidão de escolha de espécie (ex: Humano Aptidão Extra)
  if (acquiredTalents.some(t => t.treeKey === '__speciesFeat__' && norm(t.talentId) === target)) return true;
  // Aptidões condicionais de espécie (concedidas quando a condição é atendida).
  // Guarda contra reentrância: conditionalFeatMet() chama checkFeatPrereqs(),
  // que pode chamar characterHasFeat() de volta.
  if (!_checkingConditionalFeat) {
    if (sp && Array.isArray(sp.conditionalFeats)) {
      _checkingConditionalFeat = true;
      const granted = sp.conditionalFeats.some(cf => norm(cf.feat) === target && conditionalFeatMet(cf));
      _checkingConditionalFeat = false;
      if (granted) return true;
    }
  }
  return false;
}

function checkFeatPrereqs(featName) {
  const feat = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[featName] : null;
  if (!feat || !feat.prereqs) return { locked: false, missing: [] };

  const p = feat.prereqs;
  const missing = [];

  const abilities = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
  for (const [attr, label] of Object.entries(abilities)) {
    if (p[attr] && getAbilityScore(attr) < p[attr]) {
      missing.push(`${label} ${p[attr]}`);
    }
  }

  if (p.bab && getCharBAB() < p.bab) {
    missing.push(`BAB +${p.bab}`);
  }

  if (p.feats) {
    // For OR groups (array means "any one of these suffices"), each item is required unless it's an array
    // Convention: prereqs.feats is an array of strings (all required)
    // Unless an entry is itself an array (meaning OR among those)
    for (const req of p.feats) {
      if (Array.isArray(req)) {
        if (!req.some(r => characterHasFeat(r))) {
          missing.push(req[0]); // show first option name
        }
      } else {
        if (!characterHasFeat(req)) {
          missing.push(req);
        }
      }
    }
  }

  if (p.trainedSkills) {
    const skillNames = {
      acrobatics: 'Acrobacia', pilot: 'Pilotar', treatInjury: 'Tratar Ferimentos',
      endurance: 'Tolerância', useTheForce: 'Usar a Força', mechanics: 'Mecânica',
      perception: 'Percepção', stealth: 'Furtividade', persuasion: 'Persuasão',
    };
    for (const skillId of p.trainedSkills) {
      if (!isSkillTrained(skillId)) {
        missing.push('Treinado em ' + (skillNames[skillId] || skillId));
      }
    }
  }

  return { locked: missing.length > 0, missing };
}

// Nome em português de uma perícia (para mensagens de pré-requisito)
function skillDisplayName(id) {
  const s = (typeof SKILLS !== 'undefined') ? SKILLS.find(sk => sk.id === id) : null;
  return s ? s.name : id;
}

// Verifica os pré-requisitos de uma classe de prestígio.
//  "Duros" (verificáveis, bloqueiam): minLevel, bab, trainedSkills, feats.
//  "Moles" (notes: talentos de certas árvores, condições especiais): apenas
//  exibidos como lembrete — o jogador auto-declara que os cumpre.
function checkClassPrereqs(classKey) {
  const cls = ALL_CLASSES[classKey];
  if (!cls || !cls.prereqs) return { locked: false, missing: [], notes: [] };
  const p = cls.prereqs;
  const missing = [];
  const notes = [];

  if (p.minLevel && getCharLevel() < p.minLevel) missing.push(`Nível ${p.minLevel}º`);
  if (p.bab && getCharBAB() < p.bab) missing.push(`BAB +${p.bab}`);
  if (Array.isArray(p.trainedSkills)) {
    p.trainedSkills.forEach(sid => {
      if (!isSkillTrained(sid)) missing.push('Treinado em ' + skillDisplayName(sid));
    });
  }
  if (Array.isArray(p.feats)) {
    p.feats.forEach(f => {
      if (Array.isArray(f)) {              // OR: basta uma das aptidões
        if (!f.some(o => characterHasFeat(o))) missing.push(f[0]);
      } else if (!characterHasFeat(f)) {
        missing.push(f);
      }
    });
  }
  if (Array.isArray(p.notes)) notes.push(...p.notes);

  return { locked: missing.length > 0, missing, notes };
}

function getClassDisplayName() {
  if (classLevels.length === 0) return '';
  return classLevels.map(e => {
    const cls = ALL_CLASSES[e.classKey];
    return `${cls ? cls.name : e.classKey} ${e.level}`;
  }).join(' / ');
}

// Returns pending talent slots: list of {classKey, classLevel, charLevel} not yet filled
function getPendingTalentSlots() {
  const pending = [];
  hpByLevel.forEach((entry, idx) => {
    const charLv = idx + 1;
    const cls = ALL_CLASSES[entry.classKey];
    if (!cls) return;
    const features = cls.levelFeatures[entry.classLv] || [];
    if (features.includes('talent')) {
      // Conta apenas talentos reais nesse nível (ignora aptidões bônus/nível que
      // compartilham o mesmo charLevel), senão remover o talento não libera o slot.
      const alreadyPicked = acquiredTalents.some(t => t.charLevel === charLv && !isFeatEntry(t));
      if (!alreadyPicked) {
        pending.push({ classKey: entry.classKey, classLv: entry.classLv, charLevel: charLv });
      }
    }
  });
  return pending;
}

function getPendingBonusFeatSlots() {
  const pending = [];
  hpByLevel.forEach((entry, idx) => {
    const charLv = idx + 1;
    const cls = ALL_CLASSES[entry.classKey];
    if (!cls) return;
    const features = cls.levelFeatures[entry.classLv] || [];
    if (features.includes('bonusFeat')) {
      const alreadyPicked = acquiredTalents.some(t => t.charLevel === charLv && t.treeKey === '__bonusFeat__');
      if (!alreadyPicked) {
        pending.push({ classKey: entry.classKey, classLv: entry.classLv, charLevel: charLv });
      }
    }
  });
  return pending;
}

// Aptidões ganhas pelo nível de personagem (Tabela 3-1: níveis 1,3,6,9,12,15,18).
// Não são limitadas à lista de aptidões bônus de classe — um slot por nível.
function getPendingLevelFeatSlots() {
  const pending = [];
  const total = getCharLevel();
  for (let charLv = 1; charLv <= total; charLv++) {
    if (LEVEL_BENEFITS[charLv] && LEVEL_BENEFITS[charLv].feat) {
      const already = acquiredTalents.some(t => t.charLevel === charLv && t.treeKey === '__levelFeat__');
      if (!already) pending.push({ charLevel: charLv });
    }
  }
  return pending;
}

// Entradas de acquiredTalents que representam aptidões (não talentos de árvore)
function isFeatEntry(t) {
  return t.treeKey === '__bonusFeat__' || t.treeKey === '__levelFeat__';
}

// Talento da Força (ocupa o mesmo slot de talento, mas é exibido em painel próprio).
function isForceTalent(t) {
  return t.classKey === '__force__';
}

// Personagem tem a aptidão Sensitivo à Força?
function characterIsForceSensitive() {
  return characterHasFeat('Sensitivo à Força');
}

// Maior Valor do Lado Negro atualmente marcado.
function getDarkSideScore() {
  const filled = [...document.querySelectorAll('.ds-pip.filled')];
  return filled.length ? Math.max(...filled.map(p => parseInt(p.dataset.score, 10) || 0)) : 0;
}

// Condição de uma aptidão condicional de espécie está atendida?
//  - requiresTrained: a perícia precisa estar treinada
//  - requiresAnyKnowledge: qualquer perícia de Conhecimento treinada
//  - pré-requisitos da própria aptidão (Des/BAB/etc.) via checkFeatPrereqs
function conditionalFeatMet(cf) {
  if (cf.requiresTrained && !isSkillTrained(cf.requiresTrained)) return false;
  if (cf.requiresAnyKnowledge) {
    const anyKnow = ['know1','know2','know3','know4'].some(id => isSkillTrained(id));
    if (!anyKnow) return false;
  }
  const { locked } = checkFeatPrereqs(cf.feat);
  return !locked;
}

// Aptidões condicionais da espécie ativa, já com o status (atendida ou não).
function getSpeciesConditionalFeats() {
  const data = activeSpeciesKey ? SPECIES_DATA[activeSpeciesKey] : null;
  if (!data || !Array.isArray(data.conditionalFeats)) return [];
  return data.conditionalFeats.map(cf => {
    const fd = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[cf.feat] : null;
    return {
      feat: cf.feat,
      met: conditionalFeatMet(cf),
      condText: cf.condText || (fd && fd.prereqText !== '—' ? fd.prereqText : '') || '',
      desc: cf.desc || fd?.description || '',
    };
  });
}

// Aptidões iniciais concedidas pelas classes do personagem (automáticas).
// Deduplica por nome, registrando a primeira classe que concede cada uma.
function getStartingFeats() {
  const seen = new Set();
  const list = [];
  classLevels.forEach(e => {
    const cls = ALL_CLASSES[e.classKey];
    if (!cls || !cls.startingFeats) return;
    cls.startingFeats.forEach(f => {
      if (seen.has(f)) return;
      seen.add(f);
      list.push({ name: f, classKey: e.classKey });
    });
  });
  return list;
}

function hasTalent(talentId) {
  return acquiredTalents.some(t => t.talentId === talentId);
}

// Quantas vezes um talento foi escolhido (para talentos repetíveis com limite).
function countTalent(talentId) {
  return acquiredTalents.filter(t => t.talentId === talentId).length;
}

function talentPrereqsMet(talent) {
  if (!talent.prerequisites || talent.prerequisites.length === 0) return true;
  return talent.prerequisites.every(req => hasTalent(req));
}

// ---- UI builders ----

function buildClassSection() {
  const entriesEl = document.getElementById('class-entries');
  const actionsEl = document.getElementById('class-bar-actions');
  if (!entriesEl || !actionsEl) return;

  // Entries
  entriesEl.innerHTML = '';
  classLevels.forEach(e => {
    const cls = ALL_CLASSES[e.classKey];
    const card = document.createElement('div');
    card.className = 'class-card';

    const nameEl = document.createElement('span');
    nameEl.className = 'class-card-name';
    nameEl.textContent = cls ? cls.name.toUpperCase() : e.classKey.toUpperCase();

    const lvEl = document.createElement('span');
    lvEl.className = 'class-card-level';
    lvEl.textContent = `Nv ${e.level}`;

    const plusBtn = document.createElement('button');
    plusBtn.className = 'class-plus-btn';
    plusBtn.dataset.classKey = e.classKey;
    const maxClassLv = cls ? cls.baseAttack.length : 20;
    if (e.level >= maxClassLv) {
      // Classe no nível máximo (relevante para classes de prestígio de 5/10 níveis)
      plusBtn.textContent = '✓';
      plusBtn.disabled = true;
      plusBtn.title = `${cls ? cls.name : e.classKey} já está no nível máximo (${maxClassLv})`;
    } else {
      plusBtn.textContent = '+';
      plusBtn.title = `Subir de nível em ${cls ? cls.name : e.classKey}`;
      plusBtn.addEventListener('click', () => startLevelUp(e.classKey, false));
    }

    card.appendChild(nameEl);
    card.appendChild(lvEl);
    card.appendChild(plusBtn);
    entriesEl.appendChild(card);
  });

  // Actions
  actionsEl.innerHTML = '';
  const takenKeys = classLevels.map(e => e.classKey);
  const available = Object.keys(ALL_CLASSES).filter(k => !takenKeys.includes(k));

  if (classLevels.length === 0) {
    // No class yet — first level
    const btn = document.createElement('button');
    btn.className = 'class-add-btn class-add-btn--first';
    btn.textContent = '⬡ ESCOLHER CLASSE INICIAL';
    btn.addEventListener('click', () => showClassSelector('first'));
    actionsEl.appendChild(btn);
  } else if (available.length > 0 && getCharLevel() < 20) {
    const btn = document.createElement('button');
    btn.className = 'class-add-btn';
    btn.textContent = '+ MULTICLASSE';
    btn.addEventListener('click', () => showClassSelector('multi'));
    actionsEl.appendChild(btn);
  }

  // Desfazer último nível (corrigir subida de nível errada)
  if (getCharLevel() > 0) {
    const undoBtn = document.createElement('button');
    undoBtn.className = 'class-undo-btn';
    undoBtn.textContent = '↩ DESFAZER NÍVEL';
    undoBtn.title = 'Remove o último nível ganho (PV e escolhas desse nível)';
    undoBtn.addEventListener('click', undoLastLevel);
    actionsEl.appendChild(undoBtn);
  }

  // Update auto-fields
  const totalLv = getCharLevel();
  const lvEl = document.getElementById('total-level');
  if (lvEl) lvEl.value = totalLv || 1;

  // BAB
  const babEl = document.getElementById('base-attack');
  if (babEl && babEl.readOnly !== true) {
    const bab = getCharBAB();
    if (bab > 0) babEl.value = bab;
  }

  // Update class traits panel
  renderClassTraits();
  recalcAll();
  scheduleSave();
}

function showClassSelector(mode) {
  const actionsEl = document.getElementById('class-bar-actions');
  if (!actionsEl) return;

  const takenKeys = (mode === 'first') ? [] : classLevels.map(e => e.classKey);
  const allKeys      = Object.keys(ALL_CLASSES).filter(k => !takenKeys.includes(k));
  const baseKeys     = allKeys.filter(k => !ALL_CLASSES[k].prestige);
  const prestigeKeys = allKeys.filter(k =>  ALL_CLASSES[k].prestige);

  actionsEl.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'class-selector-label';
  label.textContent = mode === 'first' ? 'Escolha sua classe:' : 'Nova classe:';
  actionsEl.appendChild(label);

  // Classes base
  baseKeys.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'class-choice-btn';
    btn.textContent = ALL_CLASSES[key].name;
    btn.addEventListener('click', () => startLevelUp(key, mode !== 'first'));
    actionsEl.appendChild(btn);
  });

  // Classes de prestígio — apenas via multiclasse, com pré-requisitos
  if (mode !== 'first' && prestigeKeys.length) {
    const plabel = document.createElement('span');
    plabel.className = 'class-selector-label class-selector-label--prestige';
    plabel.textContent = 'Prestígio:';
    actionsEl.appendChild(plabel);

    prestigeKeys.forEach(key => {
      const cls = ALL_CLASSES[key];
      const { locked, missing, notes } = checkClassPrereqs(key);

      const btn = document.createElement('button');
      btn.className = 'class-choice-btn class-choice-btn--prestige' + (locked ? ' class-choice-btn--locked' : '');
      btn.textContent = cls.name;

      const tip = [];
      if (missing.length) tip.push('Faltando: ' + missing.join(', '));
      if (notes.length)   tip.push('Também exige (confirme): ' + notes.join('; '));
      btn.title = tip.join('\n') || 'Pré-requisitos cumpridos';

      if (locked) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => {
          if (notes.length) {
            showNotification('Lembre-se dos requisitos: ' + notes.join('; '));
          }
          startLevelUp(key, true);
        });
      }
      actionsEl.appendChild(btn);
    });
  }

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'class-choice-btn class-choice-btn--cancel';
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.addEventListener('click', () => buildClassSection());
  actionsEl.appendChild(cancelBtn);
}

function startLevelUp(classKey, isNew) {
  const cls = ALL_CLASSES[classKey];
  if (!cls) return;
  const charLv = getCharLevel() + 1;

  // Gate por XP: só permite ganhar o nível se o XP total comportá-lo (Tabela 3-1)
  const xpAllowed = levelFromXP(numVal('xp-total', 0));
  if (charLv > xpAllowed) {
    const needed = XP_THRESHOLDS[charLv - 1];
    showNotification(`XP insuficiente para o nível ${charLv}º (necessário ${fmtXP(needed)} XP).`, true);
    return;
  }

  const classLv = isNew ? 1 : (getClassLevel(classKey) + 1);

  pendingLevelUp = { classKey, classLv, charLv, isNew };

  const panel = document.getElementById('hp-roll-panel');
  if (!panel) return;

  const conMod = abilityMod(numVal('con-score', 10)) || 0;
  const isFirstCharLevel = (charLv === 1);
  const hitDie = cls.hitDie;

  panel.style.display = '';
  let html = `<div class="hp-roll-inner">`;
  html += `<span class="hp-roll-label">`;

  if (isFirstCharLevel) {
    html += `Nível 1 — ${cls.name} (d${hitDie}): HP inicial = ${cls.startingHP} + mod CON`;
    html += `</span>`;
    html += `<div class="hp-roll-auto">HP = <strong>${cls.startingHP + conMod}</strong> (${cls.startingHP} + ${conMod >= 0 ? '+' : ''}${conMod} CON)</div>`;
    html += `<button class="hp-confirm-btn" id="hp-confirm-btn">Confirmar</button>`;
    html += `<button class="hp-cancel-btn" id="hp-cancel-btn">Cancelar</button>`;
    html += `<input type="hidden" id="hp-roll-input" value="${cls.startingHP}">`;
  } else {
    const label = isNew
      ? `Nova classe — ${cls.name} nível 1 (d${hitDie}): role 1d${hitDie}`
      : `Nível ${charLv} — ${cls.name} (d${hitDie}): role 1d${hitDie}`;
    html += label + `</span>`;
    html += `<div class="hp-roll-row">`;
    html += `<input class="hp-roll-input" id="hp-roll-input" type="number" min="1" max="${hitDie}" placeholder="1–${hitDie}" autocomplete="off">`;
    html += `<span class="hp-roll-plus">+ ${conMod >= 0 ? '+' : ''}${conMod} CON =</span>`;
    html += `<span class="hp-roll-total" id="hp-roll-total">?</span>`;
    html += `</div>`;
    html += `<button class="hp-confirm-btn" id="hp-confirm-btn">Confirmar</button>`;
    html += `<button class="hp-cancel-btn" id="hp-cancel-btn">Cancelar</button>`;
  }

  html += `</div>`;
  panel.innerHTML = html;

  const rollInput = document.getElementById('hp-roll-input');
  const totalEl   = document.getElementById('hp-roll-total');
  if (rollInput && !isFirstCharLevel) {
    rollInput.addEventListener('input', () => {
      // Limita o valor digitado ao intervalo do dado de vida (1 a hitDie).
      if (rollInput.value !== '') {
        let r = parseInt(rollInput.value, 10);
        if (isNaN(r)) {
          rollInput.value = '';
        } else {
          if (r > hitDie) r = hitDie;
          if (r < 1) r = 1;
          if (String(r) !== rollInput.value) rollInput.value = r;
        }
      }
      const r = parseInt(rollInput.value, 10);
      if (!isNaN(r) && totalEl) {
        const t = Math.max(1, r + conMod);
        totalEl.textContent = t;
      } else if (totalEl) {
        totalEl.textContent = '?';
      }
    });
  }

  document.getElementById('hp-confirm-btn')?.addEventListener('click', () => confirmLevelUp());
  document.getElementById('hp-cancel-btn')?.addEventListener('click', () => {
    pendingLevelUp = null;
    panel.style.display = 'none';
    buildClassSection();
  });
}

function confirmLevelUp() {
  if (!pendingLevelUp) return;
  const { classKey, classLv, charLv, isNew } = pendingLevelUp;
  const cls = ALL_CLASSES[classKey];
  if (!cls) return;

  const rollInput = document.getElementById('hp-roll-input');
  const roll = parseInt(rollInput?.value, 10);
  const conMod = abilityMod(numVal('con-score', 10)) || 0;

  let hpGained;
  if (charLv === 1) {
    hpGained = calcHpLevel1(cls.startingHP, conMod);
  } else {
    if (isNaN(roll) || roll < 1 || roll > cls.hitDie) {
      showNotification(`Digite um resultado válido (1–${cls.hitDie})`, true);
      return;
    }
    hpGained = calcHpPerLevel(roll, conMod);
  }

  // Update hpByLevel
  hpByLevel.push({ classKey, classLv, roll: charLv === 1 ? cls.startingHP : roll, total: hpGained });

  // Update classLevels
  if (isNew || classLv === 1) {
    classLevels.push({ classKey, level: 1 });
  } else {
    const entry = classLevels.find(e => e.classKey === classKey);
    if (entry) entry.level = classLv;
  }

  // Update hp-max
  const hpMax = hpByLevel.reduce((s, e) => s + e.total, 0);
  const hpMaxEl = document.getElementById('hp-max');
  if (hpMaxEl) hpMaxEl.value = hpMax;

  pendingLevelUp = null;
  document.getElementById('hp-roll-panel').style.display = 'none';

  buildClassSection();
  buildTalentsDisplay();
  buildBonusFeatsDisplay();

  showNotification(`Nível ${charLv} — ${cls.name}! +${hpGained} PV`);
}

// Retrocede o último nível de personagem (desfaz uma subida de nível errada).
// Remove os PV ganhos, ajusta o nível de classe e apaga as escolhas (talento/
// aptidões) feitas naquele nível.
function undoLastLevel() {
  if (hpByLevel.length === 0) {
    showNotification('Não há nível para desfazer.', true);
    return;
  }

  const removedCharLevel = hpByLevel.length;
  const last    = hpByLevel[hpByLevel.length - 1];
  const cls     = ALL_CLASSES[last.classKey];
  const clsName = cls ? cls.name : last.classKey;

  if (!confirm(
    `Desfazer o nível ${removedCharLevel}º (${clsName})?\n` +
    `Isso remove os PV ganhos e as escolhas (talento/aptidões) desse nível.`
  )) return;

  // Remove a entrada de PV deste nível
  hpByLevel.pop();

  // Ajusta o nível de classe (ou remove a classe se cair a 0)
  const entry = classLevels.find(e => e.classKey === last.classKey);
  if (entry) {
    if (last.classLv <= 1) {
      classLevels = classLevels.filter(e => e.classKey !== last.classKey);
    } else {
      entry.level = last.classLv - 1;
    }
  }

  // Remove todas as escolhas atreladas a este nível de personagem
  acquiredTalents = acquiredTalents.filter(t => t.charLevel !== removedCharLevel);

  // Recalcula PV máximo
  const hpMaxEl = document.getElementById('hp-max');
  if (hpMaxEl) {
    hpMaxEl.value = hpByLevel.length ? hpByLevel.reduce((s, e) => s + e.total, 0) : '';
  }

  buildClassSection();
  buildTalentsDisplay();
  buildBonusFeatsDisplay();
  scheduleSave();

  showNotification(`Nível ${removedCharLevel}º desfeito (${clsName}).`);
}

// ============================================================
//  XP / PROGRESSÃO DE NÍVEL (Tabela 3-1: Benefícios e
//  Experiência Dependentes do Nível)
// ============================================================

// Maior nível de personagem permitido pelo total de XP (1–20).
function levelFromXP(xp) {
  let lv = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) lv = i + 1;
    else break;
  }
  return lv;
}

const fmtXP = n => n.toLocaleString('pt-BR');

// Atualiza a linha de status (benefícios do nível atual, XP p/ próximo
// nível e aviso de level-up disponível). Chamada por recalcAll().
function updateXpStatus() {
  const statusEl = document.getElementById('xp-level-status');
  if (!statusEl) return;

  const xp        = numVal('xp-total', 0);
  const charLv    = getCharLevel();          // nível já atribuído às classes
  const displayLv = charLv || 1;
  const xpLv      = levelFromXP(xp);

  // Benefícios do nível total atual (Tabela 3-1)
  const ben = LEVEL_BENEFITS[displayLv] || {};
  const badges = [];
  if (ben.feat)         badges.push('<span class="xp-badge xp-badge--feat">APTIDÃO</span>');
  if (ben.abilityBoost) badges.push('<span class="xp-badge xp-badge--abil">AUMENTO DE HABILIDADE</span>');
  const benefitHtml = badges.length
    ? `Nível ${displayLv}º concede: ${badges.join(' ')}`
    : `Nível ${displayLv}º: sem aptidão ou aumento de habilidade`;

  // XP para o próximo nível
  let nextHtml;
  if (displayLv >= 20) {
    nextHtml = '<span class="xp-status-item">Nível máximo (20º) atingido</span>';
  } else {
    const nextThreshold = XP_THRESHOLDS[displayLv];      // XP exigido p/ displayLv+1
    const remaining     = Math.max(0, nextThreshold - xp);
    nextHtml = `<span class="xp-status-item">Próximo nível (${displayLv + 1}º): faltam <strong>${fmtXP(remaining)}</strong> XP (de ${fmtXP(nextThreshold)})</span>`;
  }

  // Aviso de level-up liberado por XP
  let prompt = '';
  if (xpLv > charLv && charLv < 20) {
    prompt = `<span class="xp-levelup-ready">↑ XP suficiente para o nível ${xpLv}º — suba de nível nas classes acima</span>`;
  }

  statusEl.innerHTML =
    `<span class="xp-status-item">${benefitHtml}</span>` + nextHtml + prompt;
}

function renderClassTraits() {
  const panel = document.getElementById('class-traits-panel');
  const body  = document.getElementById('class-traits-body');
  if (!panel || !body) return;
  if (classLevels.length === 0) { panel.style.display = 'none'; return; }

  panel.style.display = '';
  let html = '<div class="class-traits-grid">';

  classLevels.forEach(e => {
    const cls = ALL_CLASSES[e.classKey];
    if (!cls) return;
    const trainedRow = cls.prestige
      ? ''
      : `<div class="class-trait-row"><span class="ctlbl">Perícias Treinadas:</span> ${cls.trainedSkillsBase} + mod INT</div>`;

    // Pré-requisitos (classes de prestígio)
    let prereqRow = '';
    if (cls.prestige && cls.prereqs) {
      const p = cls.prereqs;
      const reqs = [];
      if (p.minLevel) reqs.push(`Nível ${p.minLevel}º`);
      if (p.bab) reqs.push(`BAB +${p.bab}`);
      if (Array.isArray(p.trainedSkills)) p.trainedSkills.forEach(s => reqs.push('Treinado em ' + skillDisplayName(s)));
      if (Array.isArray(p.feats)) p.feats.forEach(f => reqs.push(Array.isArray(f) ? f[0] : f));
      if (Array.isArray(p.notes)) p.notes.forEach(n => reqs.push(n));
      prereqRow = `<div class="class-trait-row"><span class="ctlbl">Pré-requisitos:</span> ${reqs.join('; ')}</div>`;
    }

    // Aptidões iniciais (só classes base concedem)
    const featsRow = (cls.startingFeats && cls.startingFeats.length)
      ? `<div class="class-trait-row class-trait-feats"><span class="ctlbl">Aptidões Iniciais:</span>
        <div class="starting-feats-list">${cls.startingFeats.map(f => {
          const fd = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[f] : null;
          return fd
            ? `<span class="starting-feat-item" title="${fd.description}">${f}${fd.prereqText && fd.prereqText !== '—' ? ` <em>(Pré-req: ${fd.prereqText})</em>` : ''}</span>`
            : `<span class="starting-feat-item">${f}</span>`;
        }).join('')}</div>
      </div>`
      : '';

    html += `<div class="class-trait-entry">
      <div class="class-trait-header">${cls.name.toUpperCase()}${cls.prestige ? ' <span class="class-trait-prestige">Prestígio</span>' : ''}</div>
      <div class="class-trait-row"><span class="ctlbl">Dado de Vida:</span> d${cls.hitDie}</div>
      ${trainedRow}
      <div class="class-trait-row"><span class="ctlbl">Bônus de Defesa:</span> FORT +${cls.defenseBonus.fort||0}, REF +${cls.defenseBonus.ref||0}, VON +${cls.defenseBonus.will||0}</div>
      ${prereqRow}
      ${featsRow}
    </div>`;
  });

  html += '</div>';
  body.innerHTML = html;
}

// ---- Talent display ----

function buildTalentsDisplay() {
  const container = document.getElementById('talents-display');
  if (!container) return;

  const pendingSlots = getPendingTalentSlots();

  let html = '';

  // List acquired class talents (exclui talentos da Força, que têm painel próprio)
  const classTalents = acquiredTalents.filter(t => !isFeatEntry(t) && !isForceTalent(t));
  if (classTalents.length > 0) {
    html += '<div class="acquired-talents">';
    classTalents.forEach(t => {
        const cls = ALL_CLASSES[t.classKey];
        const tree = cls?.talentTrees.find(tr => tr.key === t.treeKey);
        const talent = tree?.talents.find(tl => tl.id === t.talentId);
        if (!talent) return;
        html += `<div class="acquired-talent-item has-tooltip" data-tooltip="${escTooltip(talent.description)}">
          <span class="at-name">${talent.name}</span>
          <span class="at-source">${cls?.name || t.classKey} — ${tree?.name || t.treeKey}</span>
          <button class="at-remove-btn" data-char-level="${t.charLevel}" title="Remover talento">✕</button>
        </div>`;
      });
    html += '</div>';
  } else if (pendingSlots.length === 0) {
    html += '<p class="no-talents-msg">Nenhum talento adquirido.</p>';
  }

  // Pending talent slots
  pendingSlots.forEach(slot => {
    const cls = ALL_CLASSES[slot.classKey];
    html += `<div class="talent-pick-slot">
      <span class="talent-pick-label">
        Talento disponível: ${cls?.name || slot.classKey} nível ${slot.classLv} (Personagem nível ${slot.charLevel})
      </span>
      <button class="talent-pick-btn" data-class="${slot.classKey}" data-char-level="${slot.charLevel}">
        Novo Talento
      </button>
    </div>`;
  });

  container.innerHTML = html;

  // Bind pick buttons
  container.querySelectorAll('.talent-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openTalentModal(btn.dataset.class, parseInt(btn.dataset.charLevel));
    });
  });

  // Bind remove buttons (apenas talentos de classe)
  container.querySelectorAll('.at-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cl = parseInt(btn.dataset.charLevel);
      acquiredTalents = acquiredTalents.filter(t => !(t.charLevel === cl && !isFeatEntry(t) && !isForceTalent(t)));
      buildTalentsDisplay();
      buildForceTalentsDisplay();
      scheduleSave();
    });
  });

  buildForceTalentsDisplay();
}

// ---- TALENTOS DA FORÇA (painel exclusivo p/ Sensitivo à Força) ----

function buildForceTalentsDisplay() {
  const panel = document.getElementById('force-talents-panel');
  const container = document.getElementById('force-talents-display');
  if (!panel || !container) return;

  const sensitive = characterIsForceSensitive();
  const forceTalents = acquiredTalents.filter(isForceTalent);

  // Painel só aparece para quem é Sensitivo à Força (ou já tem talentos da Força)
  if (!sensitive && forceTalents.length === 0) {
    panel.style.display = 'none';
    container.innerHTML = '';
    return;
  }
  panel.style.display = '';

  const pendingSlots = getPendingTalentSlots();
  let html = '';

  if (forceTalents.length > 0) {
    html += '<div class="acquired-talents">';
    forceTalents.forEach(t => {
      const tree = ALL_FORCE_TALENTS.find(tr => tr.key === t.treeKey);
      const talent = tree?.talents.find(tl => tl.id === t.talentId);
      if (!talent) return;
      html += `<div class="acquired-talent-item has-tooltip" data-tooltip="${escTooltip(talent.description)}">
        <span class="at-name">${talent.name}</span>
        <span class="at-source">${tree?.name || t.treeKey}</span>
        <button class="at-remove-btn" data-char-level="${t.charLevel}" data-force="1" title="Remover talento">✕</button>
      </div>`;
    });
    html += '</div>';
  } else if (pendingSlots.length === 0) {
    html += '<p class="no-talents-msg">Nenhum talento da Força adquirido.</p>';
  }

  // Slots pendentes podem ser preenchidos com um talento da Força
  if (sensitive) {
    pendingSlots.forEach(slot => {
      const cls = ALL_CLASSES[slot.classKey];
      html += `<div class="talent-pick-slot talent-pick-slot--force">
        <span class="talent-pick-label">
          Talento disponível: ${cls?.name || slot.classKey} nível ${slot.classLv} (Personagem nível ${slot.charLevel}º)
        </span>
        <button class="force-talent-pick-btn" data-char-level="${slot.charLevel}">
          + Talento da Força
        </button>
      </div>`;
    });
  }

  container.innerHTML = html;

  container.querySelectorAll('.force-talent-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openForceTalentModal(parseInt(btn.dataset.charLevel));
    });
  });
  container.querySelectorAll('.at-remove-btn[data-force]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cl = parseInt(btn.dataset.charLevel);
      acquiredTalents = acquiredTalents.filter(t => !(t.charLevel === cl && isForceTalent(t)));
      buildTalentsDisplay();
      buildForceTalentsDisplay();
      scheduleSave();
    });
  });
}

// Verifica os pré-requisitos de um talento da Força.
function forceTalentLocked(talent, tree) {
  const missing = [];
  // Árvore do Lado Negro exige Valor do Lado Negro ≥ 1
  if (tree.requiresDarkSide && getDarkSideScore() < 1) {
    missing.push('Valor do Lado Negro ≥ 1');
  }
  // Pré-requisitos de outros talentos (da Força)
  (talent.prerequisites || []).forEach(pid => {
    if (!acquiredTalents.some(t => isForceTalent(t) && t.talentId === pid)) {
      const name = findForceTalentName(pid);
      missing.push(name);
    }
  });
  // Atributo mínimo
  if (talent.requiresAbility) {
    const labels = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
    for (const [ab, min] of Object.entries(talent.requiresAbility)) {
      if (getAbilityScore(ab) < min) missing.push(`${labels[ab] || ab} ${min}`);
    }
  }
  // Poder da Força necessário (ex.: Visões requer Visão Distante)
  if (talent.requiresPower && !acquiredForcePowers.includes(talent.requiresPower)) {
    missing.push(`Poder: ${talent.requiresPower}`);
  }
  return { locked: missing.length > 0, missing };
}

function findForceTalentName(id) {
  for (const tree of ALL_FORCE_TALENTS) {
    const t = tree.talents.find(tl => tl.id === id);
    if (t) return t.name;
  }
  return id;
}

function openForceTalentModal(charLevel) {
  const modal = document.getElementById('talent-modal');
  const title = document.getElementById('talent-modal-title');
  const body  = document.getElementById('talent-modal-body');
  if (!modal || !body || typeof ALL_FORCE_TALENTS === 'undefined') return;

  title.textContent = `TALENTO DA FORÇA — ESCOLHA (Personagem nível ${charLevel}º)`;

  let html = '';
  ALL_FORCE_TALENTS.forEach(tree => {
    html += `<div class="tm-tree">
      <div class="tm-tree-name">${tree.name}</div>
      <div class="tm-tree-desc">${tree.description}</div>
      <div class="tm-talents">`;

    tree.talents.forEach(talent => {
      const picked = acquiredTalents.filter(t => isForceTalent(t) && t.talentId === talent.id).length;
      const { locked: prereqLocked, missing } = forceTalentLocked(talent, tree);
      const maxPicks = talent.multiSelect ? Infinity : 1;
      const atLimit = picked >= maxPicks;
      const locked = prereqLocked || atLimit;

      const checkMark = picked > 0 ? ` <span class="tm-pick-count">✓${picked > 1 || talent.multiSelect ? ` ×${picked}` : ''}</span>` : '';
      html += `<div class="tm-talent ${locked ? 'tm-locked' : 'tm-available'}" data-talent-id="${talent.id}" data-tree="${tree.key}">
        <div class="tm-talent-name">${talent.name}${checkMark}</div>`;

      if (talent.prerequisites?.length || tree.requiresDarkSide || talent.requiresAbility || talent.requiresPower) {
        const reqText = [];
        if (tree.requiresDarkSide) reqText.push('Valor do Lado Negro ≥ 1');
        (talent.prerequisites || []).forEach(pid => reqText.push(findForceTalentName(pid)));
        if (talent.requiresAbility) {
          const labels = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
          for (const [ab, min] of Object.entries(talent.requiresAbility)) reqText.push(`${labels[ab] || ab} ${min}`);
        }
        if (talent.requiresPower) reqText.push(`Poder: ${talent.requiresPower}`);
        html += `<div class="tm-prereq ${prereqLocked ? 'tm-prereq-fail' : 'tm-prereq-ok'}">Pré-req: ${reqText.join(', ')}</div>`;
      }
      if (prereqLocked && missing.length) {
        html += `<div class="tm-prereq tm-prereq-fail">Faltando: ${missing.join(', ')}</div>`;
      }
      if (talent.multiSelect) {
        html += `<div class="tm-multi-note">Pode ser escolhido múltiplas vezes</div>`;
      }
      html += `<div class="tm-talent-desc">${talent.description}</div>
      </div>`;
    });

    html += `</div></div>`;
  });

  body.innerHTML = html;

  body.querySelectorAll('.tm-available').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      acquiredTalents.push({ classKey: '__force__', treeKey: el.dataset.tree, talentId: el.dataset.talentId, charLevel });
      modal.close();
      buildTalentsDisplay();
      buildForceTalentsDisplay();
      scheduleSave();
    });
  });

  modal.showModal();
}

// Preenche dois painéis:
//   • APTIDÕES        (#class-bonus-feats-display): aptidões bônus de classe
//   • APTIDÕES EXTRAS (#extra-feats-display): iniciais de classe, de espécie
//     (automáticas/condicionais/escolha) e ganhas ao subir de nível.
function buildBonusFeatsDisplay() {
  const bonusContainer = document.getElementById('class-bonus-feats-display');
  const extraContainer = document.getElementById('extra-feats-display');
  if (!bonusContainer && !extraContainer) return;

  const pendingBonus = getPendingBonusFeatSlots();
  const pendingLevel = getPendingLevelFeatSlots();

  const startingFeats = getStartingFeats();
  const condFeats  = getSpeciesConditionalFeats();
  const condMet    = condFeats.filter(c => c.met);
  const condUnmet  = condFeats.filter(c => !c.met);
  const bonusFeats = acquiredTalents.filter(t => t.treeKey === '__bonusFeat__');
  const levelFeats = acquiredTalents.filter(t => t.treeKey === '__levelFeat__');
  const speciesData = activeSpeciesKey ? SPECIES_DATA[activeSpeciesKey] : null;
  const autoFeats  = speciesData?.autoFeats || [];
  const choiceFeats = speciesData?.choiceFeats || [];
  const chosenSpeciesFeats = acquiredTalents.filter(t => t.treeKey === '__speciesFeat__');
  const pendingChoiceFeats = choiceFeats.filter(
    cf => !chosenSpeciesFeats.some(t => t.slotName === cf.name)
  );

  // ---- APTIDÕES: aptidões bônus de classe ----
  if (bonusContainer) {
    let html = '';
    if (bonusFeats.length > 0) {
      html += '<div class="acquired-talents">';
      bonusFeats.forEach(t => {
        const cls = ALL_CLASSES[t.classKey];
        const featData = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[t.talentId] : null;
        html += `<div class="acquired-talent-item has-tooltip" data-tooltip="${escTooltip(featData?.description || '')}">
            <span class="at-name">${t.talentId}</span>
            <span class="at-source">${cls?.name || t.classKey} — Aptidão Bônus</span>
            <button class="at-remove-btn" data-char-level="${t.charLevel}" data-tree="__bonusFeat__" title="Remover">✕</button>
          </div>`;
      });
      html += '</div>';
    } else if (pendingBonus.length === 0) {
      html += '<p class="no-talents-msg">Nenhuma aptidão bônus adquirida.</p>';
    }

    // Slots pendentes de aptidão bônus de classe
    pendingBonus.forEach(slot => {
      const cls = ALL_CLASSES[slot.classKey];
      html += `<div class="talent-pick-slot">
        <span class="talent-pick-label">
          Aptidão Bônus disponível: ${cls?.name || slot.classKey} nível ${slot.classLv}
        </span>
        <button class="bonus-feat-pick-btn" data-class="${slot.classKey}" data-char-level="${slot.charLevel}">
          + Escolher Aptidão
        </button>
      </div>`;
    });

    bonusContainer.innerHTML = html;

    bonusContainer.querySelectorAll('.bonus-feat-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openBonusFeatModal(btn.dataset.class, parseInt(btn.dataset.charLevel));
      });
    });
    bonusContainer.querySelectorAll('.at-remove-btn[data-tree="__bonusFeat__"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cl = parseInt(btn.dataset.charLevel);
        acquiredTalents = acquiredTalents.filter(t => !(t.charLevel === cl && t.treeKey === '__bonusFeat__'));
        buildBonusFeatsDisplay();
        scheduleSave();
      });
    });
  }

  // ---- APTIDÕES EXTRAS: iniciais de classe, de espécie e ganhas por nível ----
  if (extraContainer) {
    let html = '';
    const hasAnyExtra = startingFeats.length > 0 || condMet.length > 0 ||
      levelFeats.length > 0 || autoFeats.length > 0 || chosenSpeciesFeats.length > 0;

    if (hasAnyExtra) {
      html += '<div class="acquired-talents">';
      // Aptidões automáticas de espécie (sempre concedidas)
      autoFeats.forEach(feat => {
        const featData = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[feat] : null;
        html += `<div class="acquired-talent-item acquired-talent-item--species has-tooltip" data-tooltip="${escTooltip(featData?.description || '')}">
            <span class="at-name">${feat}</span>
            <span class="at-source">${speciesData?.name || ''} — Aptidão de Espécie</span>
          </div>`;
      });
      // Aptidões de escolha de espécie (ex: Humano — Aptidão Extra)
      chosenSpeciesFeats.forEach(t => {
        const featData = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[t.talentId] : null;
        html += `<div class="acquired-talent-item acquired-talent-item--species has-tooltip" data-tooltip="${escTooltip(featData?.description || '')}">
            <span class="at-name">${t.talentId}</span>
            <span class="at-source">${speciesData?.name || ''} — Aptidão Extra</span>
            <button class="at-remove-btn" data-tree="__speciesFeat__" data-slot="${escTooltip(t.slotName || '')}" title="Remover">✕</button>
          </div>`;
      });
      // Condicionais atendidas
      condMet.forEach(c => {
        html += `<div class="acquired-talent-item acquired-talent-item--species has-tooltip" data-tooltip="${escTooltip(c.desc)}">
            <span class="at-name">${c.feat}</span>
            <span class="at-source">${speciesData?.name || ''} — Condicional</span>
          </div>`;
      });
      // Aptidões iniciais de classe
      startingFeats.forEach(sf => {
        const cls = ALL_CLASSES[sf.classKey];
        const featData = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[sf.name] : null;
        html += `<div class="acquired-talent-item acquired-talent-item--auto has-tooltip" data-tooltip="${escTooltip(featData?.description || '')}">
            <span class="at-name">${sf.name}</span>
            <span class="at-source">${cls?.name || sf.classKey} — Inicial</span>
          </div>`;
      });
      // Aptidões ganhas ao subir de nível
      levelFeats.forEach(t => {
        const featData = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[t.talentId] : null;
        html += `<div class="acquired-talent-item has-tooltip" data-tooltip="${escTooltip(featData?.description || '')}">
            <span class="at-name">${t.talentId}</span>
            <span class="at-source">Nível ${t.charLevel}º — Aptidão</span>
            <button class="at-remove-btn" data-char-level="${t.charLevel}" data-tree="__levelFeat__" title="Remover">✕</button>
          </div>`;
      });
      html += '</div>';
    } else if (pendingLevel.length === 0 && condUnmet.length === 0 && pendingChoiceFeats.length === 0) {
      html += '<p class="no-talents-msg">Nenhuma aptidão extra.</p>';
    }

    // Slots pendentes de aptidão de escolha de espécie (ex: Humano)
    pendingChoiceFeats.forEach(cf => {
      html += `<div class="talent-pick-slot talent-pick-slot--species">
        <span class="talent-pick-label">
          ${cf.name} (${speciesData?.name || 'Espécie'}) — escolha uma aptidão
        </span>
        <button class="species-choice-feat-btn" data-slot="${escTooltip(cf.name)}">
          + Escolher Aptidão
        </button>
      </div>`;
    });

    // Aptidões condicionais de espécie ainda não atendidas (informativo)
    condUnmet.forEach(c => {
      html += `<div class="talent-pick-slot talent-pick-slot--cond">
        <span class="talent-pick-label">
          Aptidão condicional (espécie): ${c.feat}${c.condText ? ` — requer ${c.condText}` : ''}
        </span>
      </div>`;
    });

    // Slots pendentes de aptidão ganha por nível total
    pendingLevel.forEach(slot => {
      html += `<div class="talent-pick-slot talent-pick-slot--level">
        <span class="talent-pick-label">
          Aptidão de Nível disponível: Personagem nível ${slot.charLevel}º
        </span>
        <button class="level-feat-pick-btn" data-char-level="${slot.charLevel}">
          + Escolher Aptidão
        </button>
      </div>`;
    });

    extraContainer.innerHTML = html;

    extraContainer.querySelectorAll('.level-feat-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openLevelFeatModal(parseInt(btn.dataset.charLevel));
      });
    });
    extraContainer.querySelectorAll('.species-choice-feat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openSpeciesFeatModal(btn.dataset.slot);
      });
    });
    extraContainer.querySelectorAll('.at-remove-btn[data-tree="__levelFeat__"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cl = parseInt(btn.dataset.charLevel);
        acquiredTalents = acquiredTalents.filter(t => !(t.charLevel === cl && t.treeKey === '__levelFeat__'));
        buildBonusFeatsDisplay();
        scheduleSave();
      });
    });
    extraContainer.querySelectorAll('.at-remove-btn[data-tree="__speciesFeat__"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = btn.dataset.slot;
        acquiredTalents = acquiredTalents.filter(t => !(t.treeKey === '__speciesFeat__' && t.slotName === slot));
        buildBonusFeatsDisplay();
        scheduleSave();
      });
    });
  }
}

// ============================================================
//  PODERES DA FORÇA
// ============================================================

// Conta quantas vezes uma aptidão foi adquirida (todas as fontes).
function countFeat(name) {
  const norm = n => n.toLowerCase().replace(/[-\s]+/g, ' ').trim();
  const target = norm(name);
  let count = 0;
  // Iniciais de classe
  for (const entry of classLevels) {
    const cls = ALL_CLASSES[entry.classKey];
    if (cls?.startingFeats) count += cls.startingFeats.filter(f => norm(f) === target).length;
  }
  // Bônus e de nível (aptidões adquiridas)
  count += acquiredTalents.filter(t =>
    (t.treeKey === '__bonusFeat__' || t.treeKey === '__levelFeat__') && norm(t.talentId) === target
  ).length;
  // Inputs de texto livre de aptidões
  document.querySelectorAll('[id^="feat-"]').forEach(inp => {
    if (norm(inp.value || '') === target) count++;
  });
  return count;
}

// Calcula os slots de poderes da Força do personagem.
//   - cada Treinamento na Força concede 1 + mod. SAB (mínimo 1) poderes
//   - total = nº de Treinamento na Força × poderes por seleção
function getForcePowerSlots() {
  const ftCount = countFeat('Treinamento na Força');
  const wisMod  = abilityMod(numVal('wis-score', 10)) || 0;
  const perSelection = Math.max(1, 1 + wisMod);
  return { ftCount, wisMod, perSelection, total: ftCount * perSelection };
}

// Monta o texto do tooltip de um poder da Força.
function forcePowerTooltip(name) {
  const p = (typeof ALL_FORCE_POWERS !== 'undefined') ? ALL_FORCE_POWERS[name] : null;
  if (!p) return '';
  let txt = p.description || '';
  if (p.time)    txt += `\n\nTempo: ${p.time}`;
  if (p.target)  txt += `\nAlvo: ${p.target}`;
  if (p.special) txt += `\n\nEspecial: ${p.special}`;
  return txt;
}

function buildForcePowersDisplay() {
  const container = document.getElementById('force-powers-container');
  if (!container) return;

  const { ftCount, total } = getForcePowerSlots();
  const acquired = acquiredForcePowers.length;
  const pending  = total - acquired;

  let html = '';

  // Sem a aptidão Treinamento na Força e sem poderes
  if (ftCount === 0 && acquired === 0) {
    html += `<p class="no-talents-msg">Adquira a aptidão <strong>Treinamento na Força</strong> para aprender Poderes da Força.</p>`;
    container.innerHTML = html;
    return;
  }

  // Cabeçalho com a contagem de slots
  html += `<div class="fp-slots-info">Poderes conhecidos: <strong>${acquired}</strong> de <strong>${total}</strong></div>`;

  // Lista de poderes adquiridos
  if (acquired > 0) {
    html += '<div class="acquired-talents">';
    acquiredForcePowers.forEach((name, idx) => {
      const p = (typeof ALL_FORCE_POWERS !== 'undefined') ? ALL_FORCE_POWERS[name] : null;
      const desc = p?.descriptor ? ` <span class="fp-descriptor">${p.descriptor}</span>` : '';
      html += `<div class="acquired-talent-item has-tooltip" data-tooltip="${escTooltip(forcePowerTooltip(name))}">
          <span class="at-name">${name}${desc}</span>
          <span class="at-source">${p?.time || ''}</span>
          <button class="at-remove-btn" data-fp-index="${idx}" title="Remover poder">✕</button>
        </div>`;
    });
    html += '</div>';
  }

  // Slots pendentes
  if (pending > 0) {
    html += `<div class="talent-pick-slot talent-pick-slot--force">
      <span class="talent-pick-label">
        Poder da Força disponível (${acquired}/${total})
      </span>
      <button class="force-power-pick-btn">+ Escolher Poder</button>
    </div>`;
  } else if (pending < 0) {
    // Excedente (ex.: Sabedoria reduziu) — usuário deve remover poderes
    html += `<div class="talent-pick-slot talent-pick-slot--cond">
      <span class="talent-pick-label">
        Você conhece ${acquired} poderes, mas só tem direito a ${total}. Remova ${-pending} poder(es).
      </span>
    </div>`;
  }

  container.innerHTML = html;

  // Escolher poder
  container.querySelectorAll('.force-power-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => openForcePowerModal());
  });

  // Remover poder
  container.querySelectorAll('.at-remove-btn[data-fp-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.fpIndex, 10);
      acquiredForcePowers.splice(i, 1);
      buildForcePowersDisplay();
      scheduleSave();
    });
  });
}

function openForcePowerModal() {
  const modal = document.getElementById('talent-modal');
  const title = document.getElementById('talent-modal-title');
  const body  = document.getElementById('talent-modal-body');
  if (!modal || !body || typeof ALL_FORCE_POWERS === 'undefined') return;

  const acquired = acquiredForcePowers.length;
  const total = getForcePowerSlots().total;
  title.textContent = `PODER DA FORÇA — ESCOLHA (${acquired}/${total})`;

  let html = '<div class="tm-tree"><div class="tm-tree-name">Poderes da Força</div>' +
    '<div class="tm-tree-desc">Você pode escolher o mesmo poder mais de uma vez; cada escolha adiciona um uso extra ao seu conjunto.</div>' +
    '<div class="tm-talents">';

  Object.keys(ALL_FORCE_POWERS)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .forEach(name => {
      const p = ALL_FORCE_POWERS[name];
      const owned = acquiredForcePowers.filter(n => n === name).length;
      const ownedMark = owned > 0 ? ` <span class="tm-pick-count">✓ ×${owned}</span>` : '';
      html += `<div class="tm-talent tm-available tm-feat-item" data-power="${escTooltip(name)}">
        <div class="tm-talent-name">${name}${p.descriptor ? ` <span class="fp-descriptor">${p.descriptor}</span>` : ''}${ownedMark}</div>
        <div class="tm-prereq tm-prereq-ok">Tempo: ${p.time} · Alvo: ${p.target}</div>
        <div class="tm-talent-desc">${p.description}</div>
        ${p.special ? `<div class="tm-multi-note">Especial: ${p.special}</div>` : ''}
      </div>`;
    });

  html += '</div></div>';
  body.innerHTML = html;

  body.querySelectorAll('.tm-feat-item.tm-available').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      acquiredForcePowers.push(el.dataset.power);
      modal.close();
      buildForcePowersDisplay();
      scheduleSave();
    });
  });

  modal.showModal();
}

// ---- Species choice feat modal ----

function openSpeciesFeatModal(slotName) {
  const modal = document.getElementById('talent-modal');
  const title = document.getElementById('talent-modal-title');
  const body  = document.getElementById('talent-modal-body');
  if (!modal || !body) return;

  const speciesData = activeSpeciesKey ? SPECIES_DATA[activeSpeciesKey] : null;
  title.textContent = `APTIDÃO EXTRA — ${speciesData?.name?.toUpperCase() || 'ESPÉCIE'}`;

  const feats = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS : {};
  let html = '<div class="tm-tree"><div class="tm-tree-name">Escolha qualquer aptidão</div><div class="tm-talents">';

  Object.keys(feats)
    .filter(featName => !feats[featName].speciesOnly)
    // Remove aptidões não-repetíveis já adquiridas por qualquer fonte.
    .filter(featName => feats[featName].multiSelect || !characterHasFeat(featName))
    .forEach(featName => {
    const featData = feats[featName];
    const { locked, missing } = checkFeatPrereqs(featName);
    const isLocked = locked;

    html += `<div class="tm-talent ${isLocked ? 'tm-locked' : 'tm-available'} tm-feat-item" data-feat="${featName}">
      <div class="tm-talent-name">${featName}</div>`;
    if (featData.prereqText && featData.prereqText !== '—') {
      const cls = locked ? 'tm-prereq-fail' : 'tm-prereq-ok';
      html += `<div class="tm-prereq ${cls}">Pré-req: ${featData.prereqText}</div>`;
    }
    if (locked && missing.length) {
      html += `<div class="tm-prereq tm-prereq-fail">Faltando: ${missing.join(', ')}</div>`;
    }
    if (featData.description) {
      html += `<div class="tm-talent-desc">${featData.description}</div>`;
    }
    html += '</div>';
  });

  html += '</div></div>';
  body.innerHTML = html;

  body.querySelectorAll('.tm-feat-item.tm-available').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const feat = el.dataset.feat;
      acquiredTalents.push({ classKey: '__species__', treeKey: '__speciesFeat__', talentId: feat, slotName });
      modal.close();
      buildBonusFeatsDisplay();
      scheduleSave();
    });
  });

  modal.showModal();
}

// ---- Talent modal ----

function openTalentModal(classKey, charLevel) {
  const cls = ALL_CLASSES[classKey];
  if (!cls) return;

  const modal = document.getElementById('talent-modal');
  const title = document.getElementById('talent-modal-title');
  const body  = document.getElementById('talent-modal-body');
  if (!modal || !body) return;

  title.textContent = `SELECT TALENT — ${cls.name.toUpperCase()} (Character Level ${charLevel})`;

  let html = '';
  cls.talentTrees.forEach(tree => {
    html += `<div class="tm-tree">
      <div class="tm-tree-name">${tree.name}</div>
      <div class="tm-tree-desc">${tree.description}</div>
      <div class="tm-talents">`;

    tree.talents.forEach(talent => {
      const prereqMet = talentPrereqsMet(talent);
      const featMet = !talent.requiresFeat || characterHasFeat(talent.requiresFeat);
      const babMet  = !talent.requiresBab || getCharBAB() >= talent.requiresBab;
      const picked = countTalent(talent.id);
      // Limite de escolhas: maxSelect (se definido); senão 1 para não-repetível, ∞ para multiSelect.
      const maxPicks = talent.maxSelect || (talent.multiSelect ? Infinity : 1);
      const atLimit = picked >= maxPicks;
      const locked = !prereqMet || !featMet || !babMet || atLimit;

      const checkMark = picked > 0 ? ` <span class="tm-pick-count">✓${picked > 1 || talent.multiSelect ? ` ×${picked}` : ''}</span>` : '';
      html += `<div class="tm-talent ${locked ? 'tm-locked' : 'tm-available'}" data-talent-id="${talent.id}" data-tree="${tree.key}">
        <div class="tm-talent-name">${talent.name}${checkMark}</div>`;

      if (talent.prerequisites?.length) {
        const prereqNames = talent.prerequisites.map(pid => {
          for (const tr of cls.talentTrees) {
            const t = tr.talents.find(x => x.id === pid);
            if (t) return t.name;
          }
          return pid;
        });
        html += `<div class="tm-prereq ${prereqMet ? 'tm-prereq-ok' : 'tm-prereq-fail'}">Pré-req: ${prereqNames.join(', ')}</div>`;
      }
      if (talent.requiresFeat) {
        html += `<div class="tm-prereq ${featMet ? 'tm-prereq-ok' : 'tm-prereq-fail'}">Aptidão: ${talent.requiresFeat}</div>`;
      }
      if (talent.requiresBab) {
        html += `<div class="tm-prereq ${babMet ? 'tm-prereq-ok' : 'tm-prereq-fail'}">BAB: +${talent.requiresBab}</div>`;
      }
      if (talent.multiSelect) {
        const limitNote = talent.maxSelect
          ? `Pode ser escolhido até ${talent.maxSelect}× (escolhido ${picked}/${talent.maxSelect})`
          : 'Pode ser escolhido múltiplas vezes';
        html += `<div class="tm-multi-note">${limitNote}</div>`;
      }

      html += `<div class="tm-talent-desc">${talent.description}</div>
      </div>`;
    });

    html += `</div></div>`;
  });

  body.innerHTML = html;

  // Bind click on available talents
  body.querySelectorAll('.tm-available').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const talentId = el.dataset.talentId;
      const treeKey  = el.dataset.tree;
      acquiredTalents.push({ classKey, treeKey, talentId, charLevel });
      modal.close();
      buildTalentsDisplay();
      scheduleSave();
    });
  });

  modal.showModal();
}

function openBonusFeatModal(classKey, charLevel) {
  const cls = ALL_CLASSES[classKey];
  if (!cls) return;

  const modal = document.getElementById('talent-modal');
  const title = document.getElementById('talent-modal-title');
  const body  = document.getElementById('talent-modal-body');
  if (!modal || !body) return;

  title.textContent = `APTIDÃO BÔNUS — ${cls.name.toUpperCase()} (Nível ${charLevel})`;

  let html = '<div class="tm-tree"><div class="tm-tree-name">Lista de Aptidões Bônus</div><div class="tm-talents">';
  (cls.bonusFeatList || [])
    // Remove aptidões não-repetíveis já adquiridas por qualquer fonte.
    .filter(featName => {
      const fd = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[featName] : null;
      return (fd && fd.multiSelect) || !characterHasFeat(featName);
    })
    .forEach(featName => {
    const featData = (typeof ALL_FEATS !== 'undefined') ? ALL_FEATS[featName] : null;
    const { locked: prereqLocked, missing } = checkFeatPrereqs(featName);
    const locked = prereqLocked;

    html += `<div class="tm-talent ${locked ? 'tm-locked' : 'tm-available'} tm-feat-item" data-feat="${featName}">
      <div class="tm-talent-name">${featName}</div>`;

    if (featData?.prereqText && featData.prereqText !== '—') {
      const missingClass = prereqLocked ? 'tm-prereq-fail' : 'tm-prereq-ok';
      html += `<div class="tm-prereq ${missingClass}">Pré-req: ${featData.prereqText}</div>`;
    }
    if (prereqLocked && missing.length) {
      html += `<div class="tm-prereq tm-prereq-fail">Faltando: ${missing.join(', ')}</div>`;
    }
    if (featData?.description) {
      html += `<div class="tm-talent-desc">${featData.description}</div>`;
    }
    if (featData?.multiSelect) {
      html += `<div class="tm-multi-note">Pode ser escolhida múltiplas vezes</div>`;
    }

    html += `</div>`;
  });
  html += '</div></div>';

  body.innerHTML = html;

  body.querySelectorAll('.tm-feat-item.tm-available').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const feat = el.dataset.feat;
      acquiredTalents.push({ classKey, treeKey: '__bonusFeat__', talentId: feat, charLevel });
      modal.close();
      buildBonusFeatsDisplay();
      scheduleSave();
    });
  });

  modal.showModal();
}

// ---- Aptidão de nível (lista completa, não limitada à lista de classe) ----

function openLevelFeatModal(charLevel) {
  const modal = document.getElementById('talent-modal');
  const title = document.getElementById('talent-modal-title');
  const body  = document.getElementById('talent-modal-body');
  if (!modal || !body) return;

  title.textContent = `APTIDÃO DE NÍVEL — PERSONAGEM NÍVEL ${charLevel}º`;

  const featNames = (typeof ALL_FEATS !== 'undefined')
    ? Object.keys(ALL_FEATS)
        .filter(name => !ALL_FEATS[name].speciesOnly)
        // Remove aptidões não-repetíveis já adquiridas por qualquer fonte
        // (inicial de classe, espécie automática/condicional/escolha, bônus, nível).
        .filter(name => ALL_FEATS[name].multiSelect || !characterHasFeat(name))
        .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    : [];

  let html = `<div class="tm-tree">
    <div class="tm-tree-name">Aptidões — lista completa</div>
    <div class="tm-tree-desc">Aptidões ganhas pelo nível de personagem não são limitadas à lista de aptidões bônus de classe. Escolha qualquer aptidão cujos pré-requisitos você cumpra.</div>
    <div class="tm-talents">`;

  featNames.forEach(featName => {
    const featData    = ALL_FEATS[featName];
    const multiSelect = featData?.multiSelect || false;
    const { locked: prereqLocked, missing } = checkFeatPrereqs(featName);
    const locked = prereqLocked;

    html += `<div class="tm-talent ${locked ? 'tm-locked' : 'tm-available'} tm-feat-item" data-feat="${featName}">
      <div class="tm-talent-name">${featName}</div>`;

    if (featData?.prereqText && featData.prereqText !== '—') {
      html += `<div class="tm-prereq ${prereqLocked ? 'tm-prereq-fail' : 'tm-prereq-ok'}">Pré-req: ${featData.prereqText}</div>`;
    }
    if (prereqLocked && missing.length) {
      html += `<div class="tm-prereq tm-prereq-fail">Faltando: ${missing.join(', ')}</div>`;
    }
    if (featData?.description) {
      html += `<div class="tm-talent-desc">${featData.description}</div>`;
    }
    if (multiSelect) {
      html += `<div class="tm-multi-note">Pode ser escolhida múltiplas vezes</div>`;
    }
    html += `</div>`;
  });
  html += '</div></div>';

  body.innerHTML = html;

  body.querySelectorAll('.tm-feat-item.tm-available').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const feat = el.dataset.feat;
      acquiredTalents.push({ classKey: null, treeKey: '__levelFeat__', talentId: feat, charLevel });
      modal.close();
      buildBonusFeatsDisplay();
      scheduleSave();
    });
  });

  modal.showModal();
}

// ============================================================
//  AUTO-CALCULATIONS
// ============================================================

function recalcAbilityMods() {
  const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  const mods = {};

  abilities.forEach(a => {
    const score = numVal(`${a}-score`, NaN);
    const mod = isNaN(score) ? null : abilityMod(score);
    mods[a] = mod;

    // Os #*-mod foram migrados para o componente Alpine (x-text). Este write
    // é no-op (elemento inexistente); mantido como fallback se o id voltar.
    const modEl = document.getElementById(`${a}-mod`);
    if (modEl) modEl.textContent = fmtMod(mod);
  });

  // Notifica o componente Alpine de Atributos para reler os scores e
  // re-renderizar os modificadores (cobre digitação, espécie, novo, restore).
  document.dispatchEvent(new CustomEvent('scores-changed'));

  return mods;
}

// Lê o passo atual do Marcador de Condição e retorna seus efeitos (penalidade,
// deslocamento reduzido, indefeso). Ver conditionEffect() em calculations.js.
function getConditionEffect() {
  const sel = document.querySelector('input[name="condition"]:checked');
  return conditionEffect(sel ? sel.value : 'normal');
}

function recalcDefenses(mods) {
  const heroicLevel = getCharLevel() || numVal('total-level', 1);
  const classDef    = getBestDefBonus();
  const condPenalty = getConditionEffect().penalty;

  const defMap = [
    { name: 'fort', abilityKey: 'con', autoId: 'fort-ability', totalId: 'fort-total',
      lvId: 'fort-level-bonus', clsAutoId: 'fort-class-auto', miscId: 'fort-misc', clsBonus: classDef.fort },
    { name: 'ref',  abilityKey: 'dex', autoId: 'ref-ability',  totalId: 'ref-total',
      lvId: 'ref-level-bonus',  clsAutoId: 'ref-class-auto',  miscId: 'ref-misc',  clsBonus: classDef.ref  },
    { name: 'will', abilityKey: 'wis', autoId: 'will-ability', totalId: 'will-total',
      lvId: 'will-level-bonus', clsAutoId: 'will-class-auto', miscId: 'will-misc', clsBonus: classDef.will },
  ];

  defMap.forEach(d => {
    const abilMod = mods[d.abilityKey];

    const autoEl   = document.getElementById(d.autoId);
    const totalEl  = document.getElementById(d.totalId);
    const lvEl     = document.getElementById(d.lvId);
    const clsEl    = document.getElementById(d.clsAutoId);

    if (autoEl)  autoEl.textContent  = fmtMod(abilMod);
    if (lvEl)    lvEl.textContent    = heroicLevel;
    if (clsEl)   clsEl.textContent   = `+${d.clsBonus}`;

    if (abilMod !== null) {
      const misc  = numVal(d.miscId);
      const total = calcDefense({ level: heroicLevel, classBonuses: [d.clsBonus], abilityMod: abilMod, misc });
      if (totalEl) {
        totalEl.textContent = total - condPenalty;
        // Realça o total e explica a discrepância com o detalhamento quando há penalidade.
        totalEl.classList.toggle('condition-penalized', condPenalty > 0);
        totalEl.title = condPenalty > 0 ? `Inclui −${condPenalty} da condição` : '';
      }
    } else {
      if (totalEl) {
        totalEl.textContent = '—';
        totalEl.classList.remove('condition-penalized');
        totalEl.title = '';
      }
    }
  });
}

function recalcSkills(mods) {
  const halfLevel = Math.floor(numVal('total-level', 1) / 2);
  const condPenalty = getConditionEffect().penalty;

  const allSkills = [
    ...SKILLS,
    ...Array.from({ length: EXTRA_SKILLS_COUNT }, (_, i) => ({
      id: `extra${i}`, ability: getExtraSkillAbility(i), trainedOnly: false,
    })),
  ];

  allSkills.forEach(skill => {
    const halfEl  = document.getElementById(`sk-half-${skill.id}`);
    const abilEl  = document.getElementById(`sk-ability-${skill.id}`);
    const totalEl = document.getElementById(`sk-total-${skill.id}`);
    const trainedCb = document.getElementById(`sk-trained-${skill.id}`);
    const focusCb   = document.getElementById(`sk-focus-${skill.id}`);
    const miscInp   = document.getElementById(`sk-misc-${skill.id}`);

    if (!totalEl) return;

    const trained   = trainedCb ? trainedCb.checked : false;
    const focus     = focusCb ? focusCb.checked : false;
    const misc      = miscInp ? (parseInt(miscInp.value, 10) || 0) : 0;
    const abilMod   = mods[skill.ability] !== undefined ? mods[skill.ability] : null;

    if (halfEl) halfEl.textContent = halfLevel;
    if (abilEl) abilEl.textContent = fmtMod(abilMod);

    if (skill.trainedOnly && !trained) {
      totalEl.textContent = '—';
      totalEl.title = 'Requer treinamento';
      return;
    }

    if (abilMod === null) {
      totalEl.textContent = '—';
      return;
    }

    // ½ nível + mod + misc + 5 (treinado) + 5 (foco) — ver calcSkill
    const total = calcSkill({ level: numVal('total-level', 1), abilityMod: abilMod, misc, trained, focus }) - condPenalty;

    totalEl.textContent = total >= 0 ? '+' + total : total;
    totalEl.classList.toggle('condition-penalized', condPenalty > 0);
    totalEl.title = condPenalty > 0 ? `Inclui −${condPenalty} da condição` : '';
  });
}

function getExtraSkillAbility(index) {
  return 'str';
}

function recalcDamageThreshold() {
  const fort  = numVal('dt-fort');
  const feat  = numVal('dt-feat');
  const misc  = numVal('dt-misc');
  const totalEl = document.getElementById('dt-total');
  if (totalEl) {
    const hasAny = document.getElementById('dt-fort').value || document.getElementById('dt-feat').value || document.getElementById('dt-misc').value;
    totalEl.textContent = hasAny ? (fort + feat + misc) : '—';
  }
}

// Renderiza o resumo de efeitos do Marcador de Condição (penalidade global em
// ataques/testes de habilidade, deslocamento à metade, indefeso). Defesas e
// perícias já recebem a penalidade em recalcDefenses/recalcSkills.
function recalcConditionEffects() {
  const box = document.getElementById('condition-effects');
  if (!box) return;

  const { penalty, halfSpeed, helpless } = getConditionEffect();

  if (penalty === 0 && !helpless) {
    box.innerHTML = '';
    box.classList.remove('active');
    return;
  }

  box.classList.add('active');

  if (helpless) {
    box.innerHTML = '<span class="cond-fx cond-fx-danger">Indefeso — inconsciente ou desabilitado</span>';
    return;
  }

  const parts = [
    `<span class="cond-fx">−${penalty} em ataques, perícias e testes de habilidade</span>`,
    `<span class="cond-fx">−${penalty} em todas as Defesas</span>`,
  ];
  if (halfSpeed) parts.push('<span class="cond-fx cond-fx-danger">Deslocamento reduzido à metade</span>');

  box.innerHTML = parts.join('');
}

// Normaliza o campo de deslocamento (a unidade "sq" agora é um rótulo fixo ao
// lado do campo) e mostra o valor reduzido à metade quando a condição −10/Indefeso
// reduz o deslocamento (SWSE, pág. 155).
function recalcSpeed() {
  const input = document.getElementById('speed');
  if (!input) return;

  // Remove qualquer "sq" digitado ou herdado da espécie — a unidade é fixa no HTML.
  const cleaned = input.value.replace(/\s*sq\b/gi, '').trim();
  if (cleaned !== input.value) input.value = cleaned;

  const eff = document.getElementById('speed-effective');
  if (!eff) return;

  const { halfSpeed } = getConditionEffect();
  const base = parseInt(cleaned, 10);
  if (halfSpeed && !isNaN(base)) {
    eff.textContent = `→ ${Math.floor(base / 2)} sq`;
    eff.classList.add('active');
  } else {
    eff.textContent = '';
    eff.classList.remove('active');
  }
}

function recalcAll() {
  const mods = recalcAbilityMods();
  recalcDefenses(mods);
  recalcSkills(mods);
  recalcConditionEffects();
  recalcSpeed();
  recalcDamageThreshold();
  updateXpStatus();
  // Aptidões condicionais de espécie dependem de atributos/BAB/perícias treinadas
  buildBonusFeatsDisplay();
  // Poderes da Força dependem do modificador de Sabedoria e da aptidão Treinamento na Força
  buildForcePowersDisplay();
  // Talentos da Força aparecem para Sensitivo à Força; Lado Negro depende do Valor do Lado Negro
  buildForceTalentsDisplay();
}

// ============================================================
//  DATA COLLECTION — gather all form values into a plain object
// ============================================================

function collectData() {
  const data = {};

  // All inputs and textareas with data-key
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (el.type === 'radio') {
      if (el.checked) data[key] = el.value;
    } else if (el.type === 'checkbox') {
      data[key] = el.checked;
    } else {
      data[key] = el.value;
    }
  });

  // Class system
  data['__classLevels']     = JSON.stringify(classLevels);
  data['__hpByLevel']       = JSON.stringify(hpByLevel);
  data['__acquiredTalents'] = JSON.stringify(acquiredTalents);
  data['__acquiredForcePowers'] = JSON.stringify(acquiredForcePowers);

  // Dark side score
  const filled = [...document.querySelectorAll('.ds-pip.filled')];
  data['dark-side-score'] = filled.length > 0 ? parseInt(filled[filled.length - 1].dataset.score, 10) : 0;

  // Portrait image (base64)
  const img = document.getElementById('portrait-img');
  if (img && img.src && img.style.display !== 'none') {
    data['portrait'] = img.src;
  }

  return data;
}

// ============================================================
//  DATA RESTORATION — apply saved object back to form
// ============================================================

function restoreData(data) {
  if (!data) return;

  Object.entries(data).forEach(([key, val]) => {
    if (key === 'dark-side-score' || key === 'portrait') return;

    const els = document.querySelectorAll(`[data-key="${key}"]`);
    els.forEach(el => {
      if (el.type === 'radio') {
        el.checked = (el.value === val);
      } else if (el.type === 'checkbox') {
        el.checked = !!val;
      } else {
        el.value = val !== null && val !== undefined ? val : '';
      }
    });
  });

  // Dark side score
  if (data['dark-side-score'] > 0) {
    document.querySelectorAll('.ds-pip').forEach(p => {
      p.classList.toggle('filled', parseInt(p.dataset.score) <= data['dark-side-score']);
    });
  }

  // Portrait
  if (data['portrait']) {
    const img  = document.getElementById('portrait-img');
    const hint = document.getElementById('portrait-hint');
    const clearBtn = document.getElementById('portrait-clear');
    if (img) {
      img.src = data['portrait'];
      img.style.display = 'block';
      if (hint) hint.style.display = 'none';
      if (clearBtn) clearBtn.style.display = '';
    }
  }

  // Restore class system state
  try {
    classLevels     = data['__classLevels']     ? JSON.parse(data['__classLevels'])     : [];
    hpByLevel       = data['__hpByLevel']       ? JSON.parse(data['__hpByLevel'])       : [];
    acquiredTalents = data['__acquiredTalents'] ? JSON.parse(data['__acquiredTalents']) : [];
    acquiredForcePowers = data['__acquiredForcePowers'] ? JSON.parse(data['__acquiredForcePowers']) : [];
  } catch { classLevels = []; hpByLevel = []; acquiredTalents = []; acquiredForcePowers = []; }

  recalcAll();
  buildClassSection();
  buildTalentsDisplay();
  buildBonusFeatsDisplay();
  buildForcePowersDisplay();

  // Restore species state without re-applying adjustments (scores already include them)
  const restoredKey = document.getElementById('species')?.value || null;
  if (restoredKey && SPECIES_DATA[restoredKey]) {
    activeSpeciesKey           = restoredKey;
    activeSpeciesAutoLangCount = SPECIES_DATA[restoredKey].autoLangs.length;
    renderSpeciesTraits(SPECIES_DATA[restoredKey]);
  } else {
    activeSpeciesKey           = null;
    activeSpeciesAutoLangCount = 0;
  }
}

// ============================================================
//  LOCAL STORAGE
// ============================================================

let saveTimer = null;

function scheduleSave() {
  const dot   = document.getElementById('save-dot');
  const label = document.getElementById('save-label');

  if (dot)   dot.className = 'save-dot saving';
  if (label) label.textContent = 'SALVANDO...';

  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(collectData()));
    if (dot)   { dot.className = 'save-dot saved'; }
    if (label) { label.textContent = 'SALVO'; }
    setTimeout(() => {
      if (dot) dot.className = 'save-dot';
    }, 2000);
  }, 600);
}

function saveData() {
  localStorage.setItem(LS_KEY, JSON.stringify(collectData()));
}

function loadData() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ============================================================
//  EXPORT / IMPORT
// ============================================================

function exportCharacter() {
  const data     = collectData();
  const charName = (data['char-name'] || 'personagem').replace(/[^a-z0-9_-]/gi, '_');
  const blob     = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement('a');
  a.href         = url;
  a.download     = `swse_${charName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importCharacter(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      restoreData(data);
      saveData();
      showNotification('Ficha importada com sucesso!');
    } catch {
      showNotification('Erro: arquivo inválido.', true);
    }
  };
  reader.readAsText(file);
}

// ============================================================
//  PORTRAIT
// ============================================================

function setupPortrait() {
  const btn      = document.getElementById('portrait-btn');
  const clearBtn = document.getElementById('portrait-clear');
  const input    = document.getElementById('portrait-input');
  const area     = document.getElementById('portrait-area');
  const img      = document.getElementById('portrait-img');
  const hint     = document.getElementById('portrait-hint');

  if (!btn || !input || !img) return;

  btn.addEventListener('click', () => input.click());
  area.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      img.style.display = 'block';
      if (hint) hint.style.display = 'none';
      if (clearBtn) clearBtn.style.display = '';
      scheduleSave();
    };
    reader.readAsDataURL(file);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', e => {
      e.stopPropagation();
      img.src = '';
      img.style.display = 'none';
      if (hint) hint.style.display = '';
      clearBtn.style.display = 'none';
      input.value = '';
      scheduleSave();
    });
  }
}

// ============================================================
//  NOTIFICATION
// ============================================================

function showNotification(msg, isError = false) {
  const existing = document.getElementById('sw-notif');
  if (existing) existing.remove();

  const notif = document.createElement('div');
  notif.id = 'sw-notif';
  notif.textContent = msg;
  Object.assign(notif.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: isError ? '#c0392b' : '#1a1a2e',
    color: '#fff',
    fontFamily: 'var(--font-head)',
    fontSize: '11px',
    letterSpacing: '0.1em',
    padding: '10px 18px',
    border: isError ? '1px solid #e74c3c' : '1px solid rgba(255,255,255,0.3)',
    borderRadius: '4px',
    zIndex: '9999',
    transition: 'opacity 0.5s',
  });

  document.body.appendChild(notif);
  setTimeout(() => { notif.style.opacity = '0'; }, 2500);
  setTimeout(() => { notif.remove(); }, 3100);
}

// ============================================================
//  TAB NAVIGATION
// ============================================================

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById(`tab-${btn.dataset.tab}`);
      if (pane) pane.classList.add('active');
    });
  });
}

// ============================================================
//  NEW CHARACTER
// ============================================================

function newCharacter() {
  const name = document.getElementById('char-name');
  const charName = name && name.value ? `"${name.value}"` : 'o personagem atual';
  if (!confirm(`Deseja criar uma nova ficha em branco?\nIsso irá apagar todos os dados de ${charName}.`)) return;

  localStorage.removeItem(LS_KEY);

  // Reset species state before clearing form
  activeSpeciesKey           = null;
  activeSpeciesAutoLangCount = 0;
  const traitPanel = document.getElementById('species-traits-panel');
  if (traitPanel) traitPanel.style.display = 'none';

  // Reset class state
  classLevels     = [];
  hpByLevel       = [];
  acquiredTalents = [];
  acquiredForcePowers = [];
  pendingLevelUp  = null;
  const hpPanel   = document.getElementById('hp-roll-panel');
  if (hpPanel) hpPanel.style.display = 'none';

  document.querySelectorAll('[data-key]').forEach(el => {
    if (el.type === 'radio') {
      el.checked = el.value === 'normal';
    } else if (el.type === 'checkbox') {
      el.checked = false;
    } else if (el.id === 'total-level') {
      el.value = '1';
    } else {
      el.value = '';
    }
  });

  document.querySelectorAll('.ds-pip').forEach(p => p.classList.remove('filled'));

  const img = document.getElementById('portrait-img');
  if (img) { img.src = ''; img.style.display = 'none'; }
  const hint = document.getElementById('portrait-hint');
  if (hint) hint.style.display = '';
  const clearBtn = document.getElementById('portrait-clear');
  if (clearBtn) clearBtn.style.display = 'none';

  buildClassSection();
  buildTalentsDisplay();
  buildBonusFeatsDisplay();
  buildForcePowersDisplay();
  recalcAll();
  showNotification('Nova ficha criada!');
}

// ============================================================
//  EVENT BINDING
// ============================================================

function bindEvents() {
  // Species selection
  const speciesSelect = document.getElementById('species');
  if (speciesSelect) {
    speciesSelect.addEventListener('change', () => applySpecies(speciesSelect.value || null));
  }

  // Auto-save on all input changes
  document.addEventListener('input',  e => {
    if (e.target.id === 'xp-total') updateXpStatus(); // feedback ao vivo de progressão
    if (e.target.id !== 'species') scheduleSave();
  });
  document.addEventListener('change', e => { if (e.target.id !== 'species') { recalcAll(); scheduleSave(); } });

  // Talent modal close
  document.getElementById('talent-modal-close')?.addEventListener('click', () => {
    document.getElementById('talent-modal')?.close();
  });
  document.getElementById('talent-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  });

  // Toolbar buttons
  document.getElementById('btn-export').addEventListener('click', exportCharacter);
  document.getElementById('btn-import').addEventListener('click', () => {
    document.getElementById('file-import').click();
  });
  document.getElementById('file-import').addEventListener('change', e => {
    if (e.target.files[0]) importCharacter(e.target.files[0]);
  });
  document.getElementById('btn-new').addEventListener('click', newCharacter);
}

// ============================================================
//  INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  buildWeapons();
  buildSkills();
  buildDarkSideTrack();
  buildEquipmentTable();
  buildSimpleList('languages-container',    'lang',   LANGUAGES_COUNT,    'lang-line',    '');
  buildClassSection();
  buildTalentsDisplay();
  buildBonusFeatsDisplay();
  buildForcePowersDisplay();

  setupTabs();
  setupPortrait();
  bindEvents();

  const saved = loadData();
  if (saved) {
    restoreData(saved);
  } else {
    recalcAll();
  }

  const dot   = document.getElementById('save-dot');
  const label = document.getElementById('save-label');
  if (dot)   dot.className = 'save-dot saved';
  if (label) label.textContent = saved ? 'SALVO' : 'NOVO';
  setTimeout(() => { if (dot) dot.className = 'save-dot'; }, 2000);
});
