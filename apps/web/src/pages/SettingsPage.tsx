import { useAppStore } from '@/store/app-store';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Download, Trash2, Database, Info, Smartphone } from 'lucide-react';
import { downloadFile } from '@/utils/file-handler';

export function SettingsPage() {
  const { saveFile, exportSave, closeSaveFile, theme } = useAppStore();

  const handleExport = () => {
    const data = exportSave();
    if (data && saveFile) {
      downloadFile(data, saveFile.fileName);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-6 h-6 text-surface-300" /> Settings
        </h1>
      </motion.div>

      {saveFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-xl p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> Save File
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{saveFile.fileName}</p>
                <p className="text-xs text-surface-400">{(saveFile.fileSize / 1024).toFixed(1)} KB · Gen {saveFile.generation}</p>
              </div>
              {saveFile.isDirty && (
                <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20">Unsaved changes</span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={handleExport} className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Save
              </button>
              <button onClick={closeSaveFile} className="btn-danger flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Close Save
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
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Moon className="w-4 h-4 text-purple-400" /> Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Theme</p>
            <p className="text-xs text-surface-400">Switch between dark and light mode</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-lg p-1">
            <button className="p-2 rounded-md bg-indigo-500/20 text-indigo-300">
              <Moon className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-md text-surface-500 hover:text-white transition-colors">
              <Sun className="w-4 h-4" />
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
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-green-400" /> PWA
        </h3>
        <div>
          <p className="text-sm text-white">Install as App</p>
          <p className="text-xs text-surface-400 mt-1">
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
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-cyan-400" /> About
        </h3>
        <div className="space-y-2 text-xs text-surface-400">
          <p><span className="text-white font-medium">PKHeX PWA</span> v1.0.0</p>
          <p>Cross-platform Pokémon save file editor with mystery gift database.</p>
          <p>Built with React, TypeScript, and Tailwind CSS.</p>
          <p>Core logic ported from PKHeX by kwsch (GPLv3) and PKHeX.Everywhere by Arley Pádua (MIT).</p>
          <p className="pt-2 border-t border-white/[0.06]">
            Supports Generations 1-9 including Scarlet/Violet.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
