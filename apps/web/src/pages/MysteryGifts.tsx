import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  MysteryGiftType, type MysteryGift,
  GameGeneration, GAME_NAMES,
  filterGiftsByGeneration, filterActiveGifts, searchGifts,
  getSpeciesName, canInsertGift,
} from '@pkhex/core';
import { getPokemonSprite } from '@/utils/sprites';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Gift, Search, Filter, Download, Sparkles, Check, X,
  ChevronDown, Globe, Calendar, Hash,
} from 'lucide-react';

export function MysteryGifts() {
  const { mysteryGiftDb, saveFile } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [genFilter, setGenFilter] = useState<GameGeneration | null>(null);
  const [typeFilter, setTypeFilter] = useState<MysteryGiftType | null>(null);
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedGift, setSelectedGift] = useState<MysteryGift | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredGifts = useMemo(() => {
    let gifts = mysteryGiftDb.gifts;

    if (searchQuery) {
      gifts = searchGifts(mysteryGiftDb, searchQuery);
    }
    if (genFilter !== null) {
      gifts = gifts.filter(g => g.generation === genFilter);
    }
    if (typeFilter !== null) {
      gifts = gifts.filter(g => g.type === typeFilter);
    }
    if (activeOnly) {
      gifts = gifts.filter(g => g.isActive);
    }

    return gifts;
  }, [mysteryGiftDb, searchQuery, genFilter, typeFilter, activeOnly]);

  const generations = [
    { gen: GameGeneration.Gen4, label: 'Gen 4' },
    { gen: GameGeneration.Gen5, label: 'Gen 5' },
    { gen: GameGeneration.Gen6, label: 'Gen 6' },
    { gen: GameGeneration.Gen7, label: 'Gen 7' },
    { gen: GameGeneration.Gen8, label: 'Gen 8' },
    { gen: GameGeneration.Gen9, label: 'Gen 9' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Gift className="w-6 h-6 text-emerald-400" /> Mystery Gift Database
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          {mysteryGiftDb.totalCount} mystery gifts across all generations
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-3"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search mystery gifts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              'btn-secondary flex items-center gap-2',
              showFilters && 'border-indigo-500/30',
            )}
          >
            <Filter className="w-4 h-4" /> Filters
            <ChevronDown className={clsx('w-3 h-3 transition-transform', showFilters && 'rotate-180')} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs text-surface-400 mb-2">Generation</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setGenFilter(null)}
                      className={clsx(
                        'px-3 py-1 rounded-lg text-xs transition-all',
                        genFilter === null ? 'bg-indigo-500/20 text-indigo-300' : 'text-surface-400 hover:text-white',
                      )}
                    >
                      All
                    </button>
                    {generations.map(g => (
                      <button
                        key={g.gen}
                        onClick={() => setGenFilter(genFilter === g.gen ? null : g.gen)}
                        className={clsx(
                          'px-3 py-1 rounded-lg text-xs transition-all',
                          genFilter === g.gen ? 'bg-indigo-500/20 text-indigo-300' : 'text-surface-400 hover:text-white',
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-surface-400 mb-2">Type</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setTypeFilter(null)}
                      className={clsx(
                        'px-3 py-1 rounded-lg text-xs transition-all',
                        typeFilter === null ? 'bg-indigo-500/20 text-indigo-300' : 'text-surface-400 hover:text-white',
                      )}
                    >
                      All
                    </button>
                    {Object.values(MysteryGiftType).map(t => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                        className={clsx(
                          'px-3 py-1 rounded-lg text-xs transition-all capitalize',
                          typeFilter === t ? 'bg-indigo-500/20 text-indigo-300' : 'text-surface-400 hover:text-white',
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-surface-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeOnly}
                    onChange={e => setActiveOnly(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-indigo-500"
                  />
                  Active events only
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {filteredGifts.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <Gift className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400">No gifts match your criteria</p>
            </div>
          ) : (
            filteredGifts.map((gift, i) => (
              <motion.button
                key={gift.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                onClick={() => setSelectedGift(gift)}
                className={clsx(
                  'w-full text-left glass rounded-xl p-4 transition-all group',
                  selectedGift?.id === gift.id
                    ? 'glow-border'
                    : 'glass-hover',
                )}
              >
                <div className="flex items-center gap-3">
                  {gift.species ? (
                    <img
                      src={getPokemonSprite(gift.species, gift.isShiny)}
                      alt={gift.speciesName}
                      className="w-10 h-10 pixelated"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">{gift.title}</p>
                      {gift.isShiny && <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-surface-400 truncate">{gift.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-surface-500">Gen {gift.generation}</span>
                    {gift.isActive && (
                      <span className="badge badge-legal text-[10px]">Active</span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>

        <div>
          {selectedGift ? (
            <motion.div
              key={selectedGift.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl overflow-hidden sticky top-6"
            >
              {selectedGift.species && (
                <div className="h-40 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 flex items-center justify-center">
                  <img
                    src={getPokemonSprite(selectedGift.species, selectedGift.isShiny)}
                    alt={selectedGift.speciesName}
                    className="h-32 pixelated drop-shadow-2xl"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{selectedGift.title}</h3>
                    {selectedGift.isShiny && <span className="badge badge-shiny"><Sparkles className="w-3 h-3 mr-1" />Shiny</span>}
                  </div>
                  <p className="text-sm text-surface-400">{selectedGift.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedGift.species && (
                    <>
                      <div>
                        <p className="text-xs text-surface-500 mb-0.5">Species</p>
                        <p className="text-sm font-medium text-white">{selectedGift.speciesName} (#{selectedGift.species})</p>
                      </div>
                      <div>
                        <p className="text-xs text-surface-500 mb-0.5">Level</p>
                        <p className="text-sm font-medium text-white">{selectedGift.level}</p>
                      </div>
                    </>
                  )}
                  {selectedGift.itemName && (
                    <>
                      <div>
                        <p className="text-xs text-surface-500 mb-0.5">Item</p>
                        <p className="text-sm font-medium text-white">{selectedGift.itemName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-surface-500 mb-0.5">Count</p>
                        <p className="text-sm font-medium text-white">×{selectedGift.itemCount}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-xs text-surface-500 mb-0.5 flex items-center gap-1"><Globe className="w-3 h-3" /> Region</p>
                    <p className="text-sm font-medium text-white">{selectedGift.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 mb-0.5 flex items-center gap-1"><Hash className="w-3 h-3" /> Generation</p>
                    <p className="text-sm font-medium text-white">Gen {selectedGift.generation}</p>
                  </div>
                  {selectedGift.serialCode && (
                    <div className="col-span-2">
                      <p className="text-xs text-surface-500 mb-0.5">Serial Code</p>
                      <p className="text-sm font-mono font-semibold text-indigo-400">{selectedGift.serialCode}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  {saveFile && canInsertGift(selectedGift, saveFile.generation) && (
                    <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Insert into Save
                    </button>
                  )}
                  <button className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export .wc
                  </button>
                </div>

                {saveFile && !canInsertGift(selectedGift, saveFile.generation) && (
                  <p className="text-xs text-amber-400 bg-amber-500/10 rounded-lg p-2 text-center">
                    This gift is for Gen {selectedGift.generation}, but your save is Gen {saveFile.generation}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center sticky top-6">
              <Gift className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400 text-sm">Select a gift to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
