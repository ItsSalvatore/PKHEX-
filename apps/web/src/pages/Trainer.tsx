import { useAppStore } from '@/store/app-store';
import { GAME_NAMES, formatPlayTime } from '@pkhex/core';
import { motion } from 'framer-motion';
import {
  Sparkles, Clock, Trophy, CreditCard, Wallet,
  Globe, Languages, User,
} from 'lucide-react';

export function Trainer() {
  const { saveFile } = useAppStore();

  if (!saveFile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-surface-400">No save file loaded</p>
      </div>
    );
  }

  const { trainer } = saveFile;

  const infoCards = [
    { label: 'Name', value: trainer.name, icon: User, color: 'text-indigo-400' },
    { label: 'TID', value: trainer.displayTID, icon: CreditCard, color: 'text-blue-400' },
    { label: 'SID', value: trainer.displaySID, icon: CreditCard, color: 'text-cyan-400' },
    { label: 'Money', value: `₽${trainer.money.toLocaleString()}`, icon: Wallet, color: 'text-amber-400' },
    { label: 'Game', value: GAME_NAMES[trainer.gameVersion] ?? 'Unknown', icon: Sparkles, color: 'text-purple-400' },
    { label: 'Region', value: trainer.region, icon: Globe, color: 'text-emerald-400' },
    { label: 'Language', value: `#${trainer.language}`, icon: Languages, color: 'text-pink-400' },
    { label: 'Play Time', value: formatPlayTime(trainer.playTime), icon: Clock, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" /> Trainer Info
        </h1>
        <p className="text-surface-400 text-sm mt-1">View and edit trainer profile data</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 card-shine"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{trainer.name}</h2>
            <p className="text-surface-400">
              {trainer.gender === 0 ? 'Male' : 'Female'} Trainer
              <span className="mx-2">·</span>
              {GAME_NAMES[trainer.gameVersion] ?? 'Unknown'} (Gen {saveFile.generation})
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.03 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${card.color}`} />
                <span className="text-xs text-surface-400">{card.label}</span>
              </div>
              <p className="text-sm font-semibold text-white font-mono">{card.value}</p>
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
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Badges
        </h3>
        <div className="grid grid-cols-8 gap-3">
          {trainer.badges.map((has, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                has
                  ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                  : 'bg-white/[0.02] text-surface-700 border border-white/[0.04]'
              }`}
            >
              <Trophy className={`w-6 h-6 ${has ? 'text-amber-400' : 'text-surface-700'}`} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
