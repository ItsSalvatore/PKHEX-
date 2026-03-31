import { useAppStore } from '@/store/app-store';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonEditor } from '@/components/pokemon/PokemonEditor';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export function Party() {
  const { saveFile, selectedPartySlot, selectedPokemon, selectPartySlot } = useAppStore();

  if (!saveFile) {
    return <EmptyState title="Party needs a save file" description="Load a save to view and edit your active team." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Party"
        description="Up to six Pokémon. Tap a member to inspect or edit."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
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
            <PokemonEditor pokemon={selectedPokemon} onBack={() => selectPartySlot(null)} />
          ) : (
            <div className="glass rounded-xl p-10 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-surface-600" aria-hidden />
              <p className="text-sm text-slate-600 dark:text-surface-400">Choose a party member to see details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
