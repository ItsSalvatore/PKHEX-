import { useAppStore } from '@/store/app-store';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonEditor } from '@/components/pokemon/PokemonEditor';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Box, ChevronLeft, ChevronRight } from 'lucide-react';

export function Boxes() {
  const {
    saveFile, selectedBoxIndex, selectedSlot, selectedPokemon,
    selectBox, selectSlot,
  } = useAppStore();

  if (!saveFile) {
    return <EmptyState title="PC Boxes need a save file" description="Load a save to view and edit Pokémon in your boxes." />;
  }

  const currentBox = saveFile.boxes[selectedBoxIndex];
  const pokemonCount = currentBox?.pokemon.filter(p => p !== null && p.species > 0).length ?? 0;
  const slots = saveFile.slotsPerBox;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Box}
        title="PC Boxes"
        description={`${saveFile.boxCount} boxes · ${slots} slots per box · ${pokemonCount} Pokémon in this box`}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => selectBox(Math.max(0, selectedBoxIndex - 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-30 dark:border-white/[0.1] dark:text-surface-200 dark:hover:bg-white/[0.05]"
                disabled={selectedBoxIndex === 0}
                aria-label="Previous box"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="min-w-0 flex-1 px-2 text-center">
                <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {currentBox?.name ?? `Box ${selectedBoxIndex + 1}`}
                </h2>
                <p className="text-xs tabular-nums text-slate-500 dark:text-surface-500">
                  {pokemonCount}/{slots} Pokémon
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectBox(Math.min(saveFile.boxCount - 1, selectedBoxIndex + 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-30 dark:border-white/[0.1] dark:text-surface-200 dark:hover:bg-white/[0.05]"
                disabled={selectedBoxIndex === saveFile.boxCount - 1}
                aria-label="Next box"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid min-h-[4rem] grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {Array.from({ length: slots }, (_, slot) => {
                const pkm = currentBox?.pokemon[slot] ?? null;
                return (
                  <PokemonCard
                    key={slot}
                    pokemon={pkm}
                    selected={selectedSlot?.box === selectedBoxIndex && selectedSlot?.slot === slot}
                    onClick={() => selectSlot(selectedBoxIndex, slot)}
                    size="sm"
                    showDetails
                  />
                );
              })}
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {saveFile.boxes.map((box, i) => {
              const count = box.pokemon.filter(p => p !== null && p.species > 0).length;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => selectBox(i)}
                  title={`${box.name || `Box ${i + 1}`} — ${count} Pokémon`}
                  className={clsx(
                    'flex min-w-[2.75rem] flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-xs font-semibold tabular-nums transition-colors',
                    i === selectedBoxIndex
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-100'
                      : count > 0
                        ? 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-surface-200 dark:hover:border-white/[0.12]'
                        : 'border-slate-100 bg-slate-50 text-slate-400 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-surface-600',
                  )}
                >
                  <span className="text-[10px] font-medium leading-none text-slate-400 dark:text-surface-500">
                    #{i + 1}
                  </span>
                  <span className="text-sm leading-none">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {selectedPokemon && selectedSlot ? (
            <PokemonEditor pokemon={selectedPokemon} />
          ) : (
            <div className="glass rounded-xl p-10 text-center">
              <Box className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-surface-600" aria-hidden />
              <p className="text-sm text-slate-600 dark:text-surface-400">Select a slot to view or edit the Pokémon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
