import { useState, useMemo, useEffect } from 'react';
import {
  createCheatCodeDatabase,
  searchCheatCodes,
  getAvailableGames,
  getCategoriesForGame,
  getCheatsForGameAndCategory,
  getWildTemplateForGame,
  buildWildEncounterLines,
  SPECIES_NAMES,
  type CheatCode,
  type CheatCodeDatabase,
  CheatCategory,
  GameVersion,
  GAME_NAMES,
} from '@pkhex/core';
import { PageHeader } from '@/components/layout/PageHeader';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Gamepad2, Search, Copy, Check, ChevronDown, AlertTriangle, Zap, ExternalLink,
} from 'lucide-react';

const WILD_KEY = '__wild_encounter__';

const GEN_ORDER: GameVersion[][] = [
  [GameVersion.Ruby, GameVersion.Sapphire, GameVersion.Emerald, GameVersion.FireRed, GameVersion.LeafGreen],
  [GameVersion.Diamond, GameVersion.Pearl, GameVersion.Platinum, GameVersion.HeartGold, GameVersion.SoulSilver],
  [GameVersion.Black, GameVersion.White, GameVersion.Black2, GameVersion.White2],
  [GameVersion.X, GameVersion.Y, GameVersion.OmegaRuby, GameVersion.AlphaSapphire],
  [GameVersion.Sun, GameVersion.Moon, GameVersion.UltraSun, GameVersion.UltraMoon],
  [GameVersion.Sword, GameVersion.Shield, GameVersion.BrilliantDiamond, GameVersion.ShiningPearl, GameVersion.LegendsArceus],
  [GameVersion.Scarlet, GameVersion.Violet],
];

function sortGamesByRelease(games: { version: GameVersion; name: string }[]) {
  const order = new Map<GameVersion, number>();
  let i = 0;
  for (const row of GEN_ORDER) {
    for (const v of row) {
      order.set(v, i++);
    }
  }
  return [...games].sort((a, b) => {
    const oa = order.get(a.version) ?? 999;
    const ob = order.get(b.version) ?? 999;
    if (oa !== ob) return oa - ob;
    return a.name.localeCompare(b.name);
  });
}

