import { useState } from 'react';
import { clsx } from 'clsx';
import { useAppStore } from '@/store/app-store';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { getItemName, type InventoryPouch, InventoryType } from '@pkhex/core';
import { motion } from 'framer-motion';
import { Backpack, Search, Package, Plus, Minus } from 'lucide-react';

export function Inventory() {
  const { saveFile } = useAppStore();
  const [activePouch, setActivePouch] = useState<InventoryType>(InventoryType.Items);
  const [searchQuery, setSearchQuery] = useState('');

  if (!saveFile) {
    return <EmptyState title="Inventory needs a save file" />;
  }

  const pouches = saveFile.inventory;
  const currentPouch = pouches.find(p => p.type === activePouch) ?? pouches[0];

  const filteredItems = currentPouch.items.filter(item =>
    searchQuery === '' || getItemName(item.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader icon={Backpack} title="Inventory" description="Browse pouches from the loaded save." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 flex-wrap"
      >
        {pouches.map(pouch => (
          <button
            type="button"
            key={pouch.type}
            onClick={() => setActivePouch(pouch.type)}
            className={clsx(
              'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
              pouch.type === activePouch
                ? 'border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-100'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-surface-200 dark:hover:border-white/[0.15]',
            )}
          >
            <Package className="w-3 h-3" />
            {pouch.label}
            <span className="text-[10px] opacity-60">({pouch.items.length})</span>
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-surface-500" aria-hidden />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="glass rounded-xl overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-surface-600" aria-hidden />
              <p className="text-sm text-slate-600 dark:text-surface-400">
                {searchQuery ? 'No items match your search' : 'This pouch is empty'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {filteredItems.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/[0.06]">
                      <Package className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{getItemName(item.id)}</p>
                      <p className="text-[10px] text-slate-500 dark:text-surface-500">#{item.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="rounded-md p-1 transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.08]" aria-label="Decrease count">
                      <Minus className="h-3 w-3 text-slate-500 dark:text-surface-400" />
                    </button>
                    <span className="min-w-[40px] text-center font-mono text-sm font-semibold text-slate-900 dark:text-white">
                      ×{item.count}
                    </span>
                    <button type="button" className="rounded-md p-1 transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.08]" aria-label="Increase count">
                      <Plus className="h-3 w-3 text-slate-500 dark:text-surface-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
