import { useMemo, useState } from 'react';
import {
  getDocumentedSpeciesIds,
  getPokedexEntry,
  getSpeciesName,
  TYPE_COLORS,
  TYPE_NAMES,
  PokemonType,
} from '@pkhex/core';
import { PokemonSprite } from '@/components/pokemon/PokemonSprite';
import { PageHeader } from '@/components/layout/PageHeader';
import { motion } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';
const STAT_LABELS = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'] as const;

export function Pokedex() {
  const [query, setQuery] = useState('');
  const ids = useMemo(() => getDocumentedSpeciesIds(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ids;
    return ids.filter((id) => getSpeciesName(id).toLowerCase().includes(q) || String(id).includes(q));
  }, [ids, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Pokédex"
        description={`Reference data and sprites (PokeAPI). ${ids.length} species in this build.`}
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-surface-500" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or number…"
          className="input-field pl-10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
      >
        {filtered.map((id) => {
          const entry = getPokedexEntry(id);
          const name = getSpeciesName(id);
          const t1 = entry?.t[0] ?? PokemonType.Normal;
          const t2 = entry?.t[1];
          return (
            <div
              key={id}
              className="glass flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-3 transition-colors hover:border-indigo-300 dark:border-white/[0.06] dark:hover:border-indigo-500/20"
            >
              <span className="text-[10px] text-surface-500 font-mono w-full text-left">#{id}</span>
              <PokemonSprite
                species={id}
                shiny={false}
                form={0}
                alt={name}
                className="w-16 h-16 pixelated object-contain"
              />
              <p className="text-xs font-semibold text-white text-center leading-tight line-clamp-2">{name}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                <TypePill type={t1 as PokemonType} />
                {t2 !== null && t2 !== undefined && <TypePill type={t2 as PokemonType} />}
              </div>
              {entry && (
                <div className="w-full space-y-0.5 text-[9px] font-mono">
                  {STAT_LABELS.map((label, i) => (
                    <div key={label} className="flex justify-between gap-2 text-surface-400">
                      <span className="text-surface-500">{label}</span>
                      <span className="text-white tabular-nums">{entry.s[i]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-surface-400 text-sm text-center py-12">No species match your search.</p>
      )}
    </div>
  );
}

function TypePill({ type }: { type: PokemonType }) {
  const bg = TYPE_COLORS[type] ?? '#6b7280';
  return (
    <span
      className="text-[9px] px-1.5 py-0.5 rounded font-medium text-white/95 shadow-sm"
      style={{ backgroundColor: bg }}
    >
      {TYPE_NAMES[type] ?? '?'}
    </span>
  );
}
