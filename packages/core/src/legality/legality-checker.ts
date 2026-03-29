import type { Pokemon } from '../structures/pokemon.js';
import type { SaveFile } from '../structures/save-file.js';
import { calculateShiny, isSpeciesValid } from '../structures/pokemon.js';
import { GameGeneration } from '../structures/save-file.js';
import { getPokedexEntry, getSpeciesAbilityIds, getSpeciesIntroGeneration } from '../data/pokedex.js';

/** Upper bound for move IDs (Gen 9); slots above this are treated as invalid. */
const MAX_MOVE_ID = 1024;

export enum LegalityStatus {
  Legal = 'legal',
  Illegal = 'illegal',
  Warning = 'warning',
  Unknown = 'unknown',
}

export interface LegalityIssue {
  field: string;
  message: string;
  severity: LegalityStatus;
}

export interface LegalityResult {
  status: LegalityStatus;
  issues: LegalityIssue[];
  summary: string;
}

export function checkLegality(pkm: Pokemon, save?: SaveFile): LegalityResult {
  const issues: LegalityIssue[] = [];

  if (!isSpeciesValid(pkm.species)) {
    issues.push({ field: 'species', message: 'Invalid species ID', severity: LegalityStatus.Illegal });
  } else if (pkm.species > 0 && !getPokedexEntry(pkm.species)) {
    issues.push({ field: 'species', message: 'No Pokédex data for this species', severity: LegalityStatus.Warning });
  }

  if (save && pkm.species > 0) {
    const intro = getSpeciesIntroGeneration(pkm.species);
    if (intro !== null && intro > save.generation) {
      issues.push({
        field: 'species',
        message: `Species is not available in Gen ${save.generation} (introduced Gen ${intro})`,
        severity: LegalityStatus.Illegal,
      });
    }
  }

  if (save && pkm.form === 0 && pkm.species > 0 && pkm.ability > 0 && save.generation >= GameGeneration.Gen6) {
    const { first, second, hidden } = getSpeciesAbilityIds(pkm.species);
    const allowed = new Set([first, second, hidden].filter(id => id > 0));
    if (allowed.size > 0 && !allowed.has(pkm.ability)) {
      issues.push({
        field: 'ability',
        message: 'Ability does not match species ability slots (form-specific abilities not validated)',
        severity: LegalityStatus.Warning,
      });
    }
  }

  if (
    save
    && save.generation >= GameGeneration.Gen3
    && save.generation <= GameGeneration.Gen6
    && !pkm.isEgg
    && pkm.pid !== 0
  ) {
    const xorShiny = calculateShiny(pkm.pid, pkm.otId, pkm.secretId);
    if (pkm.isShiny !== xorShiny) {
      issues.push({
        field: 'shiny',
        message: 'Shiny flag does not match PID/TID/SID (Gen 3–6 XOR check)',
        severity: LegalityStatus.Warning,
      });
    }
  }

  if (pkm.level < 1 || pkm.level > 100) {
    issues.push({ field: 'level', message: 'Level must be between 1 and 100', severity: LegalityStatus.Illegal });
  }

  const totalEVs = pkm.evs.hp + pkm.evs.atk + pkm.evs.def + pkm.evs.spa + pkm.evs.spd + pkm.evs.spe;
  if (totalEVs > 510) {
    issues.push({ field: 'evs', message: `Total EVs (${totalEVs}) exceed maximum of 510`, severity: LegalityStatus.Illegal });
  }
  for (const [stat, val] of Object.entries(pkm.evs)) {
    if (val > 252) {
      issues.push({ field: `evs.${stat}`, message: `${stat} EV (${val}) exceeds 252`, severity: LegalityStatus.Illegal });
    }
    if (val < 0) {
      issues.push({ field: `evs.${stat}`, message: `${stat} EV cannot be negative`, severity: LegalityStatus.Illegal });
    }
  }

  for (const [stat, val] of Object.entries(pkm.ivs)) {
    if (val > 31 || val < 0) {
      issues.push({ field: `ivs.${stat}`, message: `${stat} IV (${val}) must be 0-31`, severity: LegalityStatus.Illegal });
    }
  }

  if (pkm.friendship < 0 || pkm.friendship > 255) {
    issues.push({ field: 'friendship', message: 'Friendship must be 0-255', severity: LegalityStatus.Illegal });
  }

  if (pkm.nature < 0 || pkm.nature > 24) {
    issues.push({ field: 'nature', message: 'Invalid nature', severity: LegalityStatus.Illegal });
  }

  const moveIds = pkm.moves.map(m => m.id);
  const nonZeroMoves = moveIds.filter(id => id > 0);
  if (nonZeroMoves.length === 0 && pkm.species > 0) {
    issues.push({ field: 'moves', message: 'Pokémon must know at least one move', severity: LegalityStatus.Illegal });
  }
  const uniqueMoves = new Set(nonZeroMoves);
  if (uniqueMoves.size < nonZeroMoves.length) {
    issues.push({ field: 'moves', message: 'Duplicate moves detected', severity: LegalityStatus.Illegal });
  }

  if (pkm.isShiny && pkm.isEgg) {
    issues.push({ field: 'shiny', message: 'Shiny eggs are very rare - verify PID/TID/SID', severity: LegalityStatus.Warning });
  }

  if (save && pkm.metLevel > pkm.level) {
    issues.push({ field: 'level', message: 'Current level below met level', severity: LegalityStatus.Illegal });
  }

  if (save) {
    const gen = save.generation;
    if (pkm.dynamaxLevel !== undefined && pkm.dynamaxLevel > 0 && gen !== GameGeneration.Gen8) {
      issues.push({ field: 'dynamaxLevel', message: 'Dynamax only valid in Gen 8', severity: LegalityStatus.Illegal });
    }
    if (pkm.teraType !== undefined && gen !== GameGeneration.Gen9) {
      issues.push({ field: 'teraType', message: 'Tera Type only valid in Gen 9', severity: LegalityStatus.Illegal });
    }
  }

  for (let mi = 0; mi < pkm.moves.length; mi++) {
    const move = pkm.moves[mi];
    if (move.ppUps > 3) {
      issues.push({ field: 'moves', message: 'PP Ups cannot exceed 3', severity: LegalityStatus.Illegal });
    }
    if (move.id > MAX_MOVE_ID) {
      issues.push({
        field: `moves.${mi}`,
        message: `Move ID ${move.id} is out of range`,
        severity: LegalityStatus.Illegal,
      });
    }
    if (move.id < 0) {
      issues.push({ field: `moves.${mi}`, message: 'Move ID cannot be negative', severity: LegalityStatus.Illegal });
    }
  }

  const status = issues.some(i => i.severity === LegalityStatus.Illegal)
    ? LegalityStatus.Illegal
    : issues.some(i => i.severity === LegalityStatus.Warning)
      ? LegalityStatus.Warning
      : issues.length === 0
        ? LegalityStatus.Legal
        : LegalityStatus.Unknown;

  return {
    status,
    issues,
    summary: status === LegalityStatus.Legal
      ? 'This Pokémon appears to be legal.'
      : `Found ${issues.length} issue(s).`,
  };
}

export function batchCheckLegality(pokemon: Pokemon[], save?: SaveFile): Map<number, LegalityResult> {
  const results = new Map<number, LegalityResult>();
  pokemon.forEach((pkm, i) => {
    results.set(i, checkLegality(pkm, save));
  });
  return results;
}