export function CheatCodes() {
  const [db] = useState<CheatCodeDatabase>(() => createCheatCodeDatabase());
  const sortedGames = useMemo(() => sortGamesByRelease(getAvailableGames(db)), [db]);

  const [gameVersion, setGameVersion] = useState<GameVersion>(sortedGames[0]?.version ?? GameVersion.Platinum);
  useEffect(() => {
    if (sortedGames.length && !sortedGames.some(g => g.version === gameVersion)) {
      setGameVersion(sortedGames[0].version);
    }
  }, [sortedGames, gameVersion]);

  const wildTemplate = getWildTemplateForGame(gameVersion);
  const dbCategories = useMemo(
    () => getCategoriesForGame(db, gameVersion),
    [db, gameVersion],
  );

  const categoryKeys = useMemo(() => {
    const keys: string[] = [];
    if (wildTemplate) keys.push(WILD_KEY);
    for (const c of dbCategories.sort((a, b) => a.localeCompare(b))) {
      keys.push(c);
    }
    return keys;
  }, [wildTemplate, dbCategories]);

  const [categoryKey, setCategoryKey] = useState<string>(WILD_KEY);
  useEffect(() => {
    if (categoryKeys.includes(categoryKey)) return;
    setCategoryKey(categoryKeys[0] ?? '');
  }, [categoryKeys, categoryKey]);

  const cheatsInCategory = useMemo(() => {
    if (!categoryKey || categoryKey === WILD_KEY) return [];
    return getCheatsForGameAndCategory(db, gameVersion, categoryKey as CheatCategory);
  }, [db, gameVersion, categoryKey]);

  const [cheatVariantIndex, setCheatVariantIndex] = useState(0);
  useEffect(() => {
    setCheatVariantIndex(0);
  }, [categoryKey, gameVersion]);

  const [speciesDex, setSpeciesDex] = useState(1);
  useEffect(() => {
    if (wildTemplate) {
      setSpeciesDex(prev => Math.min(Math.max(prev, wildTemplate.dexMin), wildTemplate.dexMax));
    }
  }, [wildTemplate]);

  const [pokemonFilter, setPokemonFilter] = useState('');
  const speciesOptions = useMemo(() => {
    if (!wildTemplate) return [];
    const q = pokemonFilter.trim().toLowerCase();
    const out: { dex: number; name: string }[] = [];
    for (let d = wildTemplate.dexMin; d <= wildTemplate.dexMax; d++) {
      const name = SPECIES_NAMES[d];
      if (!name || name === '—') continue;
      if (q && !`${d} ${name}`.toLowerCase().includes(q)) continue;
      out.push({ dex: d, name });
    }
    return out;
  }, [wildTemplate, pokemonFilter]);

  const selectedDbCheat: CheatCode | null =
    categoryKey !== WILD_KEY && cheatsInCategory.length > 0
      ? cheatsInCategory[Math.min(cheatVariantIndex, cheatsInCategory.length - 1)]
      : null;

  const wildLines = useMemo(() => {
    if (!wildTemplate || categoryKey !== WILD_KEY) return null;
    return buildWildEncounterLines(wildTemplate, speciesDex);
  }, [wildTemplate, categoryKey, speciesDex]);

  const activeCodes: string[] | null =
    categoryKey === WILD_KEY ? wildLines : selectedDbCheat?.codes ?? null;

  const displayTitle =
    categoryKey === WILD_KEY && wildTemplate
      ? `Wild encounter: ${SPECIES_NAMES[speciesDex] ?? `#${speciesDex}`}`
      : selectedDbCheat?.name ?? 'Select a cheat';

  const displayDescription =
    categoryKey === WILD_KEY && wildTemplate
      ? `National Dex #${speciesDex} — ${wildTemplate.activationNote}`
      : selectedDbCheat?.description ?? '';

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!activeCodes?.length) return;
    navigator.clipboard.writeText(activeCodes.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [browseOpen, setBrowseOpen] = useState(false);
  const [browseQuery, setBrowseQuery] = useState('');
  const browseResults = useMemo(() => {
    const list = browseQuery ? searchCheatCodes(db, browseQuery) : db.codes;
    return list.filter(c => c.game === gameVersion);
  }, [db, browseQuery, gameVersion]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Gamepad2}
        title="Cheat codes"
        description={
          <>
            Pick a game and category, then copy the lines below. Gen 4–5 wild Pokémon use the species list. Mostly
            from{' '}
            <a
              href="https://www.pokemoncoders.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              PokemonCoders <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
            .
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-5 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-surface-400 mb-1.5">Game</label>
            <div className="relative">
              <select
                value={gameVersion}
                onChange={e => setGameVersion(Number(e.target.value) as GameVersion)}
                className="input-field w-full appearance-none pr-10 cursor-pointer"
              >
                {sortedGames.map(g => (
                  <option key={g.version} value={g.version}>
                    {g.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-surface-400 mb-1.5">Cheat category</label>
            <div className="relative">
              <select
                value={categoryKey}
                onChange={e => setCategoryKey(e.target.value)}
                className="input-field w-full appearance-none pr-10 cursor-pointer"
              >
                {wildTemplate && (
                  <option value={WILD_KEY}>Wild Pokémon (choose species)</option>
                )}
                {dbCategories.sort((a, b) => a.localeCompare(b)).map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {categoryKey === WILD_KEY && wildTemplate && (
          <div className="space-y-3 border-t border-slate-200 pt-1 dark:border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs text-surface-500">
              <Zap className="w-3.5 h-3.5" />
              <span>
                Source:{' '}
                <a
                  href={wildTemplate.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {wildTemplate.gameName} cheats (PokemonCoders)
                </a>
              </span>
            </div>
            <div>
              <label className="block text-xs text-surface-400 mb-1.5">Filter Pokémon</label>
              <input
                type="search"
                placeholder="Search by name or Dex #…"
                value={pokemonFilter}
                onChange={e => setPokemonFilter(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-surface-400 mb-1.5">Pokémon (national Dex)</label>
              <div className="relative">
                <select
                  value={speciesDex}
                  onChange={e => setSpeciesDex(Number(e.target.value))}
                  className="input-field w-full appearance-none pr-10 cursor-pointer max-h-48 font-mono text-sm"
                  size={1}
                >
                  {speciesOptions.map(({ dex, name }) => (
                    <option key={dex} value={dex}>
                      #{dex.toString().padStart(3, '0')} — {name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
              </div>
              <p className="text-[10px] text-surface-500 mt-1">
                Dex {wildTemplate.dexMin}–{wildTemplate.dexMax} for {GAME_NAMES[gameVersion] ?? wildTemplate.gameName}.
              </p>
            </div>
          </div>
        )}

        {categoryKey !== WILD_KEY && cheatsInCategory.length > 1 && (
          <div>
            <label className="block text-xs text-surface-400 mb-1.5">Cheat variant</label>
            <div className="relative">
              <select
                value={cheatVariantIndex}
                onChange={e => setCheatVariantIndex(Number(e.target.value))}
                className="input-field w-full appearance-none pr-10 cursor-pointer"
              >
                {cheatsInCategory.map((c, i) => (
                  <option key={c.id} value={i}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3 dark:border-white/[0.08] dark:bg-black/50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-slate-900 dark:text-white">{displayTitle}</h2>
              {displayDescription ? (
                <p className="text-xs text-surface-500 mt-0.5">{displayDescription}</p>
              ) : null}
              {selectedDbCheat ? (
                <p className="text-[10px] text-surface-600 mt-1">
                  {selectedDbCheat.codeType}
                  {selectedDbCheat.masterCodeRequired ? ' · master code required' : ''}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!activeCodes?.length}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 flex-shrink-0 disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
          </div>

          {activeCodes && activeCodes.length > 0 ? (
            <pre className="select-all whitespace-pre-wrap break-all font-mono text-[13px] leading-6 text-slate-800 dark:text-surface-200">
              {activeCodes.join('\n')}
            </pre>
          ) : (
            <p className="text-surface-500 text-sm">No code for this selection.</p>
          )}

          {selectedDbCheat?.activationNote && (
            <p className="text-xs text-surface-400 border-l-2 border-blue-500/40 pl-2 py-0.5">{selectedDbCheat.activationNote}</p>
          )}
          {selectedDbCheat?.warning && (
            <p className="text-xs text-amber-200/90 border-l-2 border-amber-500/50 pl-2 py-0.5">{selectedDbCheat.warning}</p>
          )}
          {wildTemplate && categoryKey === WILD_KEY && wildTemplate.warning && (
            <p className="text-xs text-amber-200/90 border-l-2 border-amber-500/50 pl-2 py-0.5">{wildTemplate.warning}</p>
          )}
        </div>
      </motion.div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.06]">
        <button
          type="button"
          onClick={() => setBrowseOpen(o => !o)}
          className="flex w-full items-center justify-between bg-slate-100/90 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-100 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.05]"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-500 dark:text-surface-400" />
            Search all codes for {GAME_NAMES[gameVersion] ?? 'this game'}
          </span>
          <ChevronDown className={clsx('w-4 h-4 transition-transform', browseOpen && 'rotate-180')} />
        </button>
        {browseOpen && (
          <div className="space-y-3 border-t border-slate-200 p-4 dark:border-white/[0.06]">
            <input
              type="search"
              placeholder="e.g. rare candy, shiny, walk…"
              value={browseQuery}
              onChange={e => setBrowseQuery(e.target.value)}
              className="input-field w-full"
            />
            <ul className="max-h-64 overflow-y-auto space-y-1 text-sm">
              {browseResults.length === 0 ? (
                <li className="text-surface-500 py-4 text-center">No matches</li>
              ) : (
                browseResults.map(c => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setGameVersion(c.game);
                        setCategoryKey(c.category);
                        const list = getCheatsForGameAndCategory(db, c.game, c.category);
                        const ix = list.findIndex(x => x.id === c.id);
                        setCheatVariantIndex(ix >= 0 ? ix : 0);
                        setBrowseOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.04] text-surface-300 hover:text-white"
                    >
                      <span className="text-white">{c.name}</span>
                      <span className="text-surface-500 text-xs block">{c.category}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      <p className="text-xs text-surface-500 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-surface-600 flex-shrink-0 mt-0.5" />
        <span>
          Back up your save. NDS codes are for matching US/English ROMs where noted; turn cheats off when you are done.
        </span>
      </p>
    </div>
  );
}
