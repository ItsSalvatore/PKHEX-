import { useAppStore } from '@/store/app-store';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonEditor } from '@/components/pokemon/PokemonEditor';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Box, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

export function Boxes() {
  const {
    saveFile, selectedBoxIndex, selectedSlot, selectedPokemon,
    selectBox, selectSlot,
  } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  if (!saveFile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-surface-400">No save file loaded</p>
      </div>
    );
  }

  const currentBox = saveFile.boxes[selectedBoxIndex];
  const pokemonCount = currentBox?.pokemon.filter(p => p !== null).length ?? 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Box className="w-6 h-6 text-purple-400" /> PC Boxes
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          {saveFile.boxCount} boxes · {saveFile.slotsPerBox} slots each
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
              <div className="text-center">
                <h3 className="text-sm font-semibold text-white">{currentBox?.name ?? 'Box'}</h3>
                <p className="text-xs text-surface-400">{pokemonCount} Pokémon</p>
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
              const count = box.pokemon.filter(p => p !== null).length;
              return (
                <button
                  key={i}
                  onClick={() => selectBox(i)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    i === selectedBoxIndex
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : count > 0
                        ? 'glass text-surface-300 hover:text-white'
                        : 'bg-white/[0.02] text-surface-600 hover:text-surface-400',
                  )}
                >
                  {i + 1}
                  {count > 0 && <span className="ml-1 text-[10px] opacity-60">({count})</span>}
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
