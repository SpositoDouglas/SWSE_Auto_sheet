// Componente Alpine — ATRIBUTOS
// ============================================================
// Migração incremental: o Alpine passa a renderizar reativamente o modificador
// de cada atributo e a vincular (x-model) os campos de score.
//
// A PERSISTÊNCIA continua no js/script.js (os inputs mantêm id + data-key; o
// save/restore via localStorage 'swse-character-sheet' é do script.js) — assim
// evitamos double-binding e perda de dados.
//
// Sincronização: o script.js dispara o evento 'scores-changed' ao final de
// recalcAbilityMods() (chamado em todo recálculo: digitação, espécie, novo
// personagem, restore). O componente reage a esse evento relendo os inputs,
// mantendo o estado do Alpine sempre em sincronia com o pipeline existente.

import Alpine from 'alpinejs';

const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

Alpine.data('characterAttributes', () => ({
  str: null, dex: null, con: null, int: null, wis: null, cha: null,

  init() {
    this.syncFromDom();
    // Reage a qualquer recálculo do script.js (digitação/espécie/novo/restore)
    document.addEventListener('scores-changed', () => this.syncFromDom());
  },

  // Lê os valores atuais dos inputs (geridos pelo script.js) para o estado Alpine.
  syncFromDom() {
    ABILITIES.forEach(a => {
      const el = document.getElementById(`${a}-score`);
      const v = el && el.value !== '' ? parseInt(el.value, 10) : null;
      if (this[a] !== v) this[a] = v;
    });
  },

  // Modificador de atributo: ⌊(score − 10) / 2⌋
  modText(a) {
    const v = this[a];
    if (v === null || v === '' || Number.isNaN(v)) return '—';
    const m = Math.floor((v - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  },
}));
