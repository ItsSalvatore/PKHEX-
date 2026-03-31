import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { GAME_NAMES } from '@pkhex/core';
import { formatPlayTime } from '@pkhex/core';
import { motion } from 'framer-motion';
import {
  Upload, Users, Box, Backpack, Gift, Shield, Sparkles, Clock, Trophy,
} from 'lucide-react';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export function Dashboard() {
  const { saveFile, recentFiles } = useAppStore();
  const navigate = useNavigate();

  if (!saveFile) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-12">
        <motion.div {...fade} className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">Welcome</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-surface-400">
            Load a save file to edit your party, boxes, trainer, and inventory. Everything runs locally in your browser.
          </p>
          <button
            type="button"
            onClick={() => navigate('/load')}
            className="btn-primary mt-8 inline-flex items-center gap-2"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Load save file
          </button>
        </motion.div>

        {recentFiles.length > 0 && (
          <motion.div {...fade} transition={{ delay: 0.1 }} className="mt-12 w-full">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-surface-500">
              Recent files
            </h2>
            <ul className="space-y-2">
              {recentFiles.map((f, i) => (
                <li key={i} className="glass rounded-lg px-4 py-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{f.name}</p>
                  <p className="text-xs text-slate-500 dark:text-surface-500">
                    {new Date(f.date).toLocaleDateString()} · {(f.size / 1024).toFixed(0)} KB
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    );
  }

  const { trainer } = saveFile;
  const gameName = GAME_NAMES[saveFile.gameVersion] ?? 'Unknown';
  const partyCount = saveFile.party.filter(p => p !== null).length;
  const boxPokemonCount = saveFile.boxes.reduce(
    (sum, b) => sum + b.pokemon.filter(p => p !== null).length, 0,
  );

  const shortcuts = [
    { label: 'Party', sub: `${partyCount}/6`, icon: Users, path: '/party' },
    { label: 'PC Boxes', sub: `${boxPokemonCount} Pokémon`, icon: Box, path: '/boxes' },
    { label: 'Inventory', sub: 'Items', icon: Backpack, path: '/inventory' },
    { label: 'Mystery Gifts', sub: 'Database', icon: Gift, path: '/mystery-gifts' },
    { label: 'Legality', sub: 'Checks', icon: Shield, path: '/legality' },
    { label: 'Trainer', sub: 'Profile', icon: Sparkles, path: '/trainer' },
  ];

  return (
    <div className="space-y-8">
      <motion.section {...fade} className="glass rounded-xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-surface-500">
              Loaded save
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              {gameName}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-surface-400">
              <span className="font-medium text-slate-900 dark:text-white">{trainer.name}</span>
              <span className="mx-2 text-slate-300 dark:text-surface-600">·</span>
              <span className="font-mono text-indigo-700 dark:text-indigo-300">ID {trainer.displayTID}</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-500 dark:text-surface-500">Generation {saveFile.generation}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-surface-400">
              <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              {formatPlayTime(trainer.playTime)}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {trainer.badges.map((has, i) => (
            <div
              key={i}
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-md border',
                has
                  ? 'border-amber-300/50 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300'
                  : 'border-slate-200 bg-slate-50 text-slate-300 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-surface-600',
              )}
              title={`Badge ${i + 1}`}
            >
              <Trophy className="h-3.5 w-3.5" aria-hidden />
            </div>
          ))}
        </div>
      </motion.section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-surface-500">
          Shortcuts
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {shortcuts.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                type="button"
                key={s.path}
                onClick={() => navigate(s.path)}
                className="glass glass-hover flex flex-col items-start rounded-xl p-4 text-left transition-colors"
                {...fade}
                transition={{ delay: 0.03 * i }}
              >
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{s.label}</span>
                <span className="text-xs text-slate-500 dark:text-surface-500">{s.sub}</span>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
