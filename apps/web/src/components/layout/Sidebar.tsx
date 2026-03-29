import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { GAME_NAMES } from '@pkhex/core';
import { clsx } from 'clsx';
import {
  Home, Upload, Users, Box, Backpack, Gift, Shield, Gamepad2,
  Settings, ChevronLeft, ChevronRight, Sparkles, Zap,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/load', icon: Upload, label: 'Load Save' },
  { path: '/party', icon: Users, label: 'Party', requiresSave: true },
  { path: '/boxes', icon: Box, label: 'PC Boxes', requiresSave: true },
  { path: '/trainer', icon: Sparkles, label: 'Trainer', requiresSave: true },
  { path: '/inventory', icon: Backpack, label: 'Inventory', requiresSave: true },
  { path: '/mystery-gifts', icon: Gift, label: 'Mystery Gifts' },
  { path: '/legality', icon: Shield, label: 'Legality', requiresSave: true },
  { path: '/cheat-codes', icon: Gamepad2, label: 'Cheat Codes' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { saveFile, sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-out',
        'glass border-r border-white/[0.06]',
        sidebarOpen ? 'w-64' : 'w-20',
      )}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-lg font-bold text-gradient">PKHeX</h1>
            <p className="text-[10px] text-surface-400 tracking-wider uppercase">Save Editor</p>
          </div>
        )}
      </div>

      {saveFile && sidebarOpen && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/20 animate-fade-in">
          <p className="text-xs text-indigo-300 font-medium">{GAME_NAMES[saveFile.gameVersion] ?? 'Unknown Game'}</p>
          <p className="text-sm font-semibold text-white mt-0.5">{saveFile.trainer.name}</p>
          <p className="text-[10px] text-surface-400 mt-1 truncate">{saveFile.fileName}</p>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          if (item.requiresSave && !saveFile) return null;
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={clsx('nav-item', isActive && 'active', !sidebarOpen && 'justify-center px-0')}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="animate-fade-in">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="mx-3 mb-4 p-3 rounded-xl glass glass-hover flex items-center justify-center"
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
