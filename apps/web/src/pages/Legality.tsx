import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  checkLegality, LegalityStatus, getSpeciesName,
  type Pokemon, type LegalityResult,
} from '@pkhex/core';
import { getPokemonSprite } from '@/utils/sprites';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Shield, CheckCircle, XCircle, AlertTriangle, Zap } from 'lucide-react';

export function Legality() {
  const { saveFile } = useAppStore();

  const results = useMemo(() => {
    if (!saveFile) return [];

    const allPokemon: Array<{ pkm: Pokemon; location: string; result: LegalityResult }> = [];

    saveFile.party.forEach((pkm, i) => {
      if (pkm && pkm.species > 0) {
        allPokemon.push({
          pkm,
          location: `Party Slot ${i + 1}`,
          result: checkLegality(pkm, saveFile),
        });
      }
    });

    saveFile.boxes.forEach((box, bi) => {
      box.pokemon.forEach((pkm, si) => {
        if (pkm && pkm.species > 0) {
          allPokemon.push({
            pkm,
            location: `${box.name} Slot ${si + 1}`,
            result: checkLegality(pkm, saveFile),
          });
        }
      });
    });

    return allPokemon;
  }, [saveFile]);

  if (!saveFile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-surface-400">No save file loaded</p>
      </div>
    );
  }

  const legalCount = results.filter(r => r.result.status === LegalityStatus.Legal).length;
  const illegalCount = results.filter(r => r.result.status === LegalityStatus.Illegal).length;
  const warningCount = results.filter(r => r.result.status === LegalityStatus.Warning).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-400" /> Legality Checker
        </h1>
        <p className="text-surface-400 text-sm mt-1">Scan all Pokémon for legality issues</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="glass rounded-xl p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{legalCount}</p>
          <p className="text-xs text-surface-400">Legal</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{warningCount}</p>
          <p className="text-xs text-surface-400">Warnings</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{illegalCount}</p>
          <p className="text-xs text-surface-400">Illegal</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        {results.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <Zap className="w-12 h-12 text-surface-600 mx-auto mb-4" />
            <p className="text-surface-400">No Pokémon to check</p>
          </div>
        ) : (
          results.map((entry, i) => (
            <div
              key={i}
              className={clsx(
                'glass rounded-xl p-4 flex items-center gap-4',
                entry.result.status === LegalityStatus.Illegal && 'border-red-500/20',
                entry.result.status === LegalityStatus.Warning && 'border-amber-500/20',
              )}
            >
              <img
                src={getPokemonSprite(entry.pkm.species, entry.pkm.isShiny)}
                alt={getSpeciesName(entry.pkm.species)}
                className="w-10 h-10 pixelated"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">
                  {entry.pkm.nickname || getSpeciesName(entry.pkm.species)}
                  <span className="ml-2 text-xs text-surface-400">Lv.{entry.pkm.level}</span>
                </p>
                <p className="text-xs text-surface-500">{entry.location}</p>
                {entry.result.issues.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {entry.result.issues.slice(0, 3).map((issue, j) => (
                      <span key={j} className={clsx(
                        'text-[10px] px-2 py-0.5 rounded',
                        issue.severity === LegalityStatus.Illegal
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-amber-500/10 text-amber-400',
                      )}>
                        {issue.message}
                      </span>
                    ))}
                    {entry.result.issues.length > 3 && (
                      <span className="text-[10px] text-surface-500">+{entry.result.issues.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
              <div className={clsx(
                'badge',
                entry.result.status === LegalityStatus.Legal && 'badge-legal',
                entry.result.status === LegalityStatus.Illegal && 'badge-illegal',
                entry.result.status === LegalityStatus.Warning && 'badge-warning',
              )}>
                {entry.result.status === LegalityStatus.Legal && <CheckCircle className="w-3 h-3 mr-1" />}
                {entry.result.status === LegalityStatus.Illegal && <XCircle className="w-3 h-3 mr-1" />}
                {entry.result.status === LegalityStatus.Warning && <AlertTriangle className="w-3 h-3 mr-1" />}
                {entry.result.status}
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}
