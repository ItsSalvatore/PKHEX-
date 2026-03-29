import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { getItemName, type InventoryPouch, InventoryType } from '@pkhex/core';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Backpack, Search, Package, Plus, Minus } from 'lucide-react';

export function Inventory() {
  const { saveFile } = useAppStore();
  const [activePouch, setActivePouch] = useState<InventoryType>(InventoryType.Items);
  const [searchQuery, setSearchQuery] = useState('');

  if (!saveFile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-surface-400">No save file loaded</p>
      </div>
    );
  }

  const pouches = saveFile.inventory;
  const currentPouch = pouches.find(p => p.type === activePouch) ?? pouches[0];

  const filteredItems = currentPouch.items.filter(item =>
    searchQuery === '' || getItemName(item.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Backpack className="w-6 h-6 text-amber-400" /> Inventory
        </h1>
        <p className="text-surface-400 text-sm mt-1">Manage your item pouches</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 flex-wrap"
      >
        {pouches.map(pouch => (
          <button
            key={pouch.type}
            onClick={() => setActivePouch(pouch.type)}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2',
              pouch.type === activePouch
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'glass text-surface-300 hover:text-white',
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
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
              <Package className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400">
                {searchQuery ? 'No items match your search' : 'This pouch is empty'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filteredItems.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{getItemName(item.id)}</p>
                      <p className="text-[10px] text-surface-500">#{item.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 rounded-md hover:bg-white/[0.06] transition-colors">
                      <Minus className="w-3 h-3 text-surface-400" />
                    </button>
                    <span className="text-sm font-mono font-semibold text-white min-w-[40px] text-center">
                      ×{item.count}
                    </span>
                    <button className="p-1 rounded-md hover:bg-white/[0.06] transition-colors">
                      <Plus className="w-3 h-3 text-surface-400" />
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
