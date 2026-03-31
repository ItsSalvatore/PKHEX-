import { useState, useCallback } from 'react';
import type { Pokemon, IVs, EVs } from '@pkhex/core';
import {
  getSpeciesName, getPokemonDisplayName, getMoveName, getItemName, getNatureName,
  PokemonNature, PokemonGender,
  checkLegality, LegalityStatus,
  searchSpecies, searchMoves, searchItems,
  NATURE_DATA,
} from '@pkhex/core';
import { PokemonArtwork } from './PokemonArtwork';
import { useAppStore } from '@/store/app-store';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Sparkles, Shield, Heart, Swords, ShieldCheck, Zap,
  Wind, Target, ArrowLeft, Save, RotateCcw,
} from 'lucide-react';

interface PokemonEditorProps {
  pokemon: Pokemon;
  onBack?: () => void;
}

type EditorTab = 'main' | 'stats' | 'moves' | 'met' | 'ribbons';

export function PokemonEditor({ pokemon: initialPokemon, onBack }: PokemonEditorProps) {
  const { updatePokemon, saveFile } = useAppStore();
  const [pokemon, setPokemon] = useState<Pokemon>({ ...initialPokemon });
  const [tab, setTab] = useState<EditorTab>('main');
  const [dirty, setDirty] = useState(false);

  const update = useCallback((changes: Partial<Pokemon>) => {
    setPokemon(prev => {
      const next = { ...prev, ...changes };
      setDirty(true);
      return next;
    });
  }, []);

  const updateIV = useCallback((stat: keyof IVs, value: number) => {
    setPokemon(prev => {
      setDirty(true);
      return { ...prev, ivs: { ...prev.ivs, [stat]: Math.max(0, Math.min(31, value)) } };
    });
  }, []);

  const updateEV = useCallback((stat: keyof EVs, value: number) => {
    setPokemon(prev => {
      setDirty(true);
      return { ...prev, evs: { ...prev.evs, [stat]: Math.max(0, Math.min(252, value)) } };
    });
  }, []);

  const updateMove = useCallback((index: number, moveId: number) => {
    setPokemon(prev => {
      const moves = [...prev.moves] as Pokemon['moves'];
      moves[index] = { ...moves[index], id: moveId };
      setDirty(true);
      return { ...prev, moves };
    });
  }, []);

  const handleSave = () => {
    updatePokemon(pokemon);
    setDirty(false);
  };

  const handleReset = () => {
    setPokemon({ ...initialPokemon });
    setDirty(false);
  };

  const legality = checkLegality(pokemon, saveFile ?? undefined);
  const speciesName = getSpeciesName(pokemon.species);

  const tabs: { id: EditorTab; label: string }[] = [
    { id: 'main', label: 'Main' },
    { id: 'stats', label: 'Stats' },
    { id: 'moves', label: 'Moves' },
    { id: 'met', label: 'Met' },
    { id: 'ribbons', label: 'Ribbons' },
  ];

  const statEntries = [
    { key: 'hp' as const, label: 'HP', color: '#ef4444', icon: Heart },
    { key: 'atk' as const, label: 'Attack', color: '#f97316', icon: Swords },
    { key: 'def' as const, label: 'Defense', color: '#eab308', icon: ShieldCheck },
    { key: 'spa' as const, label: 'Sp. Atk', color: '#3b82f6', icon: Zap },
    { key: 'spd' as const, label: 'Sp. Def', color: '#22c55e', icon: Shield },
    { key: 'spe' as const, label: 'Speed', color: '#ec4899', icon: Wind },
  ];

  const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-surface-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="relative h-44 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
          <PokemonArtwork
            species={pokemon.species}
            shiny={pokemon.isShiny}
            alt={speciesName}
            className="h-36 w-auto max-w-full object-contain drop-shadow-2xl"
          />
          {pokemon.isShiny && (
            <div className="absolute top-3 right-3 badge badge-shiny"><Sparkles className="w-3 h-3 mr-1" /> Shiny</div>
          )}
          <div className={clsx('absolute top-3 left-3 badge',
            legality.status === LegalityStatus.Legal && 'badge-legal',
            legality.status === LegalityStatus.Illegal && 'badge-illegal',
            legality.status === LegalityStatus.Warning && 'badge-warning',
          )}>
            <Shield className="w-3 h-3 mr-1" />
            {legality.status === LegalityStatus.Legal ? 'Legal' : legality.status === LegalityStatus.Illegal ? 'Illegal' : 'Warning'}
          </div>
          {dirty && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button onClick={handleReset} className="btn-secondary !py-1.5 !px-3 !text-xs flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
              <button onClick={handleSave} className="btn-primary !py-1.5 !px-3 !text-xs flex items-center gap-1">
                <Save className="w-3 h-3" /> Apply
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{getPokemonDisplayName(pokemon)}</h2>
              {getPokemonDisplayName(pokemon) !== speciesName && (
                <p className="text-xs text-surface-400">{speciesName}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-indigo-400">Lv. {pokemon.level}</p>
              <p className="text-[10px] text-surface-400">
                {pokemon.gender === PokemonGender.Male ? '♂' : pokemon.gender === PokemonGender.Female ? '♀' : '⚥'}
                {' · '}{getNatureName(pokemon.nature)}
              </p>
            </div>
          </div>

          <div className="flex gap-1 mb-4">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  tab === t.id
                    ? 'border border-indigo-300 bg-indigo-100 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-surface-400 dark:hover:bg-white/[0.04] dark:hover:text-white',
                )}>{t.label}</button>
            ))}
          </div>

          {tab === 'main' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Nickname</label>
                  <input className="input-field !py-1.5 !text-xs" value={pokemon.nickname}
                    onChange={e => update({ nickname: e.target.value })} placeholder={speciesName} />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Level</label>
                  <input type="number" className="input-field !py-1.5 !text-xs" value={pokemon.level}
                    min={1} max={100} onChange={e => update({ level: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) })} />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Nature</label>
                  <select className="input-field !py-1.5 !text-xs" value={pokemon.nature}
                    onChange={e => update({ nature: parseInt(e.target.value) as PokemonNature })}>
                    {Object.entries(NATURE_DATA).map(([key, val]) => (
                      <option key={key} value={key}>{val.name}{val.increased ? ` (+${val.increased}/-${val.decreased})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Held Item</label>
                  <input type="number" className="input-field !py-1.5 !text-xs" value={pokemon.heldItem}
                    min={0} onChange={e => update({ heldItem: parseInt(e.target.value) || 0 })} />
                  <p className="text-[9px] text-surface-500 mt-0.5">{getItemName(pokemon.heldItem)}</p>
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Friendship</label>
                  <input type="number" className="input-field !py-1.5 !text-xs" value={pokemon.friendship}
                    min={0} max={255} onChange={e => update({ friendship: Math.max(0, Math.min(255, parseInt(e.target.value) || 0)) })} />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Ball</label>
                  <input type="number" className="input-field !py-1.5 !text-xs" value={pokemon.ball}
                    min={1} max={26} onChange={e => update({ ball: parseInt(e.target.value) || 4 })} />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Gender</label>
                  <select className="input-field !py-1.5 !text-xs" value={pokemon.gender}
                    onChange={e => update({ gender: parseInt(e.target.value) as PokemonGender })}>
                    <option value={0}>Male ♂</option>
                    <option value={1}>Female ♀</option>
                    <option value={2}>Genderless ⚥</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Shiny</label>
                  <button onClick={() => update({ isShiny: !pokemon.isShiny })}
                    className={clsx('input-field !py-1.5 !text-xs text-center',
                      pokemon.isShiny ? 'border-amber-500/40 text-amber-300' : 'text-surface-400',
                    )}>{pokemon.isShiny ? '★ Shiny' : 'Not Shiny'}</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-surface-500 block mb-1">PID / EC</label>
                <p className="text-[10px] font-mono text-surface-300">
                  PID: {pokemon.pid.toString(16).toUpperCase().padStart(8, '0')}
                  {' · '}EC: {pokemon.encryptionConstant.toString(16).toUpperCase().padStart(8, '0')}
                </p>
              </div>
            </div>
          )}

          {tab === 'stats' && (
            <div className="space-y-3 animate-fade-in">
              <div className="text-[10px] text-surface-400 text-right">
                Total EVs:{' '}
                <span
                  className={clsx(
                    'font-mono font-bold',
                    totalEVs > 510 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white',
                  )}
                >
                  {totalEVs}/510
                </span>
              </div>
              {statEntries.map(stat => {
                const iv = pokemon.ivs[stat.key];
                const ev = pokemon.evs[stat.key];
                const Icon = stat.icon;
                return (
                  <div key={stat.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                        <span className="text-[10px] font-medium text-surface-300">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-surface-500">IV</span>
                          <input
                            type="number"
                            className="w-12 rounded border border-slate-200 bg-white px-1 py-0.5 text-center font-mono text-[10px] text-slate-900 focus:border-indigo-400 focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:focus:border-indigo-500/40"
                            value={iv}
                            min={0}
                            max={31}
                            onChange={e => updateIV(stat.key, parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-surface-500">EV</span>
                          <input
                            type="number"
                            className="w-14 rounded border border-slate-200 bg-white px-1 py-0.5 text-center font-mono text-[10px] text-slate-900 focus:border-indigo-400 focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:focus:border-indigo-500/40"
                            value={ev}
                            min={0}
                            max={252}
                            onChange={e => updateEV(stat.key, parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.04]">
                      <div className="stat-bar h-1.5" style={{ width: `${(iv / 31) * 100}%`, '--bar-color': stat.color } as React.CSSProperties} />
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-2 pt-2">
                <button className="btn-secondary !py-1 !px-3 !text-[10px]"
                  onClick={() => { for (const s of statEntries) updateIV(s.key, 31); }}>Max IVs</button>
                <button className="btn-secondary !py-1 !px-3 !text-[10px]"
                  onClick={() => { for (const s of statEntries) updateEV(s.key, 0); }}>Clear EVs</button>
                <button className="btn-secondary !py-1 !px-3 !text-[10px]"
                  onClick={() => { updateEV('hp', 4); updateEV('atk', 252); updateEV('spe', 252); for (const s of ['def','spa','spd'] as const) updateEV(s, 0); }}>
                  Physical Sweeper
                </button>
                <button className="btn-secondary !py-1 !px-3 !text-[10px]"
                  onClick={() => { updateEV('hp', 4); updateEV('spa', 252); updateEV('spe', 252); for (const s of ['atk','def','spd'] as const) updateEV(s, 0); }}>
                  Special Sweeper
                </button>
              </div>
            </div>
          )}

          {tab === 'moves' && (
            <div className="space-y-2 animate-fade-in">
              {pokemon.moves.map((move, i) => (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-400">{i + 1}</div>
                    <div className="flex-1">
                      <input type="number" className="input-field !py-1 !text-xs" value={move.id} min={0}
                        onChange={e => updateMove(i, parseInt(e.target.value) || 0)} />
                      <p className="text-[9px] text-surface-500 mt-0.5">{getMoveName(move.id)}</p>
                    </div>
                    <div className="text-[9px] text-surface-400">PP: {move.pp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'met' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Met Location</label>
                  <input type="number" className="input-field !py-1.5 !text-xs" value={pokemon.metLocation}
                    min={0} onChange={e => update({ metLocation: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Met Level</label>
                  <input type="number" className="input-field !py-1.5 !text-xs" value={pokemon.metLevel}
                    min={1} max={100} onChange={e => update({ metLevel: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Language</label>
                  <select className="input-field !py-1.5 !text-xs" value={pokemon.language}
                    onChange={e => update({ language: parseInt(e.target.value) })}>
                    <option value={1}>Japanese</option><option value={2}>English</option>
                    <option value={3}>French</option><option value={4}>Italian</option>
                    <option value={5}>German</option><option value={7}>Spanish</option>
                    <option value={8}>Korean</option><option value={9}>Chinese (S)</option>
                    <option value={10}>Chinese (T)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-surface-500 block mb-1">Is Egg</label>
                  <button onClick={() => update({ isEgg: !pokemon.isEgg })}
                    className={clsx('input-field !py-1.5 !text-xs text-center',
                      pokemon.isEgg ? 'border-green-500/40 text-green-300' : 'text-surface-400',
                    )}>{pokemon.isEgg ? 'Yes' : 'No'}</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-surface-500 block mb-1">OT Name</label>
                <input className="input-field !py-1.5 !text-xs" value={pokemon.otName}
                  onChange={e => update({ otName: e.target.value })} />
              </div>
            </div>
          )}

          {tab === 'ribbons' && (
            <div className="animate-fade-in text-center py-6">
              <p className="text-xs text-surface-400">Ribbon editing coming in a future update</p>
            </div>
          )}
        </div>
      </div>

      {legality.issues.length > 0 && (
        <div className="glass rounded-xl p-3 space-y-1">
          <h3 className="flex items-center gap-1 text-[10px] font-semibold text-slate-900 dark:text-white">
            <Shield className="h-3 w-3 text-amber-500 dark:text-amber-400" /> Legality issues ({legality.issues.length})
          </h3>
          {legality.issues.slice(0, 5).map((issue, i) => (
            <div key={i} className={clsx('p-1.5 rounded text-[10px]',
              issue.severity === LegalityStatus.Illegal ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
            )}>
              <span className="font-mono text-slate-600 dark:text-white/60">{issue.field}</span>: {issue.message}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
