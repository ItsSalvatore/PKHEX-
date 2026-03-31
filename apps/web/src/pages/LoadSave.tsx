import { useCallback, useId, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { useFileDrop } from '@/hooks/use-file-drop';
import { readFileAsArrayBuffer, KNOWN_SAVE_EXTENSIONS_LABEL, SAVE_FILE_INPUT_ACCEPT } from '@/utils/file-handler';
import { motion } from 'framer-motion';
import { Upload, FileUp, HardDrive, Cloud, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function LoadSave() {
  const { loadSaveFile, isLoading } = useAppStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const dropDescId = `${inputId}-hint`;

  const handleFile = useCallback(async (file: File) => {
    const data = await readFileAsArrayBuffer(file);
    if (await loadSaveFile(data, file.name)) navigate('/');
  }, [loadSaveFile, navigate]);

  const handleDrop = useCallback(async (files: FileList) => {
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop: onDrop } = useFileDrop({
    onDrop: handleDrop,
  });

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl page-title mb-2">Load Save File</h1>
        <p className="text-slate-600 dark:text-surface-400" id={dropDescId}>
          Drop a save file or browse to open. Supports all generations (1-9).
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div
          role="presentation"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={onDrop}
          className={clsx(
            'relative rounded-2xl border-2 border-dashed p-10 sm:p-12 text-center transition-colors duration-200',
            'border-slate-300 bg-slate-50/50 dark:border-white/[0.08] dark:bg-white/[0.02]',
            isDragging && 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30 dark:ring-indigo-400/25',
            isLoading && 'opacity-50 pointer-events-none',
          )}
        >
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={SAVE_FILE_INPUT_ACCEPT}
            onChange={handleInputChange}
            className="sr-only"
            aria-describedby={dropDescId}
            disabled={isLoading}
          />
          <div
            className={clsx(
              'w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-colors duration-200',
              isDragging ? 'bg-indigo-500/20' : 'bg-slate-200/80 dark:bg-white/[0.04]',
            )}
          >
            <Upload className={clsx(
              'w-8 h-8 transition-colors',
              isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-surface-400',
            )} aria-hidden />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {isDragging ? 'Drop your save file here' : 'Drag & drop your save file'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-surface-400 mb-4">or choose a file from your device</p>
          <button
            type="button"
            onClick={openPicker}
            disabled={isLoading}
            className="btn-primary inline-flex items-center gap-2 cursor-pointer"
          >
            <FileUp className="w-4 h-4" aria-hidden />
            Browse files
          </button>
          <p className="text-xs text-slate-500 dark:text-surface-500 mt-6 max-w-md mx-auto leading-relaxed">
            {KNOWN_SAVE_EXTENSIONS_LABEL} — or any file; with the dev server, PKHeX.Core runs via the local bridge when it is running (`npm run pkhex-bridge`).
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Local Files</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-surface-400">
            Save files from emulators, homebrew, or cartridge dumpers. Processing stays in your browser unless you use the optional server bridge.
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="w-5 h-5 text-cyan-600 dark:text-cyan-400" aria-hidden />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cloud Saves</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-surface-400">
            Coming soon: sync save files across devices with optional cloud backup integration.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-3 p-4 rounded-xl border
          bg-amber-50 border-amber-200/80
          dark:bg-amber-500/[0.06] dark:border-amber-500/10"
      >
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden />
        <div>
          <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">Privacy first</p>
          <p className="text-xs text-slate-700 dark:text-surface-400 mt-1 leading-relaxed">
            Saves are not uploaded to our servers by default. Production builds can proxy to PKHeX.Core on the same host (see PM2 setup). Otherwise the app falls back to in-browser parsers.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
