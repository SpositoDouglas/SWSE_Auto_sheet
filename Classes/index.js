'use strict';

// ============================================================
//  ALL_CLASSES — aggregates all 5 base classes
//  Loaded after each individual class file.
//  Access via: ALL_CLASSES['jedi'], ALL_CLASSES['noble'], etc.
// ============================================================

const ALL_CLASSES = {
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
const XP_THRESHOLDS = [
  0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000,
  55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000,
];

// Character-level benefits (feats at 1,3,6,9,12,15,18; ability boosts at 4,8,12,16,20)
const LEVEL_BENEFITS = {
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

// When adding a new class via multiclassing, the character does NOT get:
//   - All starting feats (only ONE choice from the starting feat list)
//   - Maximum tripled starting HP
//   - Starting credits
const MULTICLASS_EXCLUDED = ['allStartingFeats', 'maxHP', 'startingCredits'];
