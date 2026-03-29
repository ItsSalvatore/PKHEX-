import { useState, useMemo } from 'react';
import {
  createCheatCodeDatabase,
  searchCheatCodes,
  getAvailableGames,
  getAvailableCategories,
  type CheatCode,
  type CheatCodeDatabase,
  CheatCategory,
  GameGeneration,
  GameVersion,
  GAME_NAMES,
} from '@pkhex/core';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Gamepad2, Search, Filter, Copy, Check, ChevronDown,
  AlertTriangle, Zap, Joystick, Tag, BookOpen, Shield,
} from 'lucide-react';

const GEN_LABELS: Record<number, string> = {
  3: 'Gen 3 (GBA)',
  4: 'Gen 4 (NDS)',
  5: 'Gen 5 (NDS)',
  6: 'Gen 6 (3DS)',
  7: 'Gen 7 (3DS)',
  8: 'Gen 8 (Switch)',
  9: 'Gen 9 (Switch)',
};

const CATEGORY_ICONS: Partial<Record<CheatCategory, string>> = {
  [CheatCategory.WalkThroughWalls]: '🚶',
  [CheatCategory.RareCandy]: '🍬',
  [CheatCategory.MasterBall]: '⚾',
  [CheatCategory.InfiniteMoney]: '💰',
  [CheatCategory.CatchRate]: '🎯',
  [CheatCategory.ShinyPokemon]: '✨',
  [CheatCategory.WildModifier]: '🐾',
  [CheatCategory.ExpMultiplier]: '📈',
  [CheatCategory.AllItems]: '🎒',
  [CheatCategory.InfiniteHP]: '❤️',
  [CheatCategory.MaxStats]: '💪',
  [CheatCategory.Teleport]: '🌀',
  [CheatCategory.Pokedex]: '📖',
  [CheatCategory.AllBadges]: '🏅',
  [CheatCategory.EggHatch]: '🥚',
  [CheatCategory.NoBattles]: '🚫',
  [CheatCategory.CatchTrainer]: '🤝',
  [CheatCategory.AllTMs]: '💿',
  [CheatCategory.EggTicket]: '🎫',
  [CheatCategory.MasterCode]: '🔑',
};

