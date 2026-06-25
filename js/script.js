'use strict';

// ============================================================
//  STAR WARS SAGA EDITION — FICHA ONLINE
// ============================================================

const LS_KEY = 'swse-character-sheet';

// ============================================================
//  SKILLS DEFINITION
//  trainedOnly: ^ cannot be used untrained
//  armorPenalty: * armor check penalty applies
//  custom: user fills in the name (Knowledge skills)
//  marker: ► shown on original sheet
// ============================================================
const SKILLS = [
  { id: 'acrobatics',   name: 'Acrobatics',         ability: 'dex', armorPenalty: true,  trainedOnly: false },
  { id: 'climb',        name: 'Climb',               ability: 'str', armorPenalty: true,  trainedOnly: false },
  { id: 'deception',    name: 'Deception',           ability: 'cha', armorPenalty: false, trainedOnly: false },
  { id: 'endurance',    name: 'Endurance',           ability: 'con', armorPenalty: true,  trainedOnly: false },
  { id: 'gatherInfo',   name: 'Gather Information',  ability: 'cha', armorPenalty: false, trainedOnly: false },
  { id: 'initiative',   name: 'Initiative',          ability: 'dex', armorPenalty: false, trainedOnly: false, marker: true },
  { id: 'jump',         name: 'Jump',                ability: 'str', armorPenalty: true,  trainedOnly: false },
  { id: 'know1',        name: 'Knowledge',           ability: 'int', armorPenalty: false, trainedOnly: true,  custom: true },
  { id: 'know2',        name: 'Knowledge',           ability: 'int', armorPenalty: false, trainedOnly: true,  custom: true },
  { id: 'know3',        name: 'Knowledge',           ability: 'int', armorPenalty: false, trainedOnly: true,  custom: true },
  { id: 'know4',        name: 'Knowledge',           ability: 'int', armorPenalty: false, trainedOnly: true,  custom: true },
  { id: 'mechanics',    name: 'Mechanics',           ability: 'int', armorPenalty: false, trainedOnly: true  },
  { id: 'perception',   name: 'Perception',          ability: 'wis', armorPenalty: false, trainedOnly: false, marker: true },
  { id: 'persuasion',   name: 'Persuasion',          ability: 'cha', armorPenalty: false, trainedOnly: false },
  { id: 'pilot',        name: 'Pilot',               ability: 'dex', armorPenalty: false, trainedOnly: false },
  { id: 'ride',         name: 'Ride',                ability: 'dex', armorPenalty: true,  trainedOnly: false },
  { id: 'stealth',      name: 'Stealth',             ability: 'dex', armorPenalty: true,  trainedOnly: false },
  { id: 'survival',     name: 'Survival',            ability: 'wis', armorPenalty: false, trainedOnly: false },
  { id: 'swim',         name: 'Swim',                ability: 'str', armorPenalty: true,  trainedOnly: false },
  { id: 'treatInjury',  name: 'Treat Injury',        ability: 'wis', armorPenalty: false, trainedOnly: false },
  { id: 'useComputer',  name: 'Use Computer',        ability: 'int', armorPenalty: false, trainedOnly: false },
  { id: 'useTheForce',  name: 'Use the Force',       ability: 'cha', armorPenalty: false, trainedOnly: true  },
];

let activeSpeciesKey      = null;
let activeSpeciesAutoLangCount = 0;

// classLevels: [{classKey:'jedi', level:5}, {classKey:'noble', level:3}]
// hpByLevel:   [{classKey:'jedi', classLv:1, roll:10, total:13}, ...] index = charLevel-1
// acquiredTalents: [{classKey, treeKey, talentId, charLevel}, ...]
let classLevels      = [];
let hpByLevel        = [];
let acquiredTalents  = [];
let pendingLevelUp   = null; // {classKey, charLevel, isNew} while waiting HP roll

const EXTRA_SKILLS_COUNT = 4;
const WEAPONS_COUNT      = 5;
const FEATS_COUNT        = 14;
const EQUIPMENT_ROWS     = 14;
const LANGUAGES_COUNT    = 8;
const FORCE_POWERS_COUNT = 14;
const TALENTS_COUNT      = 16;
const ADD_FEATS_COUNT    = 16;

// ============================================================
//  UTILITY
// ============================================================

function abilityMod(score) {
  const s = parseInt(score, 10);
  if (isNaN(s)) return null;
  return Math.floor((s - 10) / 2);
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
//  STARFIELD CANVAS
// ============================================================

function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function draw() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // deep space gradient
    const grad = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.35, 0,
      canvas.width * 0.5, canvas.height * 0.5,  Math.max(canvas.width, canvas.height) * 0.7
    );
    grad.addColorStop(0, '#0e1224');
    grad.addColorStop(1, '#060810');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // stars
    const count = Math.floor((canvas.width * canvas.height) / 3000);
    for (let i = 0; i < count; i++) {
      const x    = Math.random() * canvas.width;
      const y    = Math.random() * canvas.height;
      const r    = Math.random() * 1.2 + 0.2;
      const a    = Math.random() * 0.75 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      ctx.fill();
    }
  }

  draw();
  window.addEventListener('resize', draw);
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

