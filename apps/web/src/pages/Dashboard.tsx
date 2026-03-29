import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { GAME_NAMES } from '@pkhex/core';
import { formatPlayTime } from '@pkhex/core';
import { motion } from 'framer-motion';
import {
  Upload, Users, Box, Backpack, Gift, Shield,
  Sparkles, Clock, Trophy, Zap,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export function Dashboard() {
  const { saveFile, recentFiles } = useAppStore();
  const navigate = useNavigate();

  if (!saveFile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div {...fadeUp} className="text-center max-w-lg">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-float">
            <Zap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-3">PKHeX</h1>
          <p className="text-surface-300 text-lg mb-8">
            Cross-platform Pokémon save file editor. Load a save to get started.
          </p>
          <button onClick={() => navigate('/load')} className="btn-primary text-base px-8 py-3">
            <Upload className="w-5 h-5 inline mr-2" />
            Load Save File
          </button>
        </motion.div>

        {recentFiles.length > 0 && (
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-12 w-full max-w-lg">
            <h3 className="text-sm font-medium text-surface-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Files
            </h3>
            <div className="space-y-2">
              {recentFiles.map((f, i) => (
                <div key={i} className="glass glass-hover rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{f.name}</p>
                    <p className="text-xs text-surface-400">{new Date(f.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs text-surface-500">{(f.size / 1024).toFixed(0)} KB</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  const { trainer } = saveFile;
  const gameName = GAME_NAMES[saveFile.gameVersion] ?? 'Unknown';
  const partyCount = saveFile.party.filter(p => p !== null).length;
  const boxPokemonCount = saveFile.boxes.reduce(
    (sum, b) => sum + b.pokemon.filter(p => p !== null).length, 0
  );

  const quickActions = [
    { label: 'Party', icon: Users, path: '/party', color: 'from-blue-500 to-cyan-500', count: `${partyCount}/6` },
    { label: 'PC Boxes', icon: Box, path: '/boxes', color: 'from-purple-500 to-pink-500', count: `${boxPokemonCount} Pokémon` },
    { label: 'Inventory', icon: Backpack, path: '/inventory', color: 'from-amber-500 to-orange-500', count: 'Manage' },
    { label: 'Mystery Gifts', icon: Gift, path: '/mystery-gifts', color: 'from-emerald-500 to-teal-500', count: 'Database' },
    { label: 'Legality', icon: Shield, path: '/legality', color: 'from-red-500 to-rose-500', count: 'Check' },
    { label: 'Trainer', icon: Sparkles, path: '/trainer', color: 'from-indigo-500 to-violet-500', count: 'Edit' },
  ];

  return (
    <div className="space-y-8">
      <motion.div {...fadeUp}>
        <div className="glass rounded-2xl p-6 card-shine">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-surface-400 uppercase tracking-wider mb-1">Currently Loaded</p>
              <h1 className="text-3xl font-bold text-white mb-1">
                Pokémon {gameName}
              </h1>
              <p className="text-surface-300">
                Trainer: <span className="text-white font-semibold">{trainer.name}</span>
                <span className="mx-2 text-surface-600">|</span>
                ID: <span className="text-indigo-400 font-mono">{trainer.displayTID}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-surface-400 mb-1">Gen {saveFile.generation}</p>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-surface-400" />
                <span className="text-xs text-surface-300">{formatPlayTime(trainer.playTime)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {trainer.badges.map((has, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  has
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-white/[0.03] text-surface-600 border border-white/[0.04]'
                }`}
              >
                <Trophy className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="glass glass-hover rounded-2xl p-5 text-left group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-white">{action.label}</p>
              <p className="text-xs text-surface-400 mt-0.5">{action.count}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
