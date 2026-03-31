import { useAppStore } from '@/store/app-store';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Download, Trash2, Database, Info, Smartphone } from 'lucide-react';
import { downloadFile } from '@/utils/file-handler';

export function SettingsPage() {
  const { saveFile, exportSave, closeSaveFile, theme, setTheme } = useAppStore();

  const handleExport = () => {
    const data = exportSave();
    if (data && saveFile) {
      downloadFile(data, saveFile.fileName);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl page-title flex items-center gap-3">
          <Settings className="w-6 h-6 text-slate-500 dark:text-surface-300" aria-hidden /> Settings
        </h1>
      </motion.div>

      {saveFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-xl p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden /> Save File
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm text-slate-900 dark:text-white">{saveFile.fileName}</p>
                <p className="text-xs text-slate-500 dark:text-surface-400">{(saveFile.fileSize / 1024).toFixed(1)} KB · Gen {saveFile.generation}</p>
              </div>
              {saveFile.isDirty && (
                <span className="badge bg-amber-500/15 text-amber-800 border border-amber-500/30 dark:text-amber-400 dark:border-amber-500/20">
                  Unsaved changes
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleExport} className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" aria-hidden /> Export Save
              </button>
              <button type="button" onClick={closeSaveFile} className="btn-danger flex items-center gap-2">
                <Trash2 className="w-4 h-4" aria-hidden /> Close Save
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Moon className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden /> Appearance
        </h3>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-slate-900 dark:text-white" id="theme-label">Theme</p>
            <p className="text-xs text-slate-500 dark:text-surface-400">OLED-friendly dark default; light for daytime</p>
          </div>
          <div
            className="flex items-center gap-1 glass rounded-xl p-1"
            role="group"
            aria-labelledby="theme-label"
          >
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={clsx(
                'p-2.5 rounded-lg transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60',
                theme === 'dark'
                  ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-surface-500 dark:hover:text-white',
              )}
              aria-pressed={theme === 'dark'}
              aria-label="Dark theme"
            >
              <Moon className="w-4 h-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={clsx(
                'p-2.5 rounded-lg transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60',
                theme === 'light'
                  ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-surface-500 dark:hover:text-white',
              )}
              aria-pressed={theme === 'light'}
              aria-label="Light theme"
            >
              <Sun className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden /> PWA
        </h3>
        <div>
          <p className="text-sm text-slate-900 dark:text-white">Install as App</p>
          <p className="text-xs text-slate-600 dark:text-surface-400 mt-1">
            PKHeX can be installed as a Progressive Web App for offline access.
            Use your browser's "Install" or "Add to Home Screen" option.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400" aria-hidden /> About
        </h3>
        <div className="space-y-2 text-xs text-slate-600 dark:text-surface-400">
          <p><span className="text-slate-900 dark:text-white font-medium">PKHeX PWA</span> v1.0.0</p>
          <p>Cross-platform Pokémon save file editor with mystery gift database.</p>
          <p>Built with React, TypeScript, and Tailwind CSS.</p>
          <p>Core logic ported from PKHeX by kwsch (GPLv3) and PKHeX.Everywhere by Arley Pádua (MIT).</p>
          <p className="pt-2 border-t border-slate-200 dark:border-white/[0.06]">
            Supports Generations 1-9 including Scarlet/Violet.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
