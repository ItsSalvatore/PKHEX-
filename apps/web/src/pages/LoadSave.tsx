import { useCallback, useRef } from 'react';
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

  const handleFile = useCallback(async (file: File) => {
    const data = await readFileAsArrayBuffer(file);
    if (loadSaveFile(data, file.name)) navigate('/');
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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-2">Load Save File</h1>
        <p className="text-surface-400">
          Drop a save file or browse to open. Supports all generations (1-9).
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={clsx(
          'relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer',
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
            : 'border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.02]',
          isLoading && 'opacity-50 pointer-events-none',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={SAVE_FILE_INPUT_ACCEPT}
          onChange={handleInputChange}
          className="hidden"
        />
        <div className={clsx(
          'w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all',
          isDragging
            ? 'bg-indigo-500/20 scale-110'
            : 'bg-white/[0.04]',
        )}>
          <Upload className={clsx(
            'w-8 h-8 transition-colors',
            isDragging ? 'text-indigo-400' : 'text-surface-400',
          )} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {isDragging ? 'Drop your save file here' : 'Drag & drop your save file'}
        </h3>
        <p className="text-sm text-surface-400 mb-4">or click to browse</p>
        <p className="text-xs text-surface-500">
          {KNOWN_SAVE_EXTENSIONS_LABEL} — or any file; format is detected from the data like PKHeX.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Local Files</h3>
          </div>
          <p className="text-xs text-surface-400">
            Save files from emulators, homebrew, or cartridge dumpers. All processing happens locally in your browser.
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Cloud Saves</h3>
          </div>
          <p className="text-xs text-surface-400">
            Coming soon: sync save files across devices with optional cloud backup integration.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/10"
      >
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-300 font-medium">Privacy First</p>
          <p className="text-xs text-surface-400 mt-1">
            Your save files are never uploaded to any server. All editing happens 100% locally in your browser using WebAssembly.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
