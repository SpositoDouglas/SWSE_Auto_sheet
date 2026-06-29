// ============================================================
//  ALL_CLASSES — agrega as 5 classes base + classes de prestígio.
//  Barrel file (ES Modules). Acesso via: ALL_CLASSES['jedi'], etc.
// ============================================================

import { CLASS_JEDI } from './jedi.js';
import { CLASS_NOBLE } from './noble.js';
import { CLASS_SCOUNDREL } from './scoundrel.js';
import { CLASS_SCOUT } from './scout.js';
import { CLASS_SOLDIER } from './soldier.js';
import { CLASS_ACE_PILOT } from './ace_pilot.js';
import { CLASS_BOUNTY_HUNTER } from './bounty_hunter.js';
import { CLASS_CRIME_LORD } from './crime_lord.js';
import { CLASS_ELITE_TROOPER } from './elite_trooper.js';
import { CLASS_FORCE_ADEPT } from './force_adept.js';
import { CLASS_FORCE_DISCIPLE } from './force_disciple.js';
import { CLASS_GUNSLINGER } from './gunslinger.js';
import { CLASS_JEDI_KNIGHT } from './jedi_knight.js';
import { CLASS_JEDI_MASTER } from './jedi_master.js';
import { CLASS_OFFICER } from './officer.js';
import { CLASS_SITH_APPRENTICE } from './sith_apprentice.js';
import { CLASS_SITH_LORD } from './sith_lord.js';

export const ALL_CLASSES = {
  // Classes base (heroicas)
  jedi:      CLASS_JEDI,
  noble:     CLASS_NOBLE,
  scoundrel: CLASS_SCOUNDREL,
  scout:     CLASS_SCOUT,
  soldier:   CLASS_SOLDIER,
  // Classes de prestígio
  acePilot:        CLASS_ACE_PILOT,
  bountyHunter:    CLASS_BOUNTY_HUNTER,
  crimeLord:       CLASS_CRIME_LORD,
  eliteTrooper:    CLASS_ELITE_TROOPER,
  forceAdept:      CLASS_FORCE_ADEPT,
  forceDisciple:   CLASS_FORCE_DISCIPLE,
  gunslinger:      CLASS_GUNSLINGER,
  jediKnight:      CLASS_JEDI_KNIGHT,
  jediMaster:      CLASS_JEDI_MASTER,
  officer:         CLASS_OFFICER,
  sithApprentice:  CLASS_SITH_APPRENTICE,
  sithLord:        CLASS_SITH_LORD,
};

// XP thresholds per character level (index 0 = level 1)
export const XP_THRESHOLDS = [
  0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000,
  55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000,
];

// Character-level benefits (feats at 1,3,6,9,12,15,18; ability boosts at 4,8,12,16,20)
export const LEVEL_BENEFITS = {
  1:  { feat: true },
  3:  { feat: true },
  4:  { abilityBoost: true },
  6:  { feat: true },
  8:  { abilityBoost: true },
  9:  { feat: true },
  12: { feat: true, abilityBoost: true },
  15: { feat: true },
  16: { abilityBoost: true },
  18: { feat: true },
  20: { abilityBoost: true },
};

// Ao multiclassar, o personagem NÃO recebe: todas as aptidões iniciais (só 1),
// HP máximo triplicado e créditos iniciais.
export const MULTICLASS_EXCLUDED = ['allStartingFeats', 'maxHP', 'startingCredits'];
