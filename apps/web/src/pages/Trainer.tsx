import { clsx } from 'clsx';
import { useAppStore } from '@/store/app-store';
import { GAME_NAMES, formatPlayTime } from '@pkhex/core';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { motion } from 'framer-motion';
import {
  Sparkles, Clock, Trophy, CreditCard, Wallet,
  Globe, Languages, User,
} from 'lucide-react';

export function Trainer() {
  const { saveFile } = useAppStore();

  if (!saveFile) {
    return <EmptyState title="Trainer info needs a save file" />;
  }

  const { trainer } = saveFile;

  const infoCards = [
    { label: 'Name', value: trainer.name, icon: User },
    { label: 'TID', value: trainer.displayTID, icon: CreditCard },
    { label: 'SID', value: trainer.displaySID, icon: CreditCard },
    { label: 'Money', value: `₽${trainer.money.toLocaleString()}`, icon: Wallet },
    { label: 'Game', value: GAME_NAMES[trainer.gameVersion] ?? 'Unknown', icon: Sparkles },
    { label: 'Region', value: trainer.region, icon: Globe },
    { label: 'Language', value: `#${trainer.language}`, icon: Languages },
    { label: 'Play Time', value: formatPlayTime(trainer.playTime), icon: Clock },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        icon={Sparkles}
        title="Trainer"
        description="Read-only summary from the loaded save (editing varies by generation)."
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <User className="h-8 w-8" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{trainer.name}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-surface-400">
              {trainer.gender === 0 ? 'Male' : 'Female'} trainer
              <span className="mx-2 text-slate-300 dark:text-surface-600">·</span>
              {GAME_NAMES[trainer.gameVersion] ?? 'Unknown'} (Gen {saveFile.generation})
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {infoCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + i * 0.02 }}
              className="glass rounded-xl p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-surface-500">
                <Icon className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden />
                <span className="text-xs font-medium">{card.label}</span>
              </div>
              <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden /> Badges
        </h3>
        <div className="grid grid-cols-8 gap-2 sm:gap-3">
          {trainer.badges.map((has, i) => (
            <div
              key={i}
              className={clsx(
                'flex aspect-square items-center justify-center rounded-lg border text-sm font-bold transition-colors',
                has
                  ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/35 dark:bg-amber-500/10 dark:text-amber-300'
                  : 'border-slate-200 bg-slate-50 text-slate-300 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-surface-600',
              )}
            >
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
