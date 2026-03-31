import { create } from 'zustand';
import type {
  SaveFile, Pokemon, BoxData, TrainerInfo, InventoryPouch,
} from '@pkhex/core';
import {
  setBoxPokemon, swapBoxPokemon,
  loadSaveFileWithOptionalPkhexBridge,
  exportModifiedSave,
  createBuiltinMysteryGiftDatabase,
  type MysteryGiftDatabase,
} from '@pkhex/core';

function readStoredTheme(): 'dark' | 'light' {
  if (typeof localStorage === 'undefined') return 'dark';
  return localStorage.getItem('pkhex-theme') === 'light' ? 'light' : 'dark';
}

function applyThemeClass(theme: 'dark' | 'light') {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
}

export interface AppState {
  saveFile: SaveFile | null;
  selectedBoxIndex: number;
  selectedSlot: { box: number; slot: number } | null;
  selectedPartySlot: number | null;
  selectedPokemon: Pokemon | null;
  mysteryGiftDb: MysteryGiftDatabase;
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
  recentFiles: Array<{ name: string; date: string; size: number }>;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  loadSaveFile: (data: Uint8Array, fileName: string) => Promise<boolean>;
  closeSaveFile: () => void;
  exportSave: () => Uint8Array | null;
  selectBox: (index: number) => void;
  selectSlot: (box: number, slot: number) => void;
  selectPartySlot: (slot: number | null) => void;
  selectPokemon: (pkm: Pokemon | null) => void;
  updatePokemon: (pkm: Pokemon) => void;
  swapSlots: (fromBox: number, fromSlot: number, toBox: number, toSlot: number) => void;
  toggleSidebar: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  saveFile: null,
  selectedBoxIndex: 0,
  selectedSlot: null,
  selectedPartySlot: null,
  selectedPokemon: null,
  mysteryGiftDb: createBuiltinMysteryGiftDatabase(),
  sidebarOpen: true,
  isLoading: false,
  error: null,
  recentFiles: [],
  theme: readStoredTheme(),

  setTheme: (theme) => {
    try {
      localStorage.setItem('pkhex-theme', theme);
    } catch {
      /* ignore */
    }
    applyThemeClass(theme);
    set({ theme });
  },

  loadSaveFile: async (data, fileName) => {
    set({ isLoading: true, error: null });
    try {
      const save = await loadSaveFileWithOptionalPkhexBridge(data, fileName);
      const recent = get().recentFiles;
      const entry = { name: fileName, date: new Date().toISOString(), size: data.length };
      set({
        saveFile: save,
        selectedBoxIndex: 0,
        selectedSlot: null,
        selectedPartySlot: null,
        selectedPokemon: null,
        isLoading: false,
        recentFiles: [entry, ...recent.filter(r => r.name !== fileName)].slice(0, 10),
      });
      return true;
    } catch (e) {
      set({ isLoading: false, error: `Failed to load save: ${e}` });
      return false;
    }
  },

  closeSaveFile: () => set({
    saveFile: null, selectedSlot: null, selectedPartySlot: null, selectedPokemon: null,
  }),

  exportSave: () => {
    const save = get().saveFile;
    if (!save) return null;
    return exportModifiedSave(save);
  },

  selectBox: (index) => set({ selectedBoxIndex: index, selectedSlot: null }),

  selectSlot: (box, slot) => {
    const save = get().saveFile;
    if (!save) return;
    const pkm = save.boxes[box]?.pokemon[slot] ?? null;
    set({ selectedSlot: { box, slot }, selectedPartySlot: null, selectedPokemon: pkm });
  },

  selectPartySlot: (slot) => {
    const save = get().saveFile;
    if (!save) return;
    if (slot === null || slot < 0) {
      set({ selectedPartySlot: null, selectedSlot: null, selectedPokemon: null });
      return;
    }
    const pkm = save.party[slot] ?? null;
    set({ selectedPartySlot: slot, selectedSlot: null, selectedPokemon: pkm });
  },

  selectPokemon: (pkm) => set({ selectedPokemon: pkm }),

  updatePokemon: (pkm) => {
    const { saveFile, selectedSlot, selectedPartySlot } = get();
    if (!saveFile) return;
    if (selectedSlot) {
      const newSave = setBoxPokemon(saveFile, selectedSlot.box, selectedSlot.slot, pkm);
      set({ saveFile: newSave, selectedPokemon: pkm });
    } else if (selectedPartySlot !== null) {
      const newParty = [...saveFile.party];
      newParty[selectedPartySlot] = pkm;
      set({ saveFile: { ...saveFile, party: newParty, isDirty: true }, selectedPokemon: pkm });
    }
  },

  swapSlots: (fromBox, fromSlot, toBox, toSlot) => {
    const save = get().saveFile;
    if (!save) return;
    const newSave = swapBoxPokemon(save, fromBox, fromSlot, toBox, toSlot);
    set({ saveFile: newSave });
  },

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