function buildFeats() {
  const container = document.getElementById('feats-container');
  if (!container) return;
  container.style.padding = '8px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '4px';

  for (let i = 0; i < FEATS_COUNT; i++) {
    const inp = document.createElement('input');
    inp.className = 'feat-line';
    inp.type = 'text';
    inp.id = `feat-${i}`;
    inp.dataset.key = `feat-${i}`;
    inp.autocomplete = 'off';
    container.appendChild(inp);
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

  activeSpeciesKey = newKey || null;

  const speedInput = document.getElementById('speed');
  if (speedInput && newData) speedInput.value = newData.speed;
  else if (speedInput && !newData) speedInput.value = '';

  updateAutoLanguages(newData ? newData.autoLangs : []);
  renderSpeciesTraits(newData);
  recalcAll();
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
  let best = 0;
  classLevels.forEach(e => {
    const cls = ALL_CLASSES[e.classKey];
    if (!cls) return;
    const bab = cls.baseAttack[e.level - 1] || 0;
    if (bab > best) best = bab;
  });
  return best;
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
      const alreadyPicked = acquiredTalents.some(t => t.charLevel === charLv);
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

function hasTalent(talentId) {
  return acquiredTalents.some(t => t.talentId === talentId);
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
    plusBtn.title = `Subir de nível em ${cls ? cls.name : e.classKey}`;
    plusBtn.textContent = '+';
    plusBtn.dataset.classKey = e.classKey;
    plusBtn.addEventListener('click', () => startLevelUp(e.classKey, false));

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
  const available = Object.keys(ALL_CLASSES).filter(k => !takenKeys.includes(k));

  actionsEl.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'class-selector-label';
  label.textContent = mode === 'first' ? 'Escolha sua classe:' : 'Nova classe:';
  actionsEl.appendChild(label);

  available.forEach(key => {
    const cls = ALL_CLASSES[key];
    const btn = document.createElement('button');
    btn.className = 'class-choice-btn';
    btn.textContent = cls.name;
    btn.addEventListener('click', () => startLevelUp(key, mode !== 'first'));
    actionsEl.appendChild(btn);
  });

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
      const r = parseInt(rollInput.value, 10);
      if (!isNaN(r) && totalEl) {
        const t = Math.max(1, r + conMod);
        totalEl.textContent = t;
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
    hpGained = cls.startingHP + conMod;
  } else {
    if (isNaN(roll) || roll < 1 || roll > cls.hitDie) {
      showNotification(`Digite um resultado válido (1–${cls.hitDie})`, true);
      return;
    }
    hpGained = Math.max(1, roll + conMod);
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
    html += `<div class="class-trait-entry">
      <div class="class-trait-header">${cls.name.toUpperCase()}</div>
      <div class="class-trait-row"><span class="ctlbl">Dado de Vida:</span> d${cls.hitDie}</div>
      <div class="class-trait-row"><span class="ctlbl">Perícias Treinadas:</span> ${cls.trainedSkillsBase} + mod INT</div>
      <div class="class-trait-row"><span class="ctlbl">Bônus de Defesa:</span> FORT +${cls.defenseBonus.fort||0}, REF +${cls.defenseBonus.ref||0}, VON +${cls.defenseBonus.will||0}</div>
      <div class="class-trait-row"><span class="ctlbl">Aptidões Iniciais:</span> ${cls.startingFeats.join(', ')}</div>
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

  // List acquired talents
  if (acquiredTalents.filter(t => t.treeKey !== '__bonusFeat__').length > 0) {
    html += '<div class="acquired-talents">';
    acquiredTalents
      .filter(t => t.treeKey !== '__bonusFeat__')
      .forEach(t => {
        const cls = ALL_CLASSES[t.classKey];
        const tree = cls?.talentTrees.find(tr => tr.key === t.treeKey);
        const talent = tree?.talents.find(tl => tl.id === t.talentId);
        if (!talent) return;
        html += `<div class="acquired-talent-item">
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

  // Bind remove buttons
  container.querySelectorAll('.at-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cl = parseInt(btn.dataset.charLevel);
      acquiredTalents = acquiredTalents.filter(t => !(t.charLevel === cl && t.treeKey !== '__bonusFeat__'));
      buildTalentsDisplay();
      scheduleSave();
    });
  });
}