export function CheatCodes() {
  const [db] = useState<CheatCodeDatabase>(() => createCheatCodeDatabase());
  const [searchQuery, setSearchQuery] = useState('');
  const [genFilter, setGenFilter] = useState<GameGeneration | null>(null);
  const [gameFilter, setGameFilter] = useState<GameVersion | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CheatCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCode, setSelectedCode] = useState<CheatCode | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredCodes = useMemo(() => {
    let result = searchQuery ? searchCheatCodes(db, searchQuery) : db.codes;
    if (genFilter !== null) result = result.filter(c => c.generation === genFilter);
    if (gameFilter !== null) result = result.filter(c => c.game === gameFilter);
    if (categoryFilter !== null) result = result.filter(c => c.category === categoryFilter);
    return result;
  }, [db, searchQuery, genFilter, gameFilter, categoryFilter]);

  const availableGames = useMemo(() => getAvailableGames(db), [db]);
  const availableCategories = useMemo(() => getAvailableCategories(db), [db]);
  const generations = [3, 4, 5, 6, 7, 8, 9] as GameGeneration[];

  const handleCopy = (code: CheatCode) => {
    const text = code.codes.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(code.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const gamesForGen = genFilter !== null
    ? availableGames.filter(g => {
        const c = db.codes.find(cc => cc.game === g.version);
        return c && c.generation === genFilter;
      })
    : availableGames;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Gamepad2 className="w-6 h-6 text-rose-400" /> Action Replay Codes
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          {db.totalCount} cheat codes from PokemonCoders & community databases
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input type="text" placeholder="Search cheats (e.g. 'rare candy', 'walk through', 'platinum')..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={clsx('btn-secondary flex items-center gap-2', showFilters && 'border-indigo-500/30')}>
            <Filter className="w-4 h-4" /> Filters
            <ChevronDown className={clsx('w-3 h-3 transition-transform', showFilters && 'rotate-180')} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="glass rounded-xl p-4 space-y-4">
                <div>
                  <p className="text-xs text-surface-400 mb-2 flex items-center gap-1"><Joystick className="w-3 h-3" /> Generation</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => { setGenFilter(null); setGameFilter(null); }}
                      className={clsx('px-3 py-1 rounded-lg text-xs transition-all', genFilter === null ? 'bg-rose-500/20 text-rose-300' : 'text-surface-400 hover:text-white')}>All</button>
                    {generations.map(g => (
                      <button key={g} onClick={() => { setGenFilter(genFilter === g ? null : g); setGameFilter(null); }}
                        className={clsx('px-3 py-1 rounded-lg text-xs transition-all', genFilter === g ? 'bg-rose-500/20 text-rose-300' : 'text-surface-400 hover:text-white')}>
                        {GEN_LABELS[g] ?? `Gen ${g}`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-surface-400 mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> Game</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setGameFilter(null)}
                      className={clsx('px-3 py-1 rounded-lg text-xs transition-all', gameFilter === null ? 'bg-rose-500/20 text-rose-300' : 'text-surface-400 hover:text-white')}>All</button>
                    {gamesForGen.map(g => (
                      <button key={g.version} onClick={() => setGameFilter(gameFilter === g.version ? null : g.version)}
                        className={clsx('px-3 py-1 rounded-lg text-xs transition-all', gameFilter === g.version ? 'bg-rose-500/20 text-rose-300' : 'text-surface-400 hover:text-white')}>
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-surface-400 mb-2 flex items-center gap-1"><Tag className="w-3 h-3" /> Category</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setCategoryFilter(null)}
                      className={clsx('px-3 py-1 rounded-lg text-xs transition-all', categoryFilter === null ? 'bg-rose-500/20 text-rose-300' : 'text-surface-400 hover:text-white')}>All</button>
                    {availableCategories.map(cat => (
                      <button key={cat} onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                        className={clsx('px-3 py-1 rounded-lg text-xs transition-all', categoryFilter === cat ? 'bg-rose-500/20 text-rose-300' : 'text-surface-400 hover:text-white')}>
                        {CATEGORY_ICONS[cat] ?? '🔧'} {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="text-xs text-surface-500">{filteredCodes.length} codes found</p>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-2 max-h-[75vh] overflow-y-auto pr-1">
          {filteredCodes.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <Gamepad2 className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400">No codes match your search</p>
            </div>
          ) : (
            filteredCodes.map((code, i) => (
              <motion.button key={code.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.4) }}
                onClick={() => setSelectedCode(code)}
                className={clsx('w-full text-left glass rounded-xl p-4 transition-all group',
                  selectedCode?.id === code.id ? 'glow-border' : 'glass-hover')}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0 text-base">
                    {CATEGORY_ICONS[code.category] ?? '🔧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white truncate">{code.name}</p>
                      {code.masterCodeRequired && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">Master Code</span>
                      )}
                    </div>
                    <p className="text-xs text-surface-400 truncate">{code.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{code.gameName}</span>
                      <span className="text-[10px] text-surface-500">{code.codeType}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleCopy(code); }}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/[0.06] transition-all" title="Copy codes">
                    {copiedId === code.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-surface-400" />}
                  </button>
                </div>
              </motion.button>
            ))
          )}
        </div>

        <div className="xl:col-span-2">
          {selectedCode ? (
            <motion.div key={selectedCode.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl overflow-hidden sticky top-6">
              <div className="h-24 bg-gradient-to-br from-rose-600/20 to-orange-600/20 flex items-center justify-center">
                <span className="text-5xl">{CATEGORY_ICONS[selectedCode.category] ?? '🔧'}</span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedCode.name}</h3>
                  <p className="text-sm text-surface-400 mt-1">{selectedCode.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-surface-500 mb-0.5">Game</p>
                    <p className="text-sm font-medium text-white">{selectedCode.gameName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-500 mb-0.5">Type</p>
                    <p className="text-sm font-medium text-white">{selectedCode.codeType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-500 mb-0.5">Generation</p>
                    <p className="text-sm font-medium text-white">{GEN_LABELS[selectedCode.generation] ?? `Gen ${selectedCode.generation}`}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-500 mb-0.5">Category</p>
                    <p className="text-sm font-medium text-white">{selectedCode.category}</p>
                  </div>
                </div>

                {selectedCode.masterCodeRequired && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/10">
                    <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-300">Requires Master Code to be activated first</p>
                  </div>
                )}

                {selectedCode.activationNote && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/[0.06] border border-blue-500/10">
                    <BookOpen className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-300">{selectedCode.activationNote}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-surface-400 font-medium">Code</p>
                    <button onClick={() => handleCopy(selectedCode)}
                      className="flex items-center gap-1 text-xs text-surface-400 hover:text-white transition-colors">
                      {copiedId === selectedCode.id ? <><Check className="w-3 h-3 text-green-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                  <div className="bg-surface-950/80 rounded-xl p-4 font-mono text-sm leading-relaxed text-emerald-300 border border-white/[0.04] select-all">
                    {selectedCode.codes.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>

                {selectedCode.warning && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-300">{selectedCode.warning}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center sticky top-6">
              <Gamepad2 className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400 text-sm">Select a code to view details</p>
              <p className="text-surface-500 text-xs mt-2">Click the copy button to copy codes to your clipboard for use in emulators</p>
            </div>
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/10">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-300 font-medium">Use Cheats Responsibly</p>
          <p className="text-xs text-surface-400 mt-1">
            Always save before using cheat codes. Activate only one code at a time to prevent crashes.
            Some codes may cause glitches like bad eggs or corrupted saves. Disable codes after use.
            For Gen 6+ games, use PKHeX's built-in save editing features instead of external cheat devices.
          </p>
          <p className="text-[10px] text-surface-500 mt-2">Sources: PokemonCoders, AxeeTech, Gaming Gorilla, Pro Game Guides</p>
        </div>
      </motion.div>
    </div>
  );
}
