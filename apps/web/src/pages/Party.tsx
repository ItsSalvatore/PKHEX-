import { useAppStore } from '@/store/app-store';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonEditor } from '@/components/pokemon/PokemonEditor';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export function Party() {
  const { saveFile, selectedPartySlot, selectedPokemon, selectPartySlot } = useAppStore();

  if (!saveFile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-surface-400">No save file loaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-400" /> Party
        </h1>
        <p className="text-surface-400 text-sm mt-1">Your active team of up to 6 Pokémon</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-3">
            {saveFile.party.map((pkm, i) => (
              <PokemonCard
                key={i}
                pokemon={pkm}
                selected={selectedPartySlot === i}
                onClick={() => selectPartySlot(i)}
                size="lg"
                showDetails
              />
            ))}
          </div>
        </motion.div>

        <div>
          {selectedPokemon && selectedPartySlot !== null ? (
            <PokemonEditor
              pokemon={selectedPokemon}
              onBack={() => selectPartySlot(-1)}
            />
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <Users className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400">Select a party member to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