function buildBonusFeatsDisplay() {
  const container = document.getElementById('class-bonus-feats-display');
  if (!container) return;

  const pendingSlots = getPendingBonusFeatSlots();

  let html = '';

  // Acquired bonus feats
  const bonusFeats = acquiredTalents.filter(t => t.treeKey === '__bonusFeat__');
  if (bonusFeats.length > 0) {
    html += '<div class="acquired-talents">';
    bonusFeats.forEach(t => {
      const cls = ALL_CLASSES[t.classKey];
      html += `<div class="acquired-talent-item">
        <span class="at-name">${t.talentId}</span>
        <span class="at-source">${cls?.name || t.classKey} — Aptidão Bônus</span>
        <button class="at-remove-btn" data-char-level="${t.charLevel}" data-tree="__bonusFeat__" title="Remover">✕</button>
      </div>`;
    });
    html += '</div>';
  } else if (pendingSlots.length === 0) {
    html += '<p class="no-talents-msg">Nenhuma aptidão bônus adquirida.</p>';
  }

  // Pending bonus feat slots
  pendingSlots.forEach(slot => {
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

  container.innerHTML = html;

  // Bind pick buttons
  container.querySelectorAll('.bonus-feat-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openBonusFeatModal(btn.dataset.class, parseInt(btn.dataset.charLevel));
    });
  });

  container.querySelectorAll('.at-remove-btn[data-tree="__bonusFeat__"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cl = parseInt(btn.dataset.charLevel);
      acquiredTalents = acquiredTalents.filter(t => !(t.charLevel === cl && t.treeKey === '__bonusFeat__'));
      buildBonusFeatsDisplay();
      scheduleSave();
    });
  });
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
      const alreadyHas = hasTalent(talent.id) && !talent.multiSelect;
      const locked = !prereqMet || alreadyHas;

      html += `<div class="tm-talent ${locked ? 'tm-locked' : 'tm-available'}" data-talent-id="${talent.id}" data-tree="${tree.key}">
        <div class="tm-talent-name">${talent.name}${alreadyHas ? ' ✓' : ''}</div>`;

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
        html += `<div class="tm-prereq tm-prereq-feat">Aptidão: ${talent.requiresFeat}</div>`;
      }
      if (talent.requiresBab) {
        html += `<div class="tm-prereq tm-prereq-feat">BAB: +${talent.requiresBab}</div>`;
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

  title.textContent = `SELECT BONUS FEAT — ${cls.name.toUpperCase()} (Character Level ${charLevel})`;

  let html = '<div class="tm-tree"><div class="tm-tree-name">Bonus Feat List</div><div class="tm-talents">';
  (cls.bonusFeatList || []).forEach(featName => {
    const alreadyHas = acquiredTalents.some(t => t.talentId === featName && t.treeKey === '__bonusFeat__' && t.classKey === classKey);
    html += `<div class="tm-talent tm-available tm-feat-item" data-feat="${featName}">
      <div class="tm-talent-name">${featName}${alreadyHas ? ' ✓' : ''}</div>
    </div>`;
  });
  html += '</div></div>';

  body.innerHTML = html;

  body.querySelectorAll('.tm-feat-item').forEach(el => {
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

    const modEl = document.getElementById(`${a}-mod`);
    if (modEl) modEl.textContent = fmtMod(mod);
  });

  return mods;
}

function recalcDefenses(mods) {
  const heroicLevel = getCharLevel() || numVal('total-level', 1);
  const classDef    = getBestDefBonus();

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
      const total = 10 + heroicLevel + d.clsBonus + abilMod + misc;
      if (totalEl) totalEl.textContent = total;
    } else {
      if (totalEl) totalEl.textContent = '—';
    }
  });
}

function recalcSkills(mods) {
  const halfLevel = Math.floor(numVal('total-level', 1) / 2);

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

    let total = halfLevel + abilMod + misc;
    if (trained) total += 5;
    if (focus)   total += 1;

    totalEl.textContent = total >= 0 ? '+' + total : total;
    totalEl.title = '';
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

function recalcAll() {
  const mods = recalcAbilityMods();
  recalcDefenses(mods);
  recalcSkills(mods);
  recalcDamageThreshold();
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
  } catch { classLevels = []; hpByLevel = []; acquiredTalents = []; }

  recalcAll();
  buildClassSection();
  buildTalentsDisplay();
  buildBonusFeatsDisplay();

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
  document.addEventListener('input',  e => { if (e.target.id !== 'species') scheduleSave(); });
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
  initStarfield();
  buildWeapons();
  buildSkills();
  buildFeats();
  buildDarkSideTrack();
  buildEquipmentTable();
  buildSimpleList('languages-container',    'lang',   LANGUAGES_COUNT,    'lang-line',    '');
  buildSimpleList('force-powers-container', 'fp',     FORCE_POWERS_COUNT, 'fp-line',      '');
  buildClassSection();
  buildTalentsDisplay();
  buildBonusFeatsDisplay();

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
