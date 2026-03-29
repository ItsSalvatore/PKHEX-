import { useAppStore } from '@/store/app-store';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonEditor } from '@/components/pokemon/PokemonEditor';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Box, ChevronLeft, ChevronRight } from 'lucide-react';

export function Boxes() {
  const {
    saveFile, selectedBoxIndex, selectedSlot, selectedPokemon,
    selectBox, selectSlot,
  } = useAppStore();

  if (!saveFile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-surface-400">No save file loaded</p>
      </div>
    );
  }

  const currentBox = saveFile.boxes[selectedBoxIndex];
  const pokemonCount = currentBox?.pokemon.filter(p => p !== null && p.species > 0).length ?? 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Box className="w-6 h-6 text-purple-400" /> PC Boxes
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          {saveFile.boxCount} boxes · up to {saveFile.slotsPerBox} Pokémon per box
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => selectBox(Math.max(0, selectedBoxIndex - 1))}
                className="p-2 rounded-lg glass-hover"
                disabled={selectedBoxIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center min-w-0 px-2">
                <h3 className="text-sm font-semibold text-white truncate">{currentBox?.name ?? 'Box'}</h3>
                <p className="text-xs text-surface-400 tabular-nums">
                  {pokemonCount}/{saveFile.slotsPerBox} in this box
                </p>
              </div>
              <button
                onClick={() => selectBox(Math.min(saveFile.boxCount - 1, selectedBoxIndex + 1))}
                className="p-2 rounded-lg glass-hover"
                disabled={selectedBoxIndex === saveFile.boxCount - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {currentBox?.pokemon.map((pkm, slot) => (
                <PokemonCard
                  key={`${selectedBoxIndex}-${slot}`}
                  pokemon={pkm}
                  selected={selectedSlot?.box === selectedBoxIndex && selectedSlot?.slot === slot}
                  onClick={() => selectSlot(selectedBoxIndex, slot)}
                  size="sm"
                  showDetails
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 flex-wrap"
          >
            {saveFile.boxes.map((box, i) => {
              const count = box.pokemon.filter(p => p !== null && p.species > 0).length;
              return (
                <button
                  key={i}
                  onClick={() => selectBox(i)}
                  title={`${box.name || `Box ${i + 1}`} — ${count} Pokémon`}
                  className={clsx(
                    'min-w-[2.75rem] px-2 py-2 rounded-lg text-xs font-semibold tabular-nums transition-all flex flex-col items-center gap-0.5',
                    i === selectedBoxIndex
                      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30'
                      : count > 0
                        ? 'glass text-surface-200 hover:text-white border border-transparent'
                        : 'bg-white/[0.02] text-surface-500 hover:text-surface-400 border border-white/[0.04]',
                  )}
                >
                  <span className="text-[10px] font-medium text-surface-500 leading-none">#{i + 1}</span>
                  <span className="text-sm leading-none">{count}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        <div>
          {selectedPokemon && selectedSlot ? (
            <PokemonEditor pokemon={selectedPokemon} />
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <Box className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400 text-sm">Select a Pokémon to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
